// engine.js — the student model, the Trial Score, adaptive selection, pacing, and alerts.
// Pure functions over a plain JSON state so it can be synced, tested in Node, and audited.
//
// Research basis (full write-up in the course guide):
//  - Skill estimates: Elo-style ability updates (Pelánek 2016), a Rasch/IRT-family model.
//  - Mastery gates: mastery learning (Kulik, Kulik & Bangert-Drowns 1990), knowledge-tracing style
//    thresholds (Corbett & Anderson 1995).
//  - Retention: FSRS-style memory stability with a power forgetting curve; reviews scheduled near 90%
//    recall, i.e. spaced retrieval / successive relearning (Rawson & Dunlosky).
//  - Selection targets ~75% success: hard enough to be "desirable difficulty", easy enough to learn from.

export const ENGINE_VERSION = 1;

// ---------- small helpers ----------
export const sigmoid = (x) => 1 / (1 + Math.exp(-x));
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export function dateStr(d = new Date()) { const z = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`; }
export function daysBetween(a, b) { // whole days from date string a to b
  const pa = a.split('-').map(Number), pb = b.split('-').map(Number);
  return Math.round((Date.UTC(pb[0], pb[1] - 1, pb[2]) - Date.UTC(pa[0], pa[1] - 1, pa[2])) / 86400000);
}
export function addDays(s, n) { const p = s.split('-').map(Number); const d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)); return d.toISOString().slice(0, 10); }

// difficulty 1..5 -> item difficulty on the logit scale
export const B_BY_D = { 1: -1.5, 2: -0.5, 3: 0.5, 4: 1.5, 5: 2.5 };
export const EXPECTED_SEC = { 1: 40, 2: 70, 3: 110, 4: 180, 5: 300 };
const CONTEXT_K = { pretest: 1.2, warmup: 1.0, practice: 1.0, check: 0.8, challenge: 1.0, exit: 1.4, trial: 1.4, mastery: 1.6, benchmark: 1.4, rebuild: 1.0 };
const kFactor = (n) => 1.1 / (1 + 0.12 * n);

// credit for an attempt: first-try correct with no help is full evidence; help reduces it
export function creditFor({ correct, hints = 0, tries = 1, sawSolution = false }) {
  if (sawSolution || !correct) return 0;
  let c = tries > 1 ? 0.5 : 1;
  if (hints >= 2) c = Math.min(c, 0.45); else if (hints === 1) c = Math.min(c, 0.7);
  return c;
}

// forgetting curve (FSRS v4 form): R = (1 + t/(9S))^-1, so R = 0.9 when t = S days
export const retrievability = (S, t) => (S <= 0 ? 0 : Math.pow(1 + Math.max(0, t) / (9 * S), -1));

// ---------- state ----------
export function newState({ startDate, name = 'Student' } = {}) {
  return {
    v: ENGINE_VERSION,
    startDate: startDate || dateStr(),
    settings: { name, dailyMinutes: 120, bonus: null },
    skills: {},           // id -> {th, n, S, lastRev, intro, F, ok, att}
    transfer: { th: 0, n: 0 },
    cards: {},            // id -> {S, last, reps, lapses}
    calib: { n: 0, err: 0 },
    progress: { idx: 0, done: [], rebuild: null, retakes: {}, rebuildCount: {} },
    seen: {},             // itemId -> last date seen
    history: { score: [], days: {} },
    notebook: {},         // sessionId -> {notes, reflections, drawing}
    flags: [],
    outbox: [],           // alerts waiting to be sent
    updatedAt: Date.now(),
  };
}

function skillRec(state, id, today) {
  if (!state.skills[id]) state.skills[id] = { th: 0, n: 0, S: 0, lastRev: null, intro: today, F: 0.5, ok: 0, att: 0 };
  return state.skills[id];
}

// ---------- recording an attempt ----------
// a = {itemId, skill, d, dok, correct, hints, tries, sawSolution, timeSec, context, confidence(0..1|null)}
export function recordAttempt(state, a, now = new Date()) {
  const today = dateStr(now);
  const s = skillRec(state, a.skill, today);
  const credit = creditFor(a);
  const b = B_BY_D[a.d] ?? 0.5;
  const p = sigmoid(s.th - b);
  const K = kFactor(s.n) * (CONTEXT_K[a.context] ?? 1);
  s.th = clamp(s.th + K * (credit - p), -4, 6);
  s.n += 1; s.att += 1; if (credit >= 0.99) s.ok += 1;

  // fluency: only from clean correct answers, relative to the expected time for that difficulty
  if (credit >= 0.99 && a.timeSec > 0) {
    const ratio = Math.min(1, (a.expectedSec || EXPECTED_SEC[a.d] || 110) / a.timeSec);
    s.F = s.F + 0.2 * (ratio - s.F);
  }

  // retention: the first graded retrieval of a skill on a later day counts as a spaced review
  if (!s.S) { s.S = 1; s.lastRev = today; }
  else if (s.lastRev !== today && s.intro !== today) {
    const R = retrievability(s.S, daysBetween(s.lastRev, today));
    if (credit >= 0.7) s.S = Math.min(365, s.S * (1.8 + 2.2 * (1 - R)));
    else s.S = Math.max(0.5, s.S * 0.4);
    s.lastRev = today;
  }

  // transfer: non-routine (DOK 3+) problems feed a separate problem-solving rating
  if ((a.dok || 1) >= 3) {
    const T = state.transfer; const pt = sigmoid(T.th - b);
    T.th = clamp(T.th + kFactor(T.n) * 0.9 * (credit - pt), -4, 6); T.n += 1;
  }

  // calibration: how well his confidence predicts his correctness (metacognition)
  if (typeof a.confidence === 'number') { state.calib.n += 1; state.calib.err += Math.abs(a.confidence - (a.correct ? 1 : 0)); }

  if (a.itemId) state.seen[a.itemId] = today;
  state.updatedAt = Date.now();
  return { credit, pBefore: p, theta: s.th };
}

// spaced flashcard-style retrieval of key facts/definitions (self-graded)
export function recordCard(state, id, remembered, now = new Date()) {
  const today = dateStr(now);
  const c = state.cards[id] || (state.cards[id] = { S: 0, last: null, reps: 0, lapses: 0 });
  if (!c.S) { c.S = remembered ? 2 : 0.7; }
  else if (c.last !== today) {
    const R = retrievability(c.S, daysBetween(c.last, today));
    c.S = remembered ? Math.min(365, c.S * (1.8 + 2.2 * (1 - R))) : Math.max(0.5, c.S * 0.4);
  }
  c.reps += 1; if (!remembered) c.lapses += 1; c.last = today;
}
export function dueCards(state, cardIds, now = new Date(), limit = 4) {
  const today = dateStr(now);
  return cardIds.map((id) => { const c = state.cards[id]; const R = c ? retrievability(c.S, daysBetween(c.last, today)) : 0; return { id, R, fresh: !c }; })
    .filter((x) => !x.fresh && x.R < 0.9).sort((a, b) => a.R - b.R).slice(0, limit).map((x) => x.id);
}

// ---------- views of a skill and the Trial Score ----------
export function skillView(state, id, now = new Date()) {
  const s = state.skills[id]; if (!s) return null;
  const today = dateStr(now);
  const M = sigmoid(s.th - 0.5);                    // P(solve a standard on-level problem)
  const R = s.S ? retrievability(s.S, daysBetween(s.lastRev, today)) : 0;
  const F = s.F;
  const score = 100 * (0.6 * M + 0.25 * R + 0.15 * F);
  return { id, M, R, F, score, S: s.S, n: s.n, due: R < 0.9, th: s.th };
}

export function trialScore(state, skillMeta = {}, now = new Date()) {
  const ids = Object.keys(state.skills);
  if (!ids.length) return null;
  let wsum = 0, acc = 0, mM = 0, mR = 0, mF = 0;
  for (const id of ids) {
    const v = skillView(state, id, now); const w = skillMeta[id]?.w ?? 1;
    wsum += w; acc += w * v.score; mM += w * v.M; mR += w * v.R; mF += w * v.F;
  }
  const skillPart = acc / wsum;
  const T = state.transfer.n >= 3 ? sigmoid(state.transfer.th - 0.5) : null;
  const score = T === null ? skillPart : 0.85 * skillPart + 0.15 * 100 * T;
  return {
    score: Math.round(score * 10) / 10,
    parts: { mastery: mM / wsum, retention: mR / wsum, fluency: mF / wsum, transfer: T },
    nSkills: ids.length,
    provisional: ids.reduce((a, id) => a + state.skills[id].n, 0) < 40,
  };
}

export function band(score) {
  if (score === null || score === undefined) return { label: 'Not started', letter: '–', key: 'none' };
  if (score >= 93) return { label: 'Mastered', letter: 'A', key: 'a' };
  if (score >= 85) return { label: 'Proficient', letter: 'B', key: 'b' };
  if (score >= 75) return { label: 'Developing', letter: 'C', key: 'c' };
  if (score >= 65) return { label: 'Fragile', letter: 'D', key: 'd' };
  return { label: 'Not yet', letter: 'F', key: 'f' };
}

export function calibration(state) { return state.calib.n ? 1 - state.calib.err / state.calib.n : null; }

// ---------- adaptive selection ----------
// candidates: [{id, skill, d, gen?}] ; returns the candidate whose predicted success is closest to target
export function pickItem(state, candidates, { target = 0.75, avoidSkill = null, rng = Math.random, today = dateStr() } = {}) {
  let best = null, bestScore = Infinity;
  for (const c of candidates) {
    const s = state.skills[c.skill]; const th = s ? s.th : 0;
    const p = sigmoid(th - (B_BY_D[c.d] ?? 0.5));
    let cost = Math.abs(p - target) + rng() * 0.08;
    if (!c.gen && state.seen[c.id]) cost += state.seen[c.id] === today ? 5 : 0.6; // prefer unseen hand-written items
    if (avoidSkill && c.skill === avoidSkill) cost += 0.25;                      // interleaving: avoid back-to-back same skill
    if (cost < bestScore) { bestScore = cost; best = c; }
  }
  return best;
}

// skills that need review now: forgotten-ish (R < 0.9) or not yet solid, most urgent first
export function reviewQueue(state, now = new Date(), { exclude = [], limit = 8 } = {}) {
  const today = dateStr(now);
  return Object.keys(state.skills)
    .filter((id) => !exclude.includes(id) && state.skills[id].intro !== today)
    .map((id) => skillView(state, id, now))
    .filter((v) => v.R < 0.9 || v.M < 0.7)
    .sort((a, b) => (a.R + a.M) - (b.R + b.M))
    .slice(0, limit).map((v) => v.id);
}

// ---------- sessions, gates, pacing ----------
// course.sessions: [{id, type:'lesson'|'trial'|'mastery'|'benchmark', title, unit, skills:[], pack}]
export function nextSession(state, course, now = new Date()) {
  const P = state.progress; const sess = course.sessions[P.idx];
  if (!sess) return { done: true };
  const today = dateStr(now);
  const bonus = state.settings.bonus && state.settings.bonus.until >= today;
  if (P.rebuild && P.rebuild.skills.length) {
    if (bonus) return { session: sess, mode: 'normal', rebuildFirst: P.rebuild.skills }; // (c): add time, keep the date
    return { session: sess, mode: 'rebuild', rebuildSkills: P.rebuild.skills };        // (a): mastery first, date stretches
  }
  if (sess.type === 'mastery' && P.retakes[sess.id]) return { session: sess, mode: 'retake' };
  return { session: sess, mode: 'normal' };
}

export function pace(state, course, now = new Date()) {
  const today = dateStr(now);
  const total = course.sessions.length;
  const planned = clamp(daysBetween(state.startDate, today), 0, total); // sessions that should be done by start of today
  const idx = state.progress.idx;
  // today's session counts as expected once he has worked today, so finishing it doesn't read as "ahead"
  const workedToday = !!(state.history.days[today] && state.history.days[today].advanced);
  const lag = planned + (workedToday ? 1 : 0) - idx;                       // + behind, - ahead
  const days = Object.keys(state.history.days).sort();
  const recent = days.filter((d) => daysBetween(d, today) <= 14);
  const doneRecent = recent.reduce((a, d) => a + (state.history.days[d].advanced || 0), 0);
  const span = Math.max(1, Math.min(14, daysBetween(state.startDate, today)));
  const rate = clamp(doneRecent / span || 1, 0.5, 1.5);
  const remaining = total - idx;
  const projectedEnd = addDays(today, Math.ceil(remaining / rate));
  const plannedEnd = addDays(state.startDate, total - 1);
  const slip = daysBetween(plannedEnd, projectedEnd);
  const status = lag >= 2 ? 'behind' : lag <= -2 ? 'ahead' : 'on track';
  return { planned, idx, lag, rate, projectedEnd, plannedEnd, slip, status, total };
}

// Called when a session finishes. result = {session, mode, exitPct, masteryPct, weakSkills, minutes, items, correct, trialPct}
export function completeSession(state, course, result, skillMeta = {}, now = new Date()) {
  const today = dateStr(now);
  const P = state.progress; const alerts = [];
  const before = lastScore(state);
  let advanced = 0;
  const s = result.session;
  const name = state.settings.name || 'Your student';

  if (result.mode === 'rebuild') {
    // a rebuild day re-teaches; the lesson queue does not advance
    P.rebuild = null;
  } else if (s.type === 'mastery') {
    if (result.masteryPct >= 85) {
      P.idx += 1; advanced = 1; delete P.retakes[s.id];
      alerts.push(alert('mastery_pass', 'good', `${name} passed the ${s.unitName || s.unit} mastery exam: ${Math.round(result.masteryPct)}%.`, now));
    } else {
      const n = (P.retakes[s.id] || 0) + 1; P.retakes[s.id] = n;
      P.rebuild = { skills: result.weakSkills.slice(0, 6), from: s.id };
      if (n >= 3) { P.idx += 1; advanced = 1; delete P.retakes[s.id]; alerts.push(alert('stuck', 'action', `${name} has not cleared the ${s.unitName || s.unit} mastery exam after 3 attempts (best ${Math.round(result.masteryPct)}%). Moving on so he doesn't stall, but the weak skills listed in the dashboard need an adult check-in.`, now)); }
      else alerts.push(alert('mastery_fail', 'warn', `${name} scored ${Math.round(result.masteryPct)}% on the ${s.unitName || s.unit} mastery exam (85% needed). Next session rebuilds the weak skills, then he retakes it.`, now));
    }
  } else {
    P.idx += 1; advanced = 1;
    if (s.type === 'lesson' && result.weakSkills && result.weakSkills.length && (result.exitPct ?? 100) < 70) {
      const key = result.weakSkills.join(',');
      P.rebuildCount[key] = (P.rebuildCount[key] || 0) + 1;
      if (P.rebuildCount[key] <= 1) {
        P.rebuild = { skills: result.weakSkills.slice(0, 4), from: s.id };
        alerts.push(alert('rebuild', 'info', `${name} scored ${Math.round(result.exitPct)}% on today's exit check. Tomorrow starts with a rebuild of: ${result.weakSkills.map((k) => skillMeta[k]?.name || k).join(', ')}.`, now));
      } else {
        alerts.push(alert('stuck', 'action', `${name} is still struggling with ${result.weakSkills.map((k) => skillMeta[k]?.name || k).join(', ')} after a rebuild. Worth sitting with him for 15 minutes on this.`, now));
      }
    }
    if (s.type === 'trial') alerts.push(alert('trial_result', result.trialPct >= 80 ? 'good' : 'warn', `Weekly Trial: ${Math.round(result.trialPct)}% on ${result.testN || result.items} mixed problems.`, now));
    if (s.type === 'benchmark') alerts.push(alert('benchmark', 'info', `Benchmark: ${result.benchmarkText || Math.round(result.trialPct) + '%'}.`, now));
  }
  if (!P.done.includes(s.id) && advanced) P.done.push(s.id);

  // day log
  const d = state.history.days[today] || (state.history.days[today] = { minutes: 0, items: 0, correct: 0, sessions: [], advanced: 0 });
  d.minutes += result.minutes || 0; d.items += result.items || 0; d.correct += result.correct || 0; d.sessions.push(s.id + (result.mode !== 'normal' ? `:${result.mode}` : '')); d.advanced += advanced;

  const ts = trialScore(state, skillMeta, now);
  if (ts) {
    const h = state.history.score; const last = h[h.length - 1];
    const entry = { date: today, score: ts.score, ...ts.parts };
    if (last && last.date === today) h[h.length - 1] = entry; else h.push(entry);
  }
  const after = ts ? ts.score : null;
  const acc = d.items ? Math.round((100 * d.correct) / d.items) : 0;
  alerts.push(alert('day_complete', 'info', `${name} finished ${result.mode === 'rebuild' ? 'a rebuild session' : `"${s.title}"`}: ${Math.round(result.minutes)} min, ${result.items} problems, ${acc}% correct. Trial Score ${before == null ? '–' : Math.round(before)} → ${after == null ? '–' : Math.round(after)}.`, now, { scoreBefore: before, scoreAfter: after }));
  if (before !== null && after !== null && before - after >= 3) alerts.push(alert('score_drop', 'warn', `Trial Score dropped ${Math.round(before - after)} points today (${Math.round(before)} → ${Math.round(after)}). Usually means older skills are fading; the next warm-ups will target them.`, now));

  const pc = pace(state, course, now);
  if (pc.lag >= 6 && pc.slip > 10 && !(state.settings.bonus && state.settings.bonus.until >= today)) {
    alerts.push(alert('pace_action', 'action', `${name} is ${pc.lag} sessions behind plan (projected finish ${pc.projectedEnd}). Recommended: approve 30 extra minutes a day for two weeks in the dashboard so rebuilds no longer push the schedule back.`, now));
  } else if (pc.lag >= 3) {
    alerts.push(alert('pace_behind', 'warn', `${name} is ${pc.lag} sessions behind plan because mastery comes first. Projected finish: ${pc.projectedEnd}.`, now));
  } else if (pc.lag <= -3) {
    alerts.push(alert('pace_ahead', 'good', `${name} is ${-pc.lag} sessions ahead of plan.`, now));
  }
  state.outbox.push(...alerts);
  state.updatedAt = Date.now();
  return { alerts, pace: pc, score: ts };
}

function lastScore(state) { const h = state.history.score; return h.length ? h[h.length - 1].score : null; }

export function alert(kind, level, text, now = new Date(), extra = {}) {
  return { id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`, kind, level, text, at: now.toISOString(), ...extra };
}

// missed-day detection, run when the app opens
export function checkMissedDays(state, now = new Date()) {
  const today = dateStr(now);
  const days = Object.keys(state.history.days).sort();
  const last = days[days.length - 1];
  if (!last) return [];
  const gap = daysBetween(last, today) - 1;
  if (gap >= 1 && state.lastMissedAlert !== today) {
    state.lastMissedAlert = today;
    const a = alert('missed_day', 'warn', `${state.settings.name || 'Your student'} has not done a session in ${gap} day${gap > 1 ? 's' : ''} (last: ${last}).`, now);
    state.outbox.push(a); return [a];
  }
  return [];
}
