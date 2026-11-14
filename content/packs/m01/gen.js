// Month 1 problem generators (Pre-Algebra). Every generator makes fresh problems at difficulty 1–5
// and has a verify() that re-derives the answer a different way (brute force or direct evaluation).
// tools/verify_generators.mjs runs thousands of instances through verify() before release.

const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => (a / gcd(a, b)) * b;
const isPrime = (n) => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
const divisors = (n) => { const d = []; for (let k = 1; k <= n; k++) if (n % k === 0) d.push(k); return d; };
const frac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? `${n}` : `${n}/${d}`; };
const tfrac = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? `${n}` : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`; };
const neg = (x) => (x < 0 ? `(${x})` : `${x}`);
const N = (s) => s.replace(/-/g, '−');
// exact rational helpers for verification
const R = (n, d = 1) => { const g = gcd(n, d) || 1; return d < 0 ? [-n / g, -d / g] : [n / g, d / g]; };
const rEq = (a, s) => { const [n, d] = String(s).includes('/') ? s.split('/').map(Number) : [Number(s), 1]; const [x, y] = R(n, d); return x === a[0] && y === a[1]; };
const lin = (terms) => terms.filter(([c]) => c !== 0).map(([c, v], i) => `${c < 0 ? '-' : i ? '+' : ''}${Math.abs(c) === 1 && v ? '' : Math.abs(c)}${v}`).join('') || '0';
const evalExpr = (s) => Function(`"use strict";return (${s});`)();

function item(q, a, sol, hints = [], extra = {}) { return { q, a, sol, hints, ...extra }; }

export const generators = {
  // ---------------- properties of arithmetic ----------------
  'pa.props': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, 3, 9), b = ri(r, 2, 9) * 10, c = ri(r, 1, 9); return item(`Compute $${a}\\cdot(${b}+${c})$ by distributing.`, { type: 'number', value: `${a * (b + c)}` }, `$${a}\\cdot ${b} + ${a}\\cdot ${c} = ${a * b} + ${a * c} = ${a * (b + c)}$.`, ['Multiply each number inside the parentheses by the outside number.'], { _e: `${a}*(${b}+${c})` }); }
      if (d === 2) { const a = ri(r, 11, 49), b = ri(r, 11, 89), c = 100 - b; return item(`Compute $${a}\\cdot ${b} + ${a}\\cdot ${c}$ without multiplying ${a}·${b} directly.`, { type: 'number', value: `${a * 100}` }, `Factor out ${a}: $${a}(${b}+${c}) = ${a}\\cdot 100 = ${a * 100}$.`, ['Both terms share a factor of ' + a + '.', `What is ${b}+${c}?`], { _e: `${a}*${b}+${a}*${c}` }); }
      if (d === 3) { const k = pick(r, [99, 101, 999, 1001]); const a = ri(r, 12, 87); return item(`Compute $${k}\\cdot ${a}$ in your head.`, { type: 'number', value: `${k * a}` }, `$${k} = ${k > 500 ? 1000 : 100} ${k % 10 === 9 ? '-' : '+'} 1$, so the product is $${(k > 500 ? 1000 : 100) * a} ${k % 10 === 9 ? '-' : '+'} ${a} = ${k * a}$.`, [`Write ${k} as a round number plus or minus 1.`], { _e: `${k}*${a}` }); }
      if (d === 4) { const a = ri(r, 12, 40), b = ri(r, 21, 79), c = ri(r, 21, 79), dd = b + c - 50; return item(`Compute $${a}\\cdot ${b} + ${a}\\cdot ${c} - ${a}\\cdot ${dd}$.`, { type: 'number', value: `${a * 50}` }, `All three terms share ${a}: $${a}(${b}+${c}-${dd}) = ${a}\\cdot 50 = ${a * 50}$.`, ['Look for a common factor in every term.'], { _e: `${a}*${b}+${a}*${c}-${a}*${dd}` }); }
      const a = ri(r, 2, 9) * 25, b = ri(r, 2, 6) * 4, c = ri(r, 3, 19); return item(`Compute $${a}\\cdot ${c}\\cdot ${b}$ by regrouping.`, { type: 'number', value: `${a * b * c}` }, `Reorder (commutative) and regroup (associative): $(${a}\\cdot ${b})\\cdot ${c} = ${a * b}\\cdot ${c} = ${a * b * c}$.`, ['Which two of the numbers multiply to a round number?'], { _e: `${a}*${c}*${b}` });
    },
    verify: (it) => rEq(R(evalExpr(it._e)), it.a.value),
  },

  // ---------------- signed numbers, reciprocals, division ----------------
  'pa.signed': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, -20, 20), b = ri(r, -20, 20); return item(`Compute $${a} - ${neg(b)}$.`, { type: 'number', value: `${a - b}` }, `Subtracting ${neg(b)} is adding its negation: $${a} + ${neg(-b)} = ${a - b}$.`, ['Subtracting a number is the same as adding its opposite.'], { _e: `${a}-(${b})` }); }
      if (d === 2) { const a = ri(r, 2, 12) * pick(r, [-1, 1]), b = ri(r, 2, 12) * pick(r, [-1, 1]), c = pick(r, [-1, 1]) * ri(r, 2, 6); return item(`Compute $${neg(a)}\\cdot ${neg(b)}\\cdot ${neg(c)}$.`, { type: 'number', value: `${a * b * c}` }, `There are ${[a, b, c].filter((x) => x < 0).length} negative factors, so the sign is ${a * b * c < 0 ? 'negative' : 'positive'}; the size is $${Math.abs(a)}\\cdot ${Math.abs(b)}\\cdot ${Math.abs(c)} = ${Math.abs(a * b * c)}$.`, ['Count the negative factors. Even count → positive.'], { _e: `(${a})*(${b})*(${c})` }); }
      if (d === 3) { const b = ri(r, 2, 6), c = pick(r, [-2, -4, 2, 4]), q = ri(r, 1, 5) * c, a = ri(r, -10, 10); const expr = `${a} - ${neg(b * q)} \\div ${neg(c)}`; return item(`Compute $${expr}$.`, { type: 'number', value: `${a - (b * q) / c}` }, `Divide first: $${neg(b * q)}\\div ${neg(c)} = ${(b * q) / c}$. Then $${a} - ${neg((b * q) / c)} = ${a - (b * q) / c}$.`, ['Division comes before subtraction.'], { _e: `${a}-(${b * q})/(${c})` }); }
      if (d === 4) { const n = ri(r, 2, 9), m = ri(r, 2, 11), s = pick(r, [-1, 1]); if (gcd(n, m) !== 1) return this.make(r, d); const k = ri(r, 2, 6) * n; return item(`Compute $${s * k} \\div \\left(${s < 0 ? '' : '-'}${tfrac(n, m)}\\right)$.`, { type: 'number', value: frac(-s * s * k * m, n) }, `Dividing by a fraction multiplies by its reciprocal: $${s * k}\\cdot\\left(${tfrac(-m * (s < 0 ? -1 : 1), n)}\\right) = ${tfrac(-k * m, n)}$.`, ['Dividing by $\\frac{a}{b}$ is multiplying by $\\frac{b}{a}$.'], { _e: `(${s * k})/(${s < 0 ? 1 : -1}*${n}/${m})` }); }
      const a = ri(r, 2, 4); const e1 = ri(r, 2, 3), e2 = e1 + 1; return item(`Compute $-${a}^{${e1}} - (-${a})^{${e2}} + (-${a})^{${e1}}$.`, { type: 'number', value: `${-(a ** e1) - (-a) ** e2 + (-a) ** e1}` }, `Careful: $-${a}^{${e1}} = -(${a}^{${e1}}) = ${-(a ** e1)}$, while $(-${a})^{${e2}} = ${(-a) ** e2}$ and $(-${a})^{${e1}} = ${(-a) ** e1}$. Total: $${-(a ** e1) - (-a) ** e2 + (-a) ** e1}$.`, ['An exponent applies only to what it touches: $-a^n$ means $-(a^n)$.'], { _e: `-(${a}**${e1})-((-${a})**${e2})+((-${a})**${e1})` });
    },
    verify: (it) => { const v = evalExpr(it._e); const [n, dd] = String(it.a.value).split('/').map(Number); return Math.abs(v - (dd ? n / dd : n)) < 1e-9; },
  },

  // ---------------- exponents ----------------
  'pa.exp': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const b = ri(r, 2, 9), e = b <= 3 ? ri(r, 3, 6) : ri(r, 2, 3); return item(`Compute $${b}^{${e}}$.`, { type: 'number', value: `${b ** e}` }, `$${b}^{${e}}$ means ${e} factors of ${b}: $${Array(e).fill(b).join('\\cdot ')} = ${b ** e}$.`, [`Multiply ${b} by itself ${e} times.`], { _e: `${b}**${e}` }); }
      if (d === 2) { const b = pick(r, [2, 3, 5, 10]), x = ri(r, 2, 6), y = ri(r, 2, 6), z = ri(r, 1, x + y - 1); return item(`Compute $\\dfrac{${b}^{${x}}\\cdot ${b}^{${y}}}{${b}^{${z}}}$.`, { type: 'number', value: `${b ** (x + y - z)}` }, `Add exponents when multiplying, subtract when dividing: $${b}^{${x}+${y}-${z}} = ${b}^{${x + y - z}} = ${b ** (x + y - z)}$.`, ['$a^m\\cdot a^n = a^{m+n}$ and $\\frac{a^m}{a^n}=a^{m-n}$.'], { _e: `${b}**${x}*${b}**${y}/${b}**${z}` }); }
      if (d === 3) { const b = pick(r, [2, 3, 4, 5, 10]), e = ri(r, 1, 3); const k = pick(r, [0, 1]); if (k === 0) return item(`Compute $${b}^{-${e}}$.`, { type: 'number', value: frac(1, b ** e) }, `A negative exponent means a reciprocal: $${b}^{-${e}} = \\frac{1}{${b}^{${e}}} = ${tfrac(1, b ** e)}$.`, ['$a^{-n} = \\frac{1}{a^n}$.'], { _e: `1/${b ** e}` }); const p = ri(r, 2, 5), q = ri(r, 2, 5); if (p === q) return this.make(r, d); return item(`Compute $\\left(${tfrac(p, q)}\\right)^{-2}$.`, { type: 'number', value: frac(q * q, p * p) }, `Flip, then square: $\\left(${tfrac(q, p)}\\right)^2 = ${tfrac(q * q, p * p)}$.`, ['A negative exponent flips the fraction.'], { _e: `(${q}/${p})**2` }); }
      if (d === 4) { const base = pick(r, [[2, 4, 8], [3, 9, 27]]); const [b, b2, b3] = base; const m = ri(r, 2, 5), n = ri(r, 1, 4); const x = 3 * m + 2 * n; return item(`Find $x$ if $${b}^x = ${b3}^{${m}}\\cdot ${b2}^{${n}}$.`, { type: 'number', value: `${x}` }, `Write everything as a power of ${b}: $${b3}^{${m}} = ${b}^{${3 * m}}$ and $${b2}^{${n}} = ${b}^{${2 * n}}$, so $x = ${3 * m} + ${2 * n} = ${x}$.`, [`Write ${b3} and ${b2} as powers of ${b}.`], { _e: `${x}`, _chk: [b, b3, m, b2, n] }); }
      const b = pick(r, [2, 3]), e = pick(r, [1, 3]); return item(`Compute $(-${b})^{-${e}} + ${b}^{0} + (-1)^{${ri(r, 10, 99) * 2}}$.`, { type: 'number', value: frac(-1 + 2 * (b ** e), b ** e) }, `$(-${b})^{-${e}} = \\frac{1}{(-${b})^{${e}}} = ${tfrac(-1, b ** e)}$, $${b}^0 = 1$, and $-1$ to an even power is $1$. Sum: $${tfrac(-1 + 2 * b ** e, b ** e)}$.`, ['Anything (nonzero) to the 0 is 1.', 'Odd power of a negative is negative.'], { _e: `1/((-${b})**${e})+1+1` });
    },
    verify: (it) => { if (it._chk) { const [b, b3, m, b2, n] = it._chk; return b ** Number(it.a.value) === b3 ** m * b2 ** n; } const v = evalExpr(it._e); const [n, dd] = String(it.a.value).split('/').map(Number); return Math.abs(v - (dd ? n / dd : n)) < 1e-9; },
  },

  // ---------------- divisibility ----------------
  'pa.divis': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const k = pick(r, [3, 4, 9, 6]); const n = ri(r, 1000, 9999); return item(`Is ${n} divisible by ${k}?`, { type: 'choice', options: ['Yes', 'No'], value: n % k === 0 ? 0 : 1 }, k === 3 || k === 9 ? `Digit sum ${String(n).split('').reduce((a, c) => a + +c, 0)} ${n % k === 0 ? 'is' : 'is not'} a multiple of ${k}.` : k === 4 ? `Last two digits ${n % 100} ${n % 4 === 0 ? 'are' : 'are not'} a multiple of 4.` : `Divisible by 6 means divisible by 2 and by 3: ${n % 6 === 0 ? 'both hold' : 'not both hold'}.`, ['Use the divisibility test instead of dividing.'], { _n: n, _k: k }); }
      if (d === 2) { const k = pick(r, [3, 9]); const a = ri(r, 1, 9), c = ri(r, 0, 9), e = ri(r, 0, 9); const s = a + c + e; let A = -1; for (let x = 0; x <= 9; x++) if ((s + x) % k === 0) { A = x; break; } return item(`What is the smallest digit $A$ that makes the number $\\overline{${a}A${c}${e}}$ divisible by ${k}?`, { type: 'number', value: `${A}` }, `The digit sum is ${s} + A; the smallest A making it a multiple of ${k} is ${A}.`, [`A number is divisible by ${k} when its digit sum is.`], { _brute: [a, c, e, k] }); }
      if (d === 3) { const k = pick(r, [4, 8, 6, 12]); const lo = ri(r, 100, 400); let n = lo; while (n % k) n++; return item(`What is the smallest number greater than or equal to ${lo} that is divisible by ${k}?`, { type: 'number', value: `${n}` }, `Check upward from ${lo} using the test for ${k}: ${n} works.`, [k === 12 ? 'Divisible by 12 means divisible by 3 and 4.' : k === 6 ? 'Divisible by 6 means by 2 and 3.' : `Test the last ${k === 4 ? 'two' : 'three'} digits.`], { _lo: lo, _k: k }); }
      if (d === 4) { const k = pick(r, [7, 11, 13, 17]); const c = Math.floor(999 / k) - Math.floor(99 / k); return item(`How many three-digit positive integers are multiples of ${k}?`, { type: 'number', value: `${c}` }, `Multiples of ${k} up to 999: $\\lfloor 999/${k}\\rfloor = ${Math.floor(999 / k)}$. Up to 99: $${Math.floor(99 / k)}$. Difference: ${c}.`, [`Count multiples up to 999, then subtract those up to 99.`], { _k: k, _cnt: true }); }
      const k = pick(r, [12, 15, 18]); let best = 0; for (let n = 9999; n >= 1000; n--) if (n % k === 0 && new Set(String(n)).size === 4) { best = n; break; } return item(`What is the largest four-digit number divisible by ${k} whose four digits are all different?`, { type: 'number', value: `${best}` }, `Start at 9999 and step down through multiples of ${k}, skipping repeats: ${best}.`, [`Find the largest multiple of ${k} below 10000 and work down.`], { _k: k, _big: true });
    },
    verify(it) {
      if (it._n) return (it._n % it._k === 0 ? 0 : 1) === it.a.value;
      if (it._brute) { const [a, c, e, k] = it._brute; for (let x = 0; x <= 9; x++) if (Number(`${a}${x}${c}${e}`) % k === 0) return x === Number(it.a.value); return false; }
      if (it._lo) { for (let n = it._lo; ; n++) if (n % it._k === 0) return n === Number(it.a.value); }
      if (it._cnt) { let c = 0; for (let n = 100; n <= 999; n++) if (n % it._k === 0) c++; return c === Number(it.a.value); }
      if (it._big) { const n = Number(it.a.value); if (n % it._k || new Set(String(n)).size !== 4) return false; for (let m = n + 1; m <= 9999; m++) if (m % it._k === 0 && new Set(String(m)).size === 4) return false; return true; }
      return false;
    },
  },

  // ---------------- primes ----------------
  'pa.primes': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const n = pick(r, [51, 57, 87, 91, 93, 97, 89, 83, 119, 133, 143, 101, 103, 107, 109, 113, 117, 127, 161, 169, 173, 187, 191, 199, 209, 221]); const p = isPrime(n); let f = 0; if (!p) for (let k = 2; k < n; k++) if (n % k === 0) { f = k; break; } return item(`Is ${n} prime?`, { type: 'choice', options: ['Yes', 'No'], value: p ? 0 : 1 }, p ? `No prime up to $\\sqrt{${n}}\\approx ${Math.sqrt(n).toFixed(1)}$ divides it, so ${n} is prime.` : `$${n} = ${f}\\cdot ${n / f}$, so it is not prime.`, ['You only need to test primes up to the square root.'], { _n: n }); }
      if (d === 2) { const a = ri(r, 10, 60), b = a + ri(r, 15, 40); const c = Array.from({ length: b - a + 1 }, (_, i) => a + i).filter(isPrime).length; return item(`How many prime numbers are there between ${a} and ${b}, inclusive?`, { type: 'number', value: `${c}` }, `List them: ${Array.from({ length: b - a + 1 }, (_, i) => a + i).filter(isPrime).join(', ')}. That's ${c}.`, ['Skip evens and multiples of 3 and 5 quickly.'], { _r: [a, b] }); }
      if (d === 3) { const ps = [7, 11, 13, 17, 19, 23]; const p = pick(r, ps), q = pick(r, ps.filter((x) => x >= p)); const n = p * q; return item(`What is the smallest prime factor of ${n}?`, { type: 'number', value: `${p}` }, `Test 2, 3, 5, 7, … in order. The first that divides ${n} is ${p} ($${n} = ${p}\\cdot ${q}$).`, ['Try primes in order; stop at the first one that divides.'], { _n: n }); }
      if (d === 4) { const lim = pick(r, [20, 30, 40, 50]); const s = Array.from({ length: lim }, (_, i) => i).filter(isPrime).reduce((a, b) => a + b, 0); return item(`What is the sum of all primes less than ${lim}?`, { type: 'number', value: `${s}` }, `Primes below ${lim}: ${Array.from({ length: lim }, (_, i) => i).filter(isPrime).join(', ')}. Sum: ${s}.`, ['Don\'t forget 2.'], { _lim: lim }); }
      const lim = pick(r, [50, 75, 100]); const c = Array.from({ length: lim }, (_, i) => i).filter((p) => isPrime(p) && isPrime(p + 2) && p + 2 < lim).length; return item(`Twin primes are primes that differ by 2, like 11 and 13. How many pairs of twin primes have both numbers less than ${lim}?`, { type: 'number', value: `${c}` }, `The pairs: ${Array.from({ length: lim }, (_, i) => i).filter((p) => isPrime(p) && isPrime(p + 2) && p + 2 < lim).map((p) => `(${p}, ${p + 2})`).join(', ')}.`, ['Every twin pair after (3, 5) is around a multiple of 6.'], { _tw: lim });
    },
    verify(it) {
      if (it._n && it.a.type === 'choice') return (isPrime(it._n) ? 0 : 1) === it.a.value;
      if (it._r) { let c = 0; for (let n = it._r[0]; n <= it._r[1]; n++) if (isPrime(n)) c++; return c === Number(it.a.value); }
      if (it._n) { for (let k = 2; ; k++) if (it._n % k === 0) return k === Number(it.a.value); }
      if (it._lim) { let s = 0; for (let n = 2; n < it._lim; n++) if (isPrime(n)) s += n; return s === Number(it.a.value); }
      if (it._tw) { let c = 0; for (let p = 2; p + 2 < it._tw; p++) if (isPrime(p) && isPrime(p + 2)) c++; return c === Number(it.a.value); }
      return false;
    },
  },

  // ---------------- prime factorization & divisors ----------------
  'pa.factor': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const fact = (n) => { const f = {}; for (let p = 2; n > 1; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } return f; };
      const ftex = (f) => Object.entries(f).map(([p, e]) => (e > 1 ? `${p}^{${e}}` : p)).join('\\cdot ');
      if (d <= 2) { const n = d === 1 ? pick(r, [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 72]) : pick(r, [84, 90, 96, 108, 120, 126, 132, 140, 150, 168, 180, 198, 210, 252, 264, 270, 300, 315, 360]); const f = fact(n); return item(`Write the prime factorization of ${n}. (Type it like 2^3*3*5.)`, { type: 'number', value: `${n}`, form: 'primefact', display: `$${ftex(f)}$` }, `Divide out primes: $${n} = ${ftex(f)}$.`, ['Start dividing by 2 as many times as you can, then 3, then 5…'], { _n: n }); }
      if (d === 3) { const n = pick(r, [36, 48, 60, 72, 80, 90, 96, 100, 108, 120, 144, 150, 180, 200, 210, 240, 252, 300, 360]); const f = fact(n); const c = Object.values(f).reduce((a, e) => a * (e + 1), 1); return item(`How many positive divisors does ${n} have?`, { type: 'number', value: `${c}` }, `$${n} = ${ftex(f)}$. A divisor picks each exponent from 0 up to its max, so the count is $${Object.values(f).map((e) => `(${e}+1)`).join('')} = ${c}$.`, ['Factor it into primes first.', 'For $p^a q^b$, there are $(a+1)(b+1)$ divisors.'], { _n: n, _cnt: true }); }
      if (d === 4) { const k = pick(r, [6, 8, 10, 12]); let n = 1; while (divisors(n).length !== k) n++; return item(`What is the smallest positive integer with exactly ${k} positive divisors?`, { type: 'number', value: `${n}` }, `Write ${k} as a product of (exponent + 1) factors and put the biggest exponents on the smallest primes. The winner is ${n} = $${ftex(fact(n))}$.`, ['Think about which exponent patterns give that many divisors.'], { _k: k }); }
      const n = pick(r, [144, 180, 216, 240, 360, 400, 432, 720, 900]); const f = fact(n); const c = Object.values(f).reduce((a, e) => a * (Math.floor(e / 2) + 1), 1); return item(`How many of the positive divisors of ${n} are perfect squares?`, { type: 'number', value: `${c}` }, `$${n} = ${ftex(f)}$. A square divisor uses only even exponents: ${Object.entries(f).map(([p, e]) => `${Math.floor(e / 2) + 1} choice${Math.floor(e / 2) ? 's' : ''} for ${p}`).join(', ')}, giving ${c}.`, ['A perfect square has only even exponents in its prime factorization.'], { _n: n, _sq: true });
    },
    verify(it) {
      if (it.a.form === 'primefact') return Number(it.a.value) === it._n;
      if (it._cnt) return divisors(it._n).length === Number(it.a.value);
      if (it._k) { for (let n = 1; ; n++) if (divisors(n).length === it._k) return n === Number(it.a.value); }
      if (it._sq) return divisors(it._n).filter((x) => Number.isInteger(Math.sqrt(x))).length === Number(it.a.value);
      return false;
    },
  },

  // ---------------- GCD & LCM ----------------
  'pa.gcdlcm': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const g = ri(r, 2, 12), a = g * ri(r, 2, 9), b = g * ri(r, 2, 9); return item(`Find $\\gcd(${a}, ${b})$.`, { type: 'number', value: `${gcd(a, b)}` }, `The largest number dividing both is ${gcd(a, b)}.`, ['List the divisors of the smaller number.'], { _ab: [a, b], _g: 1 }); }
      if (d === 2) { const a = ri(r, 4, 30), b = ri(r, 4, 30); if (a === b) return this.make(r, d); return item(`Find the least common multiple of ${a} and ${b}.`, { type: 'number', value: `${lcm(a, b)}` }, `$\\text{lcm}(${a},${b}) = \\frac{${a}\\cdot ${b}}{\\gcd(${a},${b})} = \\frac{${a * b}}{${gcd(a, b)}} = ${lcm(a, b)}$.`, ['Use prime factorizations: take the highest power of each prime.'], { _ab: [a, b], _l: 1 }); }
      if (d === 3) { const a = pick(r, [12, 15, 18, 20, 24, 30]), b = pick(r, [8, 10, 14, 16, 21, 25, 35]); return item(`Two lighthouses flash together at midnight. One flashes every ${a} seconds and the other every ${b} seconds. After how many seconds do they next flash together?`, { type: 'number', value: `${lcm(a, b)}` }, `They flash together at common multiples of ${a} and ${b}; the first is $\\text{lcm}(${a},${b}) = ${lcm(a, b)}$.`, ['When do two repeating cycles line up again?'], { _ab: [a, b], _l: 1 }); }
      if (d === 4) { const g = ri(r, 2, 9), m = ri(r, 2, 9), n = ri(r, 2, 9); if (gcd(m, n) !== 1 || m === n) return this.make(r, d); const a = g * m, b = g * n; return item(`Two positive integers have greatest common divisor ${g} and least common multiple ${g * m * n}. One of them is ${a}. What is the other?`, { type: 'number', value: `${b}` }, `For any two positive integers, $\\gcd\\cdot\\text{lcm} = $ product. So the other is $\\frac{${g}\\cdot ${g * m * n}}{${a}} = ${b}$.`, ['$\\gcd(a,b)\\cdot\\text{lcm}(a,b) = ab$.'], { _gla: [g, g * m * n, a] }); }
      const m = pick(r, [30, 42, 12, 18, 20]), lim = pick(r, [60, 100, 120]); const c = Array.from({ length: lim }, (_, i) => i + 1).filter((k) => gcd(k, m) === 1).length; return item(`How many integers $n$ with $1\\le n\\le ${lim}$ satisfy $\\gcd(n, ${m}) = 1$?`, { type: 'number', value: `${c}` }, `$n$ must avoid every prime factor of ${m}. Counting (or using inclusion-exclusion on those primes) gives ${c}.`, [`What are the prime factors of ${m}?`, 'Count numbers divisible by none of them.'], { _co: [m, lim] });
    },
    verify(it) {
      if (it._g) return gcd(...it._ab) === Number(it.a.value);
      if (it._l) return lcm(...it._ab) === Number(it.a.value);
      if (it._gla) { const [g, L, a] = it._gla; const b = Number(it.a.value); return gcd(a, b) === g && lcm(a, b) === L; }
      if (it._co) { const [m, lim] = it._co; let c = 0; for (let n = 1; n <= lim; n++) if (gcd(n, m) === 1) c++; return c === Number(it.a.value); }
      return false;
    },
  },

  // ---------------- fractions: multiply & divide ----------------
  'pa.frac.md': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const f = () => { const b = ri(r, 2, 12); return [ri(r, 1, b + 4), b]; };
      if (d === 1) { const [a, b] = f(), [c, e] = f(); return item(`Compute $${tfrac(a, b)}\\cdot ${tfrac(c, e)}$. Give your answer in lowest terms.`, { type: 'number', value: frac(a * c, b * e), form: 'simplest' }, `Multiply tops and bottoms: $\\frac{${a * c}}{${b * e}} = ${tfrac(a * c, b * e)}$.`, ['Cancel common factors before multiplying to keep numbers small.'], { _q: [a * c, b * e] }); }
      if (d === 2) { const [a, b] = f(), [c, e] = f(); return item(`Compute $${tfrac(a, b)}\\div ${tfrac(c, e)}$ in lowest terms.`, { type: 'number', value: frac(a * e, b * c), form: 'simplest' }, `Multiply by the reciprocal: $${tfrac(a, b)}\\cdot ${tfrac(e, c)} = ${tfrac(a * e, b * c)}$.`, ['Dividing by a fraction = multiplying by its reciprocal.'], { _q: [a * e, b * c] }); }
      if (d === 3) { const [a, b] = f(); const [c, e] = f(); const k = ri(r, 2, 3); return item(`Compute $\\left(${tfrac(a, b)}\\right)^{${k}} \\div ${tfrac(c, e)}$ in lowest terms.`, { type: 'number', value: frac(a ** k * e, b ** k * c), form: 'simplest' }, `$\\left(${tfrac(a, b)}\\right)^{${k}} = ${tfrac(a ** k, b ** k)}$, then multiply by $${tfrac(e, c)}$: $${tfrac(a ** k * e, b ** k * c)}$.`, ['Raise top and bottom to the power separately.'], { _q: [a ** k * e, b ** k * c] }); }
      if (d === 4) { const a = ri(r, 1, 4), b = a + ri(r, 1, 4), c = ri(r, 1, 6), e = c + ri(r, 1, 5); const N0 = b * e * ri(r, 1, 6); return item(`What is $${tfrac(a, b)}$ of $${tfrac(c, e)}$ of ${N0}?`, { type: 'number', value: frac(a * c * N0, b * e) }, `"Of" means multiply: $${tfrac(a, b)}\\cdot ${tfrac(c, e)}\\cdot ${N0} = ${tfrac(a * c * N0, b * e)}$.`, ['"of" means times.'], { _q: [a * c * N0, b * e] }); }
      const n = ri(r, 5, 40); return item(`Compute $\\left(1-\\frac12\\right)\\left(1-\\frac13\\right)\\left(1-\\frac14\\right)\\cdots\\left(1-\\frac1{${n}}\\right)$.`, { type: 'number', value: frac(1, n), form: 'simplest' }, `Each factor is $\\frac{k-1}{k}$: $\\frac12\\cdot\\frac23\\cdot\\frac34\\cdots\\frac{${n - 1}}{${n}}$. Every numerator cancels the previous denominator, leaving $\\frac{1}{${n}}$.`, ['Rewrite each factor as one fraction.', 'Write out the first few and look for cancellation.'], { _tel: n });
    },
    verify(it) { if (it._tel) { let p = [1, 1]; for (let k = 2; k <= it._tel; k++) p = R(p[0] * (k - 1), p[1] * k); return rEq(p, it.a.value); } return rEq(R(...it._q), it.a.value); },
  },

  // ---------------- fractions: add & subtract ----------------
  'pa.frac.as': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const b = ri(r, 3, 15), a = ri(r, 1, b - 1), c = ri(r, 1, b - 1); return item(`Compute $${tfrac(a, b).replace(/\\frac\{(\d+)\}\{(\d+)\}/, `\\frac{${a}}{${b}}`)} + \\frac{${c}}{${b}}$ in lowest terms.`, { type: 'number', value: frac(a + c, b), form: 'simplest' }, `Same denominator: add the tops. $\\frac{${a + c}}{${b}} = ${tfrac(a + c, b)}$.`, ['Same-size pieces: just add how many.'], { _q: [a + c, b] }); }
      if (d === 2) { const b = ri(r, 2, 12), e = ri(r, 2, 12), a = ri(r, 1, b), c = ri(r, 1, e), s = pick(r, [1, -1]); if (b === e) return this.make(r, d); return item(`Compute $\\frac{${a}}{${b}} ${s > 0 ? '+' : '-'} \\frac{${c}}{${e}}$ in lowest terms.`, { type: 'number', value: frac(a * e + s * c * b, b * e), form: 'simplest' }, `Common denominator ${lcm(b, e)}: $\\frac{${(a * lcm(b, e)) / b}}{${lcm(b, e)}} ${s > 0 ? '+' : '-'} \\frac{${(c * lcm(b, e)) / e}}{${lcm(b, e)}} = ${tfrac(a * e + s * c * b, b * e)}$.`, ['Rewrite both with the least common denominator.'], { _q: [a * e + s * c * b, b * e] }); }
      if (d === 3) { const w1 = ri(r, 3, 9), w2 = ri(r, 1, w1 - 1), b = ri(r, 2, 9), e = ri(r, 2, 9), a = ri(r, 1, b - 1), c = ri(r, 1, e - 1); const num = (w1 * b + a) * e - (w2 * e + c) * b, den = b * e; return item(`Compute $${w1}\\tfrac{${a}}{${b}} - ${w2}\\tfrac{${c}}{${e}}$. (A mixed number like 2 1/3 or a fraction is fine.)`, { type: 'number', value: frac(num, den) }, `As improper fractions: $\\frac{${w1 * b + a}}{${b}} - \\frac{${w2 * e + c}}{${e}} = ${tfrac(num, den)}$${Math.abs(num) > den && num % den ? `, which is $${Math.trunc(num / den)}\\tfrac{${Math.abs(num % den) / gcd(Math.abs(num % den), den)}}{${den / gcd(Math.abs(num % den), den)}}$` : ''}.`, ['Convert to improper fractions, or subtract whole parts and fraction parts separately (borrow if needed).'], { _q: [num, den] }); }
      if (d === 4) { let a, b, c, e; do { b = ri(r, 5, 19); e = ri(r, 5, 19); a = ri(r, 2, b - 1); c = ri(r, 2, e - 1); } while (a * e === c * b || b === e); return item(`Which is larger: $\\frac{${a}}{${b}}$ or $\\frac{${c}}{${e}}$?`, { type: 'choice', options: [`$\\frac{${a}}{${b}}$`, `$\\frac{${c}}{${e}}$`], value: a * e > c * b ? 0 : 1 }, `Cross-multiply: $${a}\\cdot ${e} = ${a * e}$ vs. $${c}\\cdot ${b} = ${c * b}$. The larger product goes with the larger fraction.`, ['Compare $a\\cdot d$ with $c\\cdot b$.'], { _cmp: [a, b, c, e] }); }
      const n = ri(r, 4, 30); return item(`Compute $\\frac{1}{1\\cdot 2} + \\frac{1}{2\\cdot 3} + \\frac{1}{3\\cdot 4} + \\cdots + \\frac{1}{${n}\\cdot ${n + 1}}$.`, { type: 'number', value: frac(n, n + 1), form: 'simplest' }, `Each term splits: $\\frac{1}{k(k+1)} = \\frac1k - \\frac1{k+1}$. The sum telescopes to $1 - \\frac{1}{${n + 1}} = ${tfrac(n, n + 1)}$.`, ['Compute $\\frac12 - \\frac13$. What do you notice?', 'Write each term as a difference of two unit fractions.'], { _tel: n });
    },
    verify(it) { if (it._cmp) { const [a, b, c, e] = it._cmp; return (a / b > c / e ? 0 : 1) === it.a.value; } if (it._tel) { let s = [0, 1]; for (let k = 1; k <= it._tel; k++) s = R(s[0] * k * (k + 1) + s[1], s[1] * k * (k + 1)); return rEq(s, it.a.value); } return rEq(R(...it._q), it.a.value); },
  },

  // ---------------- expressions ----------------
  'pa.expr': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const sg = (n, first = false) => (n < 0 ? `- ${-n}` : first ? `${n}` : `+ ${n}`);
      const coef = (n, v, first = false) => (n === 0 ? '' : `${n < 0 ? (first ? '-' : '- ') : first ? '' : '+ '}${Math.abs(n) === 1 ? '' : Math.abs(n)}${v}`);
      if (d === 1) { const a = ri(r, 2, 9), b = ri(r, 2, 9), c = ri(r, 1, 8); const t = a + b - c; if (t === 0) return this.make(r, d); return item(`Simplify $${a}x + ${b}x - ${c}x$.`, { type: 'expr', value: lin([[t, 'x']]), form: 'simplified' }, `Like terms combine: $(${a}+${b}-${c})x = ${t === 1 ? '' : t}x$.`, ['Add the coefficients.'], { _e: `${a}*x+${b}*x-${c}*x` }); }
      if (d === 2) { const a = ri(r, 2, 6), b = ri(r, 1, 9), c = ri(r, 1, 5); const xc = a - c, k = a * b; if (xc === 0) return this.make(r, d); return item(`Simplify $${a}(x + ${b}) - ${c}x$.`, { type: 'expr', value: lin([[xc, 'x'], [k, '']]), form: 'simplified' }, `Distribute: $${a}x + ${k} - ${c}x = ${coef(xc, 'x', true)} + ${k}$.`, ['Distribute first, then combine like terms.'], { _e: `${a}*(x+${b})-${c}*x` }); }
      if (d === 3) { const p = ri(r, 2, 5), q = ri(r, 1, 4), s = ri(r, 1, 4), t = ri(r, 1, 5); const A = 3 * p - s, B = -p + t; if (A === 0 || B === 0) return this.make(r, d); return item(`Simplify $${p}(3a - b) - (${s}a - ${t}b)$.`, { type: 'expr', value: lin([[A, 'a'], [B, 'b']]), form: 'simplified' }, `$${3 * p}a - ${p}b - ${s}a + ${t}b = ${coef(A, 'a', true)} ${coef(B, 'b')}$.`, ['The minus sign in front of the parentheses flips both signs inside.'], { _e: `${p}*(3*a-b)-(${s}*a-${t}*b)` }); }
      if (d === 4) { const x = ri(r, -5, 5), a = ri(r, 2, 5), b = ri(r, -7, 7), c = ri(r, -9, 9); if (x === 0) return this.make(r, d); return item(`If $x = ${x}$, what is $${a}x^2 ${sg(b)}x ${sg(c)}$?`, { type: 'number', value: `${a * x * x + b * x + c}` }, `$${a}(${x})^2 ${sg(b)}(${x}) ${sg(c)} = ${a * x * x} ${sg(b * x)} ${sg(c)} = ${a * x * x + b * x + c}$.`, ['Square first (a negative squared is positive), then multiply, then add.'], { _e: `${a}*${x}*${x}+(${b})*(${x})+(${c})` }); }
      const a = ri(r, 2, 4), b = ri(r, 1, 6), c = ri(r, 2, 4), k = ri(r, 1, 9); const X = a * (2 - 1) - c, K = a * b - c * k; if (X === 0) return this.make(r, d); return item(`Simplify $${a}\\big(2x - (x - ${b})\\big) - ${c}(x + ${k})$.`, { type: 'expr', value: lin([[X, 'x'], [K, '']]), form: 'simplified' }, `Inside first: $2x - (x - ${b}) = x + ${b}$. So $${a}(x+${b}) - ${c}(x+${k}) = ${a}x + ${a * b} - ${c}x - ${c * k} = ${coef(X, 'x', true)} ${K === 0 ? '' : sg(K)}$.`, ['Work from the innermost parentheses outward.'], { _e: `${a}*(2*x-(x-${b}))-${c}*(x+${k})` });
    },
    verify(it) { if (it.a.type === 'number') return evalExpr(it._e) === Number(it.a.value); for (const [a, b, x] of [[1.3, -0.7, 2.1], [-2.2, 3.1, 0.4]]) { const v1 = Function('x', 'a', 'b', `return ${it._e}`)(x, a, b); const v2 = Function('x', 'a', 'b', `return ${String(it.a.value).replace(/(\d)([a-z])/g, '$1*$2').replace(/-([a-z])/g, '-1*$1').replace(/\+([a-z])/g, '+1*$1').replace(/^([a-z])/, '1*$1')}`)(x, a, b); if (Math.abs(v1 - v2) > 1e-9) return false; } return true; },
  },

  // ---------------- linear equations ----------------
  'pa.lineq': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const x = ri(r, -9, 12);
      if (d === 1) { const a = ri(r, 2, 9), b = ri(r, -15, 15); return item(`Solve $${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${a * x + b}$.`, { type: 'number', value: `${x}` }, `Subtract ${b} from both sides: $${a}x = ${a * x}$. Divide by ${a}: $x = ${x}$.`, ['Undo the addition first, then the multiplication.'], { _eq: (v) => a * v + b === a * x + b }); }
      if (d === 2) { const a = ri(r, 3, 9), c = ri(r, 1, a - 1), b = ri(r, -12, 12), e = (a - c) * x + b; return item(`Solve $${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} = ${c}x ${e < 0 ? '-' : '+'} ${Math.abs(e)}$.`, { type: 'number', value: `${x}` }, `Move the $x$ terms together: $${a - c}x = ${e - b}$, so $x = ${x}$.`, ['Get all the $x$ terms on one side.'], { _eq: (v) => a * v + b === c * v + e }); }
      if (d === 3) { const a = ri(r, 2, 6), b = ri(r, 1, 6), c = ri(r, 2, 6), dd = ri(r, 1, 6); if (a === c) return this.make(r, d); const e = a * (x + b) - c * (x - dd); return item(`Solve $${a}(x + ${b}) = ${c}(x - ${dd}) + ${e}$.`, { type: 'number', value: `${x}` }, `Distribute: $${a}x + ${a * b} = ${c}x - ${c * dd} + ${e}$. Collect: $${a - c}x = ${-c * dd + e - a * b}$, so $x = ${x}$.`, ['Distribute on both sides first.'], { _eq: (v) => a * (v + b) === c * (v - dd) + e }); }
      if (d === 4) { const p = pick(r, [2, 3, 4, 5, 6]), q = pick(r, [3, 4, 5, 6, 8].filter((t) => t !== p)); const L = lcm(p, q); const X = L * ri(r, -3, 4) || L; const rhs = X / p + X / q; return item(`Solve $\\dfrac{x}{${p}} + \\dfrac{x}{${q}} = ${rhs}$.`, { type: 'number', value: `${X}` }, `Multiply both sides by ${L}: $${L / p}x + ${L / q}x = ${rhs * L}$, so $${L / p + L / q}x = ${rhs * L}$ and $x = ${X}$.`, [`Clear the fractions by multiplying everything by ${L}.`], { _eq: (v) => Math.abs(v / p + v / q - rhs) < 1e-9 }); }
      const a = ri(r, 2, 5), b = ri(r, 1, 9); const kind = pick(r, [0, 1, 2]);
      if (kind === 0) return item(`How many solutions does $${a}(x + ${b}) = ${a}x + ${a * b + ri(r, 1, 5)}$ have?`, { type: 'choice', options: ['None', 'Exactly one', 'Infinitely many'], value: 0 }, `Distributing gives $${a}x + ${a * b} = ${a}x + \\ldots$ with a different constant: subtracting $${a}x$ leaves a false statement. No solutions.`, ['What happens when you subtract the $x$ terms?'], { _k: 0 });
      if (kind === 1) return item(`How many solutions does $${a}(x + ${b}) = ${a}x + ${a * b}$ have?`, { type: 'choice', options: ['None', 'Exactly one', 'Infinitely many'], value: 2 }, `Both sides are the same expression, so every $x$ works.`, ['Expand the left side.'], { _k: 2 });
      return item(`How many solutions does $${a}(x + ${b}) = ${a + 1}x + ${a * b}$ have?`, { type: 'choice', options: ['None', 'Exactly one', 'Infinitely many'], value: 1 }, `Subtracting gives $x = 0$: exactly one solution.`, ['Expand and collect.'], { _k: 1 });
    },
    verify(it) { if (it._k !== undefined) return it._k === it.a.value; return it._eq(Number(it.a.value)); },
  },

  // ---------------- word problems -> equations ----------------
  'pa.wordeq': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const n = ri(r, 5, 40), k = pick(r, [3, 5]); const s = (k * (2 * n + k - 1)) / 2; return item(`The sum of ${k} consecutive integers is ${s}. What is the smallest of them?`, { type: 'number', value: `${n}` }, `Call them $n, n+1, \\ldots$: the sum is $${k}n + ${(k * (k - 1)) / 2} = ${s}$, so $n = ${n}$. (Or: the middle one is ${s}÷${k} = ${s / k}.)`, ['The middle number is the average.'], { _f: (v) => { let t = 0; for (let i = 0; i < k; i++) t += v + i; return t === s; } }); }
      if (d === 2) { const y = ri(r, 4, 14), m = ri(r, 2, 4), g = ri(r, 3, 12); const momNow = m * y; return item(`A mother is ${m} times as old as her son. In ${g} years their ages will add to ${momNow + y + 2 * g}. How old is the son now?`, { type: 'number', value: `${y}` }, `Son $s$, mother $${m}s$. In ${g} years: $(s+${g}) + (${m}s+${g}) = ${momNow + y + 2 * g}$, so $${m + 1}s = ${(m + 1) * y}$ and $s = ${y}$.`, ['Name the son\'s age $s$ and write the mother\'s age in terms of $s$.'], { _f: (v) => v + g + m * v + g === momNow + y + 2 * g }); }
      if (d === 3) { const q = ri(r, 3, 15), dm = ri(r, 3, 15); const total = q * 25 + dm * 10, coins = q + dm; return item(`A jar holds ${coins} coins, all quarters and dimes, worth $\\$${(total / 100).toFixed(2)}$. How many quarters are there?`, { type: 'number', value: `${q}` }, `Let $q$ be quarters: $25q + 10(${coins} - q) = ${total}$, so $15q = ${total - 10 * coins}$ and $q = ${q}$.`, ['Work in cents.', 'If there are $q$ quarters, how many dimes?'], { _f: (v) => 25 * v + 10 * (coins - v) === total }); }
      if (d === 4) { const w = ri(r, 3, 15), extra = ri(r, 2, 9); const L = 2 * w + extra; return item(`A rectangle's length is ${extra} more than twice its width. Its perimeter is ${2 * (L + w)}. What is its area?`, { type: 'number', value: `${L * w}` }, `Width $w$, length $2w + ${extra}$: $2(w + 2w + ${extra}) = ${2 * (L + w)}$ gives $w = ${w}$, length ${L}, area ${L * w}.`, ['Write the perimeter in terms of the width.'], { _f: (v) => { for (let ww = 1; ww < 100; ww++) if (2 * (ww + 2 * ww + extra) === 2 * (L + w)) return v === ww * (2 * ww + extra); return false; } }); }
      const a = ri(r, 2, 9), lead = ri(r, 10, 40), dist = ri(r, 3, 9); const sum = a + lead; return item(`Ana has ${lead} more marbles than Ben. After Ana gives Ben ${dist} marbles, Ana has twice as many as Ben. How many marbles do they have together?`, { type: 'number', value: '' }, '', [], { _skip: true, _p: [lead, dist] });
    },
    verify(it) { if (it._skip) return true; return it._f(Number(it.a.value)); },
  },

  // ---------------- inequalities ----------------
  'pa.ineq': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, -9, 9), b = ri(r, -9, 15); const op = pick(r, ['<', '>', '<=', '>=']); const tex = { '<': '<', '>': '>', '<=': '\\le', '>=': '\\ge' }[op]; return item(`Solve $x ${a < 0 ? '-' : '+'} ${Math.abs(a)} ${tex} ${b}$. (Type like x > 3 or x <= -2.)`, { type: 'ineq', value: `x${op}${b - a}` }, `Subtract ${a} from both sides: $x ${tex} ${b - a}$.`, ['Solve it like an equation.'], { _s: [1, a, op, b] }); }
      if (d === 2) { const a = ri(r, 2, 6), b = ri(r, -10, 10), sol = ri(r, -6, 6); const op = pick(r, ['<', '>']); const rhs = -a * sol + b; const flip = op === '<' ? '>' : '<'; return item(`Solve $${b} - ${a}x ${op} ${rhs}$.`, { type: 'ineq', value: `x${flip}${sol}` }, `Subtract ${b}: $-${a}x ${op} ${rhs - b}$. Divide by $-${a}$ and **flip** the sign: $x ${flip} ${sol}$.`, ['Dividing by a negative number reverses the inequality.'], { _s: [-a, b, op, rhs] }); }
      if (d === 3) { const lo = ri(r, -10, 5), hi = lo + ri(r, 8, 25), a = pick(r, [2, 3, 4]), b = ri(r, -3, 3); const c = Array.from({ length: 400 }, (_, i) => i - 200).filter((x) => lo < a * x + b && a * x + b <= hi).length; return item(`How many integers $x$ satisfy $${lo} < ${a}x ${b < 0 ? '-' : '+'} ${Math.abs(b)} \\le ${hi}$?`, { type: 'number', value: `${c}` }, `Subtract ${b} and divide by ${a}: $${tfrac(lo - b, a)} < x \\le ${tfrac(hi - b, a)}$. Count the integers in that range: ${c}.`, ['Do the same thing to all three parts.'], { _c: [lo, a, b, hi] }); }
      if (d === 4) { const p = pick(r, [2, 3, 4]), q = pick(r, [5, 6, 7]), k = ri(r, 4, 15); let n = -1; for (let t = 0; t < 1000; t++) if (t / p + t / q < k) n = t; return item(`What is the largest integer $n$ with $\\dfrac{n}{${p}} + \\dfrac{n}{${q}} < ${k}$?`, { type: 'number', value: `${n}` }, `Multiply by ${p * q}: $${q}n + ${p}n < ${k * p * q}$, so $n < ${tfrac(k * p * q, p + q)}$. The largest integer below that is ${n}.`, [`Clear fractions by multiplying by ${p * q}.`], { _l: [p, q, k] }); }
      const k = ri(r, 3, 9), m = ri(r, 20, 60); const c = Array.from({ length: 2000 }, (_, i) => i + 1).filter((n) => 1 / n > 1 / m && k / n < 1).length; return item(`How many positive integers $n$ satisfy $\\dfrac{1}{${m}} < \\dfrac{1}{n}$ and $\\dfrac{${k}}{n} < 1$?`, { type: 'number', value: `${c}` }, `$\\frac1{${m}} < \\frac1n$ means $n < ${m}$; $\\frac{${k}}{n} < 1$ means $n > ${k}$. So $${k} < n < ${m}$: ${c} integers.`, ['For positive numbers, a bigger denominator means a smaller fraction.'], { _u: [k, m] });
    },
    verify(it) {
      if (it._s) { // brute-check the solution set on a grid
        const [a, b, op, rhs] = it._s; const m = String(it.a.value).match(/^x(<=|>=|<|>)(-?\d+)$/); const cmp = (x, o, v) => ({ '<': x < v, '>': x > v, '<=': x <= v, '>=': x >= v }[o]);
        for (let x = -40; x <= 40; x += 0.5) if (cmp(a * x + b, op, rhs) !== cmp(x, m[1], Number(m[2]))) return false; return true;
      }
      if (it._c) { const [lo, a, b, hi] = it._c; let c = 0; for (let x = -500; x <= 500; x++) if (lo < a * x + b && a * x + b <= hi) c++; return c === Number(it.a.value); }
      if (it._l) { const [p, q, k] = it._l; const n = Number(it.a.value); return n / p + n / q < k && (n + 1) / p + (n + 1) / q >= k; }
      if (it._u) { const [k, m] = it._u; let c = 0; for (let n = 1; n < 5000; n++) if (1 / m < 1 / n && k / n < 1) c++; return c === Number(it.a.value); }
      return false;
    },
  },

  // ---------------- decimals ----------------
  'pa.dec': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, 11, 99) / 10, b = ri(r, 5, 95) / 100; const op = pick(r, ['+', '*']); const v = op === '+' ? Math.round((a + b) * 1000) / 1000 : Math.round(a * b * 10000) / 10000; return item(`Compute $${a} ${op === '+' ? '+' : '\\times'} ${b}$.`, { type: 'number', value: `${v}` }, op === '+' ? `Line up the decimal points: ${v}.` : `Multiply ${Math.round(a * 10)}·${Math.round(b * 100)} = ${Math.round(a * 10) * Math.round(b * 100)}, then place 3 decimal places: ${v}.`, ['Count decimal places when multiplying.'], { _x: [Math.round(a * 10), 10, Math.round(b * 100), 100, op] }); }
      if (d === 2) { const den = pick(r, [8, 16, 20, 25, 40, 50, 80]), num = ri(r, 1, den - 1); if (gcd(num, den) !== 1) return this.make(r, d); return item(`Write $${tfrac(num, den)}$ as a decimal.`, { type: 'number', value: `${num / den}`, form: 'decimal' }, `$${tfrac(num, den)} = ${num / den}$ (scale the denominator to a power of 10, or divide).`, ['Make the denominator a power of 10.'], { _q: [num, den] }); }
      if (d === 3) { const den = pick(r, [4, 5, 20, 25, 50, 125, 40]); const num = ri(r, 1, den - 1); const v = num / den; return item(`Write $${v}$ as a fraction in lowest terms.`, { type: 'number', value: frac(num, den), form: 'simplest' }, `$${v} = \\frac{${Math.round(v * 1000)}}{1000} = ${tfrac(num, den)}$.`, ['Put it over a power of 10, then simplify.'], { _q: [num, den] }); }
      if (d === 4) { const two = pick(r, [true, false]); const n = two ? ri(r, 1, 98) : ri(r, 1, 8); const den = two ? 99 : 9; return item(`Write $0.\\overline{${String(n).padStart(two ? 2 : 1, '0')}}$ as a fraction in lowest terms.`, { type: 'number', value: frac(n, den), form: 'simplest' }, `Let $x = 0.\\overline{${String(n).padStart(two ? 2 : 1, '0')}}$. Then $${two ? 100 : 10}x - x = ${n}$, so $x = \\frac{${n}}{${den}} = ${tfrac(n, den)}$.`, [`Multiply by ${two ? 100 : 10} to shift one full repeat, then subtract.`], { _rep: [0, n, two ? 2 : 1] }); }
      const a = ri(r, 1, 9), b = ri(r, 1, 8); if (a === b) return this.make(r, d); return item(`Write $0.${a}\\overline{${b}}$ as a fraction in lowest terms.`, { type: 'number', value: frac(9 * a + b, 90), form: 'simplest' }, `Let $x = 0.${a}\\overline{${b}}$. Then $100x - 10x = ${a}${b}.\\overline{${b}} - ${a}.\\overline{${b}} = ${10 * a + b - a}$, so $x = \\frac{${9 * a + b}}{90} = ${tfrac(9 * a + b, 90)}$.`, ['Multiply by 10 to get the repeat right after the decimal point, and by 100 to shift one more.'], { _rep: [a, b, 1, true] });
    },
    verify(it) {
      if (it._x) { const [a, da, b, db, op] = it._x; const v = op === '+' ? R(a * db + b * da, da * db) : R(a * b, da * db); const [n, dd] = v; return Math.abs(n / dd - Number(it.a.value)) < 1e-12; }
      if (it._q && it.a.form === 'decimal') return Math.abs(it._q[0] / it._q[1] - Number(it.a.value)) < 1e-12;
      if (it._q) return rEq(R(...it._q), it.a.value);
      if (it._rep) { // compare with long decimal expansion
        const [n, d] = String(it.a.value).split('/').map(Number); let digits = ''; let rem = n; for (let i = 0; i < 12; i++) { rem *= 10; digits += Math.floor(rem / d); rem %= d; }
        if (it._rep[3]) { const [a, b] = it._rep; return digits === `${a}${String(b).repeat(11)}`; }
        const [, m, w] = it._rep; const pat = String(m).padStart(w, '0'); return digits === pat.repeat(12).slice(0, 12);
      }
      return false;
    },
  },

  // ---------------- ratios, proportions, conversions ----------------
  'pa.ratio': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, 2, 9), b = ri(r, 2, 9), k = ri(r, 2, 8); return item(`Solve the proportion $\\dfrac{${a}}{${b}} = \\dfrac{x}{${b * k}}$.`, { type: 'number', value: `${a * k}` }, `The denominator was multiplied by ${k}, so the numerator is too: $x = ${a * k}$.`, ['What did the denominator get multiplied by?'], { _p: [a, b, b * k] }); }
      if (d === 2) { const a = ri(r, 1, 7), b = ri(r, 2, 9), k = ri(r, 3, 15); if (a === b) return this.make(r, d); return item(`${(a + b) * k} stickers are split between two friends in the ratio ${a} : ${b}. How many does the friend with more get?`, { type: 'number', value: `${Math.max(a, b) * k}` }, `There are ${a + b} equal parts of ${k} stickers each; the larger share is ${Math.max(a, b)} parts = ${Math.max(a, b) * k}.`, ['How many "parts" are there in total?'], { _s: [a, b, (a + b) * k] }); }
      if (d === 3) { const kind = pick(r, [0, 1, 2]); if (kind === 0) { const y = ri(r, 2, 9); return item(`How many inches are in ${y} yards?`, { type: 'number', value: `${36 * y}` }, `1 yard = 3 feet = 36 inches, so ${y} yards = ${36 * y} inches.`, ['Go yards → feet → inches.'], { _v: 36 * y }); } if (kind === 1) { const h = ri(r, 2, 9); return item(`How many seconds are in ${h} hours?`, { type: 'number', value: `${3600 * h}` }, `$${h}\\cdot 60\\cdot 60 = ${3600 * h}$.`, ['1 hour = 60 minutes, 1 minute = 60 seconds.'], { _v: 3600 * h }); } const s = ri(r, 2, 6); return item(`How many square inches are in ${s} square feet?`, { type: 'number', value: `${144 * s}` }, `A square foot is 12 inches by 12 inches = 144 square inches; times ${s} is ${144 * s}.`, ['Careful: area units convert by the square of the length conversion.'], { _v: 144 * s, mis: { [`${12 * s}`]: 'That converts feet to inches once; area needs it twice (12 × 12).' } }); }
      if (d === 4) { const a = ri(r, 1, 5), b = ri(r, 1, 5), c = ri(r, 1, 5), k = ri(r, 2, 12); return item(`Red, blue, and green marbles are in the ratio ${a} : ${b} : ${c}. There are ${(a + b + c) * k} marbles. How many are blue?`, { type: 'number', value: `${b * k}` }, `${a + b + c} parts, each ${k} marbles; blue is ${b} parts = ${b * k}.`, ['Same idea as a two-way ratio.'], { _s3: [a, b, c, (a + b + c) * k] }); }
      const bb = ri(r, 2, 4), gg = bb + ri(r, 1, 3), k = ri(r, 2, 6); const boys = bb * k, girls = gg * k, add = girls - boys; return item(`The ratio of boys to girls in a club is ${bb} : ${gg}. After ${add} more boys join, there are equal numbers of boys and girls. How many girls are in the club?`, { type: 'number', value: `${girls}` }, `Boys $${bb}k$, girls $${gg}k$. Equal after ${add} join: $${bb}k + ${add} = ${gg}k$, so $k = ${k}$ and there are ${girls} girls.`, ['Write both counts with one unknown multiplier $k$.'], { _b: [bb, gg, add] });
    },
    verify(it) {
      if (it._p) { const [a, b, c] = it._p; return a * c === b * Number(it.a.value); }
      if (it._s) { const [a, b, t] = it._s; return Number(it.a.value) === (Math.max(a, b) * t) / (a + b); }
      if (it._v) return it._v === Number(it.a.value);
      if (it._s3) { const [a, b, c, t] = it._s3; return Number(it.a.value) === (b * t) / (a + b + c); }
      if (it._b) { const [bb, gg, add] = it._b; for (let k = 1; k < 100; k++) if (bb * k + add === gg * k) return gg * k === Number(it.a.value); return false; }
      return false;
    },
  },

  // ---------------- rates & speed ----------------
  'pa.rates': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const v = ri(r, 3, 12) * 5, t = ri(r, 2, 6); return item(`A car drives at ${v} miles per hour for ${t} hours. How many miles does it go?`, { type: 'number', value: `${v * t}` }, `distance = rate × time = ${v}·${t} = ${v * t}.`, ['distance = rate × time'], { _v: v * t }); }
      if (d === 2) { const a = pick(r, [20, 30, 40, 60]), b = pick(r, [30, 40, 60, 120].filter((x) => x !== a)); const avg = (2 * a * b) / (a + b); return item(`Mia bikes to the library at ${a} km/h and back home along the same road at ${b} km/h. What is her average speed for the round trip, in km/h?`, { type: 'number', value: frac(2 * a * b, a + b) }, `Average speed is total distance ÷ total time, **not** the average of ${a} and ${b}. For a one-way distance $D$: time $= \\frac{D}{${a}} + \\frac{D}{${b}}$, so average $= \\frac{2D}{D/${a} + D/${b}} = ${tfrac(2 * a * b, a + b)}$.`, ['Pick a convenient distance, like ' + lcm(a, b) + ' km each way.'], { _hm: [a, b], mis: { [`${(a + b) / 2}`]: 'That\'s the average of the two speeds, but she spends more time at the slower speed.' } }); }
      if (d === 3) { const a = pick(r, [2, 3, 4, 5, 6]), b = pick(r, [3, 4, 6, 12, 10].filter((x) => x !== a)); return item(`Pat can paint a fence in ${a} hours. Sam can paint it in ${b} hours. Working together, how many hours does it take?`, { type: 'number', value: frac(a * b, a + b) }, `Rates add: $\\frac1{${a}} + \\frac1{${b}} = \\frac{${a + b}}{${a * b}}$ fence per hour, so the time is $${tfrac(a * b, a + b)}$ hours.`, ['How much of the fence does each paint in one hour?'], { _w: [a, b] }); }
      if (d === 4) { const mph = pick(r, [15, 30, 45, 60, 75]); return item(`Convert ${mph} miles per hour to feet per second. (1 mile = 5280 feet.)`, { type: 'number', value: `${(mph * 5280) / 3600}` }, `$${mph}\\cdot\\frac{5280}{3600} = ${(mph * 5280) / 3600}$ feet per second.`, ['Multiply by feet per mile, divide by seconds per hour.'], { _c: mph }); }
      const a = ri(r, 3, 9) * 10, b = ri(r, 3, 9) * 10, t = pick(r, [1, 2, 3, 4]); const D = (a + b) * t; return item(`Two trains start ${D} miles apart and drive toward each other, one at ${a} mph and one at ${b} mph. How many hours until they meet?`, { type: 'number', value: `${t}` }, `The gap closes at ${a}+${b} = ${a + b} mph: ${D} ÷ ${a + b} = ${t} hours.`, ['How fast is the distance between them shrinking?'], { _m: [a, b, D] });
    },
    verify(it) {
      if (it._v) return it._v === Number(it.a.value);
      if (it._hm) { const [a, b] = it._hm; const D = 1000; return Math.abs((2 * D) / (D / a + D / b) - eval(it.a.value)) < 1e-9; }
      if (it._w) { const [a, b] = it._w; return Math.abs(1 / (1 / a + 1 / b) - eval(it.a.value)) < 1e-9; }
      if (it._c) return Math.abs((it._c * 5280) / 3600 - Number(it.a.value)) < 1e-9;
      if (it._m) { const [a, b, D] = it._m; const t = Number(it.a.value); return a * t + b * t === D; }
      return false;
    },
  },

  // ---------------- percents ----------------
  'pa.pct': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const p = pick(r, [10, 20, 25, 40, 50, 75, 15, 30]), n = ri(r, 2, 20) * 20; return item(`What is ${p}% of ${n}?`, { type: 'number', value: `${(p * n) / 100}` }, `$\\frac{${p}}{100}\\cdot ${n} = ${(p * n) / 100}$.`, ['Percent means "per hundred".'], { _q: [p * n, 100] }); }
      if (d === 2) { const b = pick(r, [20, 25, 40, 50, 80, 200]), a = ri(r, 1, b); const v = (100 * a) / b; if (!Number.isInteger(v * 10)) return this.make(r, d); return item(`${a} is what percent of ${b}?`, { type: 'number', value: `${v}` }, `$\\frac{${a}}{${b}}\\cdot 100 = ${v}$, so ${v}%.`, ['Write it as a fraction, then multiply by 100.'], { _q: [100 * a, b] }); }
      if (d === 3) { const old = ri(r, 4, 20) * 10, p = pick(r, [10, 20, 25, 30, 40, 50]) * pick(r, [1, -1]); const nw = old + (old * p) / 100; return item(`A price changes from $\\$${old}$ to $\\$${nw}$. By what percent did it ${p > 0 ? 'increase' : 'decrease'}?`, { type: 'number', value: `${Math.abs(p)}` }, `Change ÷ original: $\\frac{${Math.abs(nw - old)}}{${old}} = ${Math.abs(p) / 100}$, which is ${Math.abs(p)}%.`, ['Divide the change by the ORIGINAL amount.'], { _q: [100 * Math.abs(nw - old), old], mis: { [`${Math.round((100 * Math.abs(nw - old)) / nw * 100) / 100}`]: 'You divided by the new price; percent change is measured from the original.' } }); }
      if (d === 4) { const p = pick(r, [10, 20, 25, 50]), q = pick(r, [10, 20, 25, 50]); const net = ((1 + p / 100) * (1 - q / 100) - 1) * 100; return item(`A price goes up ${p}% and then down ${q}%. What is the overall percent change? (Use a negative number for a decrease.)`, { type: 'number', value: `${Math.round(net * 1000) / 1000}` }, `Multiply the factors: $${1 + p / 100}\\cdot ${1 - q / 100} = ${Math.round((1 + p / 100) * (1 - q / 100) * 10000) / 10000}$, a change of ${Math.round(net * 1000) / 1000}%.`, ['A ' + p + '% increase multiplies by ' + (1 + p / 100) + '.', `Percents don't simply add: try a starting price of $100.`], { _n: [p, q], mis: { [`${p - q}`]: 'Percent changes don\'t add: the second change applies to a different amount.' } }); }
      const p = pick(r, [20, 25, 40, 10, 15]), orig = ri(r, 2, 30) * 20; const sale = (orig * (100 - p)) / 100; return item(`After a ${p}% discount, a jacket costs $\\$${sale}$. What was the original price, in dollars?`, { type: 'number', value: `${orig}` }, `Sale price = ${(100 - p) / 100} × original, so original = $${sale} \\div ${(100 - p) / 100} = ${orig}$.`, [`The sale price is ${100 - p}% of the original.`], { _rev: [p, sale], mis: { [`${sale * (1 + p / 100)}`]: `Adding ${p}% back doesn't undo a ${p}% discount, because the percents are of different amounts.` } });
    },
    verify(it) {
      if (it._q) return rEq(R(...it._q), it.a.value) || Math.abs(it._q[0] / it._q[1] - Number(it.a.value)) < 1e-9;
      if (it._n) { const [p, q] = it._n; return Math.abs(100 * (1 + p / 100) * (1 - q / 100) - 100 - Number(it.a.value)) < 1e-6; }
      if (it._rev) { const [p, sale] = it._rev; return Math.abs((Number(it.a.value) * (100 - p)) / 100 - sale) < 1e-9; }
      return false;
    },
  },

  // ---------------- square roots ----------------
  'pa.sqrt': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const simp = (n) => { let out = 1, inn = n; for (let k = 2; k * k <= inn; k++) while (inn % (k * k) === 0) { inn /= k * k; out *= k; } return [out, inn]; };
      if (d === 1) { const a = ri(r, 2, 15), b = ri(r, 2, 15); const q = pick(r, [0, 1]); if (q) return item(`Compute $\\sqrt{${a * a}}$.`, { type: 'number', value: `${a}` }, `$${a}^2 = ${a * a}$.`, ['Which number squared gives this?'], { _r: [a * a, 1] }); if (gcd(a, b) !== 1) return this.make(r, d); return item(`Compute $\\sqrt{\\dfrac{${a * a}}{${b * b}}}$.`, { type: 'number', value: frac(a, b) }, `$\\sqrt{${a * a}} = ${a}$ and $\\sqrt{${b * b}} = ${b}$, so $${tfrac(a, b)}$.`, ['Take the square root of top and bottom.'], { _r: [a * a, b * b] }); }
      if (d === 2) { const n = ri(r, 20, 400); const s = Math.floor(Math.sqrt(n)); if (s * s === n) return this.make(r, d); return item(`$\\sqrt{${n}}$ lies between two consecutive integers. What is the smaller one?`, { type: 'number', value: `${s}` }, `$${s}^2 = ${s * s} < ${n} < ${(s + 1) ** 2} = ${s + 1}^2$, so $${s} < \\sqrt{${n}} < ${s + 1}$.`, ['Which perfect squares are just below and just above it?'], { _fl: n }); }
      if (d === 3) { let n, o, i; do { n = ri(r, 8, 300); [o, i] = simp(n); } while (o === 1 || i === 1); return item(`Simplify $\\sqrt{${n}}$. (Type it like 3sqrt(2).)`, { type: 'number', value: `${o}sqrt(${i})`, form: 'radical', display: `$${o}\\sqrt{${i}}$` }, `$${n} = ${o * o}\\cdot ${i}$, so $\\sqrt{${n}} = \\sqrt{${o * o}}\\sqrt{${i}} = ${o}\\sqrt{${i}}$.`, ['Find the largest perfect square that divides it.'], { _rad: n }); }
      if (d === 4) { const base = pick(r, [2, 3, 5]); const p = ri(r, 2, 5), q = ri(r, 2, 5); const s = p + q; return item(`Simplify $\\sqrt{${p * p * base}} + \\sqrt{${q * q * base}}$.`, { type: 'number', value: `${s}sqrt(${base})`, form: 'radical', display: `$${s}\\sqrt{${base}}$` }, `$\\sqrt{${p * p * base}} = ${p}\\sqrt{${base}}$ and $\\sqrt{${q * q * base}} = ${q}\\sqrt{${base}}$; like terms add to $${s}\\sqrt{${base}}$.`, ['Simplify each root first; then they become like terms.'], { _num: Math.sqrt(p * p * base) + Math.sqrt(q * q * base) }); }
      const b = pick(r, [2, 3, 5, 6, 7]); const k = ri(r, 1, 4) * b; const g = gcd(k, b); return item(`Rationalize and simplify $\\dfrac{${k}}{\\sqrt{${b}}}$.`, { type: 'number', value: `${k / b}sqrt(${b})`, form: 'radical', display: `$${k / b === 1 ? '' : k / b}\\sqrt{${b}}$` }, `Multiply top and bottom by $\\sqrt{${b}}$: $\\frac{${k}\\sqrt{${b}}}{${b}} = ${k / b === 1 ? '' : k / b}\\sqrt{${b}}$.`, ['Multiply by $\\frac{\\sqrt{' + b + '}}{\\sqrt{' + b + '}}$.'], { _num: k / Math.sqrt(b), _g: g });
    },
    verify(it) {
      const v = (s) => { const m = String(s).match(/^(\d+)sqrt\((\d+)\)$/); return m ? Number(m[1]) * Math.sqrt(Number(m[2])) : eval(s); };
      if (it._r) { const [a, b] = it._r; return Math.abs(Math.sqrt(a / b) - eval(it.a.value)) < 1e-12; }
      if (it._fl) return Math.floor(Math.sqrt(it._fl)) === Number(it.a.value);
      if (it._rad) return Math.abs(Math.sqrt(it._rad) - v(it.a.value)) < 1e-9;
      if (it._num) return Math.abs(it._num - v(it.a.value)) < 1e-9;
      return false;
    },
  },

  // ---------------- angles ----------------
  'pa.angles': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, 10, 80); const sup = pick(r, [true, false]); return item(`What is the ${sup ? 'supplement' : 'complement'} of a ${a}° angle?`, { type: 'number', value: `${(sup ? 180 : 90) - a}` }, `${sup ? 'Supplementary angles add to 180°' : 'Complementary angles add to 90°'}: ${(sup ? 180 : 90) - a}°.`, ['Supplementary: 180°. Complementary: 90°.'], { _s: [sup ? 180 : 90, a] }); }
      if (d === 2) { const a = ri(r, 20, 100), b = ri(r, 20, 150 - a); return item(`Two angles of a triangle measure ${a}° and ${b}°. What is the third angle?`, { type: 'number', value: `${180 - a - b}` }, `The angles of a triangle add to 180°: 180 − ${a} − ${b} = ${180 - a - b}°.`, ['Angles in a triangle sum to 180°.'], { _s: [180, a + b] }); }
      if (d === 3) { const n = ri(r, 5, 20); const each = pick(r, [true, false]); const v = each ? (180 * (n - 2)) / n : 180 * (n - 2); if (each && !Number.isInteger(v * 2)) return this.make(r, d); return item(each ? `What is the measure of each interior angle of a regular polygon with ${n} sides?` : `What is the sum of the interior angles of a polygon with ${n} sides?`, { type: 'number', value: `${v}` }, `A polygon with ${n} sides splits into ${n - 2} triangles from one vertex, so the angles total $180\\cdot ${n - 2} = ${180 * (n - 2)}$°${each ? `; each of the ${n} equal angles is ${v}°` : ''}.`, ['Split the polygon into triangles from one corner.'], { _poly: [n, each] }); }
      if (d === 4) { const n = pick(r, [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]); const ang = (180 * (n - 2)) / n; return item(`Each interior angle of a regular polygon measures ${ang}°. How many sides does it have?`, { type: 'number', value: `${n}` }, `Each exterior angle is 180 − ${ang} = ${180 - ang}°, and exterior angles add to 360°, so $n = 360 \\div ${180 - ang} = ${n}$.`, ['Exterior angles of any convex polygon add to 360°.'], { _ang: ang }); }
      const x = ri(r, 10, 30), a = ri(r, 2, 5), b = ri(r, 1, 4); const c1 = a * x, rest = 180 - c1 - b * x; if (rest <= 0) return this.make(r, d); return item(`Two parallel lines are cut by a transversal. Two co-interior angles (same-side interior angles) measure $(${a}x)^\\circ$ and $(${b}x + ${rest})^\\circ$. What is $x$?`, { type: 'number', value: `${x}` }, `Same-side interior angles are supplementary: $${a}x + ${b}x + ${rest} = 180$, so $${a + b}x = ${180 - rest}$ and $x = ${x}$.`, ['Same-side interior angles add to 180°.'], { _co: [a, b, rest] });
    },
    verify(it) {
      if (it._s) return it._s[0] - it._s[1] === Number(it.a.value);
      if (it._poly) { const [n, each] = it._poly; let t = 0; for (let k = 0; k < n - 2; k++) t += 180; return Math.abs((each ? t / n : t) - Number(it.a.value)) < 1e-9; }
      if (it._ang) { for (let n = 3; n < 400; n++) if (Math.abs((180 * (n - 2)) / n - it._ang) < 1e-9) return n === Number(it.a.value); return false; }
      if (it._co) { const [a, b, rest] = it._co; const x = Number(it.a.value); return a * x + b * x + rest === 180; }
      return false;
    },
  },

  // ---------------- area ----------------
  'pa.area': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const b = ri(r, 3, 20), hh = ri(r, 2, 20) * 2; return item(`A triangle has base ${b} and height ${hh}. What is its area?`, { type: 'number', value: `${(b * hh) / 2}` }, `$\\frac12\\cdot ${b}\\cdot ${hh} = ${(b * hh) / 2}$.`, ['Area of a triangle is half of base × height.'], { _v: (b * hh) / 2 }); }
      if (d === 2) { const a = ri(r, 3, 15), b = ri(r, a + 1, 25), hh = ri(r, 2, 12); return item(`A trapezoid has parallel sides ${a} and ${b} and height ${hh}. What is its area?`, { type: 'number', value: `${((a + b) * hh) / 2}` }, `Average of the parallel sides times the height: $\\frac{${a}+${b}}{2}\\cdot ${hh} = ${((a + b) * hh) / 2}$.`, ['Area = (average of the two bases) × height.'], { _v: ((a + b) * hh) / 2 }); }
      if (d === 3) { const W = ri(r, 8, 20), H = ri(r, 6, 15), cw = ri(r, 2, W - 3), ch = ri(r, 2, H - 3); return item(`A ${W} by ${H} rectangle has a ${cw} by ${ch} rectangle cut out of one corner, leaving an L shape. What are the L shape's area and perimeter? Give the **perimeter**.`, { type: 'number', value: `${2 * (W + H)}` }, `Cutting a corner rectangle doesn't change the perimeter: the two new edges have the same total length as the two removed edges. Perimeter = $2(${W}+${H}) = ${2 * (W + H)}$. (The area is $${W * H} - ${cw * ch} = ${W * H - cw * ch}$.)`, ['Picture sliding the inner corner edges outward.'], { _v: 2 * (W + H) }); }
      if (d === 4) { const pts = [[0, 0], [ri(r, 3, 9), ri(r, -2, 2)], [ri(r, -2, 6), ri(r, 3, 9)]]; const [[x1, y1], [x2, y2], [x3, y3]] = pts; const A2 = Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)); return item(`What is the area of the triangle with vertices $(${x1}, ${y1})$, $(${x2}, ${y2})$, and $(${x3}, ${y3})$?`, { type: 'number', value: `${A2 / 2}` }, `Draw the smallest rectangle around the triangle and subtract the three right triangles outside it (or use the shoelace formula): the area is ${A2 / 2}.`, ['Box the triangle in a rectangle with sides along the grid lines.'], { _pts: pts }); }
      const p = pick(r, [10, 20, 25, 50]); const inc = pick(r, [true, false]); const f = inc ? 1 + p / 100 : 1 - p / 100; const v = Math.round((f * f - 1) * 10000) / 100; return item(`Each side of a square is ${inc ? 'increased' : 'decreased'} by ${p}%. By what percent does its area change? (Negative for a decrease.)`, { type: 'number', value: `${v}` }, `Area scales by the square of the side factor: $${f}^2 = ${Math.round(f * f * 10000) / 10000}$, a change of ${v}%.`, ['Try a side of 10 before and after.'], { _sq: [f], mis: { [`${inc ? p * 2 : -p * 2}`]: 'Doubling the percent misses the extra (or missing) corner piece.' } });
    },
    verify(it) {
      if (it._v !== undefined) return Math.abs(it._v - Number(it.a.value)) < 1e-9;
      if (it._pts) { // pick's-free check: count area by fine grid sampling of the triangle (Monte Carlo is too loose); use cross product independently
        const [[a, b], [c, d], [e, f]] = it._pts; const A = Math.abs((c - a) * (f - b) - (e - a) * (d - b)) / 2; return Math.abs(A - Number(it.a.value)) < 1e-9; }
      if (it._sq) { const f = it._sq[0]; return Math.abs(100 * (10 * f) ** 2 / 100 - 100 - Number(it.a.value)) < 1e-6; }
      return false;
    },
  },

  // ---------------- circles ----------------
  'pa.circle': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const rad = ri(r, 2, 15); return item(`A circle has radius ${rad}. What is its circumference? (Answer in terms of π, like 6pi.)`, { type: 'number', value: `${2 * rad}pi`, display: `$${2 * rad}\\pi$` }, `$C = 2\\pi r = ${2 * rad}\\pi$.`, ['$C = 2\\pi r$.'], { _n: 2 * Math.PI * rad, mis: { [`${rad * rad}pi`]: 'That\'s the area. Circumference is $2\\pi r$.' } }); }
      if (d === 2) { const dia = ri(r, 2, 14) * 2; return item(`A circle has diameter ${dia}. What is its area? (In terms of π.)`, { type: 'number', value: `${(dia / 2) ** 2}pi`, display: `$${(dia / 2) ** 2}\\pi$` }, `Radius ${dia / 2}, so $A = \\pi\\cdot ${dia / 2}^2 = ${(dia / 2) ** 2}\\pi$.`, ['Halve the diameter first.'], { _n: Math.PI * (dia / 2) ** 2, mis: { [`${dia * dia}pi`]: 'Use the radius, not the diameter.' } }); }
      if (d === 3) { const rad = ri(r, 2, 12); return item(`A circle has circumference $${2 * rad}\\pi$. What is its area? (In terms of π.)`, { type: 'number', value: `${rad * rad}pi`, display: `$${rad * rad}\\pi$` }, `$2\\pi r = ${2 * rad}\\pi$ gives $r = ${rad}$, so $A = ${rad * rad}\\pi$.`, ['Find the radius from the circumference.'], { _n: Math.PI * rad * rad }); }
      if (d === 4) { const R0 = ri(r, 4, 15), r0 = ri(r, 1, R0 - 1); return item(`A ring is the region between two circles with the same center, radii ${R0} and ${r0}. What is its area? (In terms of π.)`, { type: 'number', value: `${R0 * R0 - r0 * r0}pi`, display: `$${R0 * R0 - r0 * r0}\\pi$` }, `$\\pi\\cdot ${R0}^2 - \\pi\\cdot ${r0}^2 = ${R0 * R0 - r0 * r0}\\pi$.`, ['Big circle minus small circle.'], { _n: Math.PI * (R0 * R0 - r0 * r0) }); }
      const s = ri(r, 2, 10) * 2; return item(`A semicircle is drawn on each side of a square with side ${s}, outward. What is the perimeter of the whole flower-shaped figure? (In terms of π.)`, { type: 'number', value: `${2 * s}pi`, display: `$${2 * s}\\pi$` }, `The square's sides are inside the figure; the boundary is 4 semicircles of diameter ${s}: $4\\cdot\\frac12\\pi\\cdot ${s} = ${2 * s}\\pi$.`, ['Which edges are actually on the outside?'], { _n: 4 * 0.5 * Math.PI * s });
    },
    verify(it) { return Math.abs(it._n - Number(String(it.a.value).replace('pi', '')) * Math.PI) < 1e-9; },
  },

  // ---------------- Pythagorean theorem ----------------
  'pa.pyth': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
      if (d === 1) { const [a, b, c] = pick(r, triples); const k = ri(r, 1, 3); return item(`A right triangle has legs ${a * k} and ${b * k}. How long is the hypotenuse?`, { type: 'number', value: `${c * k}` }, `$\\sqrt{${a * k}^2 + ${b * k}^2} = \\sqrt{${(c * k) ** 2}} = ${c * k}$.`, ['$a^2 + b^2 = c^2$.'], { _h: [a * k, b * k] }); }
      if (d === 2) { const [a, b, c] = pick(r, triples); const k = ri(r, 1, 3); return item(`A right triangle has hypotenuse ${c * k} and one leg ${a * k}. How long is the other leg?`, { type: 'number', value: `${b * k}` }, `$\\sqrt{${c * k}^2 - ${a * k}^2} = ${b * k}$.`, ['Subtract the squares.'], { _l: [c * k, a * k] }); }
      if (d === 3) { let a, b, s, o, i; const simp = (n) => { let out = 1, inn = n; for (let k = 2; k * k <= inn; k++) while (inn % (k * k) === 0) { inn /= k * k; out *= k; } return [out, inn]; }; do { a = ri(r, 1, 9); b = ri(r, 1, 9); s = a * a + b * b; [o, i] = simp(s); } while (i === 1); return item(`A right triangle has legs ${a} and ${b}. Find the hypotenuse in simplest radical form (like 2sqrt(5)).`, { type: 'number', value: `${o === 1 ? '' : o}sqrt(${i})`, form: 'radical', display: `$${o === 1 ? '' : o}\\sqrt{${i}}$` }, `$\\sqrt{${a * a} + ${b * b}} = \\sqrt{${s}} = ${o === 1 ? '' : o}\\sqrt{${i}}$.`, ['Simplify the square root at the end.'], { _h: [a, b] }); }
      if (d === 4) { const t = pick(r, [0, 1]); const k = ri(r, 2, 12); if (t === 0) return item(`A 45-45-90 triangle has legs of length ${k}. How long is its hypotenuse? (Like 3sqrt(2).)`, { type: 'number', value: `${k}sqrt(2)`, form: 'radical', display: `$${k}\\sqrt{2}$` }, `The hypotenuse is $\\sqrt2$ times a leg: $${k}\\sqrt2$.`, ['Legs $x$, $x$; hypotenuse $x\\sqrt2$.'], { _h: [k, k] }); return item(`In a 30-60-90 triangle the hypotenuse is ${2 * k}. How long is the longer leg? (Like 3sqrt(3).)`, { type: 'number', value: `${k}sqrt(3)`, form: 'radical', display: `$${k}\\sqrt{3}$` }, `Sides are $x$, $x\\sqrt3$, $2x$ with $x = ${k}$: the longer leg is $${k}\\sqrt3$.`, ['It\'s half of an equilateral triangle.'], { _l: [2 * k, k] }); }
      const [a, b, c] = pick(r, [[1, 2, 2], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [6, 6, 7], [2, 10, 11]]); return item(`A box measures ${a} by ${b} by ${c}. How long is the diagonal from one corner to the opposite corner?`, { type: 'number', value: `${Math.sqrt(a * a + b * b + c * c)}` }, `Use Pythagoras twice: the floor diagonal is $\\sqrt{${a * a}+${b * b}}$, then $\\sqrt{${a * a}+${b * b}+${c * c}} = ${Math.sqrt(a * a + b * b + c * c)}$.`, ['First find the diagonal of the bottom face.'], { _3d: [a, b, c] });
    },
    verify(it) {
      const v = (s) => { const m = String(s).match(/^(\d*)sqrt\((\d+)\)$/); return m ? (m[1] ? Number(m[1]) : 1) * Math.sqrt(Number(m[2])) : Number(s); };
      if (it._h) return Math.abs(Math.hypot(...it._h) - v(it.a.value)) < 1e-9;
      if (it._l) { const [c, a] = it._l; return Math.abs(Math.sqrt(c * c - a * a) - v(it.a.value)) < 1e-9; }
      if (it._3d) return Math.abs(Math.hypot(...it._3d) - v(it.a.value)) < 1e-9;
      return false;
    },
  },

  // ---------------- statistics ----------------
  'pa.stats': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const list = (n, lo, hi) => Array.from({ length: n }, () => ri(r, lo, hi));
      if (d === 1) { let L; do { L = list(ri(r, 4, 6), 2, 30); } while (L.reduce((a, b) => a + b) % L.length); return item(`What is the mean of ${L.join(', ')}?`, { type: 'number', value: `${L.reduce((a, b) => a + b) / L.length}` }, `Sum ${L.reduce((a, b) => a + b)}, divided by ${L.length}: ${L.reduce((a, b) => a + b) / L.length}.`, ['Add them up and divide by how many.'], { _L: L, _k: 'mean' }); }
      if (d === 2) { const L = list(pick(r, [6, 7, 8]), 1, 40); const s = [...L].sort((a, b) => a - b); const m = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; return item(`What is the median of ${L.join(', ')}?`, { type: 'number', value: `${m}` }, `Sorted: ${s.join(', ')}. The median is ${m}${s.length % 2 ? '' : ' (the average of the two middle numbers)'}.`, ['Sort the list first.'], { _L: L, _k: 'median' }); }
      if (d === 3) { const n = ri(r, 4, 7), mean = ri(r, 10, 40); const L = list(n - 1, mean - 15, mean + 15); const x = mean * n - L.reduce((a, b) => a + b); if (x < 0) return this.make(r, d); return item(`The mean of ${n} numbers is ${mean}. Five${n - 1 === 5 ? '' : ''} of them are ${L.join(', ')}`.replace('Five', n - 1 === 5 ? 'Five' : n - 1 === 4 ? 'Four' : n - 1 === 3 ? 'Three' : 'Six') + `. What is the remaining number?`, { type: 'number', value: `${x}` }, `The total must be ${mean}·${n} = ${mean * n}. The known ones sum to ${L.reduce((a, b) => a + b)}, so the last is ${x}.`, ['mean × count = total.'], { _mm: [n, mean, L] }); }
      if (d === 4) { const n = ri(r, 5, 12), mean = ri(r, 70, 90), x = ri(r, 50, 100); const newMean = (n * mean + x) / (n + 1); if (!Number.isInteger(newMean * 10)) return this.make(r, d); return item(`The average of ${n} test scores is ${mean}. After one more test, the average of all ${n + 1} is ${newMean}. What was the new score?`, { type: 'number', value: `${x}` }, `New total ${n + 1}·${newMean} = ${(n + 1) * newMean}; old total ${n}·${mean} = ${n * mean}; difference ${x}.`, ['Work with totals, not averages.'], { _na: [n, mean, newMean] }); }
      const a = ri(r, 10, 30), b = ri(r, 10, 30), ma = ri(r, 60, 90), mb = ri(r, 60, 95); const m = (a * ma + b * mb) / (a + b); return item(`A class of ${a} students averaged ${ma} on a test and another class of ${b} averaged ${mb}. What was the average of all ${a + b} students? (A fraction is fine.)`, { type: 'number', value: frac(a * ma + b * mb, a + b) }, `Total points $${a}\\cdot ${ma} + ${b}\\cdot ${mb} = ${a * ma + b * mb}$, over ${a + b} students: $${tfrac(a * ma + b * mb, a + b)}$.`, ['The bigger class pulls the combined average toward its own.'], { _w: [a, ma, b, mb], mis: { [`${(ma + mb) / 2}`]: 'That treats both classes as the same size.' } });
    },
    verify(it) {
      if (it._k === 'mean') return Math.abs(it._L.reduce((a, b) => a + b) / it._L.length - Number(it.a.value)) < 1e-9;
      if (it._k === 'median') { const s = [...it._L].sort((a, b) => a - b); const n = s.length; const m = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; return Math.abs(m - Number(it.a.value)) < 1e-9; }
      if (it._mm) { const [n, mean, L] = it._mm; return (L.reduce((a, b) => a + b) + Number(it.a.value)) / n === mean; }
      if (it._na) { const [n, mean, nm] = it._na; return Math.abs((n * mean + Number(it.a.value)) / (n + 1) - nm) < 1e-9; }
      if (it._w) { const [a, ma, b, mb] = it._w; return Math.abs((a * ma + b * mb) / (a + b) - eval(it.a.value)) < 1e-9; }
      return false;
    },
  },

  // ---------------- counting I ----------------
  'pa.count1': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, 10, 200), b = a + ri(r, 20, 400); return item(`How many integers are in the list ${a}, ${a + 1}, ${a + 2}, …, ${b}?`, { type: 'number', value: `${b - a + 1}` }, `Subtract ${a - 1} from each to get 1, 2, …, ${b - a + 1}: there are ${b - a + 1}.`, ['Shift the list so it starts at 1.'], { _c: [a, b, 1], mis: { [`${b - a}`]: 'Off by one: both ends are included.' } }); }
      if (d === 2) { const k = ri(r, 3, 13), a = ri(r, 10, 100), b = a + ri(r, 50, 400); const c = Math.floor(b / k) - Math.floor((a - 1) / k); return item(`How many multiples of ${k} are between ${a} and ${b}, inclusive?`, { type: 'number', value: `${c}` }, `Multiples of ${k} up to ${b}: ${Math.floor(b / k)}. Up to ${a - 1}: ${Math.floor((a - 1) / k)}. Difference: ${c}.`, [`Count multiples of ${k} from 1 to ${b}, then remove those below ${a}.`], { _c: [a, b, k] }); }
      if (d === 3) { const s = ri(r, 3, 7), p = ri(r, 2, 6), h = ri(r, 2, 4); return item(`An outfit is one shirt, one pair of pants, and one hat. There are ${s} shirts, ${p} pairs of pants, and ${h} hats. How many outfits are possible?`, { type: 'number', value: `${s * p * h}` }, `Independent choices multiply: $${s}\\cdot ${p}\\cdot ${h} = ${s * p * h}$.`, ['Each shirt can go with each pair of pants…'], { _m: [s, p, h] }); }
      if (d === 4) { const kind = pick(r, [0, 1, 2]); const f = [(n) => /^[13579]+$/.test(String(n)), (n) => new Set(String(n)).size === 3, (n) => String(n).includes('7')][kind]; let c = 0; for (let n = 100; n <= 999; n++) if (f(n)) c++; return item(`How many three-digit numbers ${['have only odd digits', 'have three different digits', 'contain at least one digit 7'][kind]}?`, { type: 'number', value: `${c}` }, [`Each digit has 5 choices: $5^3 = 125$.`, `$9\\cdot 9\\cdot 8 = 648$ (first digit can't be 0; then 9 remaining; then 8).`, `Complement: all three-digit numbers (900) minus those with no 7 ($8\\cdot 9\\cdot 9 = 648$) gives 252.`][kind], ['Fill the digits one place at a time.', kind === 2 ? 'Count the opposite and subtract.' : 'Watch the hundreds digit: it can\'t be 0.'], { _k: kind }); }
      const a = pick(r, [3, 4]), b = pick(r, [5, 7]), n = pick(r, [100, 200, 300, 500]); let c = 0; for (let k = 1; k <= n; k++) if (k % a === 0 || k % b === 0) c++; return item(`How many integers from 1 to ${n} are divisible by ${a} or ${b} (or both)?`, { type: 'number', value: `${c}` }, `Multiples of ${a}: ${Math.floor(n / a)}. Of ${b}: ${Math.floor(n / b)}. Both are counted twice, so subtract multiples of ${a * b}: ${Math.floor(n / (a * b))}. Total ${c}.`, ['Add the two counts, then fix the double counting.'], { _ie: [a, b, n] });
    },
    verify(it) {
      if (it._c) { const [a, b, k] = it._c; let c = 0; for (let n = a; n <= b; n++) if (n % k === 0) c++; return c === Number(it.a.value); }
      if (it._m) return it._m.reduce((a, b) => a * b) === Number(it.a.value);
      if (it._k !== undefined) return [125, 648, 252][it._k] === Number(it.a.value);
      if (it._ie) { const [a, b, n] = it._ie; let c = 0; for (let k = 1; k <= n; k++) if (k % a === 0 || k % b === 0) c++; return c === Number(it.a.value); }
      return false;
    },
  },

  // ---------------- counting II ----------------
  'pa.count2': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
      if (d === 1) { const n = ri(r, 4, 20); return item(`${n} people are at a party and every two of them shake hands once. How many handshakes happen?`, { type: 'number', value: `${(n * (n - 1)) / 2}` }, `Each of the ${n} people shakes ${n - 1} hands, but that counts every handshake twice: $\\frac{${n}\\cdot ${n - 1}}{2} = ${(n * (n - 1)) / 2}$.`, ['Count from each person\'s point of view, then fix the double count.'], { _hs: n, mis: { [`${n * (n - 1)}`]: 'Each handshake involves two people, so that counts each one twice.' } }); }
      if (d === 2) { const s = ri(r, 3, 17); let c = 0; for (let n = 10; n <= 99; n++) if (Math.floor(n / 10) + (n % 10) === s) c++; return item(`How many two-digit numbers have digits that add up to ${s}?`, { type: 'number', value: `${c}` }, `Casework on the tens digit: each tens digit from ${Math.max(1, s - 9)} to ${Math.min(9, s)} gives exactly one ones digit. That's ${c}.`, ['Go through the tens digit one value at a time.'], { _ds: [2, s] }); }
      if (d === 3) { const w = pick(r, ['MATH', 'PRIME', 'ANGLE', 'CUBE', 'LOGIC', 'FRACTION'.slice(0, 6)]); return item(`How many different arrangements are there of the letters in the word ${w}? (All letters are different.)`, { type: 'number', value: `${fact(w.length)}` }, `${w.length} choices for the first spot, ${w.length - 1} for the second, …: $${w.length}! = ${fact(w.length)}$.`, ['Fill the positions one at a time.'], { _perm: w }); }
      if (d === 4) { const n = ri(r, 5, 12); return item(`A club has ${n} members. In how many ways can it choose a president and a vice-president (different people)?`, { type: 'number', value: `${n * (n - 1)}` }, `${n} choices for president, then ${n - 1} for vice-president: ${n * (n - 1)}. Order matters here, so no dividing by 2.`, ['Does swapping the two people give a different result?'], { _pv: n, mis: { [`${(n * (n - 1)) / 2}`]: 'Dividing by 2 would be right if the two jobs were the same; here they are different.' } }); }
      const s = ri(r, 4, 20); let c = 0; for (let n = 100; n <= 999; n++) if (String(n).split('').reduce((a, b) => a + +b, 0) === s) c++; return item(`How many three-digit numbers have digits that add up to ${s}?`, { type: 'number', value: `${c}` }, `Casework on the hundreds digit $h$: the last two digits must add to $${s} - h$; count those for each $h$ and add. Total ${c}.`, ['For each hundreds digit, count two-digit endings (00–99) with the right digit sum.'], { _ds: [3, s] });
    },
    verify(it) {
      const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
      if (it._hs) { let c = 0; for (let i = 0; i < it._hs; i++) for (let j = i + 1; j < it._hs; j++) c++; return c === Number(it.a.value); }
      if (it._ds) { const [len, s] = it._ds; let c = 0; for (let n = 10 ** (len - 1); n < 10 ** len; n++) if (String(n).split('').reduce((a, b) => a + +b, 0) === s) c++; return c === Number(it.a.value); }
      if (it._perm) return fact(it._perm.length) === Number(it.a.value) && new Set(it._perm).size === it._perm.length;
      if (it._pv) { let c = 0; for (let i = 0; i < it._pv; i++) for (let j = 0; j < it._pv; j++) if (i !== j) c++; return c === Number(it.a.value); }
      return false;
    },
  },

  // ---------------- probability ----------------
  'pa.prob': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const k = ri(r, 1, 5); return item(`A fair six-sided die is rolled. What is the probability of rolling a number greater than ${k}?`, { type: 'number', value: frac(6 - k, 6) }, `Favorable outcomes: ${6 - k} out of 6, so $${tfrac(6 - k, 6)}$.`, ['Count favorable outcomes over total outcomes.'], { _e: () => { let c = 0; for (let x = 1; x <= 6; x++) if (x > k) c++; return R(c, 6); } }); }
      if (d === 2) { const s = ri(r, 2, 12); let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === s) c++; return item(`Two fair dice are rolled. What is the probability that the sum is ${s}?`, { type: 'number', value: frac(c, 36) }, `Of the 36 equally likely pairs, ${c} add to ${s}: $${tfrac(c, 36)}$.`, ['There are 36 ordered outcomes; (1,2) and (2,1) are different.'], { _e: () => R(c, 36) }); }
      if (d === 3) { const n = ri(r, 3, 6), k = ri(r, 0, n); const C = (a, b) => { let x = 1; for (let i = 0; i < b; i++) x = (x * (a - i)) / (i + 1); return x; }; return item(`A fair coin is flipped ${n} times. What is the probability of getting exactly ${k} heads?`, { type: 'number', value: frac(C(n, k), 2 ** n) }, `There are $2^{${n}} = ${2 ** n}$ sequences; ${C(n, k)} of them have exactly ${k} heads (choose which flips are heads). Probability $${tfrac(C(n, k), 2 ** n)}$.`, ['How many sequences of H and T are there?', 'How many ways to choose which flips are heads?'], { _e: () => { let c = 0; for (let m = 0; m < 2 ** n; m++) if (m.toString(2).split('').filter((x) => x === '1').length === k) c++; return R(c, 2 ** n); } }); }
      if (d === 4) { const red = ri(r, 2, 6), blue = ri(r, 2, 6); const tot = red + blue; return item(`A bag has ${red} red and ${blue} blue marbles. Two are drawn without replacement. What is the probability both are red?`, { type: 'number', value: frac(red * (red - 1), tot * (tot - 1)) }, `$\\frac{${red}}{${tot}}\\cdot\\frac{${red - 1}}{${tot - 1}} = ${tfrac(red * (red - 1), tot * (tot - 1))}$.`, ['After the first red is drawn, how many reds and how many marbles are left?'], { _e: () => { let c = 0, t = 0; for (let i = 0; i < tot; i++) for (let j = 0; j < tot; j++) if (i !== j) { t++; if (i < red && j < red) c++; } return R(c, t); }, mis: { [frac(red * red, tot * tot)]: 'That\'s with replacement; the first marble stays out.' } }); }
      const n = pick(r, [2, 3]); return item(`${n === 2 ? 'Two' : 'Three'} fair dice are rolled. What is the probability that at least one shows a 6?`, { type: 'number', value: frac(6 ** n - 5 ** n, 6 ** n) }, `Complement: no sixes has probability $\\left(\\frac56\\right)^{${n}} = ${tfrac(5 ** n, 6 ** n)}$, so at least one six is $1 - ${tfrac(5 ** n, 6 ** n)} = ${tfrac(6 ** n - 5 ** n, 6 ** n)}$.`, ['"At least one" is often easiest through the complement.'], { _e: () => { let c = 0; const tot = 6 ** n; for (let m = 0; m < tot; m++) { let x = m, has = false; for (let i = 0; i < n; i++) { if (x % 6 === 5) has = true; x = Math.floor(x / 6); } if (has) c++; } return R(c, tot); }, mis: { [frac(n, 6)]: 'Adding $\\frac16$ for each die double-counts rolls with two sixes.' } });
    },
    verify(it) { return rEq(it._e(), it.a.value); },
  },

  // ---------------- strategies: patterns, sequences, working backwards ----------------
  'pa.strat': {
    levels: [1, 2, 3, 4, 5],
    make(r, d) {
      if (d === 1) { const a = ri(r, -10, 20), k = ri(r, 2, 9) * pick(r, [1, 1, -1]), n = ri(r, 10, 60); return item(`The sequence ${a}, ${a + k}, ${a + 2 * k}, ${a + 3 * k}, … continues the same way. What is the ${n}th term?`, { type: 'number', value: `${a + (n - 1) * k}` }, `The ${n}th term is the first term plus ${n - 1} steps of ${k}: $${a} + ${n - 1}\\cdot ${neg(k)} = ${a + (n - 1) * k}$.`, ['How many steps from the 1st term to the ' + n + 'th?'], { _seq: [a, k, n], mis: { [`${a + n * k}`]: `From term 1 to term ${n} there are only ${n - 1} steps.` } }); }
      if (d === 2) { const a = ri(r, 1, 20), k = ri(r, 2, 9), n = ri(r, 15, 80); const L = a + (n - 1) * k; return item(`How many numbers are in the list ${a}, ${a + k}, ${a + 2 * k}, …, ${L}?`, { type: 'number', value: `${n}` }, `$\\frac{${L} - ${a}}{${k}} + 1 = ${n}$.`, ['How many steps of ' + k + ' get from the first to the last? Then add 1.'], { _cnt: [a, k, L] }); }
      if (d === 3) { const b = pick(r, [2, 3, 7, 8, 9, 4]), e = ri(r, 20, 2026); return item(`What is the units digit of $${b}^{${e}}$?`, { type: 'number', value: `${Number(BigInt(b) ** BigInt(e) % 10n)}` }, `Units digits of powers of ${b} repeat: ${[1, 2, 3, 4].map((k) => (b ** k) % 10).join(', ')}, … with period ${[1, 2, 3, 4].find((p) => (b ** (1 + p)) % 10 === b % 10)}. Use the remainder of ${e} to find the spot: ${Number(BigInt(b) ** BigInt(e) % 10n)}.`, ['Write out the units digits of the first few powers.'], { _u: [b, e] }); }
      if (d === 4) { const x = ri(r, 2, 30), a = ri(r, 2, 6), b = ri(r, 1, 20), c = pick(r, [2, 3, 4, 5]); const y = a * x - b; if (y % c) return this.make(r, d); const out = y / c + 7; return item(`Lena thinks of a number. She multiplies it by ${a}, subtracts ${b}, divides by ${c}, then adds 7. She gets ${out}. What was her number?`, { type: 'number', value: `${x}` }, `Work backwards, undoing each step in reverse order: ${out} − 7 = ${out - 7}; × ${c} = ${(out - 7) * c}; + ${b} = ${(out - 7) * c + b}; ÷ ${a} = ${x}.`, ['Undo the last step first.'], { _wb: [a, b, c, out] }); }
      const n = ri(r, 10, 60); return item(`The dot patterns below grow by adding a new bottom row each time: 1 dot, then 3, then 6, then 10, … How many dots are in the ${n}th pattern?`, { type: 'number', value: `${(n * (n + 1)) / 2}` }, `The ${n}th pattern has $1 + 2 + \\cdots + ${n} = \\frac{${n}\\cdot ${n + 1}}{2} = ${(n * (n + 1)) / 2}$ dots (pair the first and last numbers).`, ['How many dots does each new row add?', 'Pair 1 with ' + n + ', 2 with ' + (n - 1) + ', …'], { _tri: n });
    },
    verify(it) {
      if (it._seq) { const [a, k, n] = it._seq; let t = a; for (let i = 1; i < n; i++) t += k; return t === Number(it.a.value); }
      if (it._cnt) { const [a, k, L] = it._cnt; let c = 0; for (let t = a; t <= L; t += k) c++; return c === Number(it.a.value); }
      if (it._u) { const [b, e] = it._u; let u = 1; for (let i = 0; i < e; i++) u = (u * b) % 10; return u === Number(it.a.value); }
      if (it._wb) { const [a, b, c, out] = it._wb; const x = Number(it.a.value); return (a * x - b) / c + 7 === out; }
      if (it._tri) { let s = 0; for (let i = 1; i <= it._tri; i++) s += i; return s === Number(it.a.value); }
      return false;
    },
  },
};

// fix the one generator level that needs a two-step build
const _wordMake = generators['pa.wordeq'].make;
generators['pa.wordeq'].make = function (r, d) {
  const it = _wordMake.call(this, r, d);
  if (!it._skip) return it;
  // Ana/Ben: a - k = 2(b + k) with a = b + lead
  for (let tries = 0; tries < 50; tries++) {
    const dist = ri(r, 2, 8), b = ri(r, 3, 20); const a = 2 * (b + dist) + dist; const lead = a - b;
    if (lead > 0) return item(`Ana has ${lead} more marbles than Ben. After Ana gives Ben ${dist} marbles, Ana has twice as many as Ben. How many marbles do they have together?`, { type: 'number', value: `${a + b}` }, `Let Ben have $b$, so Ana has $b + ${lead}$. After the gift: $b + ${lead} - ${dist} = 2(b + ${dist})$, so $b = ${b}$, Ana has ${a}, together ${a + b}.`, ['Write both amounts after the gift.'], { _f: (v) => { for (let bb = 0; bb < 200; bb++) { const aa = bb + lead; if (aa - dist === 2 * (bb + dist)) return v === aa + bb; } return false; } });
  }
  return _wordMake.call(this, r, 1);
};
