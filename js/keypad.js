// keypad.js — math answer entry built for iPad: an on-screen keypad (no system keyboard popping up),
// a live typeset preview of what was typed, and physical-keyboard support.
import { h, texEl, clear } from './util.js';
import { toLatex } from './mathcheck.js';

const KEYS = [
  ['7', '8', '9', '÷', '(', ')'],
  ['4', '5', '6', '×', '^', '√'],
  ['1', '2', '3', '−', 'x', 'π'],
  ['0', '.', ',', '+', 'y', '⌫'],
  ['space', '<', '>', '≤', '≥', '!'],
];
const INSERT = { '÷': '/', '×': '*', '−': '-', '√': '√(', 'π': 'π', space: ' ' };

export function answerBox({ type = 'number', onSubmit, placeholder = 'Your answer', vars = [] } = {}) {
  let value = '';
  const display = h('div.ans-display', { role: 'textbox', tabindex: '0', 'aria-label': 'Answer' });
  const preview = h('div.ans-preview', { 'aria-live': 'polite' });
  const extraVars = [...new Set(vars.filter((v) => !['x', 'y'].includes(v)))].slice(0, 3);
  const pad = h('div.keypad', { role: 'group', 'aria-label': 'Math keypad' },
    KEYS.map((row, ri) => h('div.kp-row', row.map((k) => {
      let label = k === 'space' ? '␣' : k;
      let key = k;
      if (ri === 3 && k === 'y' && extraVars[0]) { key = extraVars[0]; label = extraVars[0]; }
      return h('button.kp' + (k === '⌫' ? '.kp-back' : '') + (/[0-9.]/.test(k) ? '.kp-num' : ''), { type: 'button', 'aria-label': k === '⌫' ? 'Delete' : k === 'space' ? 'Space' : label, on: { click: () => press(key) } }, label);
    }))),
    h('div.kp-row', [
      h('button.kp.kp-wide', { type: 'button', on: { click: () => { value = ''; render(); } } }, 'Clear'),
      h('button.kp.kp-wide', { type: 'button', on: { click: toggleAbc } }, 'abc'),
    ]));
  const abc = h('input.abc-input', { type: 'text', autocapitalize: 'off', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Type with keyboard', on: { input: (e) => { value = e.target.value; render(); }, keydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); onSubmit && onSubmit(value); } } } });
  abc.style.display = 'none';
  function toggleAbc() { const on = abc.style.display === 'none'; abc.style.display = on ? 'block' : 'none'; if (on) { abc.value = value; abc.focus(); } }
  function press(k) {
    if (k === '⌫') value = value.slice(0, -1);
    else value += INSERT[k] ?? k;
    render();
  }
  function render() {
    clear(display);
    display.append(value ? h('span.ans-text', value.replace(/\*/g, '×').replace(/-/g, '−')) : h('span.ans-ph', placeholder), h('span.caret'));
    clear(preview);
    if (value) { const t = toLatex(value); if (t) preview.append(texEl(t)); else preview.append(h('span.muted', 'Keep typing…')); }
    if (abc.style.display !== 'none' && abc.value !== value) abc.value = value;
  }
  display.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); onSubmit && onSubmit(value); return; }
    if (e.key === 'Backspace') { e.preventDefault(); press('⌫'); return; }
    if (e.key.length === 1 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); value += e.key; render(); }
  });
  render();
  const root = h('div.answer-box', display, preview, abc, type === 'text' ? null : pad);
  return { el: root, get value() { return value; }, set value(v) { value = v; render(); }, focus() { display.focus(); }, disable() { root.classList.add('disabled'); } };
}

export function textBox({ placeholder = 'Write your answer', rows = 4 } = {}) {
  const ta = h('textarea.text-answer', { rows, placeholder });
  return { el: ta, get value() { return ta.value; }, set value(v) { ta.value = v; }, focus() { ta.focus(); }, disable() { ta.disabled = true; } };
}

export function choiceBox(options, { onPick } = {}) {
  let picked = null;
  const btns = options.map((o, i) => {
    const b = h('button.choice', { type: 'button', on: { click: () => { picked = i; btns.forEach((x) => x.classList.toggle('picked', x === b)); onPick && onPick(i); } } },
      h('span.choice-letter', String.fromCharCode(65 + i)), h('span.choice-text'));
    b.querySelector('.choice-text').innerHTML = window.__renderMd ? window.__renderMd(String(o), { inline: true }) : String(o);
    return b;
  });
  return { el: h('div.choices', btns), get value() { return picked === null ? '' : String(picked); }, disable() { btns.forEach((b) => (b.disabled = true)); }, mark(correct) { btns.forEach((b, i) => { if (i === correct) b.classList.add('right'); else if (i === picked) b.classList.add('wrong'); }); } };
}
