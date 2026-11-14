// store.js — on-device persistence (IndexedDB, with localStorage fallback).
// Everything works offline; sync.js mirrors to the family's cloud database when configured.

const DB = 'the-trial', OS = 'kv';
let dbp = null;
function db() {
  if (dbp) return dbp;
  dbp = new Promise((res) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(OS);
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch { res(null); }
  });
  return dbp;
}
export async function get(key) {
  const d = await db();
  if (!d) { try { const v = localStorage.getItem('tt:' + key); return v ? JSON.parse(v) : undefined; } catch { return undefined; } }
  return new Promise((res) => { const t = d.transaction(OS).objectStore(OS).get(key); t.onsuccess = () => res(t.result); t.onerror = () => res(undefined); });
}
export async function set(key, val) {
  const d = await db();
  if (!d) { try { localStorage.setItem('tt:' + key, JSON.stringify(val)); } catch {} return; }
  return new Promise((res) => { const tx = d.transaction(OS, 'readwrite'); tx.objectStore(OS).put(val, key); tx.oncomplete = () => res(); tx.onerror = () => res(); });
}
export async function del(key) {
  const d = await db(); if (!d) { try { localStorage.removeItem('tt:' + key); } catch {} return; }
  return new Promise((res) => { const tx = d.transaction(OS, 'readwrite'); tx.objectStore(OS).delete(key); tx.oncomplete = () => res(); });
}
export async function keys(prefix = '') {
  const d = await db(); if (!d) return Object.keys(localStorage).filter((k) => k.startsWith('tt:' + prefix)).map((k) => k.slice(3));
  return new Promise((res) => { const r = d.transaction(OS).objectStore(OS).getAllKeys(); r.onsuccess = () => res(r.result.filter((k) => String(k).startsWith(prefix))); r.onerror = () => res([]); });
}
// ask the browser not to evict our data (important on iPad home-screen apps)
export async function persist() { try { if (navigator.storage && navigator.storage.persist) return await navigator.storage.persist(); } catch {} return false; }

// a whole-device backup the parent can save, and restore from
export async function exportAll() { const out = {}; for (const k of await keys()) out[k] = await get(k); return out; }
export async function importAll(obj) { for (const [k, v] of Object.entries(obj || {})) await set(k, v); }
