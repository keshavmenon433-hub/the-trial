// parent.js — the parent/guardian dashboard: one score, what's behind it, pace, alerts, and the daily record.
import { h, clear, mdEl, renderMd, toast, modal } from './util.js';
import * as E from './engine.js';

const INK = ['#E8EEFC', '#C9D6F7', '#9DB3EF', '#6C8CE3', '#3F64D6', '#1F4FD8', '#173B9E']; // sequential, one hue, light -> dark
const inkFor = (score) => (score == null ? null : INK[Math.max(0, Math.min(6, Math.floor((score - 40) / 9)))]);

export function renderDashboard(root, data, actions) {
  const { model, history, alerts = [], days = [], course, family, control = {}, live } = data;
  clear(root);
  if (!model) { root.append(h('section.panel', h('h2', 'Waiting for the first session'), h('p', 'The dashboard fills in as soon as your student finishes a few problems on the iPad.'))); return; }
  const state = { ...model, history: history || model.history || { score: [], days: {} } };
  const meta = course.skills;
  const now = new Date();
  const ts = E.trialScore(state, meta, now);
  const b = E.band(ts ? Math.round(ts.score) : null);
  const pc = E.pace(state, course, now);
  const name = state.settings?.name || family?.studentName || 'Student';

  // ---- hero: the one number ----
  const hero = h('section.hero-score',
    h('div.hs-main',
      h('p.hs-name', `${name}'s Trial Score`),
      h('p.hs-num', ts ? String(Math.round(ts.score)) : '–', h('span.hs-of', '/100')),
      h('p.hs-band', h('span.band.b-' + b.key, b.letter), ` ${b.label}`, ts?.provisional ? h('span.muted', ' · early estimate, firms up after ~40 problems') : '')),
    h('div.hs-chart', lineChart(state.history.score)),
    h('p.hs-live', live ? h('span.live-dot', { 'aria-hidden': 'true' }) : null, live ? 'Live' : 'This device only'));
  root.append(hero);

  // ---- what's behind the number ----
  if (ts) {
    const parts = [
      ['Mastery', ts.parts.mastery, 'Chance he solves a typical problem on each skill he has learned (60% of the score).'],
      ['Retention', ts.parts.retention, 'How much of it he would still remember today, from his spaced-review record (25%).'],
      ['Fluency', ts.parts.fluency, 'Speed on problems he gets right, compared with the expected time (15%).'],
      ['Problem solving', ts.parts.transfer, 'Rating on non-routine, contest-style problems. Blended in as 15% once he has done a few.'],
    ];
    const calib = E.calibration(state);
    root.append(h('section.panel', h('h2', 'What the score is made of'),
      h('div.parts', parts.map(([l, v, d]) => h('div.part', h('div.part-top', h('span', l), h('strong', v == null ? '–' : `${Math.round(v * 100)}`)), h('div.part-bar', h('span', { style: { width: `${v == null ? 0 : Math.round(v * 100)}%` } })), h('p.muted.small', d)))),
      calib != null ? h('p.small', h('strong', 'Self-awareness: '), `${Math.round(calib * 100)}/100. How well his "sure / not sure" matches whether he is right. Not part of the score.`) : null,
      h('details.how', h('summary', 'How the Trial Score works'), mdEl('div.prose', HOW))));
  }

  // ---- pace ----
  const bonusOn = state.settings?.bonus && state.settings.bonus.until >= E.dateStr(now);
  const ctlBonus = control.bonus && control.bonus.until >= E.dateStr(now);
  root.append(h('section.panel', h('h2', 'Pace'),
    h('div.pace-grid',
      stat('Day', `${Math.min(pc.total, pc.planned + 1)} of ${pc.total}`),
      stat('Sessions done', String(pc.idx)),
      stat(pc.lag > 0 ? 'Behind plan' : pc.lag < 0 ? 'Ahead of plan' : 'On plan', pc.lag === 0 ? '0' : `${Math.abs(pc.lag)} session${Math.abs(pc.lag) === 1 ? '' : 's'}`),
      stat('Projected finish', pc.projectedEnd),
      stat('Last session', Object.keys(state.history.days || {}).sort().pop() || 'none yet')),
    h('p.small.muted', 'Mastery comes first: when a topic doesn\'t stick, the next day rebuilds it and the timeline stretches. If he falls far behind, you can approve 30 extra minutes a day so rebuilds happen in the extra time instead.'),
    bonusOn || ctlBonus ? h('p.callout', `Extra time is on until ${(control.bonus || state.settings.bonus).until}.`) :
      h('button.btn' + (pc.lag >= 4 ? '.primary' : ''), { type: 'button', on: { click: () => actions.approveBonus && actions.approveBonus() } }, 'Approve 30 extra minutes a day for 2 weeks')));

  // ---- alerts ----
  const al = alerts.length ? alerts : (state.outbox || []).slice().reverse();
  root.append(h('section.panel', h('h2', 'Alerts'),
    al.length ? h('ul.alerts', al.slice(0, 40).map((a) => h('li.alert.a-' + a.level, h('span.a-icon', { 'aria-hidden': 'true' }, { good: '✓', warn: '!', action: '!!', info: '•' }[a.level] || '•'), h('span.a-level.visually-hidden', a.level), h('div', h('p', a.text), h('p.muted.small', new Date(a.at).toLocaleString()))))) : h('p.muted', 'No alerts yet.')));

  // ---- skills by unit ----
  const unitsEl = h('div.units');
  for (const u of course.units) {
    const ids = Object.entries(meta).filter(([, m]) => m.unit === u.id).map(([k]) => k);
    const started = ids.filter((k) => state.skills[k]);
    const cells = ids.map((k) => { const v = E.skillView(state, k, now); const sc = v ? Math.round(v.score) : null; return h('span.cell' + (sc == null ? '.empty' : ''), { title: `${meta[k].name}: ${sc == null ? 'not started' : sc + '/100'}`, style: sc == null ? null : { background: inkFor(sc) }, tabindex: '0' }); });
    const avg = started.length ? Math.round(started.reduce((a, k) => a + E.skillView(state, k, now).score, 0) / started.length) : null;
    unitsEl.append(h('div.unit-row', h('span.unit-name', u.name), h('span.unit-cells', cells), h('span.unit-avg', avg == null ? '–' : String(avg))));
  }
  const weakest = Object.keys(state.skills).map((k) => E.skillView(state, k, now)).sort((a, b) => a.score - b.score).slice(0, 6);
  root.append(h('section.panel', h('h2', 'Skills'), h('p.small.muted', 'Each square is one skill, darker is stronger, outlined squares are still ahead. Hover or tap for the name and score.'), unitsEl,
    weakest.length ? h('div', h('h3', 'Weakest right now'), h('ul.weak', weakest.map((v) => h('li', h('span', meta[v.id]?.name || v.id), h('span.muted', ` ${Math.round(v.score)}/100 · memory ${Math.round(v.R * 100)}%`))))) : null));

  // ---- daily record ----
  const dayRows = days.length ? days : [];
  const histDays = Object.entries(state.history.days || {}).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 30);
  root.append(h('section.panel', h('h2', 'Daily record'),
    histDays.length ? h('table.days', h('thead', h('tr', ['Date', 'Session', 'Minutes', 'Problems', 'Correct'].map((t) => h('th', t)))),
      h('tbody', histDays.map(([d, v]) => h('tr', h('td', d), h('td', v.sessions.map((sid) => (course.sessions.find((s) => s.id === sid.split(':')[0])?.title || sid) + (sid.includes(':') ? ' (rebuild)' : '')).join(', ')), h('td', String(Math.round(v.minutes))), h('td', String(v.items)), h('td', v.items ? `${Math.round((100 * v.correct) / v.items)}%` : '–'))))) : h('p.muted', 'No sessions yet.'),
    dayRows.length ? h('div.daylogs', h('h3', 'Inside each session'), dayRows.slice(0, 14).map((lg) => dayLog(lg))) : null));

  // ---- flagged problems ----
  if ((state.flags || []).length) root.append(h('section.panel', h('h2', 'Questions he reported'), h('p.small.muted', 'These did not count against him. The next content update reviews and fixes them.'), h('ul', state.flags.slice(-20).reverse().map((f) => h('li', mdEl('div', f.q), h('p.muted.small', `His answer: ${f.given || '(none)'} · ${new Date(f.at).toLocaleDateString()}`))))));

  // ---- settings ----
  root.append(settingsPanel(state, family, actions));
}

function stat(label, value) { return h('div.stat', h('span.stat-v', value), h('span.stat-l', label)); }

function dayLog(lg) {
  return h('details.daylog', h('summary', `${lg.date} · ${lg.title}${lg.mode !== 'normal' ? ` (${lg.mode})` : ''} · ${lg.minutes} min`),
    lg.misses?.length ? h('div', h('h4', `Missed (${lg.misses.length})`), h('ul.misses', lg.misses.slice(0, 15).map((m) => h('li', mdEl('div', m.q), mdEl('p.small', `He answered **${m.given || '(blank)'}**; answer ${m.answer}`))))) : h('p.small', 'No misses.'),
    lg.explanations?.length ? h('div', h('h4', 'His explanations'), h('ul', lg.explanations.slice(0, 8).map((x) => h('li', h('p.small.muted', x.q.replace(/\$/g, '')), h('p', x.text))))) : null,
    lg.reflections?.answers ? h('div', h('h4', 'Reflection'), lg.reflections.answers.map((r) => h('p', h('span.muted', r.p + ' '), r.a || '(blank)')), lg.reflections.rating ? h('p.small', `Self-rated understanding: ${lg.reflections.rating}/5`) : null) : null,
    lg.book ? h('p.small', `Book work (${lg.book.ref}): ${lg.book.right || '?'} right of ${lg.book.tried || '?'} tried.`) : null);
}

function settingsPanel(state, family, actions) {
  const topic = family?.ntfyTopic;
  return h('section.panel', h('h2', 'Settings'),
    topic ? h('div', h('h3', 'Alerts on your phone'), mdEl('div.prose', `1. Install the free **ntfy** app (App Store or Google Play).\n2. Tap **+**, and subscribe to this topic:`), h('p.topic', h('code', topic), ' ', h('button.btn.small', { type: 'button', on: { click: () => { navigator.clipboard?.writeText(topic); toast('Topic copied'); } } }, 'Copy')),
      h('p.small.muted', 'Keep the topic private: anyone with it could read the alerts.'),
      h('label.row', 'Send me: ', h('select', { on: { change: (e) => actions.setPushLevel && actions.setPushLevel(e.target.value) } }, h('option', { value: 'all', selected: family.pushLevel !== 'important' }, 'Every grade update'), h('option', { value: 'important', selected: family.pushLevel === 'important' }, 'Only warnings and milestones')))) :
      h('p.small.muted', 'Phone alerts turn on once sync is set up (see the setup guide).'),
    h('h3', 'Backup'), h('div.row', h('button.btn', { type: 'button', on: { click: () => actions.exportBackup && actions.exportBackup() } }, 'Download a backup'), actions.importBackup ? h('button.btn', { type: 'button', on: { click: () => actions.importBackup() } }, 'Restore from backup') : null),
    actions.changePin ? h('div', h('h3', 'Parent PIN'), h('button.btn', { type: 'button', on: { click: () => actions.changePin() } }, 'Change PIN')) : null,
    actions.signOut ? h('div', h('h3', 'Account'), h('button.btn', { type: 'button', on: { click: () => actions.signOut() } }, 'Sign out')) : null);
}

// ---- single-series line chart of the Trial Score, with hover crosshair + tooltip ----
export function lineChart(points) {
  const W = 560, H = 180, L = 34, R = 10, T = 12, B = 24;
  const wrap = h('div.chart');
  if (!points || points.length < 2) { wrap.append(h('p.muted.small', 'The trend line appears after two days.')); return wrap; }
  const n = points.length; const ys = points.map((p) => p.score);
  const lo = Math.max(0, Math.floor((Math.min(...ys) - 5) / 10) * 10), hi = 100;
  const x = (i) => L + ((W - L - R) * i) / (n - 1), y = (v) => T + ((H - T - B) * (hi - v)) / (hi - lo);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `Trial Score over ${n} days, from ${ys[0]} to ${ys[n - 1]}`);
  const add = (tag, attrs, text) => { const e = document.createElementNS(ns, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); if (text) e.textContent = text; svg.append(e); return e; };
  for (let v = lo; v <= hi; v += 10) { add('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'grid' }); add('text', { x: L - 6, y: y(v) + 4, class: 'axis', 'text-anchor': 'end' }, String(v)); }
  for (const [v, lbl] of [[85, 'Proficient'], [93, 'Mastered']]) if (v >= lo) { add('line', { x1: L, x2: W - R, y1: y(v), y2: y(v), class: 'ref' }); add('text', { x: W - R, y: y(v) - 4, class: 'axis ref-l', 'text-anchor': 'end' }, lbl); }
  add('path', { d: points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.score).toFixed(1)}`).join(''), class: 'line' });
  add('circle', { cx: x(n - 1), cy: y(ys[n - 1]), r: 4, class: 'end' });
  add('text', { x: L, y: H - 6, class: 'axis' }, points[0].date); add('text', { x: W - R, y: H - 6, class: 'axis', 'text-anchor': 'end' }, points[n - 1].date);
  const cross = add('line', { x1: 0, x2: 0, y1: T, y2: H - B, class: 'cross', visibility: 'hidden' });
  const dot = add('circle', { r: 5, class: 'hover-dot', visibility: 'hidden' });
  const tip = h('div.tip'); tip.hidden = true;
  const hit = add('rect', { x: L, y: 0, width: W - L - R, height: H, fill: 'transparent' });
  const move = (e) => {
    const r = svg.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.max(0, Math.min(n - 1, Math.round(((px - L) / (W - L - R)) * (n - 1))));
    cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
    dot.setAttribute('cx', x(i)); dot.setAttribute('cy', y(ys[i])); dot.setAttribute('visibility', 'visible');
    tip.hidden = false; tip.textContent = `${points[i].date}: ${ys[i]}`; tip.style.left = `${(x(i) / W) * 100}%`;
  };
  hit.addEventListener('pointermove', move); hit.addEventListener('pointerdown', move);
  hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); tip.hidden = true; });
  wrap.append(svg, tip);
  return wrap;
}

const HOW = `The Trial Score is a single 0–100 number for **how well he knows everything he has been taught so far**. It is not a percentage of problems right. It is built from four measurements, each a well-studied idea from learning research:

- **Mastery (60%).** Every problem updates a rating for its skill, the same way chess ratings move after each game (an Elo/Rasch model, used in adaptive tutoring systems). Hard problems solved without hints raise it most. Hints, second tries, and looking at the solution count for less. Mastery is the predicted chance he solves a typical on-level problem for each skill.
- **Retention (25%).** Memory fades on a known curve. Each skill has a "stability" that grows every time he recalls it after a gap, the same model modern spaced-repetition software uses. Retention is how much he would still remember today.
- **Fluency (15%).** How quickly he solves the problems he gets right, compared with the expected time for that difficulty.
- **Problem solving (15%, once available).** A separate rating from non-routine, contest-style problems. When present, it is blended in at 15% and the other three share the remaining 85%.

Skills he hasn't reached yet don't count, so the score measures quality, not progress. Progress is in the Pace panel.

| Score | Band | Meaning |
|---|---|---|
| 93–100 | A · Mastered | Solid, fast, and remembered |
| 85–92 | B · Proficient | Reliable, a few soft spots |
| 75–84 | C · Developing | Knows it with effort; review is doing work |
| 65–74 | D · Fragile | Partly learned or fading |
| below 65 | F · Not yet | Needs reteaching |

Units also have **mastery exams**: he must score 85% to unlock the next unit, otherwise the app rebuilds the weak skills and he retakes it.`;
