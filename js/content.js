// content.js — loads the year map, monthly content packs, and problem generators,
// and turns them into concrete problems for each block of a session.
import { seeded, hashStr, shuffle } from './util.js';
import { pickItem, reviewQueue, skillView, B_BY_D, dateStr } from './engine.js';

const BASE = new URL('../content/', import.meta.url);
let course = null; let manifest = null;
const packs = {};           // id -> {index, gens, bank, sessions:{}}

async function getJSON(path) { const r = await fetch(new URL(path, BASE), { cache: 'no-cache' }); if (!r.ok) throw new Error(`Could not load ${path}`); return r.json(); }

export async function loadCourse() { if (!course) course = await getJSON('course.json'); return course; }
export async function loadManifest(force = false) { if (!manifest || force) manifest = await getJSON('manifest.json'); return manifest; }

export async function loadPack(id) {
  if (packs[id]) return packs[id];
  const index = await getJSON(`packs/${id}/index.json`);
  let gens = {};
  if (index.generators) { const mod = await import(new URL(`packs/${id}/${index.generators}`, BASE).href); gens = mod.generators || {}; }
  const bank = index.bank ? await getJSON(`packs/${id}/${index.bank}`) : { items: [] };
  packs[id] = { id, index, gens, bank, sessions: {} };
  return packs[id];
}
export async function loadAllPacks() { const m = await loadManifest(); await Promise.all(m.packs.map((p) => loadPack(p).catch(() => null))); return packs; }
export function packAvailable(id) { return manifest && manifest.packs.includes(id); }

export async function getSession(sess) {
  if (!packAvailable(sess.pack)) return null;
  const p = await loadPack(sess.pack);
  if (p.sessions[sess.id]) return p.sessions[sess.id];
  const file = p.index.sessions[sess.id]; if (!file) return null;
  p.sessions[sess.id] = await getJSON(`packs/${sess.pack}/${file}`);
  return p.sessions[sess.id];
}

export function skillMeta() { return course ? course.skills : {}; }
export function allGenerators() { const out = {}; for (const p of Object.values(packs)) Object.assign(out, p.gens); return out; }
export function bankItems() { return Object.values(packs).flatMap((p) => p.bank.items || []); }

// generator registry is keyed by skill id; each has levels it can produce
function genCandidates(skills) {
  const gens = allGenerators(); const out = [];
  for (const s of skills) { const g = gens[s]; if (!g) continue; for (const d of g.levels || [1, 2, 3, 4, 5]) out.push({ id: `gen:${s}:${d}`, skill: s, d, gen: s }); }
  return out;
}

let counter = 0;
export function instantiate(c, seedHint = '') {
  if (!c) return null;
  if (!c.gen) return { ...c.item, id: c.id, skill: c.skill, d: c.d, dok: c.item.dok || c.dok || 2 };
  const g = allGenerators()[c.gen];
  const rng = seeded(hashStr(`${c.id}:${seedHint}:${Date.now()}:${counter++}`));
  const it = g.make(rng, c.d);
  return { ...it, id: `${c.id}:${counter}`, skill: c.skill, d: c.d, dok: it.dok || (c.d >= 4 ? 3 : 2), gen: true };
}

// hand-written items from a session file, as candidates
export function itemCandidates(items = []) { return items.map((it) => ({ id: it.id, skill: it.skill, d: it.d || 3, dok: it.dok || 2, item: it })); }

// ----- block builders -----
// Warm-up: spaced retrieval of skills whose memory is fading or that are still shaky (successive relearning).
export function warmupItems(state, now = new Date(), n = 8, exclude = []) {
  const q = reviewQueue(state, now, { exclude, limit: n });
  const items = [];
  for (const sk of q) {
    const cands = genCandidates([sk]).concat(itemCandidates(bankItems().filter((b) => b.skill === sk)));
    const c = pickItem(state, cands, { target: 0.8, today: dateStr(now) });
    if (c) items.push(instantiate(c, 'warm'));
  }
  return items;
}

// Practice: adaptive + interleaved. Returns a function producing the next item on demand.
export function practiceStream(state, todaySkills, handItems = [], now = new Date()) {
  const today = dateStr(now);
  const todayCands = genCandidates(todaySkills).concat(itemCandidates(handItems));
  let count = 0, lastSkill = null;
  return {
    next() {
      count++;
      let pool;
      // first few problems are on today's skills only (acquisition), then interleave ~35% review
      const reviewSkills = reviewQueue(state, now, { exclude: todaySkills, limit: 6 });
      const doReview = count > 4 && reviewSkills.length && Math.random() < 0.35;
      if (doReview) pool = genCandidates(reviewSkills);
      else {
        // focus on whichever of today's skills is weakest
        const weakest = todaySkills.map((s) => ({ s, M: skillView(state, s, now)?.M ?? 0 })).sort((a, b) => a.M - b.M)[0];
        pool = todayCands.filter((c) => !weakest || c.skill === weakest.s || Math.random() < 0.3);
        if (!pool.length) pool = todayCands;
      }
      if (!pool.length) pool = todayCands;
      const c = pickItem(state, pool, { target: count <= 2 ? 0.85 : 0.75, avoidSkill: count > 4 ? lastSkill : null, today });
      lastSkill = c && c.skill;
      return instantiate(c, 'practice');
    },
  };
}

// Exit check: 5 problems on today's skills at on-level difficulty, no hints.
export function exitItems(state, skills, handExit = [], n = 5) {
  const out = [];
  const hand = shuffle(handExit).slice(0, Math.min(2, handExit.length)).map((it) => instantiate({ id: it.id, skill: it.skill, d: it.d || 3, item: it }));
  out.push(...hand);
  let i = 0;
  while (out.length < n && skills.length) {
    const s = skills[i++ % skills.length]; const d = [3, 3, 4, 2, 3][out.length % 5];
    const g = allGenerators()[s]; if (!g) { if (i > 20) break; continue; }
    const lv = g.levels.includes(d) ? d : g.levels[Math.floor(g.levels.length / 2)];
    out.push(instantiate({ id: `gen:${s}:${lv}`, skill: s, d: lv, gen: s }, 'exit'));
  }
  return out;
}

// Weekly Trial / mastery exam: mixed problems across many skills; weighted to weak or fading ones.
export function mixedTest(state, skills, n = 20, { dRange = [2, 4], seed = 'trial', now = new Date() } = {}) {
  const views = skills.map((s) => ({ s, v: skillView(state, s, now) })).filter((x) => allGenerators()[x.s]);
  if (!views.length) return [];
  const weighted = views.flatMap(({ s, v }) => { const w = !v ? 2 : v.M < 0.7 || v.R < 0.85 ? 3 : 1; return Array(w).fill(s); });
  const out = []; const used = {};
  const rng = seeded(hashStr(seed + dateStr(now)));
  // cover every skill once first, then fill by weight
  for (const { s } of shuffle(views, rng)) { if (out.length >= n) break; out.push(s); used[s] = 1; }
  while (out.length < n) { const s = weighted[Math.floor(rng() * weighted.length)]; if ((used[s] || 0) >= 3) { if (Object.keys(used).length >= views.length && Object.values(used).every((u) => u >= 3)) break; continue; } used[s] = (used[s] || 0) + 1; out.push(s); }
  const ds = []; for (let d = dRange[0]; d <= dRange[1]; d++) ds.push(d);
  return shuffle(out, rng).map((s, i) => {
    const g = allGenerators()[s]; const want = ds[i % ds.length]; const lv = g.levels.includes(want) ? want : g.levels.reduce((a, b) => (Math.abs(b - want) < Math.abs(a - want) ? b : a));
    return instantiate({ id: `gen:${s}:${lv}`, skill: s, d: lv, gen: s }, seed);
  });
}

// contest-style problems from the bank for the skills seen so far
export function contestSet(state, introduced, n = 4, { minD = 3, exclude = [] } = {}) {
  const pool = bankItems().filter((b) => introduced.includes(b.skill) && (b.d || 3) >= minD && !exclude.includes(b.id) && b.use !== 'benchmark');
  const unseen = pool.filter((b) => !state.seen[b.id]);
  const src = unseen.length >= n ? unseen : pool;
  return shuffle(src).slice(0, n).map((b) => instantiate({ id: b.id, skill: b.skill, d: b.d || 4, item: b }));
}
export function benchmarkItems(sessId) { return bankItems().filter((b) => b.use === 'benchmark' && (!b.session || b.session === sessId)).map((b) => instantiate({ id: b.id, skill: b.skill, d: b.d || 3, item: b })); }

export function introducedSkills(state) { return Object.keys(state.skills); }
export { B_BY_D };
