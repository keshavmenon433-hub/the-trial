// app.js — boot, routing, the student's home and notebook, parent access, and sync setup.
import { h, clear, mdEl, renderMd, toast, modal } from './util.js';
import * as store from './store.js';
import * as E from './engine.js';
import * as C from './content.js';
import * as S from './sync.js';
import { makeContext, runSession, planBlocks } from './session.js';
import { renderDashboard } from './parent.js';
import { drawingPad } from './scratch.js';

const root = document.getElementById('app');
let state = null, course = null, config = null, lastDayLog = null, parentUnlocked = false;

async function save(dayLog) {
  if (!state) return;
  state.updatedAt = Date.now();
  if (dayLog) lastDayLog = dayLog;
  await store.set('state', state);
  S.schedulePush(state, lastDayLog);
}

function nextMonday(d = new Date()) { const x = new Date(d); const add = (8 - x.getDay()) % 7 || 7; x.setDate(x.getDate() + (x.getDay() === 1 ? 0 : add)); return E.dateStr(x); }
async function sha(s) { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('the-trial:' + s)); return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join(''); }

// ---------------- boot ----------------
async function boot() {
  try {
    await Promise.all([C.loadCourse().then((c) => (course = c)), C.loadManifest()]);
    await C.loadAllPacks();
  } catch (e) { clear(root).append(h('section.panel', h('h2', 'Could not load the course'), h('p', 'Check the internet connection and reload. Once loaded, The Trial also works offline.'), h('pre.small', String(e.message || e)))); return; }
  state = await store.get('state');
  config = await S.getConfig();
  store.persist();
  if (S.isConfigured(config)) {
    await S.init();
    S.onAuth(async (user) => {
      if (user && config.role === 'student') {
        try {
          const ctl = await S.getControl(); if (ctl.bonus && state) { state.settings.bonus = ctl.bonus; await save(); }
          if (!state) { const remote = await S.pullModel(); if (remote) { state = remote; await store.set('state', state); route(); } }
          else { await S.pushNow(state, lastDayLog); }
        } catch (e) { console.warn(e); }
      }
    });
  }
  if (state) { E.checkMissedDays(state); save(); }
  window.addEventListener('hashchange', route);
  window.addEventListener('online', () => state && S.schedulePush(state, lastDayLog));
  route();
}

function route() {
  const [path, qs] = (location.hash || '#/home').slice(1).split('?');
  const params = new URLSearchParams(qs || '');
  if (path === '/join') return joinScreen(params.get('c'));
  if (path === '/sync-setup') return syncSetup();
  if (config && config.role === 'parent') return parentLive();
  if (!state) return setupScreen();
  if (path === '/session') return sessionScreen();
  if (path === '/notebook') return notebookScreen(params.get('id'));
  if (path === '/map') return mapScreen();
  if (path === '/parent') return parentLocal();
  return homeScreen();
}

// ---------------- first run ----------------
function setupScreen() {
  const name = h('input', { type: 'text', placeholder: 'First name', autocomplete: 'off' });
  const start = h('input', { type: 'date', value: nextMonday() });
  const pin = h('input', { type: 'password', inputmode: 'numeric', placeholder: '4 to 8 digits', maxlength: '8' });
  const go = async () => {
    if (!name.value.trim()) return toast('Enter the student\'s name.');
    if (!/^\d{4,8}$/.test(pin.value)) return toast('The parent PIN needs 4 to 8 digits.');
    state = E.newState({ startDate: start.value || E.dateStr(), name: name.value.trim() });
    await store.set('pin', await sha(pin.value));
    await save(); location.hash = '#/home'; route();
  };
  clear(root).append(h('main.setup',
    h('h1.wordmark', 'The Trial'),
    h('p.lede', 'One year, about two hours a day: from the first page of pre-algebra to AP Calculus BC, and the problem-solving to go with it.'),
    h('div.form',
      h('label', 'Student', name),
      h('label', 'Day 1 is', start),
      h('label', 'Parent PIN', pin, h('span.small.muted', 'Protects the parent view and settings on this iPad.')),
      h('button.btn.primary.big', { type: 'button', on: { click: go } }, 'Set up this iPad')),
    h('p.small', 'Setting up a parent\'s phone or the family sync? ', h('a', { href: '#/sync-setup' }, 'Open the sync setup'), ' or open the setup link you were sent.')));
}

// ---------------- student home ----------------
async function homeScreen() {
  const now = new Date(); const today = E.dateStr(now);
  const meta = C.skillMeta();
  const ts = E.trialScore(state, meta, now); const b = E.band(ts ? Math.round(ts.score) : null);
  const pc = E.pace(state, course, now);
  const nx = E.nextSession(state, course, now);
  const before = E.daysBetween(today, state.startDate) > 0;
  const todayLog = state.history.days[today];
  const doneToday = todayLog && todayLog.sessions.length > 0;
  const cur = state.progress.current && state.progress.current.date === today ? state.progress.current : null;
  const streak = (() => { let n = 0; let d = todayLog ? today : E.addDays(today, -1); while (state.history.days[d]) { n++; d = E.addDays(d, -1); } return n; })();

  const top = h('header.topbar', h('span.wordmark.small', 'The Trial'),
    h('nav', h('a', { href: '#/map' }, 'Year map'), h('a', { href: '#/notebook' }, 'Notebook'), h('a', { href: '#/parent' }, 'Parent')));

  let main;
  if (nx.done) main = h('section.today', h('h1', 'The Trial is complete.'), h('p', 'Every session is done. Look back through the notebook to see how far you came.'));
  else {
    const sess = nx.session; const data = await C.getSession(sess);
    const plan = planBlocks(sess, nx.mode, nx.rebuildFirst);
    const labels = { warmup: ['Warm-up', 15], discover: ['Discover', 10], learn: ['Learn', 30], practice: ['Practice', 35], challenge: ['Challenge', 20], exit: ['Exit check', 7], reflect: ['Reflect', 3], rebuild: ['Rebuild', 30], test: [sess.type === 'benchmark' ? 'Benchmark' : sess.type === 'mastery' ? 'Mastery exam' : 'Weekly Trial', sess.type === 'benchmark' ? 40 : 45], review: ['Review mistakes', 30], contest: ['Contest set', 30] };
    const title = nx.mode === 'rebuild' ? 'Rebuild day' : sess.title;
    const sub = nx.mode === 'rebuild' ? `Another pass at: ${nx.rebuildSkills.map((s) => meta[s]?.name || s).join(', ')}. Then "${sess.title}" is next.` : sess.type === 'lesson' ? `${sess.unitName}` : sess.type === 'mastery' ? `${sess.unitName}: 85% opens the next unit.` : 'Mixed review of everything so far.';
    const canStart = !before && (data || sess.type !== 'lesson' || nx.mode === 'rebuild');
    main = h('section.today',
      h('p.day-num', h('span.day-word', 'Day'), String(sess.day)),
      h('h1.today-title', title), h('p.today-sub', sub),
      before ? h('p.callout', `The Trial begins ${new Date(state.startDate + 'T12:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`) : null,
      !data && sess.type === 'lesson' && nx.mode !== 'rebuild' ? h('p.callout', 'This lesson is still being written and will appear here automatically. Your parent has been told.') : null,
      h('ol.plan', plan.map((p) => h('li', h('span', labels[p][0]), h('span.muted', `${labels[p][1]} min`)))),
      doneToday && !cur ? h('div.done-today', h('p', 'Today\'s session is done.'), h('p.muted', 'Come back tomorrow. If you finished early and want more, you can start the next session now.')) : null,
      canStart ? h('a.btn.primary.big', { href: '#/session' }, cur ? 'Resume today\'s session' : doneToday ? 'Start the next session early' : 'Begin today\'s session') : null);
    if (!data && sess.type === 'lesson' && nx.mode !== 'rebuild' && !state._missingAlert) { state._missingAlert = sess.id; state.outbox.push(E.alert('content_missing', 'action', `Lesson "${sess.title}" (day ${sess.day}) is not in the app yet. Content updates should arrive before this; check the scheduled task.`)); save(); }
  }
  const scoreCard = h('section.mini-score', h('p.ms-num', ts ? String(Math.round(ts.score)) : '–'), h('p.ms-label', 'Trial Score'), h('p.ms-band', ts ? b.label : 'Starts after your first problems'), h('p.ms-streak', streak ? `${streak}-day streak` : ''));
  clear(root).append(top, h('div.home', main, h('aside.side', scoreCard, ledger(pc))));
}

// the year, on graph paper: one square per day, filled as sessions are completed
function ledger(pc) {
  const done = new Set(state.progress.done);
  const unitAt = {}; for (const u of course.units) for (let d = u.startDay; d <= u.endDay; d++) unitAt[d] = u.id;
  const grid = h('div.ledger', { role: 'img', 'aria-label': `${state.progress.done.length} of ${course.sessions.length} sessions complete` });
  for (const s of course.sessions) {
    grid.append(h('span.lday' + (done.has(s.id) ? '.done' : '') + (s.day === pc.idx + 1 ? '.next' : '') + (s.type !== 'lesson' ? '.test' : ''), { title: `Day ${s.day}: ${s.title}`, 'data-u': unitAt[s.day] || '' }));
  }
  const legend = h('div.ledger-units', course.units.map((u) => h('span', { 'data-u': u.id, style: { flexGrow: String(u.endDay - u.startDay + 1) } }, u.name)));
  return h('section.ledger-wrap', h('h2.small-h', `${state.progress.done.length} of ${course.sessions.length} days`), grid, legend);
}

// ---------------- session ----------------
async function sessionScreen() {
  const now = new Date(); const today = E.dateStr(now);
  if (E.daysBetween(today, state.startDate) > 0) { location.hash = '#/home'; return; }
  const nx = E.nextSession(state, course, now);
  if (nx.done) { location.hash = '#/home'; return; }
  const sess = nx.session; const data = (await C.getSession(sess)) || {};
  const cur = state.progress.current && state.progress.current.date === today && state.progress.current.sid === sess.id && state.progress.current.mode === nx.mode ? state.progress.current : null;
  const ctx = makeContext({ state, course, sess, data, mode: nx.mode, rebuildSkills: nx.rebuildSkills, rebuildFirst: nx.rebuildFirst, save: () => save(ctx.log), now });
  if (!cur) state.progress.current = { sid: sess.id, date: today, mode: nx.mode, block: 0 };
  await save(ctx.log);
  runSession(root, ctx, {
    resumeBlock: cur ? cur.block : 0,
    persistBlock: (b) => { state.progress.current.block = b; save(ctx.log); },
    onFinish: async (c) => {
      const result = { session: sess, mode: nx.mode, exitPct: c.exitPct, masteryPct: c.testPct, trialPct: c.testPct, weakSkills: c.weakSkills || [], minutes: c.log.minutes, items: c.items, correct: c.correct, testN: c.testN, benchmarkText: c.testN ? `${c.testRight}/${c.testN} on contest-style problems` : null };
      const before = state.history.score.length ? state.history.score[state.history.score.length - 1].score : null;
      const out = E.completeSession(state, course, result, C.skillMeta(), new Date());
      state.progress.current = null;
      await store.set('daylog:' + c.log.date + ':' + sess.id, c.log);
      await save(c.log);
      S.pushNow(state, c.log).catch(() => {});
      finishScreen(c, before, out);
    },
  });
}

function finishScreen(c, before, out) {
  const after = out.score ? Math.round(out.score.score) : null;
  const meta = C.skillMeta();
  const skills = (c.mode === 'rebuild' ? c.rebuildSkills : c.sess.skills || []).map((s) => E.skillView(state, s, new Date())).filter(Boolean);
  clear(root).append(h('main.finish',
    h('h1', 'Done for today.'),
    h('div.finish-score', h('span.fs-before', before == null ? '–' : String(Math.round(before))), h('span.fs-arrow', { 'aria-hidden': 'true' }, '→'), h('span.fs-after', after == null ? '–' : String(after)), h('span.fs-label', 'Trial Score')),
    h('p', `${c.log.minutes} minutes, ${c.items} problems, ${c.items ? Math.round((100 * c.correct) / c.items) : 0}% right on the first try without hints.`),
    skills.length ? h('div.meters', skills.map((v) => h('div.meter', h('span.meter-name', meta[v.id]?.name || v.id), h('span.meter-bar', h('span.meter-fill', { style: { width: `${Math.round(v.M * 100)}%` } })), h('span.meter-val', `${Math.round(v.M * 100)}%`)))) : null,
    out.pace.status !== 'on track' ? h('p.muted', out.pace.status === 'behind' ? `You're ${out.pace.lag} sessions behind the plan. That's fine: mastery first.` : `You're ${-out.pace.lag} sessions ahead of the plan.`) : null,
    h('a.btn.primary.big', { href: '#/home' }, 'Back to home')));
}

// ---------------- notebook ----------------
async function notebookScreen(id) {
  const top = h('header.topbar', h('a', { href: '#/home' }, 'Home'), h('span.wordmark.small', 'Notebook'), h('span'));
  if (!id) {
    const entries = Object.entries(state.notebook).sort((a, b) => (a[1].date < b[1].date ? 1 : -1));
    clear(root).append(top, h('main.notebook', h('h1', 'Notebook'), entries.length ? h('ul.nb-list', entries.map(([sid, nb]) => h('li', h('a', { href: `#/notebook?id=${sid}` }, h('span', nb.title || sid), h('span.muted', nb.date || ''))))) : h('p.muted', 'Pages appear here after each session.')));
    return;
  }
  const sess = course.sessions.find((s) => s.id === id); const data = sess ? await C.getSession(sess) : null; const nb = state.notebook[id] || {};
  clear(root).append(top, h('main.notebook',
    h('h1', sess ? sess.title : id),
    data?.learn?.summary ? h('div.summary', h('h3', 'Key ideas'), h('ul', data.learn.summary.map((x) => h('li', { html: renderMd(x, { inline: true }) })))) : null,
    (data?.cards || []).length ? h('div', h('h3', 'Facts to remember'), h('dl.cards', data.cards.flatMap((c) => [mdEl('dt', c.front), mdEl('dd', c.back)]))) : null,
    nb.reflections ? h('div', h('h3', 'My reflections'), nb.reflections.map((r) => h('p', h('span.muted', r.p + ' '), r.a || ''))) : null,
    nb.explanations?.length ? h('div', h('h3', 'My explanations'), h('ul', nb.explanations.map((t) => h('li', t)))) : null,
    h('h3', 'My page'), drawingPad({ key: 'note:' + id, height: 520 }).el));
}

// ---------------- year map ----------------
function mapScreen() {
  const done = new Set(state.progress.done); const nextIdx = state.progress.idx;
  const top = h('header.topbar', h('a', { href: '#/home' }, 'Home'), h('span.wordmark.small', 'Year map'), h('span'));
  clear(root).append(top, h('main.map', h('h1', 'The year'),
    course.units.map((u) => h('section.map-unit', h('h2', u.name, ' ', h('span.muted.small', `days ${u.startDay}–${u.endDay}`)),
      h('ol.map-list', course.sessions.filter((s) => s.day >= u.startDay && s.day <= u.endDay).map((s, i) => h('li' + (done.has(s.id) ? '.done' : '') + (course.sessions[nextIdx] && course.sessions[nextIdx].id === s.id ? '.next' : '') + (s.type !== 'lesson' ? '.test' : ''), { value: s.day }, s.title)))))));
}

// ---------------- parent: this device (PIN) ----------------
async function parentLocal() {
  if (!parentUnlocked) {
    const pin = h('input', { type: 'password', inputmode: 'numeric', maxlength: '8', placeholder: 'PIN', autocomplete: 'off' });
    const go = async () => { if ((await sha(pin.value)) === (await store.get('pin'))) { parentUnlocked = true; parentLocal(); } else toast('That PIN is not right.'); };
    pin.addEventListener('keydown', (e) => e.key === 'Enter' && go());
    clear(root).append(h('header.topbar', h('a', { href: '#/home' }, 'Home'), h('span.wordmark.small', 'Parent'), h('span')), h('main.setup', h('h1', 'Parent view'), h('div.form', h('label', 'PIN', pin), h('button.btn.primary', { type: 'button', on: { click: go } }, 'Open'))));
    setTimeout(() => pin.focus(), 50);
    return;
  }
  const wrap = h('main.dashboard');
  clear(root).append(h('header.topbar', h('a', { href: '#/home', on: { click: () => (parentUnlocked = false) } }, 'Back to student view'), h('span.wordmark.small', 'Parent'), h('a', { href: '#/sync-setup' }, S.isConfigured(config) ? 'Sync settings' : 'Set up sync')), wrap);
  const days = [];
  for (const k of (await store.keys('daylog:')).sort().reverse().slice(0, 30)) days.push(await store.get(k));
  let family = null; try { if (S.isConfigured(config) && S.currentUser()) family = await S.getFamily(); } catch {}
  renderDashboard(wrap, { model: state, history: state.history, alerts: [], days, course, family, live: false }, localActions());
  wrap.prepend(localSettings());
}
function localActions() {
  return {
    approveBonus: async () => { state.settings.bonus = { until: E.addDays(E.dateStr(), 14), minutes: 30 }; await save(); toast('Extra time approved for two weeks.'); parentLocal(); },
    exportBackup: async () => { const blob = new Blob([JSON.stringify(await store.exportAll())], { type: 'application/json' }); const a = h('a', { href: URL.createObjectURL(blob), download: `the-trial-backup-${E.dateStr()}.json` }); document.body.append(a); a.click(); a.remove(); },
    importBackup: async () => { const inp = h('input', { type: 'file', accept: 'application/json' }); inp.onchange = async () => { const f = inp.files[0]; if (!f) return; const ok = await modal('Restore backup', 'This replaces everything on this iPad with the backup.', [{ label: 'Cancel', value: false }, { label: 'Restore', value: true, primary: true }]); if (!ok) return; await store.importAll(JSON.parse(await f.text())); location.reload(); }; inp.click(); },
    changePin: async () => { const p = h('input', { type: 'password', inputmode: 'numeric', maxlength: '8' }); const ok = await modal('New PIN', h('label', '4 to 8 digits', p), [{ label: 'Cancel', value: false }, { label: 'Save', value: true, primary: true }]); if (ok && /^\d{4,8}$/.test(p.value)) { await store.set('pin', await sha(p.value)); toast('PIN changed.'); } },
    setPushLevel: async (v) => { try { await S.updateFamily({ pushLevel: v }); toast('Saved.'); } catch { toast('Could not save. Is sync set up?'); } },
  };
}
function localSettings() {
  const start = h('input', { type: 'date', value: state.startDate }); const name = h('input', { type: 'text', value: state.settings.name });
  return h('section.panel', h('h2', 'Student'), h('div.form.inline', h('label', 'Name', name), h('label', 'Day 1', start),
    h('button.btn', { type: 'button', on: { click: async () => { state.settings.name = name.value.trim() || state.settings.name; if (start.value) state.startDate = start.value; await save(); toast('Saved.'); } } }, 'Save')),
    h('p.small.muted', 'Moving Day 1 changes the plan dates; progress is kept.'));
}

// ---------------- parent: live (phone) ----------------
function parentLive() {
  const wrap = h('main.dashboard');
  clear(root).append(h('header.topbar', h('span.wordmark.small', 'The Trial'), h('span.muted', 'Parent'), h('span')), wrap);
  const signInForm = () => {
    const em = h('input', { type: 'email', value: config.email || '', autocomplete: 'username' }); const pw = h('input', { type: 'password', autocomplete: 'current-password' });
    clear(wrap).append(h('section.setup', h('h1', 'Sign in'), h('div.form', h('label', 'Parent email', em), h('label', 'Password', pw), h('button.btn.primary', { type: 'button', on: { click: async () => { try { await S.signIn(em.value.trim(), pw.value); } catch (e) { toast(friendlyAuth(e)); } } } }, 'Sign in'))));
  };
  const data = { course, live: true };
  const draw = () => renderDashboard(wrap, data, {
    approveBonus: async () => { await S.setControl({ bonus: { until: E.addDays(E.dateStr(), 14), minutes: 30, approvedAt: Date.now() } }); toast('Approved. The iPad picks it up next time it opens.'); },
    setPushLevel: async (v) => { await S.updateFamily({ pushLevel: v }); toast('Saved.'); },
    exportBackup: async () => { const blob = new Blob([JSON.stringify({ model: data.model, history: data.history })], { type: 'application/json' }); const a = h('a', { href: URL.createObjectURL(blob), download: `the-trial-${E.dateStr()}.json` }); document.body.append(a); a.click(); a.remove(); },
    signOut: async () => { await S.signOut(); },
  });
  S.onAuth((user) => {
    if (!user) { S.stopWatching(); signInForm(); return; }
    clear(wrap).append(h('p.muted', 'Loading…'));
    S.watchFamily({
      model: (m) => { data.model = m; draw(); }, history: (x) => { data.history = x; draw(); }, alerts: (a) => { data.alerts = a; draw(); },
      days: (d) => { data.days = d; draw(); }, control: (c) => { data.control = c; draw(); }, family: (f) => { data.family = f; draw(); },
      error: (e) => { clear(wrap).append(h('section.panel', h('h2', 'Could not read the family data'), h('p', 'Usually the security rules are missing or this account is not listed in the family. Open the sync setup to check.'), h('pre.small', String(e.message || e)), h('a.btn', { href: '#/sync-setup' }, 'Sync setup'))); },
    });
  });
}
function friendlyAuth(e) { const c = e && e.code || ''; if (c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found')) return 'Email or password is not right.'; if (c.includes('network')) return 'No connection.'; return 'Sign-in failed: ' + (e.message || c); }

// ---------------- sync setup (parent, once) ----------------
async function syncSetup() {
  const cfg = (await S.getConfig()) || {};
  const pasted = h('textarea', { rows: 8, placeholder: 'Paste the firebaseConfig block from Firebase here' });
  if (cfg.firebase) pasted.value = JSON.stringify(cfg.firebase, null, 2);
  const pEmail = h('input', { type: 'email', placeholder: 'parent@example.com', value: cfg.parentEmail || '' });
  const sEmail = h('input', { type: 'email', placeholder: 'student account email', value: cfg.studentEmail || '' });
  const pPass = h('input', { type: 'password', autocomplete: 'current-password' });
  const out = h('div.setup-out');
  // Firebase's snippet is JavaScript, not JSON, and appId contains colons, so read key: "value" pairs directly
  const parseCfg = (t) => { const out = {}; for (const m of String(t).matchAll(/["']?(\w+)["']?\s*:\s*(["'])(.*?)\2/g)) out[m[1]] = m[3]; return out.apiKey ? out : null; };
  const go = async () => {
    const fbc = parseCfg(pasted.value); if (!fbc || !fbc.apiKey || !fbc.projectId) return toast('That doesn\'t look like a Firebase config. Copy the whole block with apiKey and projectId.');
    if (!pEmail.value || !sEmail.value || !pPass.value) return toast('Fill in both emails and your password.');
    const fid = cfg.fid || 'fam-' + Math.random().toString(36).slice(2, 10);
    config = { firebase: fbc, fid, role: 'parent', email: pEmail.value.trim(), parentEmail: pEmail.value.trim(), studentEmail: sEmail.value.trim() };
    await S.setConfig(config); await S.init();
    try {
      await S.signIn(pEmail.value.trim(), pPass.value);
      const fam = await S.ensureFamily({ parentEmail: pEmail.value.trim(), studentEmail: sEmail.value.trim(), studentName: state?.settings?.name });
      const code = btoa(JSON.stringify({ firebase: fbc, fid }));
      const link = `${location.origin}${location.pathname}#/join?c=${encodeURIComponent(code)}`;
      clear(out).append(h('div.callout.good', h('p', h('strong', 'Sync is ready.')),
        h('p', 'Open this link on the iPad and sign in with the student account:'), h('p.topic', h('code', { 'data-link': link }, link.slice(0, 64) + '…'), ' ', h('button.btn.small', { type: 'button', on: { click: () => { navigator.clipboard?.writeText(link); toast('Link copied'); } } }, 'Copy link'), navigator.share ? h('button.btn.small', { type: 'button', on: { click: () => navigator.share({ title: 'The Trial', url: link }) } }, 'Share') : null),
        h('p', 'For alerts on your phone, install the free ntfy app and subscribe to:'), h('p.topic', h('code', fam.ntfyTopic)),
        h('a.btn.primary', { href: '#/home', on: { click: () => setTimeout(route, 0) } }, 'Open the live dashboard')));
    } catch (e) {
      clear(out).append(h('div.callout', h('p', h('strong', 'Not finished: '), e.code && e.code.includes('permission') ? 'Firebase refused the write. Paste the security rules below into Firestore → Rules and publish, then press Connect again.' : friendlyAuth(e))));
    }
  };
  clear(root).append(h('header.topbar', h('a', { href: '#/home' }, 'Back'), h('span.wordmark.small', 'Sync setup'), h('span')),
    h('main.setup.wide', h('h1', 'Connect the parent dashboard'),
      mdEl('div.prose', SETUP_STEPS),
      h('div.form', h('label', 'Firebase config', pasted),
        h('label', 'Security rules (copy into Firestore → Rules → Publish)', h('textarea', { rows: 10, readonly: true }, S.RULES)),
        h('label', 'Parent account email', pEmail), h('label', 'Student account email', sEmail), h('label', 'Your password (parent account)', pPass),
        h('button.btn.primary.big', { type: 'button', on: { click: go } }, 'Connect')), out));
}
const SETUP_STEPS = `This connects the iPad to a private database in **your own** free Firebase project, so this dashboard updates live and alerts reach your phone. About 20 minutes, once.

1. Go to **console.firebase.google.com**, sign in with a Google account, and **Create a project** (any name, Analytics off).
2. **Build → Authentication → Get started → Email/Password → Enable.** Then **Users → Add user** twice: one account for you, one for your student (any email you control works for him; he never needs its inbox). Last, open Authentication's **Settings → Authorized domains → Add domain** and add \`${location.host}\`.
3. **Build → Firestore Database → Create database** (production mode, any US location). Open its **Rules** tab, replace everything with the rules below, and **Publish**.
4. **Project settings (gear) → Your apps → Web (</>)**, register an app (no hosting), and copy the \`firebaseConfig\` block. Paste it below, fill in the two emails and your password, and press **Connect**.`;

// ---------------- join from a setup link ----------------
async function joinScreen(code) {
  let parsed = null; try { parsed = JSON.parse(atob(decodeURIComponent(code || ''))); } catch {}
  if (!parsed) { clear(root).append(h('main.setup', h('h1', 'That setup link is not complete'), h('p', 'Ask for the link again and open it in Safari.'))); return; }
  const em = h('input', { type: 'email', autocomplete: 'username' }); const pw = h('input', { type: 'password', autocomplete: 'current-password' });
  let role = state ? 'student' : null;
  const roleBox = h('div.row', h('button.chip' + (role === 'student' ? '.on' : ''), { type: 'button', on: { click: (e) => pick('student', e.target) } }, 'This is the student\'s iPad'), h('button.chip' + (role === 'parent' ? '.on' : ''), { type: 'button', on: { click: (e) => pick('parent', e.target) } }, 'I\'m the parent'));
  function pick(r, b) { role = r; roleBox.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c === b)); }
  const go = async () => {
    if (!role) return toast('Choose whose device this is.');
    config = { firebase: parsed.firebase, fid: parsed.fid, role, email: em.value.trim() };
    await S.setConfig(config); await S.init();
    try {
      await S.signIn(em.value.trim(), pw.value);
      if (role === 'student') {
        const remote = await S.pullModel().catch(() => null);
        if (!state && remote) { state = remote; await store.set('state', state); }
        else if (!state) { location.hash = '#/home'; route(); return; }
        else await S.pushNow(state, null);
      }
      toast('Connected.'); location.hash = '#/home'; route();
    } catch (e) { toast(friendlyAuth(e)); }
  };
  clear(root).append(h('main.setup', h('h1.wordmark', 'The Trial'), h('h2', 'Connect this device'), roleBox, h('div.form', h('label', 'Account email', em), h('label', 'Password', pw), h('button.btn.primary.big', { type: 'button', on: { click: go } }, 'Connect'))));
}

// service worker for offline use + update notice
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('./sw.js').then((reg) => { reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) toast('New lessons are ready. They load next time you open The Trial.'); }); }); }).catch(() => {});
}
boot();
