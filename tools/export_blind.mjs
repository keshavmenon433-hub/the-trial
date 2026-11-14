// Exports every hand-written problem WITHOUT answers or solutions, for an independent blind solve.
import { readFileSync, writeFileSync } from 'node:fs';
const pack = process.argv[2] || 'm01';
const dir = new URL(`../content/packs/${pack}/`, import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
const out = []; const key = {};
const add = (it, where) => { const id = it.id || where; const e = { id, q: it.q, type: it.a.type }; if (it.a.type === 'choice') e.options = it.a.options; if (it.a.form) e.form = it.a.form; out.push(e); key[id] = it.a; };
for (const [sid, file] of Object.entries(index.sessions)) {
  const d = JSON.parse(readFileSync(new URL(file, dir)));
  if (d.discover?.problem) add({ ...d.discover.problem, id: sid + '-discover' });
  for (const [i, s] of (d.learn?.sections || []).entries()) { if (s.type === 'check') add(s.item); if (s.type === 'example') s.steps.forEach((st, j) => st.fade && add({ id: `${sid}-ex${i}-${j}`, q: `${s.problem}\n\n(Step) ${st.fade.prompt}`, a: st.fade.a })); }
  for (const [i, s] of (d.reteach || []).entries()) if (s.type === 'example') s.steps.forEach((st, j) => st.fade && add({ id: `${sid}-rt${i}-${j}`, q: `${s.problem}\n\n(Step) ${st.fade.prompt}`, a: st.fade.a }));
  for (const k of ['practice', 'challenge']) for (const it of d[k]?.items || []) add(it);
}
for (const b of JSON.parse(readFileSync(new URL('bank.json', dir))).items) if (!b.from) add(b);
writeFileSync('/home/claude/verify/problems.json', JSON.stringify(out, null, 1));
writeFileSync('/home/claude/verify/key.json', JSON.stringify(key));
console.log(out.length, 'problems exported for blind solving');
