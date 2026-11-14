// Static checks on a content pack before release:
//  - every problem has a prompt, an answer, and a solution; ids unique; skills known
//  - the stated answer is accepted by the app's own checker (so a correct student answer is marked right)
//  - every piece of math typesets without a KaTeX error
//  - choice answers point at a real option
import { readFileSync, readdirSync } from 'node:fs';
import { check } from '../js/mathcheck.js';
import katex from 'katex';
const pack = process.argv[2] || 'm01';
const dir = new URL(`../content/packs/${pack}/`, import.meta.url);
const course = JSON.parse(readFileSync(new URL('../content/course.json', import.meta.url)));
const errs = []; const ids = new Set(); let items = 0, mdCount = 0;
const factorString = (n) => { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f.join('*'); };
function tex(md, where) {
  if (!md) return; mdCount++;
  const parts = [...String(md).matchAll(/\$\$([\s\S]+?)\$\$|(?<!\\)\$([^$\n]+?)\$/g)];
  for (const m of parts) { const t = m[1] || m[2]; try { katex.renderToString(t, { throwOnError: true, displayMode: !!m[1], strict: 'ignore' }); } catch (e) { errs.push(`${where}: KaTeX: ${e.message.split('\n')[0]} in "${t.slice(0, 60)}"`); } }
  if ((String(md).replace(/\\\$/g, '').match(/\$/g) || []).length % 2) errs.push(`${where}: odd number of $ signs`);
  if (/(?<![a-z] )undefined|NaN|\[object/.test(md)) errs.push(`${where}: bad text`);
}
function checkItem(it, where) {
  items++;
  if (!it.q || !it.a) { errs.push(`${where}: missing q or a`); return; }
  if (it.id) { if (ids.has(it.id)) errs.push(`${where}: duplicate id ${it.id}`); ids.add(it.id); }
  if (it.skill && !course.skills[it.skill]) errs.push(`${where}: unknown skill ${it.skill}`);
  tex(it.q, where + '.q'); tex(it.sol, where + '.sol'); (it.hints || []).forEach((x, i) => tex(x, `${where}.hint${i}`));
  if (it.a.type === 'choice') { const opts = it.a.options || []; if (!(it.a.value >= 0 && it.a.value < opts.length)) errs.push(`${where}: choice index out of range`); opts.forEach((o, i) => tex(o, `${where}.opt${i}`)); return; }
  if (it.a.type === 'text') return;
  const canon = it.a.form === 'primefact' ? factorString(Number(it.a.value)) : String(it.a.value);
  const r = check(it.a, canon); if (r.ok !== true) errs.push(`${where}: own answer "${canon}" rejected by checker (${r.msg || 'not ok'})`);
  if (!it.sol) errs.push(`${where}: no solution`);
}
function walkSections(secs, where) {
  for (const [i, s] of (secs || []).entries()) {
    const w = `${where}[${i}:${s.type}]`;
    if (s.md) tex(s.md, w);
    if (s.type === 'check') checkItem(s.item, w);
    if (s.type === 'example') { tex(s.problem, w + '.problem'); for (const [j, st] of s.steps.entries()) { tex(st.md, `${w}.step${j}`); tex(st.ask, `${w}.ask${j}`); tex(st.why, `${w}.why${j}`); if (st.fade) checkItem({ q: st.fade.prompt, a: st.fade.a, sol: st.md }, `${w}.fade${j}`); } }
    if (s.type === 'mistake') { if (!(s.answer >= 0 && s.answer < s.options.length)) errs.push(`${w}: mistake answer out of range`); s.options.forEach((o) => tex(o, w)); tex(s.explain, w); }
    if (s.type === 'compare') { tex(s.left.md, w); tex(s.right.md, w); }
    if (s.type === 'explain') { tex(s.prompt, w); tex(s.model, w); }
  }
}
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
for (const [sid, file] of Object.entries(index.sessions)) {
  const d = JSON.parse(readFileSync(new URL(file, dir)));
  const sess = course.sessions.find((s) => s.id === sid);
  if (d.discover?.problem) checkItem({ ...d.discover.problem, id: sid + '-disc' }, `${sid}.discover`);
  tex(d.discover?.intro, `${sid}.intro`);
  walkSections(d.learn?.sections, `${sid}.learn`);
  (d.learn?.summary || []).forEach((x) => tex(x, `${sid}.summary`));
  walkSections(d.reteach, `${sid}.reteach`);
  for (const k of ['practice', 'challenge', 'exit']) for (const it of d[k]?.items || []) checkItem(it, `${sid}.${k}.${it.id}`);
  for (const c of d.cards || []) { tex(c.front, `${sid}.card`); tex(c.back, `${sid}.card`); }
  for (const s of sess.skills) if (!readFileSync(new URL('gen.js', dir), 'utf8').includes(`'${s}'`)) errs.push(`${sid}: no generator for skill ${s}`);
}
const bank = JSON.parse(readFileSync(new URL('bank.json', dir))).items;
const bankIds = new Set();
for (const b of bank) { if (b.from) continue; checkItem(b, `bank.${b.id}`); }
for (const b of bank) { if (bankIds.has(b.id)) { if (!b.from) errs.push('dup bank id ' + b.id); } bankIds.add(b.id); }
console.log(`${items} problems and ${mdCount} text blocks checked in ${Object.keys(index.sessions).length} lessons + bank (${bank.length}).`);
if (errs.length) { console.log(`${errs.length} problems found:`); errs.forEach((e) => console.log('  - ' + e)); process.exit(1); }
console.log('No problems found.');
