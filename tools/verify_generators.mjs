// Runs every generator many times at every level and checks each problem three ways:
//  1. the problem is well-formed (prompt, answer, solution present; no "undefined"/"NaN" text)
//  2. the stated answer passes the app's own answer checker (so a correct student answer is accepted)
//  3. verify() re-derives the answer independently (brute force / direct evaluation)
import { check } from '../js/mathcheck.js';
const pack = process.argv[2] || 'm01';
const { generators } = await import(`../content/packs/${pack}/gen.js`);
let rngSeed = 12345; const rng = () => { rngSeed = (rngSeed * 1103515245 + 12345) % 2147483648; return rngSeed / 2147483648; };
const N = Number(process.argv[3] || 400);
let total = 0, bad = 0; const report = {};
const factorString = (n) => { const f = []; for (let p = 2; n > 1; p++) while (n % p === 0) { f.push(p); n /= p; } return f.join('*'); };
for (const [id, g] of Object.entries(generators)) {
  for (const d of g.levels) {
    for (let i = 0; i < N; i++) {
      total++;
      let it; try { it = g.make(rng, d); } catch (e) { bad++; (report[id] ||= []).push(`d${d} threw ${e.message}`); continue; }
      const text = JSON.stringify({ q: it.q, sol: it.sol, a: it.a });
      const problems = [];
      if (!it.q || !it.a || it.a.value === undefined || it.a.value === '') problems.push('missing q/a');
      if (/undefined|NaN|Infinity|\[object/.test(text)) problems.push('bad text: ' + (text.match(/.{0,30}(undefined|NaN|Infinity|\[object).{0,30}/) || [''])[0]);
      const canon = it.a.type === 'choice' ? String(it.a.value) : it.a.form === 'primefact' ? factorString(Number(it.a.value)) : String(it.a.value);
      const c = check(it.a, canon); if (c.ok !== true) problems.push(`checker rejects own answer "${canon}": ${c.msg || ''}`);
      let v = false; try { v = g.verify(it); } catch (e) { problems.push('verify threw ' + e.message); }
      if (!v) problems.push(`independent check failed (answer ${it.a.value}) for: ${String(it.q).slice(0, 120)}`);
      if (problems.length) { bad++; (report[id] ||= []).push(`d${d}: ${problems.join('; ')}`); }
    }
  }
}
for (const [id, msgs] of Object.entries(report)) { console.log(`\n${id}: ${msgs.length} failures`); for (const m of [...new Set(msgs)].slice(0, 6)) console.log('  ', m); }
console.log(`\n${total - bad}/${total} generated problems passed (${Object.keys(generators).length} generators).`);
process.exit(bad ? 1 : 0);
