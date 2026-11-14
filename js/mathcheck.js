// mathcheck.js — parses what the student types and decides whether it matches the answer.
// Exact rational arithmetic (BigInt) where possible so 1/3 and 0.333 are NOT treated as equal.
// Works in the browser and in Node (used by the verification tools).

// ---------- rationals ----------
const big = (x) => BigInt(x);
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; }
export class Q {
  constructor(n, d = 1n) {
    if (d === 0n) throw new Error('division by zero');
    if (d < 0n) { n = -n; d = -d; }
    const g = gcd(n, d) || 1n;
    this.n = n / g; this.d = d / g;
  }
  static of(v) { return v instanceof Q ? v : new Q(big(v)); }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Q(this.n * o.n, this.d * o.d); }
  div(o) { if (o.n === 0n) throw new Error('division by zero'); return new Q(this.n * o.d, this.d * o.n); }
  neg() { return new Q(-this.n, this.d); }
  isInt() { return this.d === 1n; }
  eq(o) { return this.n === o.n && this.d === o.d; }
  toNumber() { return Number(this.n) / Number(this.d); }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
function decimalToQ(s) {
  const neg = s.startsWith('-'); if (neg) s = s.slice(1);
  const [ip, fp = ''] = s.split('.');
  const n = big((ip || '0') + fp); const d = 10n ** big(fp.length);
  const q = new Q(n, d); return neg ? q.neg() : q;
}
function isqrtBig(n) { if (n < 0n) return null; if (n < 2n) return n; let x = big(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; }
function sqrtQ(q) { if (q.n < 0n) return null; const a = isqrtBig(q.n), b = isqrtBig(q.d); if (a * a === q.n && b * b === q.d) return new Q(a, b); return null; }

// value = Q (exact) or number (inexact)
const toNum = (v) => (v instanceof Q ? v.toNumber() : v);
function vop(a, b, op) {
  if (a instanceof Q && b instanceof Q) {
    if (op === '+') return a.add(b); if (op === '-') return a.sub(b); if (op === '*') return a.mul(b); if (op === '/') return a.div(b);
    if (op === '^') {
      if (b.isInt() && b.n <= 4000n && b.n >= -4000n) {
        let e = b.n, r = new Q(1n), base = a; const neg = e < 0n; if (neg) e = -e;
        while (e > 0n) { if (e & 1n) r = r.mul(base); base = base.mul(base); e >>= 1n; }
        return neg ? new Q(1n).div(r) : r;
      }
      if (b.eq(new Q(1n, 2n))) { const s = sqrtQ(a); if (s) return s; }
      return Math.pow(a.toNumber(), b.toNumber());
    }
  }
  const x = toNum(a), y = toNum(b);
  if (op === '+') return x + y; if (op === '-') return x - y; if (op === '*') return x * y;
  if (op === '/') { if (y === 0) throw new Error('division by zero'); return x / y; }
  if (op === '^') return Math.pow(x, y);
  throw new Error('bad op');
}

// ---------- tokenizer ----------
const FUNCS = new Set(['sqrt', 'abs', 'sin', 'cos', 'tan', 'ln', 'log', 'exp', 'cbrt']);
export function normalizeInput(s) {
  return String(s)
    .replace(/[−–—]/g, '-').replace(/[×·∙⋅]/g, '*').replace(/÷/g, '/')
    .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/∛/g, 'cbrt')
    .replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/≠/g, '!=')
    .replace(/²/g, '^2').replace(/³/g, '^3')
    .replace(/\s+/g, ' ').trim();
}
function tokenize(s) {
  const t = []; let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9.]/.test(c)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; const num = s.slice(i, j); if ((num.match(/\./g) || []).length > 1 || num === '.') throw new Error('bad number'); t.push({ k: 'num', v: num }); i = j; continue; }
    if (/[a-zA-Z]/.test(c)) {
      let j = i; while (j < s.length && /[a-zA-Z]/.test(s[j])) j++;
      let w = s.slice(i, j);
      // split words into known function names / pi / single-letter variables
      while (w.length) {
        const f = [...FUNCS, 'pi'].sort((a, b) => b.length - a.length).find((fn) => w.toLowerCase().startsWith(fn));
        if (f) { t.push(f === 'pi' ? { k: 'const', v: 'pi' } : { k: 'fn', v: f }); w = w.slice(f.length); }
        else { t.push({ k: 'var', v: w[0] }); w = w.slice(1); }
      }
      i = j; continue;
    }
    if ('+-*/^(),!'.includes(c)) { t.push({ k: 'op', v: c }); i++; continue; }
    if (c === '[' || c === '{') { t.push({ k: 'op', v: '(' }); i++; continue; }
    if (c === ']' || c === '}') { t.push({ k: 'op', v: ')' }); i++; continue; }
    throw new Error(`Unexpected "${c}"`);
  }
  return t;
}

// ---------- parser (recursive descent with implicit multiplication) ----------
export function parse(str) {
  const toks = tokenize(normalizeInput(str)); let p = 0;
  const peek = () => toks[p]; const next = () => toks[p++];
  const isOp = (v) => peek() && peek().k === 'op' && peek().v === v;
  const startsAtom = () => { const k = peek(); if (!k) return false; return k.k === 'num' || k.k === 'var' || k.k === 'const' || k.k === 'fn' || (k.k === 'op' && k.v === '('); };
  function expr() { let n = term(); while (isOp('+') || isOp('-')) { const op = next().v; n = { t: 'bin', op, a: n, b: term() }; } return n; }
  function term() {
    let n = unary();
    for (;;) {
      if (isOp('*') || isOp('/')) { const op = next().v; n = { t: 'bin', op, a: n, b: unary(), explicit: true }; }
      else if (startsAtom()) { n = { t: 'bin', op: '*', a: n, b: power(), implicit: true }; }
      else break;
    }
    return n;
  }
  function unary() { if (isOp('-')) { next(); return { t: 'neg', a: unary() }; } if (isOp('+')) { next(); return unary(); } return power(); }
  function power() { const base = postfix(); if (isOp('^')) { next(); return { t: 'bin', op: '^', a: base, b: unary() }; } return base; }
  function postfix() { let n = atom(); while (isOp('!')) { next(); n = { t: 'fact', a: n }; } return n; }
  function atom() {
    const k = next(); if (!k) throw new Error('Incomplete expression');
    if (k.k === 'num') return { t: 'num', v: k.v };
    if (k.k === 'var') return { t: 'var', v: k.v };
    if (k.k === 'const') return { t: 'const', v: k.v };
    if (k.k === 'fn') {
      let arg;
      if (isOp('(')) { next(); arg = expr(); if (!isOp(')')) throw new Error('Missing )'); next(); }
      else arg = power(); // sqrt3, sqrt 2x -> sqrt(3)
      return { t: 'fn', f: k.v, a: arg };
    }
    if (k.k === 'op' && k.v === '(') { const e = expr(); if (!isOp(')')) throw new Error('Missing )'); next(); return { t: 'paren', a: e }; }
    throw new Error(`Unexpected "${k.v}"`);
  }
  const tree = expr(); if (p < toks.length) throw new Error(`Unexpected "${toks[p].v}"`);
  return tree;
}

export function evaluate(node, env = {}) {
  switch (node.t) {
    case 'num': return node.v.includes('.') ? decimalToQ(node.v) : new Q(big(node.v));
    case 'var': if (!(node.v in env)) throw new Error(`Unknown variable ${node.v}`); return env[node.v];
    case 'const': return Math.PI;
    case 'paren': return evaluate(node.a, env);
    case 'neg': { const v = evaluate(node.a, env); return v instanceof Q ? v.neg() : -v; }
    case 'fact': { const v = evaluate(node.a, env); if (!(v instanceof Q) || !v.isInt() || v.n < 0n || v.n > 170n) throw new Error('bad factorial'); let r = 1n; for (let i = 2n; i <= v.n; i++) r *= i; return new Q(r); }
    case 'bin': return vop(evaluate(node.a, env), evaluate(node.b, env), node.op);
    case 'fn': {
      const v = evaluate(node.a, env);
      if (node.f === 'sqrt') { if (v instanceof Q) { const s = sqrtQ(v); if (s) return s; } const x = toNum(v); if (x < 0) throw new Error('sqrt of negative'); return Math.sqrt(x); }
      if (node.f === 'abs') return v instanceof Q ? (v.n < 0n ? v.neg() : v) : Math.abs(v);
      if (node.f === 'cbrt') return Math.cbrt(toNum(v));
      const x = toNum(v);
      return { sin: Math.sin, cos: Math.cos, tan: Math.tan, ln: Math.log, log: Math.log10, exp: Math.exp }[node.f](x);
    }
  }
  throw new Error('bad node');
}

export function variablesOf(node, acc = new Set()) {
  if (!node) return acc;
  if (node.t === 'var') acc.add(node.v);
  for (const k of ['a', 'b']) if (node[k]) variablesOf(node[k], acc);
  return acc;
}

function close(x, y) { if (!isFinite(x) || !isFinite(y)) return false; return Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y)); }
export function valuesEqual(a, b) { if (a instanceof Q && b instanceof Q) return a.eq(b); return close(toNum(a), toNum(b)); }

// mixed numbers "2 1/3" or "-2 1/3"
const MIXED = /^\s*(-?)\s*(\d+)\s+(\d+)\s*\/\s*(\d+)\s*$/;
export function parseNumberish(str) {
  const s = normalizeInput(str);
  const m = s.match(MIXED);
  if (m) { const v = new Q(big(m[2])).add(new Q(big(m[3]), big(m[4]))); return { value: m[1] ? v.neg() : v, mixed: true, tree: null }; }
  const tree = parse(s); const vars = variablesOf(tree);
  if (vars.size) throw new Error('Enter a number, not an expression with letters');
  return { value: evaluate(tree), mixed: false, tree };
}

// ---------- form checks ----------
function isSimpleFractionTree(t) {
  // integer, -integer, a/b, -a/b, -(a/b)
  if (!t) return true;
  if (t.t === 'num') return !t.v.includes('.');
  if (t.t === 'neg') return isSimpleFractionTree(t.a);
  if (t.t === 'paren') return isSimpleFractionTree(t.a);
  if (t.t === 'bin' && t.op === '/') { const a = t.a.t === 'neg' ? t.a.a : t.a; return a.t === 'num' && t.b.t === 'num' && !a.v.includes('.') && !t.b.v.includes('.'); }
  return false;
}
function fractionInLowestTerms(t) {
  if (t.t === 'neg' || t.t === 'paren') return fractionInLowestTerms(t.a);
  if (t.t === 'bin' && t.op === '/') { const a = big((t.a.t === 'neg' ? t.a.a : t.a).v), b = big(t.b.v); return gcd(a, b) === 1n && b !== 1n; }
  return true;
}

// polynomial normal form for "simplified" checks: map monomial -> coefficient
function polyOf(node) {
  // returns Map<string, Q> or null if not polynomial with rational coefficients
  const mono = (vars) => Object.keys(vars).filter((k) => vars[k]).sort().map((k) => `${k}^${vars[k]}`).join('*');
  const P = (m) => m;
  function rec(n) {
    switch (n.t) {
      case 'num': return P(new Map([['', n.v.includes('.') ? decimalToQ(n.v) : new Q(big(n.v))]]));
      case 'var': return P(new Map([[`${n.v}^1`, new Q(1n)]]));
      case 'paren': return rec(n.a);
      case 'neg': { const a = rec(n.a); if (!a) return null; const r = new Map(); for (const [k, v] of a) r.set(k, v.neg()); return r; }
      case 'bin': {
        const a = rec(n.a), b = rec(n.b); if (!a || !b) return null;
        if (n.op === '+' || n.op === '-') { const r = new Map(a); for (const [k, v] of b) { const cur = r.get(k) || new Q(0n); r.set(k, n.op === '+' ? cur.add(v) : cur.sub(v)); } return r; }
        if (n.op === '*') { const r = new Map(); for (const [ka, va] of a) for (const [kb, vb] of b) { const vars = {}; for (const part of [ka, kb]) for (const f of part.split('*').filter(Boolean)) { const [x, e] = f.split('^'); vars[x] = (vars[x] || 0) + Number(e); } const k = mono(vars); r.set(k, (r.get(k) || new Q(0n)).add(va.mul(vb))); } return r; }
        if (n.op === '/') { if (b.size !== 1 || !b.has('')) return null; const d = b.get(''); if (d.n === 0n) return null; const r = new Map(); for (const [k, v] of a) r.set(k, v.div(d)); return r; }
        if (n.op === '^') { if (b.size !== 1 || !b.has('')) return null; const e = b.get(''); if (!e.isInt() || e.n < 0n || e.n > 12n) return null; let r = new Map([['', new Q(1n)]]); for (let i = 0n; i < e.n; i++) r = rec({ t: 'bin', op: '*', a: { t: '__p', p: r }, b: n.a }); return r; }
        return null;
      }
      case '__p': return n.p;
      default: return null;
    }
  }
  const r = rec(node); if (!r) return null;
  for (const [k, v] of [...r]) if (v.n === 0n) r.delete(k);
  return r;
}
function topTerms(node) { if (node.t === 'bin' && (node.op === '+' || node.op === '-')) return [...topTerms(node.a), ...topTerms(node.b)]; return [node]; }
function containsParenOrNestedProduct(node) {
  if (node.t === 'paren') return true;
  return ['a', 'b'].some((k) => node[k] && containsParenOrNestedProduct(node[k]));
}
function termIsClean(term) {
  // a clean term: optional minus, at most one numeric coefficient, each variable at most once
  let n = term; if (n.t === 'neg') n = n.a;
  const factors = []; const walk = (x) => { if (x.t === 'bin' && (x.op === '*')) { walk(x.a); walk(x.b); } else factors.push(x); };
  walk(n);
  let nums = 0; const seen = new Set();
  for (let f of factors) {
    if (f.t === 'neg' && (f.a.t === 'num' || f.a.t === 'var')) f = f.a;
    if (f.t === 'num') { nums++; continue; }
    if (f.t === 'bin' && f.op === '/' && f.a.t === 'num' && f.b.t === 'num') { nums++; continue; }
    const base = f.t === 'bin' && f.op === '^' ? f.a : f;
    if (base.t !== 'var') return false;
    if (seen.has(base.v)) return false; seen.add(base.v);
  }
  return nums <= 1;
}

// ---------- the checker ----------
// answer spec: {type:'number'|'expr'|'list'|'choice'|'ineq'|'text', value, form?, tol?, vars?, ordered?}
export function check(spec, raw) {
  const out = (ok, msg, extra = {}) => ({ ok, msg, ...extra });
  if (raw === undefined || raw === null || String(raw).trim() === '') return out(false, 'Enter an answer first.', { empty: true });
  try {
    if (spec.type === 'choice') return out(Number(raw) === Number(spec.value));
    if (spec.type === 'text') return out(null, 'Compare your answer with the model answer.', { selfCheck: true });

    if (spec.type === 'number') {
      const exp = parseNumberish(String(spec.value)).value;
      let got;
      try { got = parseNumberish(raw); } catch (e) { return out(false, e.message, { parseError: true }); }
      if (spec.tol !== undefined) { const ok = Math.abs(toNum(got.value) - toNum(exp)) <= spec.tol + 1e-12; return out(ok); }
      if (!valuesEqual(got.value, exp)) return out(false);
      const f = spec.form;
      if (f === 'integer' && !(got.value instanceof Q && got.value.isInt() && got.tree && got.tree.t !== 'bin')) return out(false, 'Right value — now write it as a whole number.', { formError: true });
      if (f === 'simplest') {
        if (got.mixed) return out(false, 'Right value — write it as a single fraction in lowest terms (not a mixed number).', { formError: true });
        if (!isSimpleFractionTree(got.tree) || !fractionInLowestTerms(got.tree)) return out(false, 'Right value — now write it as a fraction in lowest terms (or a whole number).', { formError: true });
      }
      if (f === 'mixed') {
        const v = got.value; const absv = v instanceof Q ? (v.n < 0n ? v.neg() : v) : null;
        if (absv && !absv.isInt() && absv.n > absv.d && !got.mixed) return out(false, 'Right value — write it as a mixed number, like 2 1/3.', { formError: true });
        if (got.mixed) { const m = normalizeInput(raw).match(MIXED); if (gcd(big(m[3]), big(m[4])) !== 1n || big(m[3]) >= big(m[4])) return out(false, 'Right value — the fraction part should be proper and in lowest terms.', { formError: true }); }
      }
      if (f === 'decimal' && /\//.test(normalizeInput(raw))) return out(false, 'Right value — write it as a decimal.', { formError: true });
      if (f === 'primefact') { // a product of primes (powers allowed), e.g. 2^3*3*5
        const isPrime = (n) => { if (n < 2n) return false; for (let k = 2n; k * k <= n; k++) if (n % k === 0n) return false; return true; };
        const ok = (t) => { if (t.t === 'num') return !t.v.includes('.') && isPrime(big(t.v)); if (t.t === 'paren') return ok(t.a); if (t.t === 'bin' && t.op === '*') return ok(t.a) && ok(t.b); if (t.t === 'bin' && t.op === '^') return (t.a.t === 'num' && isPrime(big(t.a.v))) && t.b.t === 'num'; return false; };
        if (!got.tree || !ok(got.tree)) return out(false, 'Right value — now write it as a product of primes, like 2^3*3*5.', { formError: true });
      }
      if (f === 'radical') { // simplest radical form: no perfect-square factor left under sqrt
        const s = normalizeInput(raw); const ms = [...s.matchAll(/sqrt\(?(\d+)\)?/g)];
        for (const m of ms) { const r = Number(m[1]); for (let k = 2; k * k <= r; k++) if (r % (k * k) === 0) return out(false, `Right value — but ${k * k} still divides the number under the root. Simplify it.`, { formError: true }); }
        if (/\/\s*sqrt/.test(s)) return out(false, 'Right value — rationalize the denominator.', { formError: true });
      }
      return out(true);
    }

    if (spec.type === 'expr') {
      const et = parse(String(spec.value)); let gt;
      try { gt = parse(raw); } catch (e) { return out(false, e.message, { parseError: true }); }
      const vars = new Set([...variablesOf(et), ...(spec.vars || [])]);
      const gv = variablesOf(gt);
      for (const v of gv) if (!vars.has(v)) return out(false, `Your answer uses "${v}", which isn't in this problem.`);
      // compare at random points (deterministic seeds)
      const pts = [[0.37, 1.13, -0.71], [2.3, -1.7, 0.53], [-1.37, 0.81, 3.1], [3.71, 2.17, -2.3], [-2.9, -0.43, 1.9]];
      const names = [...vars];
      for (const pt of pts) {
        const env = {}; names.forEach((nm, i) => { env[nm] = pt[i % 3] + i * 0.173; });
        let a, b; try { a = toNum(evaluate(et, env)); } catch { continue; }
        try { b = toNum(evaluate(gt, env)); } catch { return out(false); }
        if (!close(a, b)) return out(false);
      }
      if (spec.form === 'simplified') {
        const poly = polyOf(gt);
        if (poly) {
          const terms = topTerms(gt);
          if (terms.length !== Math.max(1, poly.size) || containsParenOrNestedProduct(gt) || !terms.every(termIsClean)) return out(false, 'Equivalent — now combine like terms and simplify fully.', { formError: true });
        }
      }
      if (spec.form === 'factored') {
        if (!(gt.t === 'bin' && gt.op === '*') && gt.t !== 'neg') return out(false, 'Equivalent — now write it as a product (factored form).', { formError: true });
      }
      return out(true);
    }

    if (spec.type === 'list') {
      const split = (s) => normalizeInput(s).replace(/^\(|\)$/g, '').split(/[,;]/).map((x) => x.trim()).filter(Boolean);
      const exp = split(String(spec.value)).map((x) => parseNumberish(x).value);
      let got; try { got = split(raw).map((x) => parseNumberish(x).value); } catch (e) { return out(false, e.message, { parseError: true }); }
      if (got.length !== exp.length) return out(false, got.length < exp.length ? `Expected ${exp.length} values.` : 'Too many values.');
      if (spec.ordered) return out(exp.every((v, i) => valuesEqual(v, got[i])));
      const used = new Array(got.length).fill(false);
      for (const v of exp) { const j = got.findIndex((g, i) => !used[i] && valuesEqual(g, v)); if (j < 0) return out(false); used[j] = true; }
      return out(true);
    }

    if (spec.type === 'ineq') {
      const P = (s) => {
        s = normalizeInput(s).replace(/\s/g, '');
        const m = s.match(/^([a-z])(<=|>=|<|>)(.+)$/) || s.match(/^(.+?)(<=|>=|<|>)([a-z])$/);
        if (!m) throw new Error('Write it like x > 3 or x <= -2');
        let v, op, rhs;
        if (/^[a-z]$/.test(m[1])) { v = m[1]; op = m[2]; rhs = m[3]; }
        else { v = m[3]; rhs = m[1]; op = { '<': '>', '>': '<', '<=': '>=', '>=': '<=' }[m[2]]; }
        return { v, op, val: parseNumberish(rhs).value };
      };
      const e = P(String(spec.value)); let g; try { g = P(raw); } catch (er) { return out(false, er.message, { parseError: true }); }
      return out(e.v === g.v && e.op === g.op && valuesEqual(e.val, g.val));
    }
  } catch (e) {
    return out(false, e.message || 'Could not read that answer.', { parseError: true });
  }
  return out(false, 'Unknown answer type');
}

// ---------- pretty preview: typed text -> LaTeX ----------
export function toLatex(raw) {
  try {
    const s = normalizeInput(raw);
    if (!s) return '';
    const m = s.match(MIXED); if (m) return `${m[1]}${m[2]}\\tfrac{${m[3]}}{${m[4]}}`;
    const ineq = s.match(/^(.*?)(<=|>=|<|>|=|!=)(.*)$/);
    if (ineq) return `${toLatex(ineq[1])} ${{ '<=': '\\le', '>=': '\\ge', '<': '<', '>': '>', '=': '=', '!=': '\\ne' }[ineq[2]]} ${toLatex(ineq[3])}`;
    if (s.includes(',')) return s.split(',').map((x) => toLatex(x)).join(',\\ ');
    return tex(parse(s));
  } catch { return null; }
}
function tex(n) {
  switch (n.t) {
    case 'num': return n.v; case 'var': return n.v; case 'const': return '\\pi';
    case 'paren': return `\\left(${tex(n.a)}\\right)`;
    case 'neg': return `-${tex(n.a)}`;
    case 'fact': return `${tex(n.a)}!`;
    case 'fn': return n.f === 'sqrt' ? `\\sqrt{${tex(n.a)}}` : n.f === 'cbrt' ? `\\sqrt[3]{${tex(n.a)}}` : n.f === 'abs' ? `\\left|${tex(n.a)}\\right|` : `\\${n.f}\\left(${tex(n.a)}\\right)`;
    case 'bin':
      if (n.op === '/') return `\\frac{${tex(strip(n.a))}}{${tex(strip(n.b))}}`;
      if (n.op === '^') return `{${tex(n.a)}}^{${tex(strip(n.b))}}`;
      if (n.op === '*') return n.implicit ? `${tex(n.a)}${tex(n.b)}` : `${tex(n.a)}\\cdot ${tex(n.b)}`;
      return `${tex(n.a)} ${n.op} ${tex(n.b)}`;
  }
  return '';
}
const strip = (n) => (n.t === 'paren' ? n.a : n);
