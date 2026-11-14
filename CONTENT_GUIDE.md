# The Trial — content guide

This is the instruction set for writing each month's content pack. Every scheduled content run follows it, and so does anyone fixing a lesson by hand. The app never changes between months; only `content/` does.

## What a month contains

A month is 28 days (`m01` = days 1–28, `m02` = days 29–56, …). `content/course.json` (built by `tools/build_course.mjs`) lists every session, its type, title, unit, skills, book reference, and pack. For the month being written:

- **Lesson days** (`type: "lesson"`): one session file each, written by hand following the template below.
- **Weekly Trials, mastery exams, benchmarks**: no session file needed. The app assembles them from generators and the bank. A **benchmark** day needs 25 `use: "benchmark"` bank problems with `session: "dNNN"`.
- **`gen.js`**: a generator for every skill introduced this month (see below).
- **`bank`**: about 25 contest-style problems (`use: "contest"`) across the month's skills, plus the benchmark set when the month has a benchmark day. Every lesson's challenge problems are added to the bank automatically.

Source files live in `content-src/mNN_w1.mjs … mNN_w4.mjs` (each exports `days`, optionally `bank` and `benchmark`). `tools/build_pack.mjs` turns them into `content/packs/mNN/`.

## Rules that are never broken

1. **Original problems only.** Never copy text, examples, or problems from any book (including the AoPS books), and never reproduce problems from real competitions (AMC, AIME, MATHCOUNTS, AP exams). Write new problems *in the style of* those sources. Books are referenced only by **chapter/section number** in the `book` field (see `book_refs.json`), so the student works from his own copy.
2. **Every answer is verified twice** before release: by code and by an independent blind solve (pipeline below). A pack that fails either is not published.
3. **One day is about 120 minutes**: warm-up 15, discover 10, learn 30, practice 35, challenge 20, exit 7, reflect 3. Lessons longer than that get split; don't compress by skipping the opener or the examples.
4. **Mastery before pace.** Never weaken a mastery exam or a rebuild to keep the calendar.

## Lesson template (one session file)

```js
{ id: 'd029',
  discover: { intro: md, problem: { q, a, sol } },          // productive failure: solvable-ish before teaching
  learn: { sections: [ ... ], summary: [md, md, md] },       // 3-line summary
  practice: { items: [ ... ] },                              // 2–4 hand-written conceptual items (generators do the rest)
  challenge: { items: [ ... ] },                             // 3 non-routine problems, d 4–5, dok 3
  reteach: [ sections ],                                     // a SECOND explanation from a different angle (used on rebuild days)
  cards: [ { id, front, back } ],                            // 2–4 facts for spaced retrieval
  book: { ref, assign },                                     // chapter/section numbers only
}
```

Section types, and what each is for (cite in this order of priority):

| type | purpose (research basis) |
|---|---|
| `debrief` | returns to the opening problem and contrasts attempts (productive failure, Sinha & Kapur 2021) |
| `md` | short explanatory prose; concrete before abstract; one idea at a time |
| `key` | the rule or fact to remember, with *why* it is true |
| `svg` | a diagram next to the words it explains (dual coding; IES 2007 rec. 3) |
| `example` | worked example, revealed step by step; `ask`/`why` steps prompt self-explanation (Bisra et al. 2018); `fade` steps make the student produce the step (Renkl & Atkinson) |
| `check` | a quick problem right after an idea (retrieval, formative feedback) |
| `mistake` | an incorrect worked example: find the error (IES algebra guide 2015, rec. 1) |
| `compare` | two correct strategies side by side (IES algebra guide rec. 3) |
| `explain` | student writes an explanation, then sees a model one |

Each lesson has: 1 debrief, 3–6 md/key, 2–3 examples (at least one with `ask` and one with `fade`), 2–3 checks, 1 mistake, 1 explain, ideally 1 compare and 1 svg where the topic is visual.

### Problem object

```js
{ id: 'd029-c1', skill: 'al.lin', d: 3, dok: 2,
  q: md, a: { type, value, form?, display?, options? }, sol: md,
  hints: [md, md], mis: { 'wrong answer': 'targeted feedback' }, explain?: 'prompt after a correct answer' }
```

- `d` 1–5 maps to the model's difficulty scale (1 routine … 5 hard contest). `dok` is Webb's Depth of Knowledge (3+ counts toward the problem-solving rating).
- Answer types: `number` (exact value; `form`: `simplest`, `mixed`, `integer`, `decimal`, `radical`, `primefact`), `expr` (`form: 'simplified'|'factored'`), `list` (`ordered`), `ineq`, `choice` (0-based `value`), `text` (self-checked against `value`).
- Write answers in the checker's syntax: `7/12`, `2sqrt(13)`, `12pi`, `144-36pi`, `x<=-5`. Prompts must tell the student the format when it isn't obvious ("in terms of π", "like 2sqrt(5)").
- Add `mis` entries for the two or three most predictable wrong answers.

## Generators (`gen.js`)

Every skill id in the month needs a generator: `{ levels: [1..5], make(rng, d) → problem, verify(problem) → boolean }`. `verify` must re-derive the answer **a different way** (brute force, substitution, exact rational arithmetic), never by repeating the generator's own formula. Generators carry the adaptive practice, warm-ups, exits, Trials, and mastery exams, so they matter more than any single lesson.

Skill ids follow the course map (`al.*`, `cp.*`, `ge.*`, …). If a lesson needs a skill id the map doesn't have, add it to `tools/build_course.mjs` and rebuild the map. Never rename an existing skill id: the student's history is keyed by it.

## Pipeline for a month

```bash
npm install
node tools/build_course.mjs
node tools/verify_generators.mjs mNN 400      # every generated problem checked independently; must be 100%
node tools/build_pack.mjs mNN mNN_w1.mjs mNN_w2.mjs mNN_w3.mjs mNN_w4.mjs
node tools/check_content.mjs mNN              # structure, math typesetting, answers accepted by the checker
node tools/export_blind.mjs mNN               # writes verify/problems.json (no answers) + verify/key.json
```

Then give **only** `verify/problems.json` to a separate agent that has not seen the content, and ask it to solve every problem blind into `verify/answers.json` (format described in `tools/export_blind.mjs`'s header) and list concerns. Run `node tools/compare_blind.mjs`: every disagreement must be resolved (fix the problem, or confirm the key with a third method) and every concern addressed. Re-run all checks after fixes, then commit with a message listing what was verified, and push. GitHub Pages republishes in about a minute and the iPad picks the pack up on its next launch.

## Reported problems

When the student reports a question, the parent sees it in the dashboard. Those reports reach the content pipeline when the parent pastes them into the conversation (the cloud runs can't read the family database). Fix the item in `content-src/`, rebuild, re-verify, push.
