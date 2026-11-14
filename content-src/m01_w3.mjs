// Month 1, week 3 lessons (days 15–20). Original content written for The Trial.
const M = String.raw;
const num = (v, extra = {}) => ({ type: 'number', value: String(v), ...extra });
const choice = (options, value) => ({ type: 'choice', options, value });
const rad = (v, display) => ({ type: 'number', value: v, form: 'radical', display });
const S = (body, w = 320, h = 200) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" xmlns="http://www.w3.org/2000/svg" font-family="Georgia, serif" font-size="15" fill="none" stroke="#22262B" stroke-width="2">${body}</svg>`;
const T = (x, y, t, a = 'middle') => `<text x="${x}" y="${y}" text-anchor="${a}" fill="#22262B" stroke="none">${t}</text>`;

const parallelSVG = S(`<line x1="20" y1="60" x2="300" y2="60"/><line x1="20" y1="150" x2="300" y2="150"/><line x1="90" y1="190" x2="230" y2="10"/>
<path d="M 192 60 A 16 16 0 0 0 183 47" stroke="#1F4FD8"/><path d="M 122 150 A 16 16 0 0 1 113 163" stroke="#1F4FD8"/>
${T(205, 50, 'a')}${T(105, 175, 'a')}${T(305, 64, 'ℓ', 'start')}${T(305, 154, 'm', 'start')}`);
const polySVG = S(`<polygon points="60,170 260,170 300,90 160,20 20,90" fill="#E8EEFC"/><line x1="160" y1="20" x2="60" y2="170" stroke-dasharray="5 4"/><line x1="160" y1="20" x2="260" y2="170" stroke-dasharray="5 4"/>`);
const circleSVG = S(`<circle cx="110" cy="100" r="70" fill="#E8EEFC"/><line x1="110" y1="100" x2="180" y2="100"/>${T(145, 92, 'r')}<circle cx="110" cy="100" r="3" fill="#22262B"/>`, 240, 200);
const rightSVG = S(`<polygon points="40,170 260,170 40,40" fill="#E8EEFC"/><rect x="40" y="152" width="18" height="18"/>${T(150, 192, 'a')}${T(24, 110, 'b')}${T(160, 98, 'c')}`, 300, 200);
const specialSVG = S(`<polygon points="20,170 150,170 20,40" fill="#E8EEFC"/>${T(85, 192, 'x')}${T(8, 110, 'x')}${T(98, 98, 'x√2')}
<polygon points="190,170 300,170 190,(n)" fill="#FFF4D6"/>`.replace('190,(n)', '190,40') + T(245, 192, 'x') + T(176, 110, 'x√3') + T(262, 98, '2x'), 320, 200);

export const days = [
// =====================================================================================
{ id: 'd015',
  discover: {
    intro: M`Rates are ratios with units: miles per hour, pages per day, dollars per pound. One famous trap waits today.`,
    problem: { q: M`You drive to a town 60 miles away at 30 mph and come back along the same road at 60 mph. What was your average speed for the whole trip, in mph?`, a: num(40), sol: M`Going takes 2 hours, returning takes 1 hour: 120 miles in 3 hours is **40 mph**, not 45. You spent more *time* at the slower speed, so it counts more.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`45 mph (the average of 30 and 60) is the tempting answer, and it's wrong. Average speed is always **total distance ÷ total time**. The slow leg lasts twice as long, so it pulls the average down.` },
    { type: 'key', md: M`**Distance = rate × time**, and its two rearrangements: rate $= \frac{\text{distance}}{\text{time}}$, time $= \frac{\text{distance}}{\text{rate}}$. Keep units visible: $\frac{\text{miles}}{\text{hour}}\cdot\text{hours} = \text{miles}$.` },
    { type: 'example', title: 'Average speed with unequal distances', problem: M`Sasha runs 6 km at 12 km/h, then walks 2 km at 4 km/h. What is her average speed?`, steps: [
      { md: M`Running time: $6\div 12 = 0.5$ h. Walking time: $2\div 4 = 0.5$ h.` },
      { md: M`Total: 8 km in 1 h, so 8 km/h.`, fade: { prompt: 'Average speed in km/h:', a: num(8) } },
    ] },
    { type: 'md', md: M`### Work rates
"Pat paints a fence in 3 hours" means Pat's rate is $\frac13$ fence per hour. **Rates add when people work together**, not times. If Sam paints a fence in 6 hours (rate $\frac16$), together they paint $\frac13 + \frac16 = \frac12$ fence per hour, so the job takes 2 hours.` },
    { type: 'check', item: { id: 'd015-c1', skill: 'pa.rates', d: 3, q: M`One pipe fills a pool in 4 hours, another in 12 hours. Together, how many hours to fill it?`, a: num(3), sol: M`$\frac14 + \frac1{12} = \frac{4}{12} = \frac13$ pool per hour, so 3 hours.` } },
    { type: 'example', title: 'Closing speed', problem: M`Two cyclists start 45 miles apart and ride toward each other at 12 mph and 18 mph. When do they meet?`, steps: [
      { md: M`The gap shrinks by $12 + 18 = 30$ miles every hour.`, ask: M`Why can we add their speeds?`, why: M`In one hour, one covers 12 miles of the gap and the other covers 18, so together 30 miles of gap disappear each hour.` },
      { md: M`$45\div 30 = 1.5$ hours.`, fade: { prompt: 'Hours until they meet:', a: num(1.5) } },
    ] },
    { type: 'mistake', md: M`Avery reasoned: "Ana mows a lawn in 2 hours and Ben in 4 hours, so together it takes $\frac{2 + 4}{2} = 3$ hours."`, question: 'What is wrong?', options: ['Should add the times: 6 hours', 'Should add the rates: 4/3 hours', 'Nothing'], answer: 1, explain: M`Together they must be faster than Ana alone (2 hours), so 3 hours can't be right. Rates: $\frac12 + \frac14 = \frac34$ lawn per hour, so $\frac43$ hours.` },
    { type: 'explain', prompt: M`A plane flies from A to B with a tailwind and back with the same wind against it. Explain why the round trip takes longer than it would with no wind at all.`, model: M`The slow leg (into the wind) takes extra time, and the fast leg saves less time than that, because you spend *longer* on the slow leg. Time per mile is $\frac1{v}$, and slowing down by $w$ adds more time than speeding up by $w$ saves.` },
    { type: 'check', item: { id: 'd015-c2', skill: 'pa.rates', d: 4, q: M`Convert 90 km/h to meters per second.`, a: num(25), sol: M`$90\cdot\frac{1000}{3600} = 25$ m/s.` } },
  ], summary: [
    M`$d = rt$. Average speed = total distance ÷ total time, never the average of the speeds.`,
    M`For jobs, rates (jobs per hour) add; times don't.`,
    M`Objects moving toward each other close the gap at the sum of their speeds.`,
  ] },
  practice: { items: [
    { id: 'd015-p1', skill: 'pa.rates', d: 3, q: M`A train leaves at 9:40 and travels 210 miles at 70 mph. When does it arrive? Give the minutes past noon.`, a: num(40), sol: M`3 hours: arrives at 12:40, so 40 minutes past noon.` },
    { id: 'd015-p2', skill: 'pa.rates', d: 4, q: M`If 6 workers build a wall in 10 days, how many days would 4 workers take (same rate each)?`, a: num(15), sol: M`The wall is 60 worker-days; 4 workers need 15 days.` },
  ] },
  challenge: { items: [
    { id: 'd015-x1', skill: 'pa.rates', d: 4, dok: 3, q: M`Jo walks up a stopped escalator in 60 seconds. Standing still on the moving escalator takes 40 seconds. How many seconds does it take to walk up the moving escalator?`, a: num(24), sol: M`Rates in escalators per second: $\frac1{60} + \frac1{40} = \frac{2 + 3}{120} = \frac1{24}$. So 24 seconds.` },
    { id: 'd015-x2', skill: 'pa.rates', d: 4, dok: 3, q: M`A car averages 40 mph for the first half of a trip's **distance**. How fast must it go for the second half to average 60 mph overall?`, a: num(120), sol: M`Say each half is 120 miles. First half: 3 hours. To average 60 over 240 miles you need 4 hours total, leaving 1 hour for 120 miles: 120 mph.` },
    { id: 'd015-x3', skill: 'pa.rates', d: 5, dok: 3, q: M`At 3:00 the hands of a clock form a 90° angle. How many minutes after 3:00 are the hands first on top of each other?`, a: num('180/11'), sol: M`The minute hand moves 6° per minute and the hour hand 0.5° per minute, so the minute hand gains 5.5° per minute. It must gain 90°: $90\div 5.5 = \frac{180}{11}\approx 16.4$ minutes.`, hints: ['How many degrees per minute does each hand turn?'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: make a table.** For trips with legs, list each leg with distance, rate, and time in columns. Fill in what you know, use $d = rt$ across each row, then add the distance column and the time column. Average speed is the distance total over the time total.` },
    { type: 'key', md: M`If the problem says "together," add rates, not times.` },
  ],
  cards: [
    { id: 'pa.rates.c1', front: M`Average speed for a round trip at speeds $a$ and $b$?`, back: M`$\frac{2ab}{a + b}$: total distance over total time. It is less than $\frac{a+b}2$.` },
    { id: 'pa.rates.c2', front: M`Two workers take $a$ and $b$ hours alone. Together?`, back: M`$\frac{ab}{a+b}$ hours (rates $\frac1a + \frac1b$ add).` },
  ],
  book: { ref: 'AoPS Prealgebra §7.5–7.7', assign: 'Exercises in §7.5–7.6, then Chapter 7 Review Problems and two Challenge Problems.' },
},

// =====================================================================================
{ id: 'd016',
  discover: {
    intro: M`Percent just means "per hundred." The hard part is always: percent **of what**?`,
    problem: { q: M`A \$100 jacket goes on sale for 20% off. A week later the sale price is raised by 20%. What does the jacket cost now, in dollars?`, a: num(96), sol: M`20% off: \$80. Then 20% of \$80 is \$16, so \$96. The two 20%s are percents of different amounts, so they don't cancel.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Many people say \$100. But the increase is 20% of the *smaller* price, so it's less than the discount was. Today's habit: always ask "percent of what?"` },
    { type: 'key', md: M`$p\%$ means $\frac{p}{100}$. **"$p\%$ of $x$" is $\frac{p}{100}\cdot x$.** An increase of $p\%$ multiplies by $1 + \frac{p}{100}$; a decrease of $p\%$ multiplies by $1 - \frac{p}{100}$. Using these **multipliers** turns every percent problem into multiplication.` },
    { type: 'example', title: 'Successive changes with multipliers', problem: M`A population grows 10% one year and 20% the next. What is the total percent increase?`, steps: [
      { md: M`Multipliers: $1.10$ and $1.20$. Combined: $1.10\cdot 1.20 = 1.32$.`, ask: M`Why multiply instead of adding the percents?`, why: M`The second 20% is 20% of the already-grown population, so it applies on top of the first change. Multiplying captures that; adding would pretend both percents are of the original.` },
      { md: M`$1.32$ means a 32% increase (not 30%).`, fade: { prompt: 'Total percent increase:', a: num(32) } },
    ] },
    { type: 'md', md: M`### Percent change
Percent change $= \dfrac{\text{new} - \text{old}}{\text{old}}\cdot 100\%$. Always divide by the **original**. From 40 to 50 is a 25% increase; from 50 to 40 is a 20% decrease.` },
    { type: 'check', item: { id: 'd016-c1', skill: 'pa.pct', d: 3, q: M`A price drops from \$80 to \$68. What is the percent decrease?`, a: num(15), sol: M`$\frac{12}{80} = 0.15$, a 15% decrease.` } },
    { type: 'example', title: 'Working backwards', problem: M`After a 25% raise, Lin earns \$30 per hour. What did Lin earn before?`, steps: [
      { md: M`New = old × 1.25, so old = $30\div 1.25$.` },
      { md: M`$= 24$ dollars per hour.`, fade: { prompt: 'Old wage in dollars:', a: num(24) } },
      { md: M`Not \$22.50: subtracting 25% of \$30 removes 25% of the *new* amount, not of the old one.` },
    ] },
    { type: 'mistake', md: M`Jamie said: "If prices go up 50% and then down 50%, they're back where they started."`, question: 'Is that true?', options: ['Yes', 'No: they end 25% lower', 'No: they end 25% higher'], answer: 1, explain: M`$1.5\cdot 0.5 = 0.75$: prices end at 75% of the original, 25% lower. The 50% decrease is of a bigger number.` },
    { type: 'explain', prompt: M`Explain why "$a\%$ of $b$" equals "$b\%$ of $a$." (Example: 8% of 50 and 50% of 8.)`, model: M`$\frac{a}{100}\cdot b = \frac{ab}{100} = \frac{b}{100}\cdot a$. It's the commutative property. So 8% of 50 is 50% of 8, which is 4.` },
    { type: 'check', item: { id: 'd016-c2', skill: 'pa.pct', d: 4, q: M`What is 16% of 25?`, a: num(4), sol: M`Same as 25% of 16: one quarter of 16 is 4.` } },
  ], summary: [
    M`$p\%$ of $x$ is $\frac{p}{100}x$. Increase by $p\%$: × $(1 + \frac p{100})$; decrease: × $(1 - \frac p{100})$.`,
    M`Successive changes multiply; they don't add.`,
    M`Percent change divides by the original amount. To undo a change, divide by its multiplier.`,
  ] },
  practice: { items: [
    { id: 'd016-p1', skill: 'pa.pct', d: 3, q: M`30 is what percent of 24?`, a: num(125), sol: M`$\frac{30}{24} = 1.25 = 125\%$.` },
    { id: 'd016-p2', skill: 'pa.pct', d: 4, q: M`A shirt is marked down 30%, then an extra 10% off the sale price. What is the total percent discount?`, a: num(37), sol: M`$0.7\cdot 0.9 = 0.63$, so 37% off.` },
  ] },
  challenge: { items: [
    { id: 'd016-x1', skill: 'pa.pct', d: 4, dok: 3, q: M`A rectangle's length increases by 20% and its width decreases by 20%. By what percent does its area change? (Negative for a decrease.)`, a: num(-4), sol: M`$1.2\cdot 0.8 = 0.96$: area decreases 4%.` },
    { id: 'd016-x2', skill: 'pa.pct', d: 4, dok: 3, q: M`Fresh grapes are 90% water by weight; raisins are 20% water. How many kilograms of raisins come from 40 kg of grapes?`, a: num(5), sol: M`The solid part doesn't change: 10% of 40 kg = 4 kg. In raisins that 4 kg is 80% of the weight, so raisins weigh $4\div 0.8 = 5$ kg.`, hints: ['Which part of the grapes doesn\'t change when they dry?'] },
    { id: 'd016-x3', skill: 'pa.pct', d: 5, dok: 3, q: M`In a class, 60% of students like math and 70% like art. At least what percent like both?`, a: num(30), sol: M`If $x\%$ like both, then $60 + 70 - x \le 100$ (no more than everyone likes at least one). So $x \ge 30$, and 30% is possible.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: use 100.** When a problem gives only percents, pretend the starting amount is 100. A 20% discount on 100 gives 80; a 20% increase on 80 gives 96. The answer, 96, means 96% of the original. Choosing 100 makes the percents show up directly as numbers.` },
    { type: 'key', md: M`"Percent of what?" The answer to that question is the number you divide by or multiply.` },
  ],
  cards: [
    { id: 'pa.pct.c1', front: M`Multiplier for a 15% increase? A 15% decrease?`, back: M`1.15 and 0.85.` },
    { id: 'pa.pct.c2', front: M`Percent change formula?`, back: M`$\frac{\text{new}-\text{old}}{\text{old}}\times 100\%$.` },
  ],
  book: { ref: 'AoPS Prealgebra §8.1–8.4', assign: 'Exercises in §8.2–8.3, then Chapter 8 Review Problems.' },
},

// =====================================================================================
{ id: 'd017',
  discover: {
    intro: M`Square roots undo squaring. Most of them aren't whole numbers, and today you learn to handle those exactly.`,
    problem: { q: M`A square has area 50. Between which two consecutive whole numbers is its side length? Give the smaller one.`, a: num(7), sol: M`The side is $\sqrt{50}$. Since $7^2 = 49 < 50 < 64 = 8^2$, the side is between 7 and 8, a little more than 7.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`The side of the square is $\sqrt{50}$: the positive number whose square is 50. It isn't a whole number, but you can trap it between perfect squares. Today you'll also learn to write it exactly: $\sqrt{50} = 5\sqrt2$.` },
    { type: 'md', md: M`### What $\sqrt{\ }$ means
$\sqrt{x}$ is the **nonnegative** number whose square is $x$. So $\sqrt{49} = 7$ (not $-7$, even though $(-7)^2 = 49$ too). Perfect squares to know by heart: $1, 4, 9, \ldots, 225$ ($15^2$), and a few more like $256 = 16^2$, $625 = 25^2$.` },
    { type: 'key', md: M`**Product rule:** $\sqrt{ab} = \sqrt a\cdot\sqrt b$ (for $a, b \ge 0$). Use it to **simplify**: pull out the largest perfect square factor.
$$\sqrt{50} = \sqrt{25\cdot 2} = 5\sqrt2.$$` },
    { type: 'example', title: 'Simplifying a radical', problem: M`Simplify $\sqrt{72}$.`, steps: [
      { md: M`Find the largest perfect square dividing 72. $72 = 36\cdot 2$.`, ask: M`What happens if you use $72 = 4\cdot 18$ instead?`, why: M`You get $2\sqrt{18}$, but 18 still contains 9: $2\cdot 3\sqrt2 = 6\sqrt2$. Same answer, more steps. The largest square factor finishes in one go.` },
      { md: M`$\sqrt{72} = \sqrt{36}\sqrt2 = 6\sqrt2$.`, fade: { prompt: M`Type $\sqrt{72}$ simplified (like 6sqrt(2)).`, a: rad('6sqrt(2)', '$6\\sqrt2$') } },
    ] },
    { type: 'md', md: M`### Arithmetic with roots
Roots with the same number inside combine like like terms: $3\sqrt5 + 4\sqrt5 = 7\sqrt5$. Different insides don't combine: $\sqrt2 + \sqrt3$ is as simple as it gets. Products: $\sqrt6\cdot\sqrt{15} = \sqrt{90} = 3\sqrt{10}$.` },
    { type: 'mistake', md: M`Dana wrote:

1. $\sqrt{9 + 16} = \sqrt9 + \sqrt{16}$
2. $= 3 + 4 = 7$`, question: 'Which line is wrong?', options: ['Line 1', 'Line 2', 'Neither'], answer: 0, explain: M`$\sqrt{9 + 16} = \sqrt{25} = 5$. The product rule works for multiplication, not addition: $\sqrt{a + b} \ne \sqrt a + \sqrt b$ (otherwise $\sqrt{25}$ would be 7).` },
    { type: 'check', item: { id: 'd017-c1', skill: 'pa.sqrt', d: 4, q: M`Simplify $\sqrt{12} + \sqrt{27}$. (Like 5sqrt(3).)`, a: rad('5sqrt(3)', '$5\\sqrt3$'), sol: M`$2\sqrt3 + 3\sqrt3 = 5\sqrt3$.` } },
    { type: 'example', title: 'Rationalizing a denominator', problem: M`Simplify $\dfrac{10}{\sqrt5}$.`, steps: [
      { md: M`Multiply top and bottom by $\sqrt5$ (that's multiplying by 1): $\frac{10\sqrt5}{5}$.` },
      { md: M`$= 2\sqrt5$.`, ask: M`Why is $\frac{10}{\sqrt5}$ equal to $2\sqrt5$? Check by squaring both.`, why: M`$\left(\frac{10}{\sqrt5}\right)^2 = \frac{100}{5} = 20$ and $(2\sqrt5)^2 = 4\cdot 5 = 20$. Same positive square, same number.` },
    ] },
    { type: 'explain', prompt: M`Explain how you can tell, without a calculator, that $\sqrt{90}$ is between 9 and 10.`, model: M`$9^2 = 81 < 90 < 100 = 10^2$, and square roots keep order for positive numbers, so $9 < \sqrt{90} < 10$.` },
    { type: 'check', item: { id: 'd017-c2', skill: 'pa.sqrt', d: 3, q: M`Compute $\sqrt{0.0049}$.`, a: num(0.07), sol: M`$0.07^2 = 0.0049$.` } },
  ], summary: [
    M`$\sqrt x$ is the nonnegative number whose square is $x$; trap it between consecutive perfect squares.`,
    M`$\sqrt{ab} = \sqrt a\sqrt b$: pull out the largest square factor. But $\sqrt{a+b} \ne \sqrt a + \sqrt b$.`,
    M`Like radicals add; rationalize by multiplying top and bottom by the root.`,
  ] },
  practice: { items: [
    { id: 'd017-p1', skill: 'pa.sqrt', d: 3, q: M`Compute $\sqrt{8}\cdot\sqrt{18}$.`, a: num(12), sol: M`$\sqrt{144} = 12$.` },
    { id: 'd017-p2', skill: 'pa.sqrt', d: 4, q: M`How many integers are between $\sqrt{10}$ and $\sqrt{200}$?`, a: num(11), sol: M`$\sqrt{10}\approx 3.2$ and $\sqrt{200}\approx 14.1$: integers 4 through 14, eleven of them.` },
  ] },
  challenge: { items: [
    { id: 'd017-x1', skill: 'pa.sqrt', d: 4, dok: 3, q: M`Compute $\sqrt{2025} - \sqrt{2024 - 1999}$.`, a: num(40), sol: M`$\sqrt{2025} = 45$ and $\sqrt{25} = 5$. Difference 40.` },
    { id: 'd017-x2', skill: 'pa.sqrt', d: 4, dok: 3, q: M`What is the smallest positive integer $n$ such that $\sqrt{180n}$ is an integer?`, a: num(5), sol: M`$180 = 2^2\cdot 3^2\cdot 5$. To make a perfect square, the 5 needs a partner: $n = 5$, giving $\sqrt{900} = 30$.` },
    { id: 'd017-x3', skill: 'pa.sqrt', d: 5, dok: 3, q: M`Compute $\sqrt{1 + 2 + 3 + \cdots + 48 + 49 + 48 + \cdots + 3 + 2 + 1}$.`, a: num(49), sol: M`Pair $1 + 2 + \cdots + 48$ with the descending copy: $2\cdot\frac{48\cdot 49}{2} + 49 = 48\cdot 49 + 49 = 49^2$. The square root is 49.`, hints: ['Try a small version: $1 + 2 + 1$, $1 + 2 + 3 + 2 + 1$. What pattern do you see?'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: factor trees.** Factor 72 completely: $2\cdot 2\cdot 2\cdot 3\cdot 3$. Circle pairs of equal primes: (2·2) and (3·3). Each pair comes out of the root as one copy: $2\cdot 3 = 6$. The leftover 2 stays inside: $6\sqrt2$.` },
    { type: 'key', md: M`Each **pair** of equal prime factors comes out of a square root as one factor.` },
  ],
  cards: [
    { id: 'pa.sqrt.c1', front: M`Is $\sqrt{a + b} = \sqrt a + \sqrt b$?`, back: M`No. Only $\sqrt{ab} = \sqrt a\sqrt b$. Counterexample: $\sqrt{9 + 16} = 5 \ne 7$.` },
    { id: 'pa.sqrt.c2', front: M`Simplest form of $\sqrt{48}$?`, back: M`$4\sqrt3$.` },
  ],
  book: { ref: 'AoPS Prealgebra §9.1–9.4', assign: 'Exercises in §9.2–9.3, then Chapter 9 Review Problems.' },
},

// =====================================================================================
{ id: 'd018',
  discover: {
    intro: M`Geometry starts today. Angle facts come in a small family, and every one of them follows from "a straight line is 180°."`,
    problem: { q: M`What is the sum of the interior angles of a pentagon (5 sides)? (Hint: you know triangles add to 180°.)`, a: num(540), sol: M`From one corner, draw the two diagonals: the pentagon splits into 3 triangles, whose angles make up exactly the pentagon's angles. $3\cdot 180 = 540°$.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Splitting the pentagon into triangles from one vertex gives 3 triangles, and their angles fill the pentagon's corners exactly. Any polygon with $n$ sides splits this way into $n - 2$ triangles.` },
    { type: 'svg', svg: polySVG, caption: M`Two diagonals from one vertex cut a pentagon into three triangles.` },
    { type: 'md', md: M`### Angle basics
A full turn is 360°; a straight line is 180°; a right angle is 90°. Angles that add to 180° are **supplementary**; to 90°, **complementary**. When two lines cross, the opposite angles (**vertical angles**) are equal, because each is supplementary to the same neighbor.` },
    { type: 'key', md: M`**Parallel lines.** When a line (a **transversal**) crosses two parallel lines, it makes the same angles at both crossings. So **corresponding** angles and **alternate interior** angles are equal, and **same-side interior** angles are supplementary.` },
    { type: 'svg', svg: parallelSVG, caption: M`Lines $\ell$ and $m$ are parallel. The two marked angles are alternate interior angles, so they are equal.` },
    { type: 'example', title: 'Why a triangle adds to 180°', problem: M`Show that the angles of any triangle add to 180°.`, steps: [
      { md: M`Through the top vertex, draw a line parallel to the bottom side.` },
      { md: M`The two bottom angles of the triangle are alternate interior angles to two angles at the top, along that new line.`, ask: M`Why are those pairs of angles equal?`, why: M`The new line is parallel to the base, and the triangle's sides are transversals. Alternate interior angles along parallel lines are equal.` },
      { md: M`At the top vertex, those two angles plus the triangle's top angle form a straight line: 180°. So the triangle's three angles add to 180°.` },
    ] },
    { type: 'key', md: M`**Polygon angle sums.** Interior angles of an $n$-gon add to $180(n - 2)°$. Each angle of a **regular** $n$-gon is $\frac{180(n-2)}{n}°$. **Exterior angles** (one at each vertex) of any convex polygon add to 360°: walk around the polygon and you turn exactly once.` },
    { type: 'check', item: { id: 'd018-c1', skill: 'pa.angles', d: 3, q: M`What is each interior angle of a regular hexagon?`, a: num(120), sol: M`$\frac{180\cdot 4}{6} = 120°$. Or: each exterior angle is $360/6 = 60°$, so interior is $180 - 60 = 120°$.` } },
    { type: 'mistake', md: M`Ellis said: "A regular polygon's exterior angles add to 360°, so a polygon with more sides has a bigger exterior angle sum."`, question: 'What is wrong?', options: ['The sum is always 360°, whatever the number of sides', 'The sum is 180(n−2)', 'Nothing'], answer: 0, explain: M`The exterior angles of any convex polygon add to exactly 360°. More sides means each exterior angle is *smaller*, not that the total grows.` },
    { type: 'explain', prompt: M`Explain why vertical angles are always equal.`, model: M`If two lines cross making angles $a$, $b$ next to each other and $c$ opposite $a$, then $a + b = 180$ (a straight line) and $b + c = 180$ (another straight line). So $a = 180 - b = c$.` },
    { type: 'check', item: { id: 'd018-c2', skill: 'pa.angles', d: 4, q: M`Each interior angle of a regular polygon is 156°. How many sides does it have?`, a: num(15), sol: M`Exterior angle $180 - 156 = 24°$, and $360\div 24 = 15$.` } },
  ], summary: [
    M`Straight line 180°, full turn 360°; vertical angles are equal.`,
    M`Parallel lines: corresponding and alternate interior angles are equal; same-side interior angles add to 180°.`,
    M`$n$-gon: interior sum $180(n-2)$; exterior sum always 360°.`,
  ] },
  practice: { items: [
    { id: 'd018-p1', skill: 'pa.angles', d: 3, q: M`In triangle $ABC$, angle $A$ is twice angle $B$, and angle $C$ is 30° more than angle $B$. What is angle $A$?`, a: num(75), sol: M`$2B + B + B + 30 = 180$, $B = 37.5$, $A = 75$.` },
    { id: 'd018-p2', skill: 'pa.angles', d: 3, q: M`An exterior angle of a triangle is 130°, and one of the two remote interior angles is 55°. What is the other?`, a: num(75), sol: M`An exterior angle equals the sum of the two remote interior angles: $130 - 55 = 75$.` },
  ] },
  challenge: { items: [
    { id: 'd018-x1', skill: 'pa.angles', d: 4, dok: 3, q: M`How many degrees are between the hands of a clock at 2:30?`, a: num(105), sol: M`Minute hand at 180°. Hour hand: $2\cdot 30 + 30\cdot 0.5 = 75°$. Difference 105°.` },
    { id: 'd018-x2', skill: 'pa.angles', d: 4, dok: 3, q: M`A regular polygon has interior angles 4 times as large as its exterior angles. How many sides does it have?`, a: num(10), sol: M`Interior + exterior = 180, and interior = 4·exterior, so exterior = 36° and $n = 360/36 = 10$.` },
    { id: 'd018-x3', skill: 'pa.angles', d: 5, dok: 3, q: M`A five-pointed star is drawn by connecting every second vertex of a regular pentagon. What is the angle at each point of the star?`, a: num(36), sol: M`The star's lines enclose a smaller regular pentagon, whose interior angles are 108°. Each point of the star is an isosceles triangle standing on a side of that small pentagon; its base angles are supplementary to 108°, so 72° each. The tip angle is $180 - 72 - 72 = 36°$.`, hints: ['Look at the small pentagon in the middle of the star.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: walk the polygon.** Imagine walking along the edges of a polygon and turning at each corner. When you're back at the start, facing the same way, you've turned exactly one full circle, 360°. The turns are the exterior angles. From there, each interior angle is 180° minus its exterior angle.` },
    { type: 'key', md: M`Regular $n$-gon: exterior angle $\frac{360}{n}$, interior angle $180 - \frac{360}{n}$.` },
  ],
  cards: [
    { id: 'pa.angles.c1', front: M`Sum of interior angles of an $n$-gon?`, back: M`$180(n-2)$ degrees.` },
    { id: 'pa.angles.c2', front: M`Sum of exterior angles of any convex polygon?`, back: M`360°.` },
  ],
  book: { ref: 'AoPS Prealgebra §10.1–10.4', assign: 'Exercises in §10.2–10.3, then Chapter 10 Review Problems.' },
},

// =====================================================================================
{ id: 'd019',
  discover: {
    intro: M`Area formulas aren't facts to memorize: each one comes from cutting and rearranging a rectangle.`,
    problem: { q: M`A parallelogram has a base of 10 and a height of 6 (the height is the perpendicular distance between the base and the opposite side). What is its area?`, a: num(60), sol: M`Cut off the triangle on one end and slide it to the other end: you get a 10 by 6 rectangle. Area 60.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`A slanted parallelogram becomes a rectangle when you move one triangle from one end to the other. The slant side length doesn't matter; only the base and the perpendicular height do.` },
    { type: 'key', md: M`**Area formulas and where they come from**
- Rectangle: $bh$.
- Parallelogram: $bh$ (cut and slide into a rectangle).
- Triangle: $\frac12 bh$ (two copies make a parallelogram).
- Trapezoid: $\frac{b_1 + b_2}{2}h$ (two copies, one flipped, make a parallelogram with base $b_1 + b_2$).

Height always means **perpendicular** height.` },
    { type: 'example', title: 'Composite shapes', problem: M`A 10 by 8 rectangle has a triangle with base 10 and height 3 removed from its top, forming a notched shape. What is the remaining area?`, steps: [
      { md: M`Rectangle: $80$. Triangle: $\frac12\cdot 10\cdot 3 = 15$.` },
      { md: M`Remaining: $80 - 15 = 65$.`, fade: { prompt: 'Remaining area:', a: num(65) } },
    ] },
    { type: 'md', md: M`### Circles
The ratio of any circle's circumference to its diameter is the same number, $\pi \approx 3.14159$. So $C = \pi d = 2\pi r$. The area is $A = \pi r^2$. Picture cutting a circle into many thin slices and laying them alternately up and down: they form a near-rectangle with width $\pi r$ (half the circumference) and height $r$.` },
    { type: 'svg', svg: circleSVG, caption: M`$C = 2\pi r$ and $A = \pi r^2$.` },
    { type: 'check', item: { id: 'd019-c1', skill: 'pa.circle', d: 3, q: M`A circle has area $36\pi$. What is its circumference? (In terms of π, like 6pi.)`, a: num('12pi', { display: '$12\\pi$' }), sol: M`$r^2 = 36$, $r = 6$, $C = 12\pi$.` } },
    { type: 'mistake', md: M`Finley found the area of a circle with diameter 10:

1. $A = \pi r^2$
2. $= \pi\cdot 10^2 = 100\pi$`, question: 'Where is the error?', options: ['Line 1', 'Line 2', 'No error'], answer: 1, explain: M`The radius is half the diameter, 5. $A = 25\pi$. Using the diameter makes the area 4 times too big.` },
    { type: 'example', title: 'Shaded region', problem: M`A square of side 4 has a quarter-circle of radius 4 drawn inside it, centered at one corner. What is the area of the part of the square outside the quarter-circle? (In terms of π.)`, steps: [
      { md: M`Square: 16. Quarter circle: $\frac14\pi\cdot 16 = 4\pi$.` },
      { md: M`Outside: $16 - 4\pi$.`, ask: M`Is $16 - 4\pi$ positive? About how big?`, why: M`$4\pi \approx 12.57$, so about 3.43. Positive, and small, which makes sense: the quarter circle fills most of the square.` },
    ] },
    { type: 'explain', prompt: M`Explain why the area of a triangle is half of base times height.`, model: M`Two identical copies of the triangle, one rotated 180°, fit together into a parallelogram with the same base and height. The parallelogram's area is $bh$, so each triangle is $\frac12 bh$.` },
    { type: 'check', item: { id: 'd019-c2', skill: 'pa.area', d: 3, q: M`A trapezoid has parallel sides 7 and 13 and height 5. What is its area?`, a: num(50), sol: M`$\frac{7 + 13}{2}\cdot 5 = 50$.` } },
  ], summary: [
    M`Parallelogram $bh$, triangle $\frac12bh$, trapezoid $\frac{b_1+b_2}2h$: all from rearranging rectangles. Use perpendicular height.`,
    M`$C = 2\pi r$, $A = \pi r^2$. Use the radius, not the diameter.`,
    M`Composite regions: add the pieces or subtract the holes.`,
  ] },
  practice: { items: [
    { id: 'd019-p1', skill: 'pa.area', d: 3, q: M`A right triangle has legs 9 and 12. What is its area?`, a: num(54), sol: M`The legs are base and height: $\frac12\cdot 9\cdot 12 = 54$.` },
    { id: 'd019-p2', skill: 'pa.circle', d: 4, q: M`A circular track has inner radius 30 m and outer radius 32 m. What is the area of the track? (In terms of π.)`, a: num('124pi', { display: '$124\\pi$' }), sol: M`$\pi(32^2 - 30^2) = \pi(1024 - 900) = 124\pi$.` },
  ] },
  challenge: { items: [
    { id: 'd019-x1', skill: 'pa.circle', d: 4, dok: 3, q: M`A circle is inscribed in a square of side 10 (it touches all four sides). What fraction of the square's area is inside the circle? (In terms of π, like pi/4.)`, a: num('pi/4', { display: '$\\frac{\\pi}{4}$' }), sol: M`Circle radius 5: area $25\pi$. Square area 100. Fraction $\frac{25\pi}{100} = \frac\pi4$.` },
    { id: 'd019-x2', skill: 'pa.area', d: 4, dok: 3, q: M`The midpoints of the sides of a square of area 64 are joined to form a smaller square. What is the area of the smaller square?`, a: num(32), sol: M`Joining midpoints cuts off four corner triangles, each $\frac12\cdot 4\cdot 4 = 8$. $64 - 32 = 32$. (The inner square is always half the big one.)` },
    { id: 'd019-x3', skill: 'pa.circle', d: 5, dok: 3, q: M`If a circle's radius increases by 1, its circumference increases by how much? (In terms of π.)`, a: num('2pi', { display: '$2\\pi$' }), sol: M`$2\pi(r + 1) - 2\pi r = 2\pi$, no matter how big the circle is.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: count squares.** On graph paper, draw a triangle with base 6 and height 4. Count the squares inside (estimating the partial ones): about 12. A 6 by 4 rectangle has 24. The triangle is half. Trying a few shapes this way shows the formulas are just shortcuts for counting.` },
    { type: 'key', md: M`Height is perpendicular to the base; a slanted side is not the height.` },
  ],
  cards: [
    { id: 'pa.area.c1', front: M`Area of a trapezoid?`, back: M`$\frac{b_1 + b_2}{2}\cdot h$.` },
    { id: 'pa.circle.c1', front: M`Circumference and area of a circle?`, back: M`$C = 2\pi r$, $A = \pi r^2$.` },
  ],
  book: { ref: 'AoPS Prealgebra §11.1–11.4', assign: 'Exercises in §11.2–11.3, then Chapter 11 Review Problems.' },
},

// =====================================================================================
{ id: 'd020',
  discover: {
    intro: M`The Pythagorean theorem is probably the most-used fact in all of geometry. Today you'll see a proof you could explain to anyone.`,
    problem: { q: M`A 13-foot ladder leans against a wall with its foot 5 feet from the wall. How high up the wall does it reach?`, a: num(12), sol: M`The ladder, wall, and ground form a right triangle with hypotenuse 13 and one leg 5. $5^2 + h^2 = 13^2$, so $h^2 = 144$, $h = 12$ feet.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`If you knew $a^2 + b^2 = c^2$, the ladder was quick. If you didn't, you may have drawn it carefully and estimated about 12. Today you'll see *why* the theorem is true, so it stops being a formula and becomes a fact you can rebuild.` },
    { type: 'svg', svg: rightSVG, caption: M`Legs $a$ and $b$ meet at the right angle; $c$ is the hypotenuse, opposite it.` },
    { type: 'key', md: M`**Pythagorean theorem.** In a right triangle with legs $a, b$ and hypotenuse $c$: $a^2 + b^2 = c^2$. **Common triples**: 3-4-5, 5-12-13, 8-15-17, 7-24-25, and their multiples (6-8-10, 9-12-15, …).` },
    { type: 'example', title: 'A proof by rearrangement', problem: M`Why is $a^2 + b^2 = c^2$?`, steps: [
      { md: M`Take a big square with side $a + b$. Inside it, place four copies of the right triangle, one in each corner, so that their hypotenuses form a tilted square in the middle with side $c$.` },
      { md: M`Area of the big square two ways: $(a + b)^2 = 4\cdot\frac12 ab + c^2$.`, ask: M`Where does the $4\cdot\frac12ab$ come from?`, why: M`Each of the four triangles has legs $a$ and $b$, so area $\frac12ab$.` },
      { md: M`Expand: $a^2 + 2ab + b^2 = 2ab + c^2$, so $a^2 + b^2 = c^2$. ∎` },
    ] },
    { type: 'check', item: { id: 'd020-c1', skill: 'pa.pyth', d: 3, q: M`A right triangle has legs 4 and 6. Find the hypotenuse in simplest radical form (like 2sqrt(13)).`, a: rad('2sqrt(13)', '$2\\sqrt{13}$'), sol: M`$\sqrt{16 + 36} = \sqrt{52} = 2\sqrt{13}$.` } },
    { type: 'md', md: M`### Special right triangles
Two shapes come up constantly:
- **45-45-90** (half a square): legs $x, x$, hypotenuse $x\sqrt2$.
- **30-60-90** (half an equilateral triangle): short leg $x$, long leg $x\sqrt3$, hypotenuse $2x$.

Both come straight from the Pythagorean theorem: for the half-equilateral, $x^2 + (\text{long leg})^2 = (2x)^2$ gives long leg $x\sqrt3$.` },
    { type: 'svg', svg: specialSVG, caption: M`Left: 45-45-90. Right: 30-60-90.` },
    { type: 'mistake', md: M`Harper found the missing leg of a right triangle with hypotenuse 10 and leg 6:

1. $6^2 + 10^2 = c^2$
2. $c = \sqrt{136}$`, question: 'Which line is wrong?', options: ['Line 1', 'Line 2', 'Neither'], answer: 0, explain: M`10 is the hypotenuse, so it goes alone on its side of the equation: $6^2 + b^2 = 10^2$, $b = 8$. The hypotenuse is always the longest side, opposite the right angle.` },
    { type: 'md', md: M`### Quadrilaterals
A **parallelogram** has two pairs of parallel sides; a **rectangle** is a parallelogram with right angles; a **rhombus** has four equal sides; a **square** is both. A **trapezoid** has (at least, by some definitions exactly) one pair of parallel sides. A rhombus's diagonals are perpendicular and bisect each other, so they cut it into four congruent right triangles. That's how you find its side length from its diagonals.` },
    { type: 'check', item: { id: 'd020-c2', skill: 'pa.pyth', d: 4, q: M`A rhombus has diagonals 10 and 24. How long is each side?`, a: num(13), sol: M`Half-diagonals 5 and 12 are legs of a right triangle: side 13.` } },
    { type: 'explain', prompt: M`How can you tell from the side lengths alone whether a triangle with sides 7, 24, 25 is a right triangle?`, model: M`Check whether the two shorter sides satisfy $a^2 + b^2 = c^2$: $49 + 576 = 625 = 25^2$. Yes, so it is a right triangle (the converse of the Pythagorean theorem).` },
  ], summary: [
    M`$a^2 + b^2 = c^2$, with $c$ the hypotenuse. Know 3-4-5, 5-12-13, 8-15-17, 7-24-25.`,
    M`45-45-90: $x, x, x\sqrt2$. 30-60-90: $x, x\sqrt3, 2x$.`,
    M`Rhombus diagonals are perpendicular bisectors: they form four right triangles.`,
  ] },
  practice: { items: [
    { id: 'd020-p1', skill: 'pa.pyth', d: 3, q: M`What is the length of the diagonal of a 9 by 40 rectangle?`, a: num(41), sol: M`$\sqrt{81 + 1600} = 41$.` },
    { id: 'd020-p2', skill: 'pa.pyth', d: 4, q: M`An equilateral triangle has side 10. What is its height? (Like 5sqrt(3).)`, a: rad('5sqrt(3)', '$5\\sqrt3$'), sol: M`The height splits it into two 30-60-90 triangles with hypotenuse 10, short leg 5, long leg $5\sqrt3$.` },
  ] },
  challenge: { items: [
    { id: 'd020-x1', skill: 'pa.pyth', d: 4, dok: 3, q: M`What is the distance between the points $(1, 2)$ and $(7, 10)$?`, a: num(10), sol: M`Horizontal 6, vertical 8: $\sqrt{36 + 64} = 10$.` },
    { id: 'd020-x2', skill: 'pa.pyth', d: 4, dok: 3, q: M`What is the area of an equilateral triangle with side 6? (Like 9sqrt(3).)`, a: rad('9sqrt(3)', '$9\\sqrt3$'), sol: M`Height $3\sqrt3$, area $\frac12\cdot 6\cdot 3\sqrt3 = 9\sqrt3$.` },
    { id: 'd020-x3', skill: 'pa.pyth', d: 5, dok: 3, q: M`An ant is at one corner of a 3 by 4 by 12 box. What is the straight-line distance through the inside of the box to the opposite corner?`, a: num(13), sol: M`Floor diagonal $\sqrt{9 + 16} = 5$; then with height 12: $\sqrt{25 + 144} = 13$.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: squares on the sides.** Draw a 3-4-5 triangle on graph paper and build a square on each side. The squares on the legs have 9 and 16 unit squares; the square on the hypotenuse has 25. The theorem literally says the two small squares together have the same area as the big one.` },
    { type: 'key', md: M`Find the hypotenuse first: it's the side opposite the right angle and the longest side.` },
  ],
  cards: [
    { id: 'pa.pyth.c1', front: M`Sides of a 30-60-90 triangle?`, back: M`$x$ (opposite 30°), $x\sqrt3$ (opposite 60°), $2x$ (hypotenuse).` },
    { id: 'pa.pyth.c2', front: M`Name four Pythagorean triples.`, back: M`3-4-5, 5-12-13, 8-15-17, 7-24-25.` },
  ],
  book: { ref: 'AoPS Prealgebra §12.1–12.4', assign: 'Exercises in §12.1–12.2, then Chapter 12 Review Problems and two Challenge Problems.' },
},
];
