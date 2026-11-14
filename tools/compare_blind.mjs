// Compares an independent blind solve with the answer key using the app's own checker.
import { readFileSync } from 'node:fs';
import { check } from '../js/mathcheck.js';
const key = JSON.parse(readFileSync('/home/claude/verify/key.json'));
const ans = JSON.parse(readFileSync('/home/claude/verify/answers.json'));
let agree = 0; const dis = [];
for (const [id, a] of Object.entries(key)) {
  const g = ans[id]; if (g === undefined) { dis.push(`${id}: no blind answer`); continue; }
  const spec = a.form === 'primefact' || a.form === 'simplest' || a.form === 'radical' || a.form === 'mixed' ? { ...a, form: undefined } : a; // compare values, not formatting
  const r = check(spec, String(g));
  if (r.ok) agree++; else dis.push(`${id}: key ${JSON.stringify(a.value)} vs blind ${JSON.stringify(g)}`);
}
console.log(`${agree}/${Object.keys(key).length} agree.`); dis.forEach((d) => console.log('  ' + d));
