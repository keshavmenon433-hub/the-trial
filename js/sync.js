// sync.js — mirrors the student's progress to the family's Firebase project (live parent dashboard)
// and sends grade alerts to the parent's phone through ntfy (https://ntfy.sh).
// Without a configuration the app runs fully on the iPad and the parent view is PIN-protected there.
import * as store from './store.js';

let fb = null, app = null, auth = null, dbf = null, cfg = null;
let pushTimer = null, listeners = [];

export async function getConfig() { return (await store.get('config')) || null; }
export async function setConfig(c) { cfg = c; await store.set('config', c); }
export function isConfigured(c = cfg) { return !!(c && c.firebase && c.firebase.apiKey && c.fid); }

export async function init() {
  cfg = await getConfig();
  if (!isConfigured()) return false;
  if (!fb) fb = await import('../vendor/firebase.js');
  if (!app) {
    app = fb.initializeApp(cfg.firebase);
    auth = fb.getAuth(app);
    try { dbf = fb.initializeFirestore(app, { localCache: fb.persistentLocalCache() }); } catch { dbf = fb.getFirestore(app); }
  }
  return true;
}
export function currentUser() { return auth && auth.currentUser; }
export function onAuth(cb) { if (!auth) { cb(null); return () => {}; } return fb.onAuthStateChanged(auth, cb); }
export async function signIn(email, password) { await init(); return fb.signInWithEmailAndPassword(auth, email, password); }
export async function signOut() { if (auth) await fb.signOut(auth); }

const famPath = () => `families/${cfg.fid}`;
const docRef = (p) => fb.doc(dbf, p);

// --- family document: members + push topic + alert level (created by the parent during setup) ---
export async function ensureFamily({ parentEmail, studentEmail, studentName }) {
  const ref = docRef(famPath());
  let snap = null;
  try { snap = await fb.getDoc(ref); } catch (e) { if (!String(e.code || '').includes('permission')) throw e; }
  if (snap && snap.exists()) return snap.data();
  const topic = 'the-trial-' + Array.from(crypto.getRandomValues(new Uint8Array(12))).map((b) => b.toString(36).padStart(2, '0')).join('').slice(0, 20);
  const data = { members: [parentEmail.toLowerCase(), studentEmail.toLowerCase()], ntfyTopic: topic, pushLevel: 'all', studentName: studentName || 'Student', createdAt: Date.now() };
  await fb.setDoc(ref, data);
  return data;
}
export async function getFamily() { const s = await fb.getDoc(docRef(famPath())); return s.exists() ? s.data() : null; }
export async function updateFamily(patch) { await fb.setDoc(docRef(famPath()), patch, { merge: true }); }

// --- student side ---
function compactState(state) {
  // keep the synced model small: drop old "seen" entries and the outbox
  const s = JSON.parse(JSON.stringify(state));
  const cutoff = new Date(Date.now() - 45 * 864e5).toISOString().slice(0, 10);
  for (const [k, v] of Object.entries(s.seen || {})) if (v < cutoff) delete s.seen[k];
  delete s.outbox;
  const history = s.history; delete s.history;
  return { model: s, history };
}
export function schedulePush(state, dayLog) {
  if (!isConfigured() || !currentUser()) return;
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => pushNow(state, dayLog).catch((e) => console.warn('sync', e)), 4000);
}
export async function pushNow(state, dayLog) {
  if (!isConfigured() || !currentUser()) return false;
  const { model, history } = compactState(state);
  const batch = fb.writeBatch(dbf);
  batch.set(docRef(`${famPath()}/state/model`), { json: JSON.stringify(model), updatedAt: Date.now() });
  batch.set(docRef(`${famPath()}/state/history`), { json: JSON.stringify(history), updatedAt: Date.now() });
  if (dayLog) batch.set(docRef(`${famPath()}/days/${dayLog.date}_${dayLog.sid}`), { json: JSON.stringify(dayLog), date: dayLog.date, updatedAt: Date.now() });
  await batch.commit();
  await flushAlerts(state);
  return true;
}
export async function flushAlerts(state) {
  if (!state.outbox || !state.outbox.length) return;
  let fam = null; try { fam = await getFamily(); } catch {}
  const sent = [];
  for (const a of state.outbox) {
    try {
      if (isConfigured() && currentUser()) await fb.setDoc(docRef(`${famPath()}/alerts/${a.id}`), a);
      if (fam && fam.ntfyTopic && (fam.pushLevel !== 'important' || a.level !== 'info')) await ntfy(fam.ntfyTopic, a);
      sent.push(a.id);
    } catch (e) { console.warn('alert not sent yet', e); break; }
  }
  state.outbox = state.outbox.filter((a) => !sent.includes(a.id));
}
export async function ntfy(topic, a) {
  const prio = { action: '5', warn: '4', good: '3', info: '3' }[a.level] || '3';
  const tags = { action: 'rotating_light', warn: 'warning', good: 'white_check_mark', info: 'pencil2' }[a.level] || 'pencil2';
  const r = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, { method: 'POST', body: a.text, headers: { Title: 'The Trial', Priority: prio, Tags: tags } });
  if (!r.ok) throw new Error('ntfy ' + r.status);
}
export async function pullModel() {
  const [m, hst] = await Promise.all([fb.getDoc(docRef(`${famPath()}/state/model`)), fb.getDoc(docRef(`${famPath()}/state/history`))]);
  if (!m.exists()) return null;
  const model = JSON.parse(m.data().json); model.history = hst.exists() ? JSON.parse(hst.data().json) : { score: [], days: {} }; model.outbox = [];
  return model;
}
export async function getControl() { const s = await fb.getDoc(docRef(`${famPath()}/control/parent`)); return s.exists() ? s.data() : {}; }

// --- parent side: live subscriptions ---
export function watchFamily(handlers) {
  stopWatching();
  const on = (p, fn) => listeners.push(fb.onSnapshot(docRef(p), (s) => fn(s.exists() ? s.data() : null), (e) => handlers.error && handlers.error(e)));
  on(`${famPath()}/state/model`, (d) => handlers.model && handlers.model(d ? JSON.parse(d.json) : null, d && d.updatedAt));
  on(`${famPath()}/state/history`, (d) => handlers.history && handlers.history(d ? JSON.parse(d.json) : null));
  on(`${famPath()}/control/parent`, (d) => handlers.control && handlers.control(d || {}));
  on(famPath(), (d) => handlers.family && handlers.family(d));
  listeners.push(fb.onSnapshot(fb.query(fb.collection(dbf, `${famPath()}/alerts`), fb.orderBy('at', 'desc'), fb.limit(150)), (qs) => handlers.alerts && handlers.alerts(qs.docs.map((d) => d.data())), (e) => handlers.error && handlers.error(e)));
  listeners.push(fb.onSnapshot(fb.query(fb.collection(dbf, `${famPath()}/days`), fb.orderBy('updatedAt', 'desc'), fb.limit(60)), (qs) => handlers.days && handlers.days(qs.docs.map((d) => JSON.parse(d.data().json))), (e) => handlers.error && handlers.error(e)));
}
export function stopWatching() { listeners.forEach((u) => u()); listeners = []; }
export async function setControl(patch) { await fb.setDoc(docRef(`${famPath()}/control/parent`), patch, { merge: true }); }

// the security rules the parent pastes into Firebase (members listed in the family document)
export const RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function member(fid) {
      return request.auth != null &&
        request.auth.token.email.lower() in get(/databases/$(database)/documents/families/$(fid)).data.members;
    }
    match /families/{fid} {
      allow read: if request.auth != null && (resource == null || request.auth.token.email.lower() in resource.data.members);
      allow update: if request.auth != null && request.auth.token.email.lower() in resource.data.members;
      allow create: if request.auth != null && request.auth.token.email.lower() in request.resource.data.members;
    }
    match /families/{fid}/{rest=**} {
      allow read, write: if member(fid);
    }
  }
}`;
