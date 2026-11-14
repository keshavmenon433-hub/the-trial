// Assembles a month's source files into the app's content pack: one JSON per session, a bank, and an index.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
const pack = process.argv[2] || 'm01';
const srcs = process.argv.slice(3);
const course = JSON.parse(readFileSync(new URL('../content/course.json', import.meta.url)));
const out = new URL(`../content/packs/${pack}/`, import.meta.url); mkdirSync(out, { recursive: true });
let days = [], bank = [], benchmark = [];
for (const f of srcs) { const m = await import(new URL(`../content-src/${f}`, import.meta.url)); days.push(...(m.days || [])); bank.push(...(m.bank || [])); benchmark.push(...(m.benchmark || [])); }
const index = { id: pack, generators: 'gen.js', bank: 'bank.json', sessions: {}, builtAt: new Date().toISOString() };
for (const d of days) {
  const sess = course.sessions.find((s) => s.id === d.id); if (!sess) throw new Error('unknown session ' + d.id);
  if (sess.pack !== pack) throw new Error(`${d.id} belongs to ${sess.pack}`);
  // challenge problems also feed the contest bank (used for interleaved contest sets later)
  for (const it of d.challenge?.items || []) bank.push({ ...it, use: 'contest', from: d.id });
  writeFileSync(new URL(`${d.id}.json`, out), JSON.stringify(d));
  index.sessions[d.id] = `${d.id}.json`;
}
writeFileSync(new URL('bank.json', out), JSON.stringify({ items: [...bank.map((b) => ({ use: 'contest', ...b })), ...benchmark] }));
writeFileSync(new URL('index.json', out), JSON.stringify(index, null, 1));
const man = new URL('../content/manifest.json', import.meta.url);
let manifest = { packs: [] }; try { manifest = JSON.parse(readFileSync(man)); } catch {}
if (!manifest.packs.includes(pack)) manifest.packs.push(pack);
manifest.updatedAt = new Date().toISOString();
writeFileSync(man, JSON.stringify(manifest, null, 1));
const lessonsInPack = course.sessions.filter((s) => s.pack === pack && s.type === 'lesson');
const missing = lessonsInPack.filter((s) => !index.sessions[s.id]);
console.log(`${pack}: ${days.length} lesson files, ${bank.length} contest problems, ${benchmark.length} benchmark problems.`);
console.log(missing.length ? `Lessons in this month without content: ${missing.map((s) => s.id + ' ' + s.title).join('; ')}` : 'Every lesson in this month has content.');
