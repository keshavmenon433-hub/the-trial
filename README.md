# The Trial

A one-year, about-two-hours-a-day math course for an iPad: from the first page of pre-algebra to AP Calculus BC, with contest problem-solving throughout. It runs in Safari, saved to the home screen, and works offline.

## What's here

| Path | What it is |
|---|---|
| `index.html`, `js/`, `css/`, `vendor/` | The app (no build step). |
| `js/engine.js` | The student model: skill ratings, memory model, Trial Score, pacing, alerts. |
| `content/course.json` | The 365-day map: units, skills, sessions, book references. |
| `content/packs/m01/` | Month 1 (Pre-Algebra): 23 lessons, 27 problem generators, contest bank, Benchmark 1. |
| `content-src/` | Source for the content packs (original lessons and problems). |
| `tools/` | Builders and verifiers. See `CONTENT_GUIDE.md`. |

## Putting it on the iPad

1. Host this folder on any static web host (GitHub Pages is free: Settings → Pages → deploy from the `main` branch, root folder).
2. On the iPad, open the site in Safari → Share → **Add to Home Screen**. Open The Trial from the home screen from then on.
3. First launch: enter the student's name, Day 1, and a parent PIN.

## Parent dashboard and phone alerts

- **On the iPad:** tap **Parent** and enter the PIN. Works with no setup at all.
- **Live on your phone:** open the site on your phone → **Set up sync** (or `#/sync-setup`) and follow the four steps (a free Firebase project you own; about 20 minutes). It gives you a link to open once on the iPad, and an ntfy topic: install the free **ntfy** app and subscribe to that topic for push alerts.

## Checking content

```bash
npm install
node tools/test_mathcheck.mjs
node tools/verify_generators.mjs m01 400
node tools/check_content.mjs m01
```
