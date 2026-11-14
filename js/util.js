// util.js — tiny DOM + rendering helpers shared by every screen.

// h('div.class#id', {attrs, on:{click}}, ...children)
export function h(tag, attrs, ...kids) {
  const m = tag.match(/^([a-z0-9]+)?([.#][^\s]*)?$/i);
  const el = document.createElement((m && m[1]) || 'div');
  if (m && m[2]) for (const part of m[2].match(/[.#][^.#]+/g) || []) { if (part[0] === '.') el.classList.add(part.slice(1)); else el.id = part.slice(1); }
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'on') { for (const [ev, fn] of Object.entries(v)) el.addEventListener(ev, fn); }
    else if (k === 'html') el.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'class') el.className += ' ' + v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) { if (k === null || k === undefined || k === false) continue; el.append(k instanceof Node ? k : document.createTextNode(String(k))); }
  return el;
}
export const $ = (sel, root = document) => root.querySelector(sel);
export function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }

// ---- markdown + math ----
// Math is pulled out before markdown runs so underscores and asterisks in TeX survive.
export function renderMd(md, { inline = false } = {}) {
  if (!md) return '';
  const store = [];
  let src = String(md)
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => { store.push({ t, d: true }); return `@@M${store.length - 1}@@`; })
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, t) => { store.push({ t, d: true }); return `@@M${store.length - 1}@@`; })
    .replace(/(^|[^\\$])\$([^$\n]+?)\$/g, (_, pre, t) => { store.push({ t, d: false }); return `${pre}@@M${store.length - 1}@@`; });
  const marked = window.marked;
  let html = marked ? (inline ? marked.parseInline(src) : marked.parse(src)) : src.replace(/\n\n/g, '<br><br>');
  html = html.replace(/@@M(\d+)@@/g, (_, i) => {
    const { t, d } = store[Number(i)];
    try { return window.katex.renderToString(t, { displayMode: d, throwOnError: false, strict: 'ignore' }); }
    catch { return `<code>${t}</code>`; }
  });
  return html;
}
export function mdEl(tag, md, opts) { const el = h(tag); el.innerHTML = renderMd(md, opts); return el; }
export function texEl(tex, display = false) { const el = h(display ? 'div' : 'span'); try { window.katex.render(tex, el, { displayMode: display, throwOnError: false }); } catch { el.textContent = tex; } return el; }

// ---- misc ----
export const fmtMin = (sec) => { const m = Math.floor(sec / 60), s = Math.floor(sec % 60); return `${m}:${String(s).padStart(2, '0')}`; };
export function shuffle(a, rng = Math.random) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export function seeded(seed) { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
export function hashStr(str) { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
export function toast(msg, kind = '') {
  const t = h('div.toast' + (kind ? '.' + kind : ''), msg); document.body.append(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2600);
}
export function modal(title, body, actions = []) {
  return new Promise((resolve) => {
    const close = (v) => { wrap.remove(); resolve(v); };
    const wrap = h('div.modal-wrap', { on: { click: (e) => { if (e.target === wrap) close(null); } } },
      h('div.modal', { role: 'dialog', 'aria-modal': 'true' },
        h('h3', title), body instanceof Node ? body : h('p', body),
        h('div.modal-actions', actions.map((a) => h('button.btn' + (a.primary ? '.primary' : ''), { on: { click: () => close(a.value) } }, a.label)))));
    document.body.append(wrap);
  });
}
