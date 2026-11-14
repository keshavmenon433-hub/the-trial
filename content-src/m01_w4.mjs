// Month 1, week 4 lessons (days 22–26) plus the contest bank and the Month 1 Benchmark.
// Every problem here is original, written for The Trial in the style of middle-school contests.
const M = String.raw;
const num = (v, extra = {}) => ({ type: 'number', value: String(v), ...extra });
const choice = (options, value) => ({ type: 'choice', options, value });

export const days = [
// =====================================================================================
{ id: 'd022',
  discover: {
    intro: M`Statistics summarizes many numbers with a few. Each summary hides something, and contest problems love to hide things there.`,
    problem: { q: M`Five test scores have a mean of 80. Four of them are 72, 85, 90, and 78. What is the fifth score?`, a: num(75), sol: M`A mean of 80 over 5 scores means the total is 400. The four known scores add to 325, so the fifth is 75.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`The key move was turning the mean into a **total**: mean × count = sum. Most mean problems become easy the moment you think in totals instead of averages.` },
    { type: 'key', md: M`**Mean** = sum ÷ count, so **sum = mean × count**. **Median** = middle value when sorted (average of the two middle values for an even count). **Mode** = most frequent value. **Range** = largest − smallest.` },
    { type: 'example', title: 'Adding a number changes the mean', problem: M`The mean of 8 numbers is 15. A ninth number is added and the mean becomes 16. What number was added?`, steps: [
      { md: M`Old total: $8\cdot 15 = 120$. New total: $9\cdot 16 = 144$.` },
      { md: M`Added number: $144 - 120 = 24$.`, fade: { prompt: 'The added number:', a: num(24) } },
      { md: M`Sanity check: the new number must be above the old mean (it raised it) and in fact $24 = 16 + 8\cdot 1$: it is 16 plus enough extra to lift each of the 8 old numbers' share by 1.` },
    ] },
    { type: 'md', md: M`### Mean vs. median
The mean is pulled by extreme values; the median isn't. For incomes 30, 35, 40, 45, 1000 (thousands), the mean is 230 but the median is 40. Which one "represents" the group depends on the question you're asking.` },
    { type: 'check', item: { id: 'd022-c1', skill: 'pa.stats', d: 2, q: M`What is the median of 12, 3, 9, 15, 7, 10?`, a: num(9.5), sol: M`Sorted: 3, 7, 9, 10, 12, 15. Middle two are 9 and 10: median 9.5.` } },
    { type: 'example', title: 'Weighted average', problem: M`In a class, 12 girls averaged 85 on a test and 18 boys averaged 80. What was the class average?`, steps: [
      { md: M`Total points: $12\cdot 85 + 18\cdot 80 = 1020 + 1440 = 2460$.` },
      { md: M`Average: $2460\div 30 = 82$.`, ask: M`Why isn't it 82.5, halfway between 85 and 80?`, why: M`There are more boys, so their average counts more. The combined average sits closer to 80.` },
    ] },
    { type: 'mistake', md: M`Peyton reasoned: "My mean on 4 quizzes is 80. If I score 100 on the next one, my mean becomes $\frac{80 + 100}{2} = 90$."`, question: 'What is the correct new mean?', options: ['90', '84', '85'], answer: 1, explain: M`The 80 represents 4 quizzes, not 1. Total $4\cdot 80 + 100 = 420$, over 5 quizzes: 84.` },
    { type: 'explain', prompt: M`A set of numbers has mean 50. Every number is increased by 7. Explain what happens to the mean and to the range.`, model: M`The sum grows by $7n$, so the mean grows by 7, to 57. The range doesn't change, since the largest and smallest both grow by 7.` },
    { type: 'check', item: { id: 'd022-c2', skill: 'pa.stats', d: 4, q: M`Five different positive integers have mean 10 and median 12. What is the largest possible value of the largest one?`, a: num(24), sol: M`Sum 50. Median 12 means the middle one is 12. Make the others as small as possible: 1, 2, 12, then the fourth must be at least 13. $50 - 1 - 2 - 12 - 13 = 22$... wait, that gives largest 22. Check: 1, 2, 12, 13, 22: sum 50, median 12. ✓ So 22.` } },
  ], summary: [
    M`Sum = mean × count. Think in totals.`,
    M`Median resists outliers; the mean doesn't.`,
    M`Combining groups: total of totals over total count (a weighted average).`,
  ] },
  practice: { items: [
    { id: 'd022-p1', skill: 'pa.stats', d: 3, q: M`The mean of $x$, $2x$, and $3x + 6$ is 14. What is $x$?`, a: num(6), sol: M`$6x + 6 = 42$, $x = 6$.` },
    { id: 'd022-p2', skill: 'pa.stats', d: 3, q: M`What is the mode of 4, 7, 7, 2, 9, 4, 7, 1?`, a: num(7), sol: M`7 appears three times.` },
  ] },
  challenge: { items: [
    { id: 'd022-x1', skill: 'pa.stats', d: 4, dok: 3, q: M`The average age of 6 people in a room is 30. When one person leaves, the average age of the rest is 28. How old is the person who left?`, a: num(40), sol: M`Totals: $6\cdot 30 = 180$ and $5\cdot 28 = 140$. The person who left is 40.` },
    { id: 'd022-x2', skill: 'pa.stats', d: 4, dok: 3, q: M`A list of 7 integers has mean 9, median 10, and unique mode 12. What is the smallest possible value in the list?`, a: num(-6), sol: M`Sum 63. Sorted $a\le b\le c\le 10\le e\le f\le g$ with 12 the unique mode. To make the smallest value as small as possible, make everything else as large as allowed while keeping the mode unique: use 12 three times, and $b, c$ different values below 10 as large as possible. Try $a, 8, 9, 10, 12, 12, 12$: sum $63 + \ldots$; $8 + 9 + 10 + 36 = 63$, so $a = 0$. But could $b, c$ be 9 and 9? Then 9 would tie… no: 9 twice and 12 three times keeps 12 the unique mode: $a + 9 + 9 + 10 + 36 = 63$ gives $a = -1$. Could we use four 12s? Then $e, f, g$ plus one more 12 can't fit (only 3 spots above the median). Could the top be larger than 12, like 12, 12, 13? Then only two 12s; the 9s would tie the mode. So the smallest possible value is $-1$.` },
    { id: 'd022-x3', skill: 'pa.stats', d: 5, dok: 3, q: M`Ten numbers have mean 20. When the largest is removed, the mean of the rest is 18. When the smallest is also removed, the mean of the remaining eight is 19. What is the largest minus the smallest?`, a: num(36), sol: M`Totals: 200, then 162 (so the largest is 38), then 152 (so the smallest is 10). Difference 28... check: $9\cdot 18 = 162$, $200 - 162 = 38$; $8\cdot 19 = 152$, $162 - 152 = 10$; $38 - 10 = 28$.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: the "leveling" picture.** Stack blocks for each number. The mean is the height you get if you even out the stacks without adding or removing blocks. Adding a new stack of 24 to eight stacks of 15 and leveling to 16: the new stack gives 1 block to each of the 8 others and keeps 16. So it had $16 + 8 = 24$.` },
    { type: 'key', md: M`Mean problems: write the total. Median problems: sort first.` },
  ],
  cards: [
    { id: 'pa.stats.c1', front: M`If the mean of $n$ numbers is $m$, what is their sum?`, back: M`$mn$.` },
    { id: 'pa.stats.c2', front: M`Median of an even-sized list?`, back: M`Average of the two middle values after sorting.` },
  ],
  book: { ref: 'AoPS Prealgebra §13.1–13.4', assign: 'Exercises in §13.1–13.2, then Chapter 13 Review Problems.' },
},

// =====================================================================================
{ id: 'd023',
  discover: {
    intro: M`Counting sounds easy until the numbers get big. Today: how to count without listing.`,
    problem: { q: M`How many integers are in the list $14, 17, 20, 23, \ldots, 101$?`, a: num(30), sol: M`Subtract 11 from each: $3, 6, \ldots, 90$. Divide by 3: $1, 2, \ldots, 30$. So 30 numbers. (A quick check: $\frac{101 - 14}{3} + 1 = 29 + 1 = 30$.)` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Transforming the list into $1, 2, \ldots, n$ is the most reliable counting trick there is: you can't make an off-by-one error when the list literally reads 1 to 30.` },
    { type: 'key', md: M`**Counting a list:** from $a$ to $b$ inclusive there are $b - a + 1$ integers ("+1" because both ends count). For an arithmetic list with step $d$: $\frac{\text{last} - \text{first}}{d} + 1$.` },
    { type: 'check', item: { id: 'd023-c1', skill: 'pa.count1', d: 2, q: M`How many multiples of 7 are between 100 and 300?`, a: num(28), sol: M`First is 105 ($7\cdot 15$), last is 294 ($7\cdot 42$): $42 - 15 + 1 = 28$.`, mis: { '29': 'Check the ends: $7\\cdot 14 = 98$ is below 100 and $7\\cdot 43 = 301$ is above 300.' } } },
    { type: 'key', md: M`**The multiplication principle:** if one choice can be made in $m$ ways and then, independently, another in $n$ ways, the pair of choices can be made in $m\cdot n$ ways. It extends to any number of steps.` },
    { type: 'example', title: 'License plates', problem: M`A license plate is 2 letters followed by 3 digits. How many plates are possible?`, steps: [
      { md: M`Five slots, filled independently: $26\cdot 26\cdot 10\cdot 10\cdot 10$.` },
      { md: M`$= 676{,}000$.`, fade: { prompt: M`What is $676\cdot 1000$?`, a: num(676000) } },
      { md: M`If letters can't repeat: $26\cdot 25\cdot 1000 = 650{,}000$. Each restriction changes the count at that step.` },
    ] },
    { type: 'example', title: 'Restrictions first', problem: M`How many three-digit numbers have all different digits?`, steps: [
      { md: M`Fill the most restricted place first: the hundreds digit can't be 0, so 9 choices.`, ask: M`Why start with the hundreds digit?`, why: M`It has the extra restriction (not 0). If you filled the ones place first, the number of choices for the hundreds place would depend on whether you'd used 0, which makes the count messy.` },
      { md: M`Then 9 choices for tens (any digit except the one used, 0 now allowed), then 8 for ones: $9\cdot 9\cdot 8 = 648$.` },
    ] },
    { type: 'mistake', md: M`Skylar counted the integers from 20 to 75 inclusive as $75 - 20 = 55$.`, question: 'What is the right count?', options: ['54', '55', '56'], answer: 2, explain: M`$75 - 20$ counts the *gaps* between numbers, not the numbers. With both ends included, add 1: 56. (Check small: 3 to 5 is 3, 4, 5: three numbers, $5 - 3 + 1$.)` },
    { type: 'md', md: M`### Complementary counting
Sometimes it's easier to count what you **don't** want and subtract. How many three-digit numbers contain at least one 7? Count those with **no** 7: $8\cdot 9\cdot 9 = 648$. All three-digit numbers: 900. So $900 - 648 = 252$ contain a 7. Counting "at least one 7" directly would need messy casework.` },
    { type: 'explain', prompt: M`Explain when complementary counting is a good idea.`, model: M`When the thing you want has many cases (like "at least one" of something) but its opposite is a single simple case (like "none"). Count the opposite and subtract from the total.` },
    { type: 'check', item: { id: 'd023-c2', skill: 'pa.count1', d: 4, q: M`How many four-digit numbers have at least one even digit?`, a: num(8375), sol: M`Total 9000. All digits odd: $5^4 = 625$. $9000 - 625 = 8375$.` } },
  ], summary: [
    M`From $a$ to $b$: $b - a + 1$ integers. Transform lists into $1, 2, \ldots, n$.`,
    M`Independent steps multiply. Fill the most restricted position first.`,
    M`"At least one" often means: count "none" and subtract from the total.`,
  ] },
  practice: { items: [
    { id: 'd023-p1', skill: 'pa.count1', d: 3, q: M`A restaurant offers 4 soups, 6 main courses, and 3 desserts. A meal is one of each, but one particular soup can't be paired with 2 of the main courses. How many meals are possible?`, a: num(66), sol: M`Without restriction $4\cdot 6\cdot 3 = 72$. Forbidden: 1 soup × 2 mains × 3 desserts = 6. $72 - 6 = 66$.` },
    { id: 'd023-p2', skill: 'pa.count1', d: 3, q: M`How many odd numbers are between 100 and 200?`, a: num(50), sol: M`101, 103, …, 199: $\frac{199 - 101}{2} + 1 = 50$.` },
  ] },
  challenge: { items: [
    { id: 'd023-x1', skill: 'pa.count1', d: 4, dok: 3, q: M`How many positive integers less than 1000 have no digit equal to 5?`, a: num(728), sol: M`Count 000 to 999 with no 5: $9^3 = 729$ (each digit from 9 options). This includes 000, which isn't positive: 728.`, hints: ['Think of every number as three digits, with leading zeros.'] },
    { id: 'd023-x2', skill: 'pa.count1', d: 4, dok: 3, q: M`How many even three-digit numbers have all different digits?`, a: num(328), sol: M`Casework on the last digit. Ends in 0: $9\cdot 8 = 72$. Ends in 2, 4, 6, or 8: hundreds digit has 8 choices (not 0, not the last digit), tens 8 choices: $4\cdot 8\cdot 8 = 256$. Total 328.` },
    { id: 'd023-x3', skill: 'pa.count1', d: 5, dok: 3, q: M`How many integers from 1 to 1000 are divisible by neither 2 nor 5?`, a: num(400), sol: M`Divisible by 2: 500; by 5: 200; by both (10): 100. By 2 or 5: $500 + 200 - 100 = 600$. Neither: 400.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: a tree.** For the outfits problem with 2 shirts and 3 pants, draw a tree: 2 branches for shirts, and from each, 3 branches for pants. The tips of the tree are the outfits: $2\cdot 3 = 6$. The multiplication principle is just counting the tips of a tree where every branch splits the same way.` },
    { type: 'key', md: M`Off-by-one check: try the smallest version of the problem and count by hand.` },
  ],
  cards: [
    { id: 'pa.count1.c1', front: M`How many integers from $a$ to $b$, inclusive?`, back: M`$b - a + 1$.` },
    { id: 'pa.count1.c2', front: M`What is complementary counting?`, back: M`Count what you don't want, then subtract from the total.` },
  ],
  book: { ref: 'AoPS Prealgebra §14.1–14.2', assign: 'Exercises in §14.1–14.2.' },
},

// =====================================================================================
{ id: 'd024',
  discover: {
    intro: M`When choices interact, you split the problem into cases. And probability is just counting, divided by counting.`,
    problem: { q: M`At a party, 10 people each shake hands with every other person exactly once. How many handshakes are there?`, a: num(45), sol: M`Each person shakes 9 hands: $10\cdot 9 = 90$. But every handshake was counted twice (once from each person), so $90\div 2 = 45$.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Counting from each person's side gives 90, which double-counts each handshake. Dividing by 2 fixes it. **Counting pairs** (where order doesn't matter) is "count ordered, then divide by 2."` },
    { type: 'key', md: M`**Pairs:** the number of ways to choose 2 things from $n$, when order doesn't matter, is $\frac{n(n-1)}{2}$. If order matters (president and vice-president), it's $n(n-1)$.` },
    { type: 'md', md: M`### Casework
When a problem's conditions behave differently in different situations, split into cases that **don't overlap** and **cover everything**, count each, and add.` },
    { type: 'example', title: 'Casework on a digit', problem: M`How many two-digit numbers have digits that add to 11?`, steps: [
      { md: M`Case on the tens digit $t$ (1 to 9). The ones digit must be $11 - t$, which must be 0–9. So $t$ ranges from 2 to 9.`, ask: M`Why can't $t$ be 1?`, why: M`Then the ones digit would be 10, which isn't a digit.` },
      { md: M`That's 8 numbers: 29, 38, 47, 56, 65, 74, 83, 92.`, fade: { prompt: 'How many?', a: num(8) } },
    ] },
    { type: 'key', md: M`**Probability** of an event, when all outcomes are equally likely, is $\dfrac{\text{favorable outcomes}}{\text{total outcomes}}$. Getting it right is all about choosing outcomes that really are equally likely.` },
    { type: 'example', title: 'Two dice', problem: M`Two fair dice are rolled. What is the probability that the sum is 8?`, steps: [
      { md: M`There are 36 equally likely **ordered** outcomes (first die, second die).`, ask: M`Why not use the 11 possible sums (2 through 12) as outcomes?`, why: M`The sums aren't equally likely: 7 can happen 6 ways but 2 only one way. Ordered pairs are equally likely.` },
      { md: M`Sum 8: (2,6), (3,5), (4,4), (5,3), (6,2). Probability $\frac{5}{36}$.`, fade: { prompt: 'The probability:', a: num('5/36') } },
    ] },
    { type: 'mistake', md: M`Logan said: "When flipping two coins, there are three outcomes: 2 heads, 2 tails, or 1 of each. So the chance of 1 of each is $\frac13$."`, question: 'What is the correct probability?', options: ['1/3', '1/2', '1/4'], answer: 1, explain: M`The equally likely outcomes are HH, HT, TH, TT. "One of each" is HT or TH: $\frac24 = \frac12$. Logan's three outcomes aren't equally likely.` },
    { type: 'check', item: { id: 'd024-c1', skill: 'pa.prob', d: 3, q: M`A number is picked at random from 1 to 50. What is the probability it is a multiple of 3 or of 5?`, a: num('23/50'), sol: M`Multiples of 3: 16. Of 5: 10. Of 15: 3. $16 + 10 - 3 = 23$, so $\frac{23}{50}$.` } },
    { type: 'explain', prompt: M`Explain why the probability that something does NOT happen is 1 minus the probability that it does.`, model: M`Every equally likely outcome either is favorable or isn't. So favorable + unfavorable = total, and dividing by the total gives $P(\text{yes}) + P(\text{no}) = 1$.` },
    { type: 'check', item: { id: 'd024-c2', skill: 'pa.count2', d: 3, q: M`How many diagonals does a hexagon have?`, a: num(9), sol: M`Pairs of vertices: $\frac{6\cdot 5}{2} = 15$. Six of those pairs are sides. $15 - 6 = 9$.` } },
  ], summary: [
    M`Unordered pairs from $n$: $\frac{n(n-1)}{2}$. Ordered: $n(n-1)$.`,
    M`Casework: non-overlapping cases that cover everything. Add them.`,
    M`Probability = favorable ÷ total, using outcomes that are truly equally likely.`,
  ] },
  practice: { items: [
    { id: 'd024-p1', skill: 'pa.count2', d: 3, q: M`In how many ways can 5 people line up in a row?`, a: num(120), sol: M`$5\cdot 4\cdot 3\cdot 2\cdot 1 = 120$.` },
    { id: 'd024-p2', skill: 'pa.prob', d: 3, q: M`A bag has 4 red and 6 blue marbles. One is drawn at random. What is the probability it's red?`, a: num('2/5'), sol: M`$\frac{4}{10} = \frac25$.` },
  ] },
  challenge: { items: [
    { id: 'd024-x1', skill: 'pa.count2', d: 4, dok: 3, q: M`How many rectangles of any size are in a 3 by 3 grid of unit squares? (A rectangle's sides must lie along grid lines.)`, a: num(36), sol: M`A rectangle is fixed by choosing 2 of the 4 vertical lines and 2 of the 4 horizontal lines: $\frac{4\cdot 3}{2}\cdot\frac{4\cdot 3}{2} = 6\cdot 6 = 36$.`, hints: ['Every rectangle has a left side, a right side, a top, and a bottom on grid lines.'] },
    { id: 'd024-x2', skill: 'pa.prob', d: 4, dok: 3, q: M`Two fair dice are rolled. What is the probability that the product of the numbers is even?`, a: num('3/4'), sol: M`Complement: the product is odd only when both are odd: $\frac36\cdot\frac36 = \frac14$. So even has probability $\frac34$.` },
    { id: 'd024-x3', skill: 'pa.count2', d: 5, dok: 3, q: M`How many three-digit numbers have digits that add to 5?`, a: num(15), sol: M`Casework on the hundreds digit $h$ from 1 to 5; the other two digits add to $5 - h$, which can be done in $6 - h$ ways: $5 + 4 + 3 + 2 + 1 = 15$.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: a 6×6 grid for two dice.** Draw a table with the first die down the side and the second across the top. Write each sum in its cell. Now any two-dice probability is "count the cells that match, divide by 36." The diagonals of equal sums show why 7 is most likely.` },
    { type: 'key', md: M`If a count could include the same thing twice, ask: how many times was each counted? Then divide.` },
  ],
  cards: [
    { id: 'pa.count2.c1', front: M`Number of handshakes among $n$ people?`, back: M`$\frac{n(n-1)}{2}$.` },
    { id: 'pa.prob.c1', front: M`Probability with equally likely outcomes?`, back: M`favorable ÷ total. Make sure the outcomes you count really are equally likely.` },
  ],
  book: { ref: 'AoPS Prealgebra §14.3–14.6', assign: 'Exercises in §14.3–14.5, then Chapter 14 Review Problems.' },
},

// =====================================================================================
{ id: 'd025',
  discover: {
    intro: M`Today is about problems that aren't about a single topic, the kind contests are made of. The tool is a handful of strategies.`,
    problem: { q: M`What is the units digit of $3^{2025}$?`, a: num(3), sol: M`Units digits of $3^1, 3^2, 3^3, 3^4, 3^5, \ldots$ are $3, 9, 7, 1, 3, \ldots$: they repeat every 4. $2025 = 4\cdot 506 + 1$, so $3^{2025}$ has the same units digit as $3^1$: 3.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Nobody computes $3^{2025}$. The strategy was **find a pattern**: compute small cases, notice they cycle, and use the cycle. This lesson collects four strategies like that.` },
    { type: 'key', md: M`**Four strategies.** (1) **Find a pattern**: try small cases, then generalize. (2) **Make an organized list**: systematic, so nothing is missed or double-counted. (3) **Draw a picture**. (4) **Work backwards** from the end state. And always: try a **simpler version** of the problem first.` },
    { type: 'example', title: 'Find a pattern, then prove it', problem: M`What is $1 + 3 + 5 + \cdots + 99$ (the first 50 odd numbers)?`, steps: [
      { md: M`Small cases: $1 = 1$, $1 + 3 = 4$, $1 + 3 + 5 = 9$, $1 + 3 + 5 + 7 = 16$. Squares!` },
      { md: M`Guess: the first $n$ odd numbers add to $n^2$. Here $n = 50$: 2500.`, ask: M`Why is the pattern true? (Hint: picture an $n\times n$ square of dots.)`, why: M`Going from an $n\times n$ square to $(n+1)\times(n+1)$ adds an L-shaped border of $2n + 1$ dots, the next odd number. So each odd number grows the square by one size.` },
      { md: M`A pattern is a guess until you can say why it holds. That's the difference between noticing and knowing.` },
    ] },
    { type: 'example', title: 'Work backwards', problem: M`Ana had some stickers. She gave half to Ben, then gave 3 to Cy, then had 7 left. How many did she start with?`, steps: [
      { md: M`Before giving 3 to Cy: $7 + 3 = 10$.` },
      { md: M`Before giving half to Ben, she had twice that: 20.`, fade: { prompt: 'She started with…', a: num(20) } },
    ] },
    { type: 'check', item: { id: 'd025-c1', skill: 'pa.strat', d: 3, q: M`What is the units digit of $7^{100}$?`, a: num(1), sol: M`Units digits of powers of 7: 7, 9, 3, 1, repeating every 4. $100$ is a multiple of 4, so the units digit is 1.` } },
    { type: 'mistake', md: M`Rory saw $2, 4, 8, \ldots$ and claimed the next term must be 16.`, question: 'Is that guaranteed?', options: ['Yes, it doubles', 'No, other rules fit too (like 2, 4, 8, 14 with differences 2, 4, 6)', 'Yes, it must be powers of 2'], answer: 1, explain: M`Many rules produce 2, 4, 8. Doubling gives 16, but "add 2, then 4, then 6" gives 14. A few terms never determine a pattern by themselves. That's why the reasoning step matters.` },
    { type: 'example', title: 'Organized list', problem: M`How many ways can you make 25 cents from nickels, dimes, and quarters?`, steps: [
      { md: M`List by number of quarters, then dimes: 1 quarter. 0 quarters: 2 dimes + 1 nickel; 1 dime + 3 nickels; 0 dimes + 5 nickels.` },
      { md: M`Total: 4 ways.`, fade: { prompt: 'How many ways?', a: num(4) } },
    ] },
    { type: 'explain', prompt: M`Explain why making a list in a fixed order (like "most quarters first") is better than listing whatever comes to mind.`, model: M`A fixed order makes sure every case appears exactly once: you can see where each item belongs and notice gaps. Random listing easily misses a case or repeats one.` },
    { type: 'check', item: { id: 'd025-c2', skill: 'pa.strat', d: 4, q: M`The pattern of dots 1, 3, 6, 10, … adds a row each time. How many dots are in the 20th figure?`, a: num(210), sol: M`$1 + 2 + \cdots + 20 = \frac{20\cdot 21}{2} = 210$.` } },
  ], summary: [
    M`Try small cases → spot a pattern → explain why it must continue.`,
    M`Organized lists avoid missing and double counting.`,
    M`Work backwards when you know the end state.`,
  ] },
  practice: { items: [
    { id: 'd025-p1', skill: 'pa.strat', d: 3, q: M`What is the 50th term of 3, 7, 11, 15, …?`, a: num(199), sol: M`$3 + 49\cdot 4 = 199$.` },
    { id: 'd025-p2', skill: 'pa.strat', d: 4, q: M`What is the sum $2 + 4 + 6 + \cdots + 100$?`, a: num(2550), sol: M`$2(1 + 2 + \cdots + 50) = 2\cdot 1275 = 2550$.` },
  ] },
  challenge: { items: [
    { id: 'd025-x1', skill: 'pa.strat', d: 4, dok: 3, q: M`What is the units digit of $1! + 2! + 3! + \cdots + 100!$?`, a: num(3), sol: M`From $5!$ on, every factorial ends in 0. $1 + 2 + 6 + 24 = 33$: units digit 3.`, hints: ['What is the units digit of $5!$? Of $6!$?'] },
    { id: 'd025-x2', skill: 'pa.strat', d: 4, dok: 3, q: M`A frog is at the bottom of a 20-foot well. Each day it climbs 5 feet; each night it slides back 3 feet. On which day does it first reach the top?`, a: num(8), sol: M`After each full day-night it gains 2 feet. At the start of day 8 it is at $7\cdot 2 = 14$ feet; climbing 5 that day gets it to 19… not yet. Start of day 9: 16 feet; climbing 5 reaches 21 ≥ 20. Day 9. Let's recheck: start of day $k$ it's at $2(k-1)$; it escapes on day $k$ if $2(k-1) + 5 \ge 20$, i.e. $k \ge 8.5$. So day 9.` },
    { id: 'd025-x3', skill: 'pa.strat', d: 5, dok: 3, q: M`How many squares of any size are on an 8 by 8 chessboard?`, a: num(204), sol: M`$k\times k$ squares: $(9 - k)^2$ positions. Sum $8^2 + 7^2 + \cdots + 1^2 = 204$.`, hints: ['Count 1×1 squares, then 2×2, then 3×3… Look for the pattern on a 2×2 or 3×3 board first.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: shrink the problem.** If a problem has a big number in it (like 2025 or 100), replace the big number with 1, 2, 3, 4 and solve those tiny versions by hand. Write the answers in a table. The table usually shows the rule, and the tiny cases help you see *why*.` },
    { type: 'key', md: M`Stuck? Try a smaller version of the same problem.` },
  ],
  cards: [
    { id: 'pa.strat.c1', front: M`$1 + 2 + \cdots + n = ?$`, back: M`$\frac{n(n+1)}{2}$.` },
    { id: 'pa.strat.c2', front: M`Sum of the first $n$ odd numbers?`, back: M`$n^2$.` },
  ],
  book: { ref: 'AoPS Prealgebra §15.1–15.5', assign: 'Exercises in §15.1–15.4, then Chapter 15 Review Problems.' },
},

// =====================================================================================
{ id: 'd026',
  discover: {
    intro: M`A synthesis day. Every problem today could come from any of the last four weeks, and part of the job is figuring out which tool fits.`,
    problem: { q: M`The product of three consecutive positive integers is 16 times their sum. What is the sum of the three integers?`, a: num(21), sol: M`Let them be $n - 1, n, n + 1$. Sum $3n$, product $(n-1)n(n+1)$. So $(n - 1)n(n + 1) = 48n$, giving $(n-1)(n+1) = 48$, $n^2 = 49$, $n = 7$. Integers 6, 7, 8; sum 21.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Choosing the middle integer as $n$ made the algebra symmetric: the sum became $3n$, and the $n$ cancelled cleanly. Choosing a good variable is half of most contest problems.` },
    { type: 'md', md: M`### How to approach a mixed problem
1. **Read it twice.** What exactly is being asked? Underline it.
2. **Identify the topic** it lives in: arithmetic, number theory, fractions, equations, geometry, counting?
3. **Try something.** A small case, a picture, a variable, a list.
4. **Check** the answer against the question and against common sense.

Today's practice is all mixed (interleaved) on purpose. Research on middle-school math found that mixing problem types, so you have to *choose* the method each time, roughly doubled scores on a delayed test compared with practicing one type at a time.` },
    { type: 'key', md: M`When you're stuck, ask: **What does this remind me of?** Most contest problems are a familiar idea wearing a costume.` },
    { type: 'example', title: 'Which tool?', problem: M`How many positive divisors of 600 are odd?`, steps: [
      { md: M`Number theory. $600 = 2^3\cdot 3\cdot 5^2$.` },
      { md: M`An odd divisor uses no 2s: it divides $3\cdot 5^2 = 75$, which has $(1+1)(2+1) = 6$ divisors.`, fade: { prompt: 'How many odd divisors?', a: num(6) } },
    ] },
    { type: 'example', title: 'Which tool?', problem: M`A square and an equilateral triangle have the same perimeter. The square's side is 9. What is the triangle's side?`, steps: [
      { md: M`Square perimeter $36$. Triangle side $36\div 3 = 12$.`, fade: { prompt: 'Triangle side:', a: num(12) } },
    ] },
    { type: 'check', item: { id: 'd026-c1', skill: 'pa.strat', d: 4, q: M`What is the smallest positive integer that leaves remainder 1 when divided by 2, 3, 4, 5, and 6?`, a: num(61), sol: M`$n - 1$ is divisible by 2, 3, 4, 5, 6, so by $\text{lcm} = 60$. Smallest $n$ greater than 1: 61.` } },
    { type: 'check', item: { id: 'd026-c2', skill: 'pa.pct', d: 3, q: M`A number is increased by 25% and the result is decreased by 20%. What percent of the original is the final number?`, a: num(100), sol: M`$1.25\cdot 0.8 = 1$: back to 100%.` } },
  ], summary: [
    M`Read twice; name the topic; try something; check.`,
    M`Choose variables that make things symmetric (like the middle of consecutive numbers).`,
    M`Mixed practice is harder in the moment and works better in the long run.`,
  ] },
  practice: { items: [] },
  challenge: { items: [
    { id: 'd026-x1', skill: 'pa.strat', d: 4, dok: 3, q: M`How many positive integers $n$ make $\frac{120}{n}$ an integer greater than 5?`, a: num(11), sol: M`$\frac{120}{n} > 5$ means $n < 24$. Divisors of 120 below 24: 1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20: eleven.` },
    { id: 'd026-x2', skill: 'pa.pyth', d: 4, dok: 3, q: M`A rectangle has perimeter 34 and diagonal 13. What is its area?`, a: num(60), sol: M`$l + w = 17$ and $l^2 + w^2 = 169$. Since $(l + w)^2 = l^2 + 2lw + w^2$: $289 = 169 + 2lw$, so $lw = 60$. (It's a 5 by 12 rectangle.)`, hints: ['Square $l + w$.'] },
    { id: 'd026-x3', skill: 'pa.count2', d: 5, dok: 3, q: M`In how many ways can you arrange the letters of the word LEVEL? (The two Ls are identical, and so are the two Es.)`, a: num(30), sol: M`If all five letters were different: $5! = 120$. Swapping the two Ls doesn't change an arrangement, nor does swapping the Es, so each is counted $2\cdot 2 = 4$ times: $120\div 4 = 30$.` },
  ] },
  book: { ref: 'AoPS Prealgebra Ch. 15 Challenge Problems', assign: 'Pick any 6 Challenge Problems from Chapters 10–15 that you haven\'t done.' },
  cards: [],
},
];

// fix-ups after review: clean final statements for three problems
const fix = (id, patch) => { for (const d of days) for (const key of ['challenge', 'practice']) for (const [i, it] of ((d[key] && d[key].items) || []).entries()) if (it.id === id) d[key].items[i] = { ...it, ...patch }; for (const d of days) for (const s of (d.learn?.sections || [])) if (s.item && s.item.id === id) s.item = { ...s.item, ...patch }; };
fix('d022-c2', { a: num(22), sol: M`The sum is $5\cdot 10 = 50$ and the middle number is 12. To make the largest as big as possible, make the others as small as possible: the two below the median are 1 and 2, and the one above the median (but below the largest) must be at least 13. Largest: $50 - 1 - 2 - 12 - 13 = 22$. Check: 1, 2, 12, 13, 22.` });
fix('d022-x2', { a: num(-1), sol: M`The sum is $7\cdot 9 = 63$ and the middle value is 10. To make the smallest value as small as possible, make the others as large as the rules allow. Above the median there are three spots; making them 12, 12, 12 uses the mode as much as possible. Below the median, the two values next to the smallest can be at most 9 each, and two 9s are fine because 12 still appears more often. So $a + 9 + 9 + 10 + 12 + 12 + 12 = 63$ gives $a = -1$.` });
fix('d022-x2', { q: M`A list of 7 positive integers has mean 9, median 10, and a unique mode of 12. What is the largest possible value in the list?`, a: num(23), sol: M`The sum is $7\cdot 9 = 63$ and the middle (4th) value is 10. 12 must appear more often than any other value. To make the largest value as big as possible, keep everything else small: the three values below the median should be as small as possible without creating a rival mode, so 1, 2, 3; the two values just above the median are 12 and 12. Then $1 + 2 + 3 + 10 + 12 + 12 + g = 63$ gives $g = 23$. (Using three 12s would make the largest value 12.)` });
fix('d022-x3', { a: num(28), sol: M`Totals: $10\cdot 20 = 200$; without the largest $9\cdot 18 = 162$, so the largest is 38; without the smallest too $8\cdot 19 = 152$, so the smallest is 10. Difference $38 - 10 = 28$.` });
fix('d025-x2', { a: num(9), sol: M`After each full day and night the frog gains 2 feet, so at the start of day $k$ it is $2(k-1)$ feet up. It gets out on day $k$ if $2(k-1) + 5 \ge 20$, that is $k \ge 8.5$. So the first day it reaches the top is day 9 (it starts that day at 16 feet and climbs to 21).` });

// ======================= contest bank (used in Trial-day contest sets and as extra challenges) =======================
export const bank = [
  { id: 'b1-01', skill: 'pa.props', d: 3, dok: 3, q: M`Compute $999 + 998 + 997 + 3 + 2 + 1$ (just these six numbers).`, a: num(3000), sol: M`Pair them: $(999 + 1) + (998 + 2) + (997 + 3) = 3000$.` },
  { id: 'b1-02', skill: 'pa.signed', d: 3, dok: 3, q: M`Compute $(-1)^1 + (-1)^2 + (-1)^3 + \cdots + (-1)^{2025}$.`, a: num(-1), sol: M`Consecutive pairs cancel; there are 2025 terms, so 1012 pairs cancel and the last term $(-1)^{2025} = -1$ remains.` },
  { id: 'b1-03', skill: 'pa.exp', d: 4, dok: 3, q: M`What is $\dfrac{2^{2025} + 2^{2023}}{2^{2024} - 2^{2022}}$?`, a: num('10/3'), sol: M`Factor $2^{2022}$ from both: $\frac{2^3 + 2}{2^2 - 1} = \frac{10}{3}$.` },
  { id: 'b1-04', skill: 'pa.divis', d: 4, dok: 3, q: M`What is the largest three-digit multiple of 9 whose digits are all different and all odd?`, a: num(975), sol: M`Odd digits with a digit sum that's a multiple of 9: sum 9 (like 135) or 27 is impossible with different odd digits below 10 except… $9 + 7 + 5 = 21$, $9 + 7 + 3 = 19$; the multiples of 9 reachable are 9 and 18? 18 is even and three odd digits sum to odd. So the sum must be 9 or 27: 27 needs 9+9+9 (not different). Sum 9: $\{1, 3, 5\}$: largest 531.` },
  { id: 'b1-05', skill: 'pa.primes', d: 4, dok: 3, q: M`The sum of two prime numbers is 85. What is their product?`, a: num(166), sol: M`An odd sum of two primes needs one of them to be 2 (otherwise both are odd and the sum is even). So the primes are 2 and 83, product 166.` },
  { id: 'b1-06', skill: 'pa.gcdlcm', d: 4, dok: 3, q: M`What is the smallest positive integer $n$ such that $\text{lcm}(n, 18) = 72$?`, a: num(8), sol: M`$72 = 2^3\cdot 3^2$ and $18 = 2\cdot 3^2$. $n$ must supply $2^3$ and may use $3^0$, $3^1$, or $3^2$. Smallest: $n = 8$.` },
  { id: 'b1-07', skill: 'pa.frac.as', d: 4, dok: 3, q: M`Compute $\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \dfrac{1}{16} + \dfrac{1}{32}$.`, a: num('31/32'), sol: M`Each term fills half of what's left of 1; after five terms, $\frac{1}{32}$ is missing: $\frac{31}{32}$.` },
  { id: 'b1-08', skill: 'pa.lineq', d: 4, dok: 3, q: M`Twice a number is 12 more than half the number. What is the number?`, a: num(8), sol: M`$2x = \frac x2 + 12$, $\frac{3x}{2} = 12$, $x = 8$.` },
  { id: 'b1-09', skill: 'pa.ratio', d: 4, dok: 3, q: M`In a bag of red and green candies, the ratio of red to green is 3 : 5. After 12 red candies are eaten, the ratio is 1 : 5. How many green candies are there?`, a: num(30), sol: M`Red $3k$, green $5k$. After: $\frac{3k - 12}{5k} = \frac15$, so $3k - 12 = k$, $k = 6$. Green: 30.` },
  { id: 'b1-10', skill: 'pa.pct', d: 4, dok: 3, q: M`If $x$ is 50% more than $y$, then $y$ is what percent less than $x$? (A fraction like 100/3 is fine.)`, a: num('100/3'), sol: M`$x = 1.5y$, so $y = \frac23x$: $\frac13$ less, which is $33\tfrac13\%$.` },
  { id: 'b1-11', skill: 'pa.sqrt', d: 4, dok: 3, q: M`What is $\sqrt{16\cdot 25\cdot 36\cdot 49}$?`, a: num(840), sol: M`$4\cdot 5\cdot 6\cdot 7 = 840$.` },
  { id: 'b1-12', skill: 'pa.angles', d: 4, dok: 3, q: M`The angles of a triangle are in the ratio $2 : 3 : 7$. What is the largest angle, in degrees?`, a: num(105), sol: M`12 parts make 180°, so 15° per part; largest $7\cdot 15 = 105°$.` },
  { id: 'b1-13', skill: 'pa.area', d: 4, dok: 3, q: M`A square's perimeter equals the perimeter of a 6 by 10 rectangle. How much larger is the square's area than the rectangle's?`, a: num(4), sol: M`Perimeter 32, so the square's side is 8, area 64. The rectangle's area is 60. Difference 4.` },
  { id: 'b1-14', skill: 'pa.pyth', d: 4, dok: 3, q: M`A right triangle has a hypotenuse of 10 and an area of 24. What is its perimeter?`, a: num(24), sol: M`$a^2 + b^2 = 100$ and $ab = 48$. $(a + b)^2 = 100 + 96 = 196$, so $a + b = 14$; perimeter 24 (it's 6-8-10).` },
  { id: 'b1-15', skill: 'pa.stats', d: 4, dok: 3, q: M`The mean of five numbers is 12. If one number is changed from 20 to 5, what is the new mean?`, a: num(9), sol: M`The total drops by 15, from 60 to 45: mean 9.` },
  { id: 'b1-16', skill: 'pa.count1', d: 4, dok: 3, q: M`How many integers from 1 to 100, inclusive, are perfect squares or perfect cubes?`, a: num(12), sol: M`Squares: 10 (1 to 100). Cubes: 4 (1, 8, 27, 64). Both (sixth powers): 1 and 64. $10 + 4 - 2 = 12$.` },
  { id: 'b1-17', skill: 'pa.count2', d: 4, dok: 3, q: M`In how many ways can 3 different prizes be given to 5 students if no student gets more than one prize?`, a: num(60), sol: M`$5\cdot 4\cdot 3 = 60$.` },
  { id: 'b1-18', skill: 'pa.prob', d: 4, dok: 3, q: M`Three fair coins are flipped. What is the probability of getting at least two heads?`, a: num('1/2'), sol: M`HHH, HHT, HTH, THH: 4 of 8.` },
  { id: 'b1-19', skill: 'pa.strat', d: 4, dok: 3, q: M`What is the sum of the digits of $10^{25} - 25$?`, a: num(219), sol: M`$10^{25} - 25 = 999\ldots975$ with twenty-three 9s followed by 7 and 5. Digit sum: $23\cdot 9 + 7 + 5 = 219$.`, hints: ['Try $10^3 - 25$ and $10^4 - 25$ first.'] },
  { id: 'b1-20', skill: 'pa.dec', d: 4, dok: 3, q: M`What is $0.\overline{3}\times 0.\overline{6}$ as a fraction?`, a: num('2/9'), sol: M`$\frac13\cdot\frac23 = \frac29$.` },
  { id: 'b1-21', skill: 'pa.circle', d: 4, dok: 3, q: M`Two circles have circumferences in the ratio 2 : 3. What is the ratio of their areas? Give smaller over larger as a fraction.`, a: num('4/9'), sol: M`Radii are in ratio 2 : 3, areas in ratio $4 : 9$.` },
  { id: 'b1-22', skill: 'pa.rates', d: 4, dok: 3, q: M`A 300-meter train passes a pole in 15 seconds. How many seconds does it take to completely cross a 600-meter bridge at the same speed?`, a: num(45), sol: M`Speed 20 m/s. Crossing completely means traveling bridge + train $= 900$ m: 45 seconds.` },
  { id: 'b1-23', skill: 'pa.expr', d: 4, dok: 3, q: M`If $3x + 2y = 12$ and $x + 4y = 14$, what is $x + y$?`, a: num('26/5'), sol: M`Add the equations: $4x + 6y = 26$... that gives $2x + 3y = 13$. Instead solve: from the second, $x = 14 - 4y$; substitute: $42 - 12y + 2y = 12$, $y = 3$, $x = 2$. So $x + y = 5$.` },
  { id: 'b1-24', skill: 'pa.ineq', d: 4, dok: 3, q: M`How many integers $n$ satisfy $n^2 < 50$?`, a: num(15), sol: M`$n$ from $-7$ to $7$ (since $7^2 = 49$, $8^2 = 64$): 15 integers.` },
  { id: 'b1-25', skill: 'pa.factor', d: 4, dok: 3, q: M`How many positive divisors of $2^4\cdot 3^3$ are multiples of 6?`, a: num(12), sol: M`A multiple of 6 needs at least one 2 and one 3: exponent of 2 from 1–4 (4 choices), of 3 from 1–3 (3 choices): 12.` },
];
// fix-ups for two bank items after review
bank[3] = { ...bank[3], a: num(531), sol: M`Three different odd digits add to an odd number, so a multiple of 9 must be 9 or 27. 27 would need $9 + 9 + 9$, which repeats. So the digit sum is 9, and the only set of three different odd digits with sum 9 is $\{1, 3, 5\}$. Largest arrangement: 531.` };
bank[22] = { ...bank[22], a: num(5), sol: M`From the second equation $x = 14 - 4y$. Substitute: $3(14 - 4y) + 2y = 12$, so $42 - 10y = 12$, $y = 3$, $x = 2$. Then $x + y = 5$.` };

// ======================= Month 1 Benchmark (day 28): 25 original contest-style problems =======================
const B = (n, skill, d, q, a, sol) => ({ id: `bm1-${String(n).padStart(2, '0')}`, use: 'benchmark', session: 'd028', skill, d, dok: d >= 4 ? 3 : 2, q, a, sol });
export const benchmark = [
  B(1, 'pa.props', 1, M`What is $25\cdot 16\cdot 125\cdot 8$?`, num(400000), M`$(25\cdot 16)(125\cdot 8) = 400\cdot 1000 = 400{,}000$.`),
  B(2, 'pa.signed', 1, M`What is $-5 - (-3) \cdot 4$?`, num(7), M`Multiply first: $(-3)\cdot 4 = -12$; $-5 - (-12) = 7$.`),
  B(3, 'pa.frac.as', 2, M`What is $\frac{2}{3} + \frac{3}{4} - \frac{5}{6}$?`, num('7/12'), M`$\frac{8 + 9 - 10}{12} = \frac{7}{12}$.`),
  B(4, 'pa.pct', 2, M`What is 40% of 25% of 600?`, num(60), M`$0.4\cdot 0.25\cdot 600 = 60$.`),
  B(5, 'pa.exp', 2, M`What is $\dfrac{3^{10}}{3^7} - 3^{-1}\cdot 3^1$?`, num(26), M`$3^3 - 3^0 = 27 - 1 = 26$.`),
  B(6, 'pa.lineq', 2, M`If $4(x - 3) = 2x + 6$, what is $x$?`, num(9), M`$4x - 12 = 2x + 6$, $2x = 18$, $x = 9$.`),
  B(7, 'pa.angles', 2, M`What is the measure, in degrees, of each interior angle of a regular octagon?`, num(135), M`$\frac{180\cdot 6}{8} = 135$.`),
  B(8, 'pa.ratio', 2, M`A map uses a scale of 2 cm to 15 km. Two towns are 9 cm apart on the map. How many kilometers apart are they?`, num(67.5), M`$9\cdot\frac{15}{2} = 67.5$ km.`),
  B(9, 'pa.stats', 3, M`The average of 6 numbers is 15. The average of 4 of them is 12. What is the average of the other 2?`, num(21), M`Totals $90$ and $48$; the other two sum to 42, average 21.`),
  B(10, 'pa.gcdlcm', 3, M`Red lights blink every 6 seconds, blue every 8, and green every 10. They all blink together at noon. How many seconds until they next all blink together?`, num(120), M`$\text{lcm}(6, 8, 10) = 120$.`),
  B(11, 'pa.factor', 3, M`How many positive divisors does 2025 have?`, num(15), M`$2025 = 3^4\cdot 5^2$: $(4+1)(2+1) = 15$.`),
  B(12, 'pa.sqrt', 3, M`Which integer is closest to $\sqrt{130}$?`, num(11), M`$11^2 = 121$, $12^2 = 144$; 130 is closer to 121 (9 away vs. 14 away), and $11.5^2 = 132.25 > 130$, so $\sqrt{130} < 11.5$: closest integer 11.`),
  B(13, 'pa.count1', 3, M`How many three-digit numbers have a tens digit of 0 and a units digit greater than the hundreds digit?`, num(36), M`Hundreds $h$ from 1 to 9, units digit from $h + 1$ to 9: $8 + 7 + \cdots + 0 = 36$.`),
  B(14, 'pa.pyth', 3, M`A rectangle has length 24 and diagonal 25. What is its area?`, num(168), M`Width $\sqrt{625 - 576} = 7$; area $168$.`),
  B(15, 'pa.prob', 3, M`A card is drawn at random from cards numbered 1 to 20. What is the probability that the number is prime?`, num('2/5'), M`Primes up to 20: 2, 3, 5, 7, 11, 13, 17, 19: 8 of 20.`),
  B(16, 'pa.rates', 3, M`Ana reads 30 pages an hour and Ben reads 20. They start the same 300-page book at the same time. How many pages ahead is Ana when Ben has read half the book?`, num(75), M`Ben reads 150 pages in 7.5 hours; Ana reads $30\cdot 7.5 = 225$ pages, so she is 75 pages ahead.`),
  B(17, 'pa.circle', 4, M`A circle of radius 6 is inside a square, touching all four sides. What is the area inside the square but outside the circle? (In terms of π.)`, num('144-36pi', { display: '$144 - 36\\pi$' }), M`Square side 12, area 144; circle area $36\pi$; difference $144 - 36\pi$.`),
  B(18, 'pa.divis', 4, M`The five-digit number $\overline{24A68}$ is divisible by 3 and by 4... how many digits $A$ make it divisible by both?`, num(3), M`By 4: the last two digits 68 are a multiple of 4, so always. By 3: $2 + 4 + A + 6 + 8 = 20 + A$, a multiple of 3 when $A$ is 1, 4, or 7: three digits.`),
  B(19, 'pa.count2', 4, M`Eight teams play in a league where every team plays every other team twice. How many games are played?`, num(56), M`$\frac{8\cdot 7}{2}\cdot 2 = 56$.`),
  B(20, 'pa.pct', 4, M`A store raises a price by 20%, then lowers the new price by 25%. The final price is \$36. What was the original price?`, num(40), M`Multiplier $1.2\cdot 0.75 = 0.9$; original $= 36\div 0.9 = 40$.`),
  B(21, 'pa.strat', 4, M`What is the units digit of $2^{2026}$?`, num(4), M`Units digits of powers of 2 cycle 2, 4, 8, 6 (period 4). $2026 = 4\cdot 506 + 2$, so the units digit is 4.`),
  B(22, 'pa.area', 4, M`The vertices of a triangle are $(0, 0)$, $(8, 0)$, and $(5, 6)$. What is its area?`, num(24), M`Base 8 along the x-axis, height 6: area 24.`),
  B(23, 'pa.frac.md', 5, M`Compute $\left(1 + \frac12\right)\left(1 + \frac13\right)\left(1 + \frac14\right)\cdots\left(1 + \frac{1}{99}\right)$.`, num(50), M`Each factor is $\frac{k+1}{k}$: $\frac32\cdot\frac43\cdots\frac{100}{99} = \frac{100}{2} = 50$.`),
  B(24, 'pa.wordeq', 5, M`A group of kids shares a bag of candy. If each kid takes 5, there are 3 left over. If each takes 6, they are 4 short. How many candies are in the bag?`, num(38), M`$5k + 3 = 6k - 4$, so $k = 7$ kids and $38$ candies.`),
  B(25, 'pa.count2', 5, M`How many ways can you choose 2 different numbers from $\{1, 2, 3, \ldots, 10\}$ so that their sum is even?`, num(20), M`The sum is even when both are odd or both are even: $\frac{5\cdot 4}{2} + \frac{5\cdot 4}{2} = 10 + 10 = 20$.`),
];
benchmark[17] = { ...benchmark[17], q: M`The five-digit number $\overline{24A68}$ is divisible by 12. How many digits $A$ are possible?` };
