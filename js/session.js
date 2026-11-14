// session.js — runs one day: warm-up → discover → learn → practice → challenge → exit check → reflect.
// Each block is grounded in a specific research finding (see the course guide); the comments say which.
import { h, clear, mdEl, renderMd, fmtMin, toast, modal, shuffle } from './util.js';
import { check, normalizeInput } from './mathcheck.js';
import { answerBox, textBox, choiceBox } from './keypad.js';
import { openScratch, drawingPad } from './scratch.js';
import * as E from './engine.js';
import * as C from './content.js';

window.__renderMd = renderMd;

// ---------------- the problem card ----------------
// opts: {context, hints:true, retry:true, label, showSkill, sessionCtx, onResult}
export function problemCard(item, opts = {}) {
  const ctx = opts.sessionCtx;
  window.__lastItem = item; // used by automated tests to read the current problem
  const allowHints = opts.hints !== false && (item.hints || []).length > 0;
  const allowRetry = opts.retry !== false;
  const started = performance.now();
  let tries = 0, hintsUsed = 0, sawSolution = false, finished = false, firstTime = null;
  const card = h('div.problem' + (opts.compact ? '.compact' : ''));
  const head = h('div.problem-head', opts.label ? h('span.problem-label', opts.label) : null,
    opts.showSkill !== false && item.skill ? h('span.problem-skill', C.skillMeta()[item.skill]?.name || '') : null);
  const prompt = mdEl('div.problem-q', item.q);
  const svg = item.svg ? h('div.figure', { html: item.svg }) : null;
  const feedback = h('div.feedback', { 'aria-live': 'polite' });
  const hintBox = h('div.hints');
  const after = h('div.after');
  let input;
  const type = item.a?.type || 'number';
  const vars = item.a?.vars || (item.a?.type === 'expr' ? [...new Set(String(item.a.value).match(/[a-z]/g) || [])].filter((v) => !'sqrtpi'.includes(v) || v === 'x') : []);
  if (type === 'choice') input = choiceBox(item.a.options || item.options || []);
  else if (type === 'text') input = textBox({ placeholder: 'Write your reasoning here' });
  else input = answerBox({ type, vars, onSubmit: () => submit(0.75) });

  const btnSure = h('button.btn.primary', { type: 'button', on: { click: () => submit(0.9) } }, type === 'text' ? 'Show the model answer' : 'Check: I\'m sure');
  const btnUnsure = type === 'text' ? null : h('button.btn', { type: 'button', on: { click: () => submit(0.4) } }, 'Check: not sure');
  const btnHint = allowHints ? h('button.btn.ghost', { type: 'button', on: { click: showHint } }, 'Hint') : null;
  const btnScratch = h('button.btn.ghost', { type: 'button', on: { click: () => openScratch(item.id) } }, 'Scratch paper');
  const btnFlag = h('button.link.flag', { type: 'button', on: { click: flag } }, 'Report a problem with this question');
  const actions = h('div.problem-actions', btnSure, btnUnsure, btnHint, btnScratch);
  card.append(...[head, prompt, svg, input.el, actions, hintBox, feedback, after, btnFlag].filter(Boolean));
  card.lock = () => { finished = true; card.querySelectorAll('button, textarea').forEach((b) => (b.disabled = true)); input.disable && input.disable(); card.classList.add('locked'); };

  function showHint() {
    const hs = item.hints || [];
    if (hintsUsed < hs.length) { hintBox.append(mdEl('div.hint', `**Hint ${hintsUsed + 1}.** ${hs[hintsUsed]}`)); hintsUsed++; if (hintsUsed === hs.length) btnHint.textContent = 'Show the solution'; }
    else { sawSolution = true; reveal(false); }
  }
  async function flag() {
    const why = await modal('Report this question', h('p', 'If the question or its answer looks wrong, report it. It will not count against you, and your parent will see it.'), [{ label: 'Cancel', value: null }, { label: 'Report it', value: 'yes', primary: true }]);
    if (!why) return;
    ctx && ctx.flag(item, input.value);
    toast('Reported. This question will not count.', 'ok');
    finished = true; opts.onResult && opts.onResult({ flagged: true, item });
  }
  function submit(conf) {
    if (finished) return;
    const val = input.value;
    if (type === 'text') {
      // free response: compare with the model answer and self-rate (self-explanation, not auto-graded)
      reveal(true, true);
      after.append(h('p.muted', 'How close was yours?'), h('div.row',
        ...[['Matched it', 1], ['Partly', 0.5], ['Missed it', 0]].map(([l, v]) => h('button.btn', { type: 'button', on: { click: () => done({ correct: v >= 1, selfScore: v, given: val, confidence: null }) } }, l))));
      return;
    }
    if (firstTime === null) firstTime = (performance.now() - started) / 1000;
    const r = check(item.a, val);
    clear(feedback);
    if (r.empty) { feedback.append(h('p.note', r.msg)); return; }
    if (r.parseError || r.formError) { feedback.append(h('p.note', r.msg || 'Could not read that — check the format.')); return; }
    tries++;
    if (r.ok) {
      feedback.append(h('p.good', tries > 1 ? 'Correct on the second try.' : 'Correct.'));
      card.classList.add('is-right');
      const sol = item.sol ? h('details.sol', h('summary', 'See a clean solution'), mdEl('div', item.sol)) : null;
      after.append(sol || '');
      if (item.explain && ctx) {
        const tb = textBox({ placeholder: 'One or two sentences', rows: 2 });
        after.append(mdEl('p.explain-q', `**Explain:** ${item.explain}`), tb.el);
        finishBtn(() => { ctx.saveExplanation(item, tb.value); done({ correct: true, given: val, confidence: conf }); });
      } else finishBtn(() => done({ correct: true, given: val, confidence: conf }));
    } else {
      card.classList.add('is-wrong'); setTimeout(() => card.classList.remove('is-wrong'), 600);
      const key = normalizeInput(val).replace(/\s/g, '');
      const mis = item.mis && (item.mis[key] || item.mis[val.trim()]);
      if (mis) feedback.append(mdEl('p.bad', `Not quite. ${mis}`));
      else feedback.append(h('p.bad', 'Not quite.'));
      if (allowRetry && tries < 2) { feedback.append(h('p.muted', 'Take another look and try again.')); return; }
      reveal(false); finishBtn(() => done({ correct: false, given: val, confidence: conf }));
    }
  }
  function reveal(isModel, keepOpen) {
    btnSure.disabled = true; if (btnUnsure) btnUnsure.disabled = true; if (btnHint) btnHint.disabled = true; input.disable();
    if (type === 'choice' && input.mark) input.mark(Number(item.a.value));
    const ans = answerText(item);
    after.append(h('div.reveal', ans ? mdEl('p', `${isModel ? 'Model answer' : 'Answer'}: ${ans}`) : null, item.sol ? mdEl('div.sol-body', item.sol) : null));
    if (sawSolution && !keepOpen) finishBtn(() => done({ correct: false, given: input.value, confidence: null }));
  }
  let finishShown = false;
  function finishBtn(fn) { if (finishShown) return; finishShown = true; const b = h('button.btn.primary.next', { type: 'button', on: { click: fn } }, 'Continue'); after.append(b); setTimeout(() => b.focus(), 50); }
  function done(res) {
    if (finished) return; finished = true;
    card.querySelectorAll('button.next').forEach((b) => b.remove());
    [btnSure, btnUnsure, btnHint].forEach((b) => b && (b.disabled = true)); input.disable && input.disable(); btnFlag.remove();
    const result = { item, tries: Math.max(1, tries), hints: hintsUsed, sawSolution, timeSec: firstTime ?? (performance.now() - started) / 1000, ...res };
    opts.onResult && opts.onResult(result);
  }
  setTimeout(() => input.focus && input.focus(), 60);
  return card;
}

export function answerText(item) {
  const a = item.a || {};
  if (a.type === 'choice') { const o = (a.options || [])[a.value]; return `(${String.fromCharCode(65 + Number(a.value))}) ${o ?? ''}`; }
  if (a.type === 'text') return a.value || '';
  if (a.display) return a.display;
  if (a.type === 'expr' || a.type === 'number') return `$${toTexSafe(a.value)}$`;
  return String(a.value ?? '');
}
function toTexSafe(v) { return String(v).replace(/sqrt\(([^)]*)\)/g, '\\sqrt{$1}').replace(/\*/g, '\\cdot ').replace(/pi/g, '\\pi '); }

// ---------------- session context ----------------
export function makeContext({ state, course, sess, data, mode, rebuildSkills, rebuildFirst, save, now = new Date() }) {
  const log = { date: E.dateStr(now), sid: sess.id, title: sess.title, mode, blocks: {}, misses: [], explanations: [], reflections: {}, book: null, flags: [], minutes: 0 };
  const ctx = {
    state, course, sess, data, mode, rebuildSkills, rebuildFirst, log, now,
    items: 0, correct: 0,
    record(result, context) {
      if (result.flagged) return;
      const it = result.item;
      if (!it.skill) return;
      const credit = E.recordAttempt(state, { itemId: it.id, skill: it.skill, d: it.d || 3, dok: it.dok || 2, correct: !!result.correct, hints: result.hints, tries: result.tries, sawSolution: result.sawSolution, timeSec: result.timeSec, expectedSec: it.t, context, confidence: result.confidence }, new Date());
      ctx.items++; if (result.correct && result.tries === 1 && !result.hints) ctx.correct++;
      const b = log.blocks[context] || (log.blocks[context] = { items: 0, correct: 0 }); b.items++; if (result.correct) b.correct++;
      if (!result.correct) log.misses.push({ q: String(it.q).slice(0, 400), given: result.given, answer: answerText(it), skill: it.skill, context });
      save();
      return credit;
    },
    flag(item, given) { const f = { id: item.id, q: String(item.q).slice(0, 400), given, at: new Date().toISOString(), sid: sess.id }; state.flags.push(f); log.flags.push(f); state.outbox.push(E.alert('flag', 'info', `Problem reported in "${sess.title}": ${String(item.q).replace(/\$/g, '').slice(0, 120)}…`)); save(); },
    saveExplanation(item, text) { if (!text) return; log.explanations.push({ q: String(item.q).slice(0, 200), text }); const nb = state.notebook[sess.id] || (state.notebook[sess.id] = {}); (nb.explanations ||= []).push(text); save(); },
  };
  return ctx;
}

// ---------------- the block shell ----------------
const BLOCKS = {
  warmup: { name: 'Warm-up', min: 15, why: 'Retrieval from memory, spaced over days, is one of the two highest-rated study methods.' },
  discover: { name: 'Discover', min: 10, why: 'Wrestling with a problem before being taught it leads to deeper learning (productive failure).' },
  learn: { name: 'Learn', min: 30, why: 'Worked examples you explain to yourself, then try with steps removed.' },
  practice: { name: 'Practice', min: 35, why: 'Adaptive, mixed practice: problems sized to you and interleaved with older topics.' },
  challenge: { name: 'Challenge', min: 20, why: 'Non-routine problems build the problem-solving needed for contests.' },
  exit: { name: 'Exit check', min: 7, why: 'A short no-hints check of today\'s skills decides what tomorrow looks like.' },
  reflect: { name: 'Reflect', min: 3, why: 'Explaining the idea in your own words locks it in.' },
  rebuild: { name: 'Rebuild', min: 30, why: 'A second explanation, from a different angle, for the skills that did not stick.' },
  test: { name: 'Trial', min: 45, why: 'Mixed, no-hints testing measures what has really been learned.' },
  review: { name: 'Review', min: 30, why: 'Fixing mistakes right after a test is when feedback helps most.' },
  contest: { name: 'Contest set', min: 30, why: 'Contest problems mix every topic so far.' },
};

export function planBlocks(sess, mode, rebuildFirst) {
  if (mode === 'rebuild') return ['warmup', 'rebuild', 'practice', 'exit', 'reflect'];
  if (sess.type === 'trial') return ['test', 'review', 'contest', 'reflect'];
  if (sess.type === 'mastery') return ['warmup', 'test', 'review', 'reflect'];
  if (sess.type === 'benchmark') return ['test', 'review', 'reflect'];
  const base = ['warmup', 'discover', 'learn', 'practice', 'challenge', 'exit', 'reflect'];
  return rebuildFirst ? ['rebuild', ...base] : base;
}

export async function runSession(root, ctx, { onFinish, resumeBlock = 0, persistBlock } = {}) {
  const plan = planBlocks(ctx.sess, ctx.mode, ctx.rebuildFirst);
  const startAll = Date.now();
  let activeSec = 0, lastTick = Date.now(), lastInput = Date.now();
  document.addEventListener('pointerdown', () => (lastInput = Date.now()), { passive: true });
  document.addEventListener('keydown', () => (lastInput = Date.now()));
  const tick = setInterval(() => {
    const now = Date.now(); const dt = (now - lastTick) / 1000; lastTick = now;
    if (document.visibilityState === 'visible' && now - lastInput < 180000) activeSec += dt; // only count real work time
    timerEl.textContent = fmtMin(activeSec); blockTimer.textContent = fmtMin((now - blockStart) / 1000);
    const over = (now - blockStart) / 60000 > (BLOCKS[plan[bi]]?.min || 99) * (plan[bi] === 'practice' ? 1 : 1.3);
    blockTimer.classList.toggle('over', over);
  }, 1000);
  let bi = resumeBlock, blockStart = Date.now();
  const steps = h('ol.steps', plan.map((b, i) => h('li', { 'data-i': i }, b === 'test' ? ({ mastery: 'Mastery exam', benchmark: 'Benchmark', trial: 'Weekly Trial' }[ctx.sess.type] || 'Trial') : BLOCKS[b].name)));
  const timerEl = h('span.total-time', '0:00'); const blockTimer = h('span.block-time', '0:00');
  const bar = h('header.session-bar', h('a.back', { href: '#/home', 'aria-label': 'Leave session (progress is saved)' }, 'Home'), steps, h('div.times', h('span.muted', 'Block '), blockTimer, h('span.muted', ' · Today '), timerEl));
  const stage = h('main.stage');
  clear(root).append(bar, stage);
  for (; bi < plan.length; bi++) {
    blockStart = Date.now();
    steps.querySelectorAll('li').forEach((li, i) => { li.classList.toggle('done', i < bi); li.classList.toggle('now', i === bi); });
    persistBlock && persistBlock(bi);
    clear(stage);
    const b = plan[bi];
    const bname = b === 'test' ? { mastery: 'Mastery exam', benchmark: 'Benchmark', trial: 'Weekly Trial' }[ctx.sess.type] || BLOCKS[b].name : BLOCKS[b].name;
    stage.append(h('div.block-head', h('h2', bname, ' ', h('span.block-min', `about ${b === 'test' && ctx.sess.type === 'benchmark' ? 40 : BLOCKS[b].min} min`)), h('p.why', BLOCKS[b].why)));
    const body = h('div.block-body'); stage.append(body);
    const t0 = Date.now();
    await RUNNERS[b](body, ctx, { blockStart });
    ctx.log.blocks[b] = { ...(ctx.log.blocks[b] || {}), minutes: Math.round((Date.now() - t0) / 6000) / 10 };
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }
  clearInterval(tick);
  ctx.log.minutes = Math.round(activeSec / 60) || Math.round((Date.now() - startAll) / 60000);
  onFinish && onFinish(ctx);
}

// sequential problem runner used by most blocks
function runItems(body, ctx, items, context, opts = {}) {
  return new Promise((resolve) => {
    let i = 0; const results = [];
    const list = h('div.items'); body.append(list);
    const step = () => {
      if (i >= items.length || (opts.until && opts.until(results))) { resolve(results); return; }
      const it = items[i++];
      if (!it) { step(); return; }
      clear(list);
      list.append(h('p.counter', opts.counter ? opts.counter(i, items.length) : `Problem ${i} of ${items.length}`));
      list.append(problemCard(it, { ...opts, sessionCtx: ctx, onResult: (r) => { if (opts.record !== false) ctx.record(r, context); results.push(r); opts.onEach && opts.onEach(r, results); step(); } }));
    };
    step();
  });
}

function continueButton(body, label = 'Continue') { return new Promise((res) => { const b = h('button.btn.primary.big', { type: 'button', on: { click: () => res() } }, label); body.append(h('div.block-end', b)); }); }

// ---------------- block runners ----------------
const RUNNERS = {
  // Successive relearning: due skills until each is answered correctly once; misses come back later in the block.
  async warmup(body, ctx) {
    const st = ctx.state;
    const focus = ctx.mode === 'rebuild' ? ctx.rebuildSkills : [];
    let items = focus.length ? C.mixedTest(st, focus, Math.min(6, focus.length * 2), { dRange: [2, 3], seed: 'rw' }) : C.warmupItems(st, ctx.now, 7, ctx.sess.skills || []);
    const cardIds = Object.values(ctx.state.cardsIndex || {}).map((c) => c.id);
    const due = E.dueCards(st, cardIds, ctx.now, 4);
    if (!items.length && !due.length) {
      body.append(h('p', 'Nothing is due for review yet. That changes from tomorrow, when today\'s ideas start coming back for spaced review.'));
      if (ctx.sess.day === 1) body.append(mdEl('div.callout', 'How The Trial works: every day has the same seven parts. You will see problems you **cannot yet solve** on purpose; that struggle is part of how you learn. Hints are there when you need them, but answers you get without hints count more.'));
      return continueButton(body);
    }
    if (due.length) {
      body.append(h('h3', 'Recall'));
      for (const id of due) await recallCard(body, ctx, ctx.state.cardsIndex[id]);
    }
    if (items.length) {
      const queue = items.slice(); let retries = 0;
      const res = await runItems(body, ctx, queue, 'warmup', { retry: false, hints: true, counter: (i) => `Review ${i}`, onEach: (r) => {
        if (!r.correct && !r.flagged && retries < 3) { retries++; const again = C.mixedTest(st, [r.item.skill], 1, { dRange: [r.item.d > 1 ? r.item.d - 1 : 1, r.item.d > 1 ? r.item.d - 1 : 1], seed: 'retry' + retries })[0]; if (again) queue.push(again); }
      } });
      clear(body); body.append(h('p', `Warm-up done: ${res.filter((r) => r.correct).length} of ${res.length} correct.`));
    }
    return continueButton(body);
  },

  // Productive failure: attempt first, get taught second. Quick pretest lets a strong start fast-track.
  async discover(body, ctx) {
    const D = ctx.data.discover || {};
    if (D.intro) body.append(mdEl('div.intro', D.intro));
    const pre = (ctx.sess.skills || []).flatMap((s) => C.mixedTest(ctx.state, [s], 1, { dRange: [3, 3], seed: 'pre' + s }));
    let preRes = [];
    if (pre.length) {
      body.append(h('h3', 'Quick check: what do you already know?'), h('p.muted', 'No hints. If you can already do these, today speeds up.'));
      const box = h('div'); body.append(box);
      preRes = await runItems(box, ctx, pre.slice(0, 3), 'pretest', { hints: false, retry: false, counter: (i, n) => `Check ${i} of ${n}` });
      clear(box);
    }
    const fast = preRes.length >= 2 && preRes.every((r) => r.correct && r.tries === 1 && r.timeSec < 150);
    ctx.fastTrack = fast;
    if (fast) body.append(mdEl('div.callout.good', '**Fast track unlocked.** You already handle the basics of today\'s topic, so the lesson will show the key ideas and harder examples, and practice will start harder.'));
    if (D.problem) {
      body.append(h('h3', 'The opening problem'), h('p.muted', 'You have not been taught how to do this yet. Try anything: draw, test numbers, guess and check. A wrong attempt is fine and useful.'));
      const box = h('div'); body.append(box);
      await new Promise((res) => {
        const it = { ...D.problem, id: ctx.sess.id + '-discover', skill: null };
        let card, link;
        const finish = (r) => { ctx.discoverResult = r; link && link.remove(); if (r.gaveUp) { card.lock(); box.append(h('p.muted', 'Good. The lesson starts by coming back to this problem.')); } res(); };
        card = problemCard(it, { sessionCtx: ctx, hints: false, retry: true, showSkill: false, onResult: (r) => finish(r) });
        link = h('button.link', { type: 'button', on: { click: () => finish({ gaveUp: true }) } }, 'I gave it a real try. Teach me.');
        box.append(card, link);
      });
    }
    return continueButton(body, 'Start the lesson');
  },

  async learn(body, ctx) {
    const L = ctx.data.learn || { sections: [] };
    const sections = ctx.fastTrack ? L.sections.filter((s) => s.type === 'key' || s.type === 'debrief' || s.deep || s.type === 'check' || s.type === 'mistake') : L.sections;
    if (ctx.fastTrack) body.append(h('details.full-lesson', h('summary', 'Show the full lesson instead'), h('div', { 'data-full': '1' })));
    for (const s of sections) await renderSection(body, ctx, s);
    if (ctx.fastTrack) { const full = body.querySelector('[data-full]'); full && full.parentElement.addEventListener('toggle', async (e) => { if (e.target.open && !full.childElementCount) for (const s of L.sections) await renderSection(full, ctx, s, true); }, { once: true }); }
    if (L.summary) body.append(h('div.summary', h('h3', 'Today in three lines'), h('ul', L.summary.map((x) => h('li', { html: renderMd(x, { inline: true }) })))));
    // spaced-retrieval cards for today's facts start their review cycle
    for (const c of ctx.data.cards || []) { ctx.state.cardsIndex = ctx.state.cardsIndex || {}; ctx.state.cardsIndex[c.id] = c; if (!ctx.state.cards[c.id]) E.recordCard(ctx.state, c.id, true, ctx.now); }
    return continueButton(body, 'Go to practice');
  },

  // Adaptive mixed practice: ends early once today's skills are mastered, or when time is up.
  async practice(body, ctx, { blockStart }) {
    const skills = ctx.mode === 'rebuild' ? ctx.rebuildSkills : (ctx.sess.skills || []);
    const hand = (ctx.data.practice?.items || []).filter((it) => skills.includes(it.skill));
    if (ctx.fastTrack) for (const s of skills) { const r = ctx.state.skills[s]; if (r && r.th < 1.2) r.th = 1.2; }
    const stream = C.practiceStream(ctx.state, skills, hand, ctx.now);
    const meters = h('div.meters'); body.append(meters);
    const drawMeters = () => { clear(meters); for (const s of skills) { const v = E.skillView(ctx.state, s, new Date()); const M = v ? v.M : 0; meters.append(h('div.meter', h('span.meter-name', C.skillMeta()[s]?.name || s), h('span.meter-bar', h('span.meter-fill', { style: { width: `${Math.round(M * 100)}%` } })), h('span.meter-val', `${Math.round(M * 100)}%`))); } };
    drawMeters();
    const limitMs = (BLOCKS.practice.min + (ctx.rebuildFirst ? 0 : 0)) * 60000;
    const minItems = ctx.fastTrack ? 8 : 12;
    const box = h('div'); body.append(box);
    let n = 0;
    const mastered = () => skills.every((s) => (E.skillView(ctx.state, s, new Date())?.M || 0) >= 0.85);
    await new Promise((resolve) => {
      const step = () => {
        drawMeters();
        const elapsed = Date.now() - blockStart;
        if ((n >= minItems && mastered()) || elapsed > limitMs || n >= 45) { resolve(); return; }
        const it = stream.next(); if (!it) { resolve(); return; }
        n++; clear(box);
        box.append(h('p.counter', `Problem ${n}`), problemCard(it, { sessionCtx: ctx, onResult: (r) => { ctx.record(r, 'practice'); step(); } }));
      };
      step();
    });
    clear(box);
    box.append(h('p', mastered() ? `Practice complete: today's skills reached the mastery bar after ${n} problems.` : `Time for practice is up after ${n} problems. Anything not yet solid comes back in tomorrow's warm-up.`));
    return continueButton(body);
  },

  async challenge(body, ctx) {
    const Ch = ctx.data.challenge || {};
    const items = (Ch.items || []).map((it) => ({ ...it, d: it.d || 4, dok: it.dok || 3 }));
    const extra = C.contestSet(ctx.state, C.introducedSkills(ctx.state).filter((s) => !(ctx.sess.skills || []).includes(s)), 1);
    const all = [...items, ...extra];
    if (all.length) await runItems(body, ctx, all, 'challenge', { counter: (i, n) => `Challenge ${i} of ${n}` });
    clear(body);
    const book = ctx.sess.book && ctx.data.book !== false ? (ctx.data.book || { ref: ctx.sess.book }) : null;
    if (book) {
      body.append(h('h3', 'Book work'), mdEl('div.book', `**${book.ref}**${book.assign ? `\n\n${book.assign}` : '\n\nTry the problems at the start of each section before reading the solutions, then do the exercises.'}`));
      const got = answerBox({ placeholder: 'How many right?' }); const tried = answerBox({ placeholder: 'How many tried?' });
      body.append(h('div.book-report', h('label', 'Problems tried', tried.el), h('label', 'Problems right', got.el)));
      await continueButton(body, 'Save and continue');
      ctx.log.book = { ref: book.ref, tried: tried.value, right: got.value };
      return;
    }
    return continueButton(body);
  },

  async exit(body, ctx) {
    const skills = ctx.mode === 'rebuild' ? ctx.rebuildSkills : (ctx.sess.skills || []);
    const items = C.exitItems(ctx.state, skills, ctx.data.exit?.items || [], 5);
    const res = await runItems(body, ctx, items, 'exit', { hints: false, retry: false, counter: (i, n) => `Exit ${i} of ${n}` });
    const counted = res.filter((r) => !r.flagged);
    const pct = counted.length ? (100 * counted.filter((r) => r.correct).length) / counted.length : 100;
    ctx.exitPct = pct;
    const missBySkill = {}; counted.filter((r) => !r.correct).forEach((r) => (missBySkill[r.item.skill] = (missBySkill[r.item.skill] || 0) + 1));
    ctx.weakSkills = skills.filter((s) => (missBySkill[s] || 0) >= 2 || (E.skillView(ctx.state, s, new Date())?.M || 0) < 0.6);
    clear(body); body.append(h('p.big-result', `${Math.round(pct)}%`), h('p', pct >= 80 ? 'Solid.' : pct >= 60 ? 'Getting there. The weak spots come back in warm-ups.' : 'Not there yet. Tomorrow starts with a rebuild of this topic, explained a different way.'));
    return continueButton(body);
  },

  async reflect(body, ctx) {
    const prompts = ctx.data.reflect?.prompts || ['In two or three sentences, explain today\'s main idea as if teaching a friend who missed the lesson.', 'What mistake will you watch out for next time?'];
    const boxes = prompts.map((p) => { const t = textBox({ rows: 3 }); body.append(mdEl('p.reflect-q', p), t.el); return [p, t]; });
    body.append(h('p.reflect-q', 'How well do you understand today\'s topic?'));
    let rating = null; const rate = h('div.row', [1, 2, 3, 4, 5].map((n) => h('button.chip', { type: 'button', on: { click: (e) => { rating = n; rate.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === e.target)); } } }, String(n)))); body.append(rate, h('p.muted.small', '1 = lost, 5 = could teach it'));
    body.append(h('h3', 'Notebook page'), h('p.muted', 'Write or sketch whatever you want to remember. This page stays with today\'s lesson in your notebook.'));
    const pad = drawingPad({ key: 'note:' + ctx.sess.id, height: 360 }); body.append(pad.el);
    await continueButton(body, 'Finish today');
    const nb = ctx.state.notebook[ctx.sess.id] || (ctx.state.notebook[ctx.sess.id] = {});
    nb.title = ctx.sess.title; nb.date = ctx.log.date; nb.reflections = boxes.map(([p, t]) => ({ p, a: t.value })); nb.rating = rating;
    ctx.log.reflections = { answers: nb.reflections, rating };
  },

  // second-angle reteach for weak skills (from each lesson's "reteach" section)
  async rebuild(body, ctx) {
    const skills = ctx.mode === 'rebuild' ? ctx.rebuildSkills : (ctx.rebuildFirst || []);
    body.append(h('p', 'These skills did not stick yet. Here they are again, explained differently.'));
    for (const s of skills) {
      const firstSess = ctx.course.sessions.find((x) => (x.skills || []).includes(s) && x.type === 'lesson');
      const data = firstSess ? await C.getSession(firstSess) : null;
      body.append(h('h3', C.skillMeta()[s]?.name || s));
      const rt = data && (data.reteach || []);
      if (rt.length) for (const sec of rt) await renderSection(body, ctx, sec);
      else if (data && data.learn) for (const sec of data.learn.sections.filter((x) => x.type === 'key' || x.type === 'example').slice(0, 3)) await renderSection(body, ctx, sec);
      const items = C.mixedTest(ctx.state, [s], 3, { dRange: [1, 3], seed: 'rb' + s });
      await runItems(body, ctx, items, 'rebuild', { counter: (i, n) => `${C.skillMeta()[s]?.name || s}: ${i} of ${n}` });
      clear(body);
    }
    return continueButton(body);
  },

  // Weekly Trial / mastery exam / benchmark: mixed, timed, no hints
  async test(body, ctx) {
    const s = ctx.sess; const st = ctx.state;
    let items, ctxName, intro;
    if (s.type === 'benchmark') {
      items = C.benchmarkItems(s.id);
      if (!items.length) items = C.mixedTest(st, C.introducedSkills(st), 25, { dRange: [2, 5], seed: s.id });
      ctxName = 'benchmark'; intro = `${items.length} contest-style problems. Work in order but skip anything that stalls you; no hints, one try each. Aim for about 40 minutes.`;
    } else if (s.type === 'mastery') {
      const skills = (s.skills || []).length ? s.skills : C.introducedSkills(st);
      const unitSkills = Object.entries(C.skillMeta()).filter(([, m]) => m.unit === s.unit).map(([k]) => k).filter((k) => st.skills[k]);
      items = C.mixedTest(st, [...new Set([...skills, ...unitSkills])], 20, { dRange: [3, 4], seed: s.id + (st.progress.retakes[s.id] || 0) });
      ctxName = 'mastery'; intro = `${items.length} problems from the whole unit. 85% unlocks the next unit. No hints, one try each.`;
    } else {
      items = C.mixedTest(st, C.introducedSkills(st), 20, { dRange: [2, 4], seed: s.id });
      ctxName = 'trial'; intro = `${items.length} mixed problems from everything so far. No hints, one try each. This is how The Trial measures what has really stuck.`;
    }
    body.append(h('p', intro));
    const res = await runItems(body, ctx, items, ctxName, { hints: false, retry: false, counter: (i, n) => `${i} of ${n}` });
    const counted = res.filter((r) => !r.flagged); const right = counted.filter((r) => r.correct).length;
    ctx.testPct = counted.length ? (100 * right) / counted.length : 0;
    ctx.testRight = right; ctx.testN = counted.length;
    const miss = {}; counted.filter((r) => !r.correct).forEach((r) => (miss[r.item.skill] = (miss[r.item.skill] || 0) + 1));
    ctx.weakSkills = Object.entries(miss).sort((a, b) => b[1] - a[1]).map(([k]) => k);
    ctx.testMisses = counted.filter((r) => !r.correct);
    clear(body);
    body.append(h('p.big-result', `${right} / ${counted.length}`), h('p', s.type === 'mastery' ? (ctx.testPct >= 85 ? 'Passed. The next unit is open.' : 'Not yet at 85%. Next session rebuilds the weak skills, then you retake it.') : s.type === 'benchmark' ? benchmarkNote(right, counted.length) : `${Math.round(ctx.testPct)}% on mixed review.`));
    return continueButton(body, 'Review mistakes');
  },

  // review: see the solutions to misses, then a fresh similar problem for each
  async review(body, ctx) {
    const misses = (ctx.testMisses || []).slice(0, 8);
    if (!misses.length) { body.append(h('p', 'No misses to review. Go straight on.')); return continueButton(body); }
    for (const m of misses) {
      body.append(h('div.review-card', mdEl('div.problem-q', m.item.q), mdEl('p.muted', `You answered: ${m.given || '(blank)'}. Answer: ${answerText(m.item)}`), m.item.sol ? mdEl('div.sol-body', m.item.sol) : null));
    }
    await continueButton(body, 'Try similar problems');
    clear(body);
    const again = misses.map((m) => (m.item.skill ? C.mixedTest(ctx.state, [m.item.skill], 1, { dRange: [Math.max(1, (m.item.d || 3) - 1), Math.max(1, (m.item.d || 3) - 1)], seed: 'rev' + m.item.id })[0] : null)).filter(Boolean);
    await runItems(body, ctx, again, 'practice', { counter: (i, n) => `Second chance ${i} of ${n}` });
    clear(body); return continueButton(body);
  },

  async contest(body, ctx) {
    const items = C.contestSet(ctx.state, C.introducedSkills(ctx.state), 4, { minD: 3 });
    if (!items.length) { body.append(h('p', 'Contest problems unlock as more topics are covered.')); return continueButton(body); }
    await runItems(body, ctx, items, 'challenge', { counter: (i, n) => `Contest problem ${i} of ${n}` });
    clear(body); return continueButton(body);
  },
};

function benchmarkNote(right, n) {
  const pct = Math.round((100 * right) / Math.max(1, n));
  return `${pct}% on contest-style problems. This is a checkpoint, not a grade: it shows how today's skills hold up on unfamiliar, timed problems.`;
}

async function recallCard(body, ctx, card) {
  if (!card) return;
  return new Promise((res) => {
    const back = mdEl('div.card-back', card.back); back.hidden = true;
    const btns = h('div.row', h('button.btn', { type: 'button', on: { click: () => { E.recordCard(ctx.state, card.id, true); el.remove(); res(); } } }, 'I remembered it'), h('button.btn', { type: 'button', on: { click: () => { E.recordCard(ctx.state, card.id, false); el.remove(); res(); } } }, 'I didn\'t'));
    btns.hidden = true;
    const show = h('button.btn.primary', { type: 'button', on: { click: () => { back.hidden = false; btns.hidden = false; show.remove(); } } }, 'Show answer');
    const el = h('div.recall', mdEl('div.card-front', card.front), h('p.muted.small', 'Answer it in your head (or on scratch paper) first.'), show, back, btns);
    body.append(el);
  });
}

// ---------------- lesson sections ----------------
async function renderSection(body, ctx, s, passive = false) {
  switch (s.type) {
    case 'md': body.append(mdEl('div.prose', s.md)); return;
    case 'key': body.append(h('div.key', h('span.key-label', 'Key idea'), mdEl('div', s.md))); return;
    case 'debrief': body.append(h('div.debrief', h('h3', 'Back to the opening problem'), mdEl('div.prose', s.md))); return;
    case 'svg': body.append(h('figure.figure', { html: s.svg + (s.caption ? `<figcaption>${renderMd(s.caption, { inline: true })}</figcaption>` : '') })); return;
    case 'compare': body.append(h('div.compare', [s.left, s.right].map((side) => h('div.compare-side', h('h4', side.title), mdEl('div', side.md)))), s.ask ? mdEl('p.muted', s.ask) : ''); return;
    case 'example': return passive ? body.append(staticExample(s)) : runExample(body, ctx, s);
    case 'check': if (passive) return; return new Promise((res) => { const box = h('div.check'); body.append(box); box.append(h('p.check-label', 'Check yourself'), problemCard({ d: 2, dok: 2, ...s.item }, { sessionCtx: ctx, compact: true, onResult: (r) => { ctx.record(r, 'check'); res(); } })); });
    case 'explain': if (passive) return; return new Promise((res) => {
      const t = textBox({ rows: 3 }); const model = mdEl('div.model', s.model); model.hidden = true;
      const btn = h('button.btn', { type: 'button', on: { click: () => { model.hidden = false; btn.remove(); ctx.saveExplanation({ q: s.prompt }, t.value); res(); } } }, 'Compare with a model explanation');
      body.append(h('div.explain', mdEl('p', `**In your own words:** ${s.prompt}`), t.el, btn, model));
    });
    case 'mistake': if (passive) { body.append(h('div.mistake', mdEl('div', s.md))); return; } return new Promise((res) => {
      const el = h('div.mistake', h('h4', 'Find the mistake'), mdEl('div.mistake-work', s.md), mdEl('p', s.question || 'Which line contains the mistake?'));
      const cb = choiceBox(s.options, { onPick: (i) => { cb.disable(); cb.mark(s.answer); el.append(mdEl('div.reveal', (i === s.answer ? '**Yes.** ' : '**Look again.** ') + s.explain)); el.append(h('button.btn.primary', { type: 'button', on: { click: res } }, 'Continue')); ctx.items += 0; } });
      el.append(cb.el); body.append(el);
    });
  }
}
function staticExample(s) { return h('div.example', h('h4', s.title || 'Example'), mdEl('div.example-q', s.problem), s.steps.map((st) => mdEl('div.step', st.md))); }

// worked example with step-by-step reveal; "fade" steps make the student produce the step (fading worked examples),
// "ask" steps prompt a self-explanation before the reason is shown.
function runExample(body, ctx, s) {
  return new Promise((resolve) => {
    const el = h('div.example', h('h4', s.title || 'Worked example'), mdEl('div.example-q', s.problem)); body.append(el);
    const stepsBox = h('div.steps-box'); el.append(stepsBox);
    let i = 0;
    const nextBtn = h('button.btn', { type: 'button', on: { click: () => advance() } }, 'Show the first step');
    el.append(nextBtn);
    function advance() {
      if (i >= s.steps.length) { nextBtn.remove(); resolve(); return; }
      const st = s.steps[i++];
      if (st.fade && !ctx.fastTrackSkipFade) {
        nextBtn.hidden = true;
        const it = { id: `${ctx.sess.id}-ex-${s.title || ''}-${i}`, skill: st.fade.skill || (ctx.sess.skills || [])[0], d: 2, dok: 2, q: st.fade.prompt || 'Your turn: do this step.', a: st.fade.a, hints: st.fade.hints || [], sol: st.md };
        const box = h('div.fade'); stepsBox.append(box);
        box.append(problemCard(it, { sessionCtx: ctx, compact: true, showSkill: false, onResult: (r) => { ctx.record(r, 'check'); clear(box); box.append(mdEl('div.step', st.md)); nextBtn.hidden = false; nextBtn.textContent = i >= s.steps.length ? 'Done with this example' : 'Next step'; if (i >= s.steps.length) { nextBtn.textContent = 'Done with this example'; } } }));
        return;
      }
      const stepEl = mdEl('div.step', st.md); stepsBox.append(stepEl);
      if (st.ask) {
        nextBtn.hidden = true;
        const t = textBox({ rows: 2, placeholder: 'Why does this step work?' }); const why = mdEl('div.why', st.why || ''); why.hidden = true;
        const rb = h('button.btn', { type: 'button', on: { click: () => { why.hidden = false; rb.remove(); ctx.saveExplanation({ q: st.ask }, t.value); nextBtn.hidden = false; } } }, 'Check my reason');
        stepsBox.append(h('div.ask', mdEl('p', `**Why?** ${st.ask}`), t.el, rb, why));
      }
      nextBtn.textContent = i >= s.steps.length ? 'Done with this example' : 'Next step';
    }
  });
}
