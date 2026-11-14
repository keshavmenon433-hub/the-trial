// scratch.js — Apple Pencil scratch paper and notebook drawing.
// Pressure-sensitive strokes; once a pencil is detected, finger touches scroll instead of drawing (palm rejection).
import { h } from './util.js';
import * as store from './store.js';

export function drawingPad({ key, height = 520, grid = true } = {}) {
  const canvas = h('canvas.pad-canvas');
  const wrap = h('div.pad' + (grid ? '.grid' : ''), canvas);
  const ctx = canvas.getContext('2d');
  let strokes = []; let cur = null; let penSeen = false; let tool = 'pen'; let dpr = window.devicePixelRatio || 1;
  let raf = 0;
  function size() {
    const w = wrap.clientWidth || 600; dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr; canvas.height = height * dpr; canvas.style.height = height + 'px'; canvas.style.width = w + 'px';
    redraw();
  }
  function seg(s, i) {
    const a = s.p[i - 1], b = s.p[i];
    ctx.lineWidth = (s.t === 'eraser' ? 22 : 1.2 + 2.6 * (b[2] || 0.5)) * dpr;
    ctx.strokeStyle = s.t === 'eraser' ? '#000' : s.c;
    ctx.globalCompositeOperation = s.t === 'eraser' ? 'destination-out' : 'source-over';
    ctx.beginPath(); ctx.moveTo(a[0] * dpr, a[1] * dpr); ctx.lineTo(b[0] * dpr, b[1] * dpr); ctx.stroke();
  }
  function redraw() { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const s of strokes) for (let i = 1; i < s.p.length; i++) seg(s, i); ctx.globalCompositeOperation = 'source-over'; }
  const pt = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top, e.pressure || 0.5]; };
  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    if (penSeen && e.pointerType === 'touch') return; // palm / finger: let it scroll
    e.preventDefault(); canvas.setPointerCapture(e.pointerId);
    cur = { t: tool, c: '#22262B', p: [pt(e)] }; strokes.push(cur);
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!cur) return; e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ce of evs) { cur.p.push(pt(ce)); const i = cur.p.length - 1; if (i > 0) { ctx.lineCap = 'round'; seg(cur, i); } }
    ctx.globalCompositeOperation = 'source-over';
  });
  const end = () => { if (!cur) return; cur = null; cancelAnimationFrame(raf); raf = requestAnimationFrame(save); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  canvas.style.touchAction = 'none';
  async function save() { if (key) await store.set('draw:' + key, strokes.map((s) => ({ t: s.t, c: s.c, p: s.p.map((q) => q.map((v) => Math.round(v * 10) / 10)) }))); }
  async function load() { if (!key) return; const s = await store.get('draw:' + key); if (Array.isArray(s)) { strokes = s; redraw(); } }
  const tools = h('div.pad-tools',
    h('button.chip', { type: 'button', on: { click: (e) => { tool = 'pen'; mark(e.target); } }, class: 'on' }, 'Pencil'),
    h('button.chip', { type: 'button', on: { click: (e) => { tool = 'eraser'; mark(e.target); } } }, 'Eraser'),
    h('button.chip', { type: 'button', on: { click: () => { strokes.pop(); redraw(); save(); } } }, 'Undo'),
    h('button.chip', { type: 'button', on: { click: () => { strokes = []; redraw(); save(); } } }, 'Clear'));
  function mark(btn) { tools.querySelectorAll('.chip').forEach((b) => b.classList.toggle('on', b === btn)); }
  const el = h('div.pad-wrap', tools, wrap);
  const ro = new ResizeObserver(() => size()); ro.observe(wrap);
  load();
  return { el, isEmpty: () => strokes.length === 0, snapshot: () => canvas.toDataURL('image/png') };
}

// a full-screen sheet of scratch paper for the current problem
export function openScratch(key) {
  const pad = drawingPad({ key: 'scratch:' + key, height: Math.max(420, window.innerHeight - 140) });
  const sheet = h('div.scratch-sheet', h('div.scratch-bar', h('strong', 'Scratch paper'), h('button.btn', { type: 'button', on: { click: () => sheet.remove() } }, 'Back to the problem')), pad.el);
  document.body.append(sheet);
}
