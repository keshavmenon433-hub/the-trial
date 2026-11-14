// Month 1, week 1 lessons (days 1–6). Original content written for The Trial.
// Lesson design per day: productive-failure opener → worked examples with self-explanation and faded steps →
// a common-mistake analysis → checks → summary + recall cards → challenge problems → a reteach from a second angle.
const M = String.raw;
const num = (v, extra = {}) => ({ type: 'number', value: String(v), ...extra });
const choice = (options, value) => ({ type: 'choice', options, value });

const rectSVG = (a, b, c) => `<svg viewBox="0 0 360 150" width="360" xmlns="http://www.w3.org/2000/svg" font-family="Georgia, serif" font-size="15">
<rect x="40" y="20" width="200" height="90" fill="#E8EEFC" stroke="#22262B" stroke-width="2"/>
<rect x="240" y="20" width="80" height="90" fill="#FFF4D6" stroke="#22262B" stroke-width="2"/>
<text x="20" y="70" text-anchor="middle">${a}</text><text x="140" y="135" text-anchor="middle">${b}</text><text x="280" y="135" text-anchor="middle">${c}</text>
<text x="140" y="70" text-anchor="middle">${a} × ${b}</text><text x="280" y="70" text-anchor="middle">${a} × ${c}</text></svg>`;

export const days = [
// =====================================================================================
{ id: 'd001',
  discover: {
    intro: M`Welcome to Day 1. Every day starts like this: a problem you haven't been taught yet. Don't wait to be shown how. Poke at it.`,
    problem: { q: M`Compute $37\cdot 48 + 37\cdot 52$. Try to do it **without** multiplying $37\cdot 48$ out.`, a: num(3700), sol: M`Both products contain 37. Taking 37 out: $37(48+52) = 37\cdot 100 = 3700$. Today is about *why* that move is allowed.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`If you found 3700 quickly, you probably noticed that both terms are "37 of something": 37 groups of 48 plus 37 groups of 52 is 37 groups of 100. If you multiplied everything out, you got there too, just with more work. Today's lesson is the small set of rules that make the shortcut legal. Every step you will ever take in algebra is one of these rules.` },
    { type: 'md', md: M`### Order and grouping
Adding $5 + 8$ or $8 + 5$ gives the same total: the **order** doesn't matter. The same is true for multiplication: $6\cdot 7 = 7\cdot 6$. This is the **commutative** property:
$$a + b = b + a \qquad a\cdot b = b\cdot a.$$
When you add three numbers, you have to do one addition first. $(2 + 9) + 1$ and $2 + (9 + 1)$ both give 12: the **grouping** doesn't matter. This is the **associative** property:
$$(a + b) + c = a + (b + c) \qquad (a\cdot b)\cdot c = a\cdot (b\cdot c).$$
Together they say: in a pure sum, or a pure product, you may reorder and regroup however you like.` },
    { type: 'example', title: 'Regrouping to make round numbers', problem: M`Compute $4\cdot 17\cdot 25$.`, steps: [
      { md: M`Reorder so the friendly pair sits together: $4\cdot 17\cdot 25 = 17\cdot 4\cdot 25$.`, ask: M`Which property lets us swap the 4 and the 17?`, why: M`The commutative property of multiplication: order doesn't matter in a product.` },
      { md: M`Group the friendly pair first: $17\cdot(4\cdot 25)$.`, ask: M`And which property lets us choose which pair to multiply first?`, why: M`The associative property: grouping doesn't matter in a product.` },
      { md: M`$4\cdot 25 = 100$, so the product is $17\cdot 100 = 1700$.`, fade: { prompt: M`Finish it: what is $17\cdot(4\cdot 25)$?`, a: num(1700) } },
    ] },
    { type: 'check', item: { id: 'd001-c1', skill: 'pa.props', d: 2, q: M`Compute $125\cdot 13\cdot 8$.`, a: num(13000), sol: M`$125\cdot 8 = 1000$, so the product is $13\cdot 1000 = 13000$.`, hints: ['Which two of the numbers multiply to a power of 10?'] } },
    { type: 'md', md: M`### Subtraction and division are different
Try the same moves with subtraction: $10 - 3 = 7$ but $3 - 10 = -7$. Order matters. And $(10 - 5) - 2 = 3$ while $10 - (5 - 2) = 7$. Grouping matters too. Division behaves the same way: $12\div 6 \ne 6\div 12$. That's one reason mathematicians prefer to think of subtraction as *adding a negative* and division as *multiplying by a reciprocal*; you'll see why tomorrow.` },
    { type: 'explain', prompt: M`Is $(24 \div 4)\div 2$ equal to $24\div(4\div 2)$? Compute both and explain what your answer says about division.`, model: M`$(24\div 4)\div 2 = 6\div 2 = 3$, but $24\div(4\div 2) = 24\div 2 = 12$. Since the groupings give different answers, division is **not** associative: you can't regroup a chain of divisions freely.` },
    { type: 'md', md: M`### Identities
Two numbers do nothing: adding 0 and multiplying by 1.
$$a + 0 = a \qquad a\cdot 1 = a.$$
And multiplying by 0 always gives 0: $a\cdot 0 = 0$. These sound obvious, but in algebra they're tools: "multiply by 1" in a clever form (like $\tfrac{3}{3}$) is how you'll change fractions without changing their value.` },
    { type: 'key', md: M`**The distributive property** connects multiplication and addition:
$$a(b + c) = ab + ac.$$
Read left to right, it lets you **expand**. Read right to left, it lets you **factor out** a common factor, which is exactly what $37\cdot 48 + 37\cdot 52 = 37(48 + 52)$ did.` },
    { type: 'svg', svg: rectSVG('a', 'b', 'c'), caption: M`Why it's true: a rectangle $a$ tall and $b + c$ wide has area $a(b+c)$. Split it into two rectangles and the area is $ab + ac$. Same rectangle, same area.` },
    { type: 'example', title: 'Distributing to make mental math easy', problem: M`Compute $7\cdot 98$ in your head.`, steps: [
      { md: M`Write $98$ as $100 - 2$: $7\cdot 98 = 7(100 - 2)$.` },
      { md: M`Distribute: $7\cdot 100 - 7\cdot 2 = 700 - 14$.`, ask: M`The distributive property was written with a plus sign. Why does it also work with a minus sign?`, why: M`Because $100 - 2 = 100 + (-2)$. Subtracting is adding a negative, so $7(100 + (-2)) = 700 + (-14)$.` },
      { md: M`$700 - 14 = 686$.`, fade: { prompt: M`What is $700 - 14$?`, a: num(686) } },
    ] },
    { type: 'example', title: 'Factoring out', problem: M`Compute $23\cdot 17 + 23\cdot 83$.`, steps: [
      { md: M`Both terms have a factor of 23. Factor it out: $23(17 + 83)$.` },
      { md: M`$17 + 83 = 100$, so the answer is $2300$.`, fade: { prompt: M`Finish: $23(17+83) = ?$`, a: num(2300) } },
    ] },
    { type: 'mistake', md: M`Riley computed $2\cdot(3\cdot 5)$ like this:

1. $2\cdot(3\cdot 5) = (2\cdot 3)\cdot(2\cdot 5)$
2. $= 6\cdot 10$
3. $= 60$`, question: 'Which line has the mistake?', options: ['Line 1', 'Line 2', 'Line 3'], answer: 0, explain: M`Line 1 "distributed" the 2 over a **product**. The distributive property only works over a sum: $a(b+c) = ab + ac$. For a product, $2\cdot(3\cdot 5)$ just regroups to $(2\cdot 3)\cdot 5 = 30$. Multiplying by 2 once doubles the product; Riley doubled it twice.` },
    { type: 'compare', left: { title: 'Method A: multiply it out', md: M`$19\cdot 21$: $19\cdot 20 = 380$, plus $19\cdot 1 = 19$, total $399$.` }, right: { title: 'Method B: split the other number', md: M`$19\cdot 21 = (20 - 1)\cdot 21 = 420 - 21 = 399$.` }, ask: M`Both are the distributive property. Good problem solvers look for the split that makes the arithmetic easiest.` },
    { type: 'check', item: { id: 'd001-c2', skill: 'pa.props', d: 3, q: M`Compute $99\cdot 36$.`, a: num(3564), sol: M`$(100 - 1)\cdot 36 = 3600 - 36 = 3564$.`, hints: ['Write 99 as 100 − 1.'] } },
    { type: 'check', item: { id: 'd001-c3', skill: 'pa.props', d: 3, q: M`Which expression is **not** always equal to $a(b + c)$?`, a: choice([M`$ab + ac$`, M`$(b + c)a$`, M`$ab + c$`, M`$ca + ba$`], 2), sol: M`$ab + c$ only multiplies $b$ by $a$. The others are the distributive and commutative properties.` } },
  ], summary: [
    M`In sums and products you may **reorder** (commutative) and **regroup** (associative) freely; not so for subtraction and division.`,
    M`$a + 0 = a$, $a\cdot 1 = a$, $a\cdot 0 = 0$.`,
    M`**Distributive**: $a(b+c) = ab + ac$. Left to right it expands; right to left it factors out.`,
  ] },
  practice: { items: [
    { id: 'd001-p1', skill: 'pa.props', d: 2, q: M`Compute $6\cdot 15 + 6\cdot 85$.`, a: num(600), sol: M`$6(15 + 85) = 600$.` },
    { id: 'd001-p2', skill: 'pa.props', d: 3, q: M`Compute $48\cdot 25$.`, a: num(1200), sol: M`$48\cdot 25 = 12\cdot 4\cdot 25 = 12\cdot 100 = 1200$.`, hints: ['Split 48 so that one piece pairs well with 25.'] },
    { id: 'd001-p3', skill: 'pa.props', d: 4, q: M`Compute $57\cdot 101 - 57$.`, a: num(5700), sol: M`$57\cdot 101 - 57\cdot 1 = 57(101 - 1) = 5700$.` },
    { id: 'd001-p4', skill: 'pa.props', d: 3, q: M`Fill in the blank so the statement is always true: $8(x + 5) = 8x + \_\_$.`, a: num(40), sol: M`$8\cdot 5 = 40$.` },
  ] },
  challenge: { items: [
    { id: 'd001-x1', skill: 'pa.props', d: 4, dok: 3, q: M`Compute $2026\cdot 2025 - 2025\cdot 2024$.`, a: num(4050), sol: M`Factor out 2025: $2025(2026 - 2024) = 2025\cdot 2 = 4050$.`, hints: ['Which number appears in both products?'] },
    { id: 'd001-x2', skill: 'pa.props', d: 4, dok: 3, q: M`Compute $12345\cdot 99999 + 12345$.`, a: num(1234500000), sol: M`$12345(99999 + 1) = 12345\cdot 100000 = 1{,}234{,}500{,}000$.`, hints: ['$12345 = 12345\\cdot 1$.'] },
    { id: 'd001-x3', skill: 'pa.props', d: 5, dok: 3, q: M`Compute $(1 + 2 + 3 + \cdots + 10)\cdot 11 - (11 + 22 + 33 + \cdots + 110)$.`, a: num(0), sol: M`The second sum is $11(1 + 2 + \cdots + 10)$ by factoring out 11. So the expression is $11S - 11S = 0$ where $S = 1 + \cdots + 10$. No adding needed.`, hints: ['Factor 11 out of the second sum.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way to see the distributive property: shopping.** Suppose a notebook costs \$3 and a pen costs \$2, and you buy 4 of each. You can pay for 4 bundles of (notebook + pen): $4\cdot(3 + 2) = 4\cdot 5 = 20$. Or pay for the notebooks and pens separately: $4\cdot 3 + 4\cdot 2 = 12 + 8 = 20$. Same money either way. That's $a(b + c) = ab + ac$.` },
    { type: 'example', title: 'Make the round number', problem: M`Compute $8\cdot 103$.`, steps: [{ md: M`$103 = 100 + 3$.` }, { md: M`$8\cdot 100 + 8\cdot 3 = 800 + 24 = 824$.`, fade: { prompt: M`What is $800 + 24$?`, a: num(824) } }] },
    { type: 'key', md: M`Look for a split that makes one piece a round number (10, 100, 1000), then distribute.` },
  ],
  cards: [
    { id: 'pa.props.c1', front: M`What does the **distributive property** say?`, back: M`$a(b + c) = ab + ac$. Multiplying a sum = multiplying each part and adding.` },
    { id: 'pa.props.c2', front: M`Which operations are commutative and associative?`, back: M`Addition and multiplication. Subtraction and division are neither.` },
    { id: 'pa.props.c3', front: M`What is $a\cdot 0$? What is $a\cdot 1$? $a + 0$?`, back: M`$0$, $a$, and $a$.` },
  ],
  book: { ref: 'AoPS Prealgebra §1.1–1.3', assign: 'Before reading each section, try its opening problems. Then do all the Exercises in §1.2 and §1.3.' },
},

// =====================================================================================
{ id: 'd002',
  discover: {
    intro: M`Today: negative numbers. You probably know the rule "negative times negative is positive." Today you'll find out *why*, because a rule you understand is a rule you can't forget.`,
    problem: { q: M`Look at the pattern:
$3\cdot(-4) = -12$, $2\cdot(-4) = -8$, $1\cdot(-4) = -4$, $0\cdot(-4) = 0$.
If the pattern keeps going the same way, what should $(-3)\cdot(-4)$ be?`, a: num(12), sol: M`Each time the first factor drops by 1, the product goes **up** by 4. So $(-1)(-4) = 4$, $(-2)(-4) = 8$, $(-3)(-4) = 12$.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`The products climb by 4 each step: $-12, -8, -4, 0, 4, 8, 12$. Patterns are a good way to *guess* a rule. Below is a way to *prove* it, using nothing but yesterday's distributive property.` },
    { type: 'md', md: M`### Negation means "opposite"
The **negation** of a number is the number on the other side of 0, the same distance away: the negation of 5 is $-5$, and the negation of $-5$ is $5$. So $-(-5) = 5$. A number plus its negation is always 0:
$$a + (-a) = 0.$$
**Subtraction is adding the negation**: $a - b = a + (-b)$. This one idea removes most sign mistakes. $7 - (-3)$ becomes $7 + 3 = 10$; $-2 - 6$ becomes $-2 + (-6) = -8$.` },
    { type: 'check', item: { id: 'd002-c1', skill: 'pa.signed', d: 1, q: M`Compute $-8 - (-13)$.`, a: num(5), sol: M`$-8 + 13 = 5$.` } },
    { type: 'key', md: M`**Why negative × negative is positive.** Start with $(-3)\cdot 4 = -12$ (three "debts" of 4). Now use the distributive property on $(-3)\cdot(4 + (-4))$:
$$(-3)\cdot 0 = (-3)\cdot 4 + (-3)\cdot(-4).$$
The left side is 0. So $0 = -12 + (-3)(-4)$, which forces $(-3)(-4) = 12$. No other value keeps the distributive property true.` },
    { type: 'md', md: M`The sign of a product depends only on how many negative factors it has: an **even** number of negatives gives a positive product, an **odd** number gives a negative one. Each negative factor flips the sign once.` },
    { type: 'example', title: 'Counting signs', problem: M`Compute $(-2)\cdot 5\cdot(-3)\cdot(-1)$.`, steps: [
      { md: M`Count negative factors: $-2$, $-3$, $-1$. That's three, an odd number, so the product is negative.`, ask: M`Why does an odd number of negatives give a negative product?`, why: M`Pair up negatives: each pair multiplies to a positive. With an odd count, one negative is left unpaired, so the result is negative.` },
      { md: M`Size: $2\cdot 5\cdot 3\cdot 1 = 30$. Answer: $-30$.`, fade: { prompt: 'So the product is…', a: num(-30) } },
    ] },
    { type: 'md', md: M`### Reciprocals and division
The **reciprocal** of a number $a$ is the number that multiplies with it to give 1. The reciprocal of 5 is $\frac15$; of $\frac23$ it's $\frac32$; of $-4$ it's $-\frac14$ (the sign stays!). **Division is multiplying by the reciprocal**:
$$a\div b = a\cdot\frac{1}{b}.$$
So the sign rules for division are the same as for multiplication: $(-20)\div(-5) = 4$ and $18\div(-3) = -6$.` },
    { type: 'key', md: M`**0 has no reciprocal, so you can never divide by 0.** If $5\div 0$ were some number $q$, then $q\cdot 0$ would have to be 5. But anything times 0 is 0. No such $q$ exists. (And $0\div 5 = 0$ is perfectly fine.)` },
    { type: 'example', title: 'Order of operations with signs', problem: M`Compute $6 - (-12)\div(-4)\cdot 2$.`, steps: [
      { md: M`Multiplication and division first, left to right: $(-12)\div(-4) = 3$, then $3\cdot 2 = 6$.` },
      { md: M`Now $6 - 6 = 0$.`, fade: { prompt: M`So $6 - 6 = $`, a: num(0) } },
      { md: M`A common slip is to do $6 - (-12)$ first. That violates the order of operations: subtraction waits until the multiplying and dividing are done.` },
    ] },
    { type: 'mistake', md: M`Jordan simplified $-(5 - 9)$:

1. $-(5 - 9) = -5 - 9$
2. $= -14$`, question: 'Where is the error?', options: ['Line 1', 'Line 2', 'No error'], answer: 0, explain: M`The negation applies to the *whole* quantity $5 - 9 = -4$, so $-(5-9) = 4$. Distributing correctly: $-(5 - 9) = -5 + 9 = 4$. The minus sign flips **every** term inside, including the $-9$.` },
    { type: 'explain', prompt: M`Explain why $0\div 7 = 0$ is fine but $7\div 0$ is undefined.`, model: M`$0\div 7$ asks "what times 7 is 0?" and 0 works. $7\div 0$ asks "what times 0 is 7?" and nothing works, because every number times 0 is 0.` },
    { type: 'check', item: { id: 'd002-c2', skill: 'pa.signed', d: 3, q: M`Compute $(-3)\cdot(-3)\cdot(-3) - (-3)$.`, a: num(-24), sol: M`Three negatives: $-27$. Then $-27 - (-3) = -27 + 3 = -24$.` } },
    { type: 'check', item: { id: 'd002-c3', skill: 'pa.signed', d: 3, q: M`What is the reciprocal of $-\frac{3}{8}$?`, a: num('-8/3'), sol: M`$-\frac{3}{8}\cdot\left(-\frac83\right) = 1$. The reciprocal keeps the sign.`, mis: { '8/3': 'Multiply them: $-\\frac38\\cdot\\frac83 = -1$, not 1. The reciprocal of a negative is negative.' } } },
  ], summary: [
    M`$a - b = a + (-b)$: subtracting is adding the opposite.`,
    M`An even number of negative factors gives a positive product; odd gives negative. The distributive property *forces* $(-a)(-b) = ab$.`,
    M`$a\div b = a\cdot\frac1b$. Zero has no reciprocal, so division by zero is undefined.`,
  ] },
  practice: { items: [
    { id: 'd002-p1', skill: 'pa.signed', d: 2, q: M`Compute $-4 - 7 - (-11)$.`, a: num(0), sol: M`$-4 - 7 = -11$; $-11 + 11 = 0$.` },
    { id: 'd002-p2', skill: 'pa.signed', d: 3, q: M`Compute $\dfrac{(-6)(-10)}{-4}$.`, a: num(-15), sol: M`$60\div(-4) = -15$.` },
    { id: 'd002-p3', skill: 'pa.signed', d: 3, q: M`Compute $-2\cdot(3 - 8) - (4 - 10)$.`, a: num(16), sol: M`$-2\cdot(-5) = 10$; $-(4-10) = 6$; total 16.` },
  ] },
  challenge: { items: [
    { id: 'd002-x1', skill: 'pa.signed', d: 4, dok: 3, q: M`Compute $1 - 2 + 3 - 4 + 5 - 6 + \cdots + 99 - 100$.`, a: num(-50), sol: M`Group in pairs: $(1-2) + (3-4) + \cdots + (99-100)$. There are 50 pairs, each $-1$, so the sum is $-50$.`, hints: ['Group the terms two at a time.'] },
    { id: 'd002-x2', skill: 'pa.signed', d: 4, dok: 3, q: M`If $a - b = 7$ and $b - c = -3$, what is $c - a$?`, a: num(-4), sol: M`Add the two equations: $(a-b) + (b-c) = a - c = 4$. Then $c - a = -(a - c) = -4$.`, hints: ['Add the two equations. What cancels?'] },
    { id: 'd002-x3', skill: 'pa.signed', d: 5, dok: 3, q: M`How many of the numbers $(-1)^1, (-2)^2, (-3)^3, \ldots, (-20)^{20}$ are negative?`, a: num(10), sol: M`$(-n)^n$ is negative exactly when $n$ is odd (an odd number of negative factors). From 1 to 20 there are 10 odd numbers.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: money.** Think of a positive number as cash and a negative number as debt. Taking away a debt makes you richer: $5 - (-3)$ means "I had \$5, and a \$3 debt was erased," leaving \$8. Multiplying $(-3)\cdot 4$ is "3 debts of \$4" (−12). And $(-3)\cdot(-4)$ is "removing 3 debts of \$4": you gain \$12.` },
    { type: 'example', title: 'Turn every subtraction into addition', problem: M`Compute $-6 - (-2) - 9$.`, steps: [{ md: M`Rewrite: $-6 + 2 + (-9)$.` }, { md: M`$-6 + 2 = -4$; $-4 + (-9) = -13$.`, fade: { prompt: 'The answer is…', a: num(-13) } }] },
  ],
  cards: [
    { id: 'pa.signed.c1', front: M`Why is $(-a)(-b) = ab$?`, back: M`Because $0 = (-a)(b + (-b)) = -ab + (-a)(-b)$ by the distributive property, so $(-a)(-b)$ must be $ab$.` },
    { id: 'pa.signed.c2', front: M`What is the reciprocal of a number?`, back: M`The number you multiply it by to get 1. $a\div b = a\cdot\frac{1}{b}$.` },
    { id: 'pa.signed.c3', front: M`Why can't you divide by zero?`, back: M`$a\div 0$ would need a number that gives $a$ when multiplied by 0. None exists.` },
  ],
  book: { ref: 'AoPS Prealgebra §1.4–1.8', assign: 'Try each opening problem first. Do the Exercises in §1.4–1.7, then Chapter 1 Review Problems 1–15.' },
},

// =====================================================================================
{ id: 'd003',
  discover: {
    intro: M`Exponents turn big multiplications into short notation, and they come with rules you can *derive* instead of memorizing.`,
    problem: { q: M`Which is larger: $2^{30}$ or $3^{20}$? (You don't need to compute either one.)`, a: choice([M`$2^{30}$`, M`$3^{20}$`, 'They are equal'], 1), sol: M`$2^{30} = (2^3)^{10} = 8^{10}$ and $3^{20} = (3^2)^{10} = 9^{10}$. Since $9 > 8$, $3^{20}$ is larger. The trick, rewriting both with the same exponent, comes from today's rules.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Comparing $2^{30}$ and $3^{20}$ directly is hard because both the bases and the exponents differ. The move is to make the exponents match: $2^{30} = 8^{10}$ and $3^{20} = 9^{10}$, and now it's obvious. That rewriting uses the rule $(a^m)^n = a^{mn}$, which you'll derive below.` },
    { type: 'md', md: M`### What an exponent means
$a^n$ means $n$ factors of $a$ multiplied together: $5^3 = 5\cdot 5\cdot 5 = 125$. The number $a$ is the **base** and $n$ is the **exponent**. Every exponent rule comes from simply **counting factors**.` },
    { type: 'example', title: 'Deriving the product rule', problem: M`Simplify $2^3\cdot 2^4$.`, steps: [
      { md: M`$2^3\cdot 2^4 = (2\cdot 2\cdot 2)\cdot(2\cdot 2\cdot 2\cdot 2)$.` },
      { md: M`That's $3 + 4 = 7$ factors of 2, so $2^3\cdot 2^4 = 2^7 = 128$.`, ask: M`Would this work for $5^2\cdot 5^6$? What's the general rule?`, why: M`Yes: 2 factors plus 6 factors is 8 factors, so $5^8$. In general $a^m\cdot a^n = a^{m+n}$: exponents add when you multiply powers of the **same base**.` },
    ] },
    { type: 'key', md: M`**The laws of exponents**, all from counting factors:
- $a^m\cdot a^n = a^{m+n}$
- $\dfrac{a^m}{a^n} = a^{m-n}$ (the $n$ factors on the bottom cancel $n$ of the factors on top)
- $(a^m)^n = a^{mn}$ ($n$ groups of $m$ factors)
- $(ab)^n = a^n b^n$ and $\left(\dfrac ab\right)^n = \dfrac{a^n}{b^n}$` },
    { type: 'check', item: { id: 'd003-c1', skill: 'pa.exp', d: 2, q: M`Compute $\dfrac{10^8\cdot 10^3}{10^9}$.`, a: num(100), sol: M`$10^{8+3-9} = 10^2 = 100$.` } },
    { type: 'md', md: M`### Zero and negative exponents
What should $5^0$ mean? "Zero factors of 5" sounds meaningless, but the quotient rule tells us what it *has* to be:
$$\frac{5^3}{5^3} = 5^{3-3} = 5^0, \quad\text{and also}\quad \frac{5^3}{5^3} = 1.$$
So $a^0 = 1$ (for $a \ne 0$). The same reasoning gives negative exponents: $\dfrac{5^2}{5^5} = 5^{-3}$, but cancelling directly gives $\dfrac{1}{5^3}$. So
$$a^{-n} = \frac{1}{a^n}.$$
These aren't new rules. They are the only definitions that keep the old rules working.` },
    { type: 'example', title: 'A negative exponent on a fraction', problem: M`Compute $\left(\frac23\right)^{-3}$.`, steps: [
      { md: M`$\left(\frac23\right)^{-3} = \dfrac{1}{\left(\frac23\right)^3} = \dfrac{1}{\frac{8}{27}}$.` },
      { md: M`Dividing 1 by $\frac{8}{27}$ is multiplying by $\frac{27}{8}$. Answer: $\frac{27}{8}$.`, ask: M`What's a shortcut for a fraction to a negative power?`, why: M`Flip the fraction and make the exponent positive: $\left(\frac ab\right)^{-n} = \left(\frac ba\right)^n$.` },
    ] },
    { type: 'key', md: M`**Watch what the exponent touches.** $-3^2$ means $-(3^2) = -9$, but $(-3)^2 = 9$. The exponent only applies to the thing directly to its left.` },
    { type: 'mistake', md: M`Sam simplified $2^3\cdot 2^4$ as follows:

1. Multiply the bases and add the exponents.
2. $2^3\cdot 2^4 = 4^7$`, question: 'What went wrong?', options: ['Line 1 is the wrong rule', 'Nothing; 4^7 is correct', 'The exponents should be multiplied'], answer: 0, explain: M`When the bases are the same, you **keep** the base and add the exponents: $2^7 = 128$. $4^7 = 16384$ would mean seven factors of 4, which is fourteen factors of 2. Counting factors catches this every time.` },
    { type: 'example', title: 'Same base, unknown exponent', problem: M`Find $x$ if $4^x = 8^6$.`, steps: [
      { md: M`Write both as powers of 2: $4^x = (2^2)^x = 2^{2x}$ and $8^6 = (2^3)^6 = 2^{18}$.` },
      { md: M`Same base, so the exponents match: $2x = 18$, $x = 9$.`, fade: { prompt: M`If $2x = 18$, what is $x$?`, a: num(9) } },
    ] },
    { type: 'check', item: { id: 'd003-c2', skill: 'pa.exp', d: 3, q: M`Compute $3^{-2} + 3^0$.`, a: num('10/9'), sol: M`$\frac19 + 1 = \frac{10}{9}$.`, mis: { '1/9': 'Remember $3^0 = 1$, not 0.', '-8': '$3^{-2}$ is $\\frac{1}{9}$, a small positive number, not $-9$.' } } },
    { type: 'check', item: { id: 'd003-c3', skill: 'pa.exp', d: 3, q: M`Compute $(-2)^5$.`, a: num(-32), sol: M`Five negative factors: negative. $2^5 = 32$. So $-32$.` } },
  ], summary: [
    M`Exponent rules come from counting factors: $a^m a^n = a^{m+n}$, $\frac{a^m}{a^n} = a^{m-n}$, $(a^m)^n = a^{mn}$.`,
    M`$a^0 = 1$ and $a^{-n} = \frac{1}{a^n}$. These are forced by the quotient rule.`,
    M`To compare or solve with powers, rewrite them with the **same base** or the **same exponent**.`,
  ] },
  practice: { items: [
    { id: 'd003-p1', skill: 'pa.exp', d: 3, q: M`Compute $\dfrac{2^{10}}{2^{12}}$.`, a: num('1/4'), sol: M`$2^{-2} = \frac14$.` },
    { id: 'd003-p2', skill: 'pa.exp', d: 3, q: M`Compute $(2^3)^2 - 2^{3^2}$. (Note: $2^{3^2}$ means $2^{(3^2)}$.)`, a: num(-448), sol: M`$(2^3)^2 = 2^6 = 64$, while $2^{3^2} = 2^9 = 512$. Difference: $-448$.` },
    { id: 'd003-p3', skill: 'pa.exp', d: 4, q: M`Compute $5^{12}\cdot 2^{12}\div 10^{10}$.`, a: num(100), sol: M`$5^{12}2^{12} = 10^{12}$, and $10^{12}\div 10^{10} = 100$.`, hints: ['$(ab)^n = a^n b^n$, read backwards.'] },
  ] },
  challenge: { items: [
    { id: 'd003-x1', skill: 'pa.exp', d: 4, dok: 3, q: M`Compute $2^{10} - 2^9 - 2^8$.`, a: num(256), sol: M`Factor out $2^8$: $2^8(2^2 - 2 - 1) = 2^8\cdot 1 = 256$.`, hints: ['Factor out the smallest power.'] },
    { id: 'd003-x2', skill: 'pa.exp', d: 4, dok: 3, q: M`Which is larger: $5^{40}$ or $3^{60}$?`, a: choice([M`$5^{40}$`, M`$3^{60}$`, 'They are equal'], 1), sol: M`$5^{40} = (5^2)^{20} = 25^{20}$ and $3^{60} = (3^3)^{20} = 27^{20}$. So $3^{60}$ is larger.` },
    { id: 'd003-x3', skill: 'pa.exp', d: 5, dok: 3, q: M`How many digits does $2^{20}\cdot 5^{17}$ have?`, a: num(18), sol: M`$2^{20}5^{17} = 2^3\cdot(2^{17}5^{17}) = 8\cdot 10^{17}$, which is an 8 followed by 17 zeros: 18 digits.`, hints: ['Pair up 2s and 5s to make 10s.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: write everything out.** If an exponent rule ever feels slippery, expand a small case. $\frac{3^5}{3^2} = \frac{3\cdot 3\cdot 3\cdot 3\cdot 3}{3\cdot 3}$. Cancel two 3s from top and bottom: three 3s remain, $3^3$. Five minus two is three. You can rebuild every rule this way in ten seconds.` },
    { type: 'example', title: 'Expand to check', problem: M`Is $(2\cdot 5)^3$ the same as $2^3\cdot 5^3$?`, steps: [{ md: M`$(2\cdot 5)^3 = (2\cdot 5)(2\cdot 5)(2\cdot 5)$.` }, { md: M`Regroup (commutative + associative): $(2\cdot 2\cdot 2)(5\cdot 5\cdot 5) = 2^3\cdot 5^3$. Both equal 1000.` }] },
  ],
  cards: [
    { id: 'pa.exp.c1', front: M`$a^m\cdot a^n = ?$ and $(a^m)^n = ?$`, back: M`$a^{m+n}$ and $a^{mn}$.` },
    { id: 'pa.exp.c2', front: M`Why is $a^0 = 1$?`, back: M`$\frac{a^n}{a^n}$ is both 1 and $a^{n-n} = a^0$.` },
    { id: 'pa.exp.c3', front: M`$-3^2$ vs. $(-3)^2$?`, back: M`$-9$ vs. $9$. The exponent only touches what it's attached to.` },
  ],
  book: { ref: 'AoPS Prealgebra §2.1–2.5', assign: 'Do the Exercises in §2.2–2.4, then Chapter 2 Review Problems (odd numbers) and two Challenge Problems of your choice.' },
},

// =====================================================================================
{ id: 'd004',
  discover: {
    intro: M`Number theory is the study of whole numbers, and divisibility is where it starts. Contest problems love it.`,
    problem: { q: M`The four-digit number $\overline{3A6B}$ (digits 3, A, 6, B) is divisible by 45. How many such four-digit numbers are there?`, a: num(3), sol: M`Divisible by 45 means divisible by 5 **and** 9. By 5: $B$ is 0 or 5. By 9: $3 + A + 6 + B$ is a multiple of 9, so $A + B$ is a multiple of 9. If $B = 0$: $A = 0$ or $9$ (3060, 3960). If $B = 5$: $A = 4$ (3465). Three numbers.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`The key idea in the opening problem was splitting 45 into $5\cdot 9$, two numbers with no common factor, and using a quick test for each. Today you'll learn those tests and, more importantly, **why** they work.` },
    { type: 'md', md: M`### Multiples and divisors
If $a = b\cdot k$ for some integer $k$, then $a$ is a **multiple** of $b$, and $b$ is a **divisor** (or factor) of $a$. We say "$b$ divides $a$." For example 6 divides 42 because $42 = 6\cdot 7$.` },
    { type: 'key', md: M`**Divisibility tests** (and why):
- **2, 5, 10:** look at the last digit, because every number is (a multiple of 10) + (last digit), and 10 is divisible by 2 and 5.
- **4:** the last two digits form a multiple of 4, because 100 is a multiple of 4. **8:** last three digits, because 1000 is a multiple of 8.
- **3 and 9:** the **digit sum** is a multiple of 3 (or 9).
- **11:** the alternating sum of digits (from the right: $+,-,+,\ldots$) is a multiple of 11.` },
    { type: 'example', title: 'Why the digit-sum test works', problem: M`Show that 4527 is divisible by 9 iff its digit sum is.`, steps: [
      { md: M`$4527 = 4\cdot 1000 + 5\cdot 100 + 2\cdot 10 + 7$.` },
      { md: M`Write $1000 = 999 + 1$, $100 = 99 + 1$, $10 = 9 + 1$: $4527 = (4\cdot 999 + 5\cdot 99 + 2\cdot 9) + (4 + 5 + 2 + 7)$.`, ask: M`Why is the first group in parentheses always a multiple of 9?`, why: M`999, 99, and 9 are all multiples of 9, so any combination of them is too.` },
      { md: M`So 4527 = (multiple of 9) + (digit sum 18). Since 18 is a multiple of 9, so is 4527. The same argument works for 3, because 9, 99, 999 are also multiples of 3.` },
    ] },
    { type: 'check', item: { id: 'd004-c1', skill: 'pa.divis', d: 2, q: M`What digit $A$ makes $\overline{52A4}$ divisible by 9?`, a: num(7), sol: M`$5 + 2 + A + 4 = 11 + A$ must be a multiple of 9, so $A = 7$.` } },
    { type: 'mistake', md: M`Taylor reasoned: "A number divisible by both 4 and 6 must be divisible by $4\cdot 6 = 24$."`, question: 'Is Taylor right?', options: ['Yes, always', 'No: 12 is a counterexample', 'Only for even numbers'], answer: 1, explain: M`12 is divisible by 4 and by 6 but not by 24. The trick only works when the two numbers share no common factor (like 5 and 9, or 3 and 8). Divisible by 4 and 6 really means divisible by $\text{lcm}(4, 6) = 12$.` },
    { type: 'md', md: M`### Primes
A **prime** is a positive integer with exactly two positive divisors: 1 and itself. 2, 3, 5, 7, 11, 13, … The number 1 is **not** prime (it has only one divisor). A positive integer greater than 1 that isn't prime is **composite**.

To test whether $n$ is prime, you only need to try primes up to $\sqrt n$: if $n = a\cdot b$ with both factors bigger than $\sqrt n$, their product would be bigger than $n$.` },
    { type: 'example', title: 'Testing a prime', problem: M`Is 221 prime?`, steps: [
      { md: M`$\sqrt{221}$ is a bit less than 15 (since $15^2 = 225$). Test primes 2, 3, 5, 7, 11, 13.` },
      { md: M`2: no (odd). 3: digit sum 5, no. 5: no. 7: $7\cdot 31 = 217$, no. 11: alternating sum $1 - 2 + 2 = 1$, no. 13: $13\cdot 17 = 221$. **Composite.**`, fade: { prompt: M`What is $221\div 13$?`, a: num(17) } },
    ] },
    { type: 'md', md: M`**There are infinitely many primes.** Here is a 2,300-year-old argument (Euclid's). Suppose you had a complete list of primes $p_1, p_2, \ldots, p_k$. Multiply them all and add 1: $N = p_1p_2\cdots p_k + 1$. Dividing $N$ by any prime on the list leaves remainder 1, so none of them divide $N$. But $N > 1$ has *some* prime factor, and it isn't on the list. So no list is complete.` },
    { type: 'explain', prompt: M`Why does a number only need to be tested for prime factors up to its square root?`, model: M`If $n = a\cdot b$ and both $a$ and $b$ were greater than $\sqrt n$, then $a\cdot b > \sqrt n\cdot\sqrt n = n$, which is impossible. So any factorization has a factor at most $\sqrt n$, and that factor has a prime factor at most $\sqrt n$.` },
    { type: 'check', item: { id: 'd004-c2', skill: 'pa.primes', d: 2, q: M`How many primes are between 40 and 60?`, a: num(5), sol: M`41, 43, 47, 53, 59.` } },
  ], summary: [
    M`Tests: last digit (2, 5, 10); last 2 / 3 digits (4 / 8); digit sum (3, 9); alternating digit sum (11). They work because of place value.`,
    M`To combine tests, the two numbers must share no factor: by 3 and 4 ⇒ by 12; but by 4 and 6 only ⇒ by 12, not 24.`,
    M`1 is not prime. Test for primality only up to $\sqrt n$. There are infinitely many primes.`,
  ] },
  practice: { items: [
    { id: 'd004-p1', skill: 'pa.divis', d: 3, q: M`Is 7,392 divisible by 11?`, a: choice(['Yes', 'No'], 0), sol: M`Alternating sum from the right: $2 - 9 + 3 - 7 = -11$, a multiple of 11. Yes ($7392 = 11\cdot 672$).` },
    { id: 'd004-p2', skill: 'pa.primes', d: 3, q: M`What is the largest prime factor of 1001?`, a: num(13), sol: M`$1001 = 7\cdot 11\cdot 13$.` },
    { id: 'd004-p3', skill: 'pa.divis', d: 3, q: M`What is the smallest positive multiple of 6 whose digits are all 1s and 0s? (Like 10, 110, 1100, …)`, a: num(1110), sol: M`It must be even (ends in 0) and have a digit sum that's a multiple of 3 (at least three 1s). Smallest: 1110.` },
  ] },
  challenge: { items: [
    { id: 'd004-x1', skill: 'pa.primes', d: 4, dok: 3, q: M`For how many primes $p$ are $p + 10$ and $p + 20$ also both prime?`, a: num(1), sol: M`$p = 3$ works (3, 13, 23). Otherwise, look at remainders when dividing by 3: $p$, $p + 10$, $p + 20$ have remainders $r$, $r+1$, $r+2$ (mod 3), so one of them is divisible by 3. It must then equal 3 itself, which only happens for $p = 3$. Exactly one prime.`, hints: ['Try small primes. Then think about remainders when dividing by 3.'] },
    { id: 'd004-x2', skill: 'pa.divis', d: 4, dok: 3, q: M`The six-digit number $\overline{A2025B}$ is divisible by 72. What is $A + B$?`, a: num(9), sol: M`$72 = 8\cdot 9$. By 8: the last three digits $\overline{25B}$ must be a multiple of 8, so $B = 6$ (256). By 9: $A + 2 + 0 + 2 + 5 + 6 = A + 15$ must be a multiple of 9, so $A = 3$. Then $A + B = 9$.`, hints: ['72 = 8 · 9. Do the test for 8 first.'] },
    { id: 'd004-x3', skill: 'pa.primes', d: 5, dok: 3, q: M`What is the smallest prime that divides $3^{11} + 5^{13}$?`, a: num(2), sol: M`Both $3^{11}$ and $5^{13}$ are odd, and odd + odd is even. So 2 divides it.`, hints: ['Odd or even?'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way to see the 3 and 9 tests: money in coins.** Write 4527 as 4 thousands + 5 hundreds + 2 tens + 7 ones. Each thousand is 999 + 1, each hundred 99 + 1, each ten 9 + 1. Set aside all the 999s, 99s, and 9s: that pile is a multiple of 9. What's left is one "1" for each unit of each digit: exactly the digit sum.` },
    { type: 'key', md: M`To check divisibility by a number like 12, 18, 36, or 45, split it into two parts with no common factor (12 = 3·4, 18 = 2·9, 36 = 4·9, 45 = 5·9) and test both.` },
  ],
  cards: [
    { id: 'pa.divis.c1', front: M`Test for divisibility by 4? By 8?`, back: M`Last two digits divisible by 4; last three digits divisible by 8.` },
    { id: 'pa.divis.c2', front: M`Test for 11?`, back: M`Alternating sum of digits ($+,-,+,\ldots$ from the right) is a multiple of 11.` },
    { id: 'pa.primes.c1', front: M`Is 1 prime? Why?`, back: M`No. A prime has exactly two positive divisors; 1 has only one.` },
  ],
  book: { ref: 'AoPS Prealgebra §3.1–3.3', assign: 'Exercises in §3.2 and §3.3. Try the sieve of Eratosthenes up to 100 by hand.' },
},

// =====================================================================================
{ id: 'd005',
  discover: {
    intro: M`Every positive integer breaks into primes in exactly one way. That single fact unlocks divisor counting, GCDs, and LCMs.`,
    problem: { q: M`How many positive divisors does 72 have? (List them if you need to.)`, a: num(12), sol: M`1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72: twelve. Listing works for 72, but would you want to list the divisors of 10,800? Today you'll count them without listing.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`$72 = 2^3\cdot 3^2$. Every divisor is $2^a\cdot 3^b$ where $a$ is 0, 1, 2, or 3 (4 choices) and $b$ is 0, 1, or 2 (3 choices). That's $4\cdot 3 = 12$ divisors. No listing needed.` },
    { type: 'md', md: M`### Prime factorization
Keep dividing by primes until only 1 is left. Use a factor tree or repeated division:
$$360 = 2\cdot 180 = 2\cdot 2\cdot 90 = 2\cdot 2\cdot 2\cdot 45 = 2^3\cdot 3^2\cdot 5.$$
The **Fundamental Theorem of Arithmetic** says this factorization is unique (apart from order). Whatever path you take, you end at $2^3\cdot 3^2\cdot 5$.` },
    { type: 'check', item: { id: 'd005-c1', skill: 'pa.factor', d: 2, q: M`Write the prime factorization of 252. (Type it like 2^2*3*5.)`, a: num(252, { form: 'primefact', display: M`$2^2\cdot 3^2\cdot 7$` }), sol: M`$252 = 4\cdot 63 = 2^2\cdot 3^2\cdot 7$.` } },
    { type: 'key', md: M`**Counting divisors.** If $n = p^a\cdot q^b\cdot r^c\cdots$, a divisor chooses an exponent for each prime, from 0 up to its maximum. So $n$ has $(a+1)(b+1)(c+1)\cdots$ positive divisors.` },
    { type: 'example', title: 'Divisors of 10,800', problem: M`How many positive divisors does $10800$ have?`, steps: [
      { md: M`$10800 = 108\cdot 100 = (2^2\cdot 3^3)\cdot(2^2\cdot 5^2) = 2^4\cdot 3^3\cdot 5^2$.` },
      { md: M`Exponent choices: 5 for the 2s (0–4), 4 for the 3s (0–3), 3 for the 5s (0–2).`, ask: M`Why "+1" in each count?`, why: M`Because exponent 0 is also allowed: it means that prime isn't used at all.` },
      { md: M`$5\cdot 4\cdot 3 = 60$ divisors.`, fade: { prompt: M`What is $5\cdot 4\cdot 3$?`, a: num(60) } },
    ] },
    { type: 'md', md: M`### GCD and LCM
The **greatest common divisor** $\gcd(a, b)$ is the largest number dividing both. The **least common multiple** $\text{lcm}(a, b)$ is the smallest positive number both divide. With prime factorizations they're easy:
- $\gcd$: take each prime to the **smaller** exponent.
- $\text{lcm}$: take each prime to the **larger** exponent.` },
    { type: 'example', title: 'GCD and LCM from factorizations', problem: M`Find $\gcd(360, 84)$ and $\text{lcm}(360, 84)$.`, steps: [
      { md: M`$360 = 2^3\cdot 3^2\cdot 5$ and $84 = 2^2\cdot 3\cdot 7$.` },
      { md: M`gcd: $2^2\cdot 3^1 = 12$ (5 and 7 don't appear in both, so exponent 0).`, fade: { prompt: M`What is $2^2\cdot 3$?`, a: num(12) } },
      { md: M`lcm: $2^3\cdot 3^2\cdot 5\cdot 7 = 2520$.` },
    ] },
    { type: 'key', md: M`For any two positive integers, $\gcd(a, b)\cdot\text{lcm}(a, b) = a\cdot b$. Why: for each prime, $\min + \max$ of the two exponents equals their sum. Check: $12\cdot 2520 = 30240 = 360\cdot 84$.` },
    { type: 'mistake', md: M`Morgan wanted $\text{lcm}(12, 18)$:

1. $12\cdot 18 = 216$
2. So $\text{lcm}(12, 18) = 216$.`, question: 'What is wrong?', options: ['Line 1 has an arithmetic mistake', 'The product is a common multiple, but not the least one', 'Nothing'], answer: 1, explain: M`216 *is* a common multiple, but not the smallest. Since $\gcd(12,18) = 6$, $\text{lcm} = \frac{216}{6} = 36$. The product equals the LCM only when the numbers share no factor.` },
    { type: 'explain', prompt: M`Two buses leave the station at 8:00. One returns every 12 minutes, the other every 18. Explain why the next time they're both at the station uses the LCM and not the GCD.`, model: M`The first bus is there at multiples of 12 minutes, the second at multiples of 18. Both are there at times that are multiples of both, and the first such time is the least common multiple, 36 minutes (8:36). The GCD would answer a different question: the largest interval that divides both.` },
    { type: 'check', item: { id: 'd005-c2', skill: 'pa.gcdlcm', d: 3, q: M`What is $\gcd(84, 126)$?`, a: num(42), sol: M`$84 = 2^2\cdot 3\cdot 7$, $126 = 2\cdot 3^2\cdot 7$. gcd $= 2\cdot 3\cdot 7 = 42$.` } },
  ], summary: [
    M`Every integer > 1 factors into primes in exactly one way.`,
    M`$p^a q^b r^c$ has $(a+1)(b+1)(c+1)$ divisors.`,
    M`gcd uses the smaller exponents, lcm the larger; $\gcd\cdot\text{lcm} = ab$.`,
  ] },
  practice: { items: [
    { id: 'd005-p1', skill: 'pa.factor', d: 3, q: M`How many positive divisors does $2^5\cdot 7^2$ have?`, a: num(18), sol: M`$(5+1)(2+1) = 18$.` },
    { id: 'd005-p2', skill: 'pa.gcdlcm', d: 3, q: M`What is the smallest positive integer divisible by every integer from 1 to 10?`, a: num(2520), sol: M`$\text{lcm}(1,\ldots,10)$ needs $2^3$ (from 8), $3^2$ (from 9), 5, and 7: $8\cdot 9\cdot 5\cdot 7 = 2520$.` },
    { id: 'd005-p3', skill: 'pa.gcdlcm', d: 4, q: M`Two numbers have product 1728 and greatest common divisor 12. What is their least common multiple?`, a: num(144), sol: M`$\text{lcm} = \frac{1728}{12} = 144$.` },
  ] },
  challenge: { items: [
    { id: 'd005-x1', skill: 'pa.factor', d: 4, dok: 3, q: M`How many positive integers are both divisors of 360 and multiples of 12?`, a: num(8), sol: M`Such a number is $12k$ with $12k$ dividing $360$, i.e. $k$ divides $30$. 30 has $(1+1)^3 = 8$ divisors.`, hints: ['Write the number as 12k.'] },
    { id: 'd005-x2', skill: 'pa.factor', d: 4, dok: 3, q: M`What is the smallest positive integer with exactly 9 positive divisors?`, a: num(36), sol: M`9 divisors means exponents with $(a+1)(b+1)\cdots = 9$: either $p^8$ (smallest 256) or $p^2q^2$ (smallest $2^2 3^2 = 36$). Answer 36.` },
    { id: 'd005-x3', skill: 'pa.gcdlcm', d: 5, dok: 3, q: M`How many ordered pairs of positive integers $(a, b)$ have $\gcd(a,b) = 6$ and $\text{lcm}(a,b) = 180$?`, a: num(8), sol: M`$6 = 2\cdot 3$ and $180 = 2^2\cdot 3^2\cdot 5$. For each prime, one of $a, b$ gets the gcd's exponent and the other gets the lcm's. For 2 the exponents are 1 and 2, for 3 they are 1 and 2, for 5 they are 0 and 1. Each prime gives 2 choices of who gets which, so there are $2^3 = 8$ ordered pairs.`, hints: ['Treat each prime separately.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way to count divisors: a table.** For $72 = 2^3\cdot 3^2$, make rows for $2^0, 2^1, 2^2, 2^3$ and columns for $3^0, 3^1, 3^2$. Each cell is a divisor (row × column): 4 rows × 3 columns = 12 cells, each a different divisor. The formula $(a+1)(b+1)$ is just the size of this table.` },
    { type: 'example', title: 'GCD by listing (for small numbers)', problem: M`Find $\gcd(24, 36)$.`, steps: [{ md: M`Divisors of 24: 1, 2, 3, 4, 6, 8, 12, 24. Which also divide 36? 1, 2, 3, 4, 6, 12.` }, { md: M`The greatest is 12.` }] },
  ],
  cards: [
    { id: 'pa.factor.c1', front: M`How many divisors does $p^a q^b$ have?`, back: M`$(a+1)(b+1)$.` },
    { id: 'pa.gcdlcm.c1', front: M`gcd and lcm from prime factorizations?`, back: M`gcd: smaller exponent of each prime. lcm: larger exponent.` },
    { id: 'pa.gcdlcm.c2', front: M`$\gcd(a,b)\cdot\text{lcm}(a,b) = ?$`, back: M`$ab$.` },
  ],
  book: { ref: 'AoPS Prealgebra §3.4–3.8', assign: 'Exercises in §3.4–3.7, then Chapter 3 Review Problems and at least three Challenge Problems.' },
},

// =====================================================================================
{ id: 'd006',
  discover: {
    intro: M`Fractions are numbers, not pairs of numbers. Today's opening problem is best solved with a picture.`,
    problem: { q: M`You have $\frac34$ of a pizza and eat $\frac23$ of what you have. What fraction of a whole pizza did you eat?`, a: num('1/2'), sol: M`$\frac23$ of $\frac34$ is $\frac23\cdot\frac34 = \frac{6}{12} = \frac12$. In a picture: cut the pizza into quarters, take three; two-thirds of those three quarters is two quarters, half the pizza.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`"$\frac23$ **of** $\frac34$" means multiply. Picture the three quarters you have; split them into three equal groups (one quarter each) and take two groups: two quarters, which is $\frac12$. The arithmetic $\frac23\cdot\frac34 = \frac{2\cdot 3}{3\cdot 4} = \frac{6}{12} = \frac12$ agrees.` },
    { type: 'md', md: M`### A fraction is a division
$\frac{a}{b}$ means $a\div b$: the number that gives $a$ when multiplied by $b$. So $\frac{12}{4} = 3$, and $\frac{3}{4}$ is the number you get when you split 3 into 4 equal parts. On the number line it's a single point, between 0 and 1.` },
    { type: 'key', md: M`**Multiplying fractions:** multiply the tops and multiply the bottoms.
$$\frac ab\cdot\frac cd = \frac{ac}{bd}.$$
**Simplifying:** divide top and bottom by their gcd. $\frac{18}{24} = \frac{3\cdot 6}{4\cdot 6} = \frac34$. You're multiplying by $\frac66 = 1$ in reverse, which doesn't change the value.` },
    { type: 'svg', svg: `<svg viewBox="0 0 260 170" width="260" xmlns="http://www.w3.org/2000/svg" font-family="Georgia, serif" font-size="14"><g stroke="#22262B" stroke-width="1.5">${[0,1,2,3].map(c=>[0,1,2].map(r=>`<rect x="${20+c*55}" y="${15+r*45}" width="55" height="45" fill="${c<3&&r<2?'#9DB3EF':c<3?'#E8EEFC':'#fff'}"/>`).join('')).join('')}</g><text x="130" y="165" text-anchor="middle">columns: quarters · rows: thirds</text></svg>`, caption: M`Three of four columns is $\frac34$; two of three rows of that is $\frac23$ of it. The dark region is 6 of 12 squares: $\frac23\cdot\frac34 = \frac{6}{12}$.` },
    { type: 'example', title: 'Cancel first, multiply second', problem: M`Compute $\frac{14}{15}\cdot\frac{25}{28}$.`, steps: [
      { md: M`Before multiplying, cancel common factors across the tops and bottoms: 14 and 28 share 14; 25 and 15 share 5.` },
      { md: M`$\frac{14}{15}\cdot\frac{25}{28} = \frac{1}{3}\cdot\frac{5}{2}$.`, ask: M`Why is it legal to cancel a top of one fraction against a bottom of the other?`, why: M`The product is $\frac{14\cdot 25}{15\cdot 28}$, a single fraction; cancelling a common factor of its numerator and denominator is just simplifying it.` },
      { md: M`$= \frac56$.`, fade: { prompt: M`What is $\frac13\cdot\frac52$?`, a: num('5/6', { form: 'simplest' }) } },
    ] },
    { type: 'md', md: M`### Dividing by a fraction
Division asks "how many of these fit into that?" How many halves are in 3? Six. So $3\div\frac12 = 6 = 3\cdot 2$. In general, dividing by $\frac cd$ is multiplying by its reciprocal $\frac dc$:
$$\frac ab\div\frac cd = \frac ab\cdot\frac dc.$$
Why it must be so: $\frac ab\div\frac cd$ is the number that gives $\frac ab$ when multiplied by $\frac cd$. And $\left(\frac ab\cdot\frac dc\right)\cdot\frac cd = \frac ab\cdot 1 = \frac ab$. ✓` },
    { type: 'check', item: { id: 'd006-c1', skill: 'pa.frac.md', d: 2, q: M`Compute $\frac{5}{6}\div\frac{10}{9}$ in lowest terms.`, a: num('3/4', { form: 'simplest' }), sol: M`$\frac56\cdot\frac{9}{10} = \frac{45}{60} = \frac34$.` } },
    { type: 'mistake', md: M`Alex simplified $\dfrac{3 + 5}{3 + 7}$ by cancelling the 3s:

1. $\dfrac{3 + 5}{3 + 7} = \dfrac{5}{7}$`, question: 'Is this right?', options: ['Yes', 'No, you can only cancel common factors, not common terms', 'Only if the numbers are prime'], answer: 1, explain: M`$\frac{3+5}{3+7} = \frac{8}{10} = \frac45$, not $\frac57$. Cancelling works because $\frac{3\cdot 5}{3\cdot 7} = \frac33\cdot\frac57 = \frac57$. That needs the 3 to be a **factor** (multiplied) of the whole top and bottom, not a piece being added.` },
    { type: 'example', title: 'Fractions of fractions', problem: M`What is $\frac35$ of $\frac{10}{21}$ of 63?`, steps: [
      { md: M`"Of" means times: $\frac35\cdot\frac{10}{21}\cdot 63$.` },
      { md: M`Cancel: $\frac{10}{5} = 2$, $\frac{63}{21} = 3$: $3\cdot 2\cdot 3 = 18$.`, fade: { prompt: 'So the answer is…', a: num(18) } },
    ] },
    { type: 'explain', prompt: M`Explain, without the "flip and multiply" rule, why $4\div\frac23 = 6$.`, model: M`$4\div\frac23$ asks how many $\frac23$s fit in 4. Each whole has three thirds, so 4 has 12 thirds; grouping them two at a time gives 6 groups of $\frac23$.` },
    { type: 'check', item: { id: 'd006-c2', skill: 'pa.frac.md', d: 3, q: M`Compute $\left(\frac{2}{3}\right)^3\div\frac{4}{9}$.`, a: num('2/3', { form: 'simplest' }), sol: M`$\frac{8}{27}\cdot\frac94 = \frac{72}{108} = \frac23$.` } },
  ], summary: [
    M`$\frac ab$ is a number: $a\div b$. "Of" means multiply.`,
    M`Multiply straight across; cancel common **factors** first. Never cancel terms that are added.`,
    M`Dividing by $\frac cd$ = multiplying by $\frac dc$, because that's the number that undoes multiplying by $\frac cd$.`,
  ] },
  practice: { items: [
    { id: 'd006-p1', skill: 'pa.frac.md', d: 3, q: M`If $x$ is $\frac25$ of $y$, and $y$ is $\frac34$ of $z$, then $x$ is what fraction of $z$?`, a: num('3/10', { form: 'simplest' }), sol: M`$x = \frac25\cdot\frac34 z = \frac{6}{20}z = \frac{3}{10}z$.` },
    { id: 'd006-p2', skill: 'pa.frac.md', d: 3, q: M`What fraction of $\frac13$ is $\frac14$?`, a: num('3/4', { form: 'simplest' }), sol: M`$\frac14\div\frac13 = \frac34$.` },
  ] },
  challenge: { items: [
    { id: 'd006-x1', skill: 'pa.frac.md', d: 4, dok: 3, q: M`Compute $1\div\left(1\div\left(1\div\frac12\right)\right)$.`, a: num(2), sol: M`Innermost: $1\div\frac12 = 2$. Then $1\div 2 = \frac12$. Then $1\div\frac12 = 2$.` },
    { id: 'd006-x2', skill: 'pa.frac.md', d: 4, dok: 3, q: M`Compute $\dfrac{2}{1}\cdot\dfrac{3}{2}\cdot\dfrac{4}{3}\cdots\dfrac{50}{49}$.`, a: num(50), sol: M`Each numerator cancels the next denominator, leaving $\frac{50}{1} = 50$.` },
    { id: 'd006-x3', skill: 'pa.frac.md', d: 5, dok: 3, q: M`A tank is $\frac25$ full. After 18 liters are added it is $\frac{5}{8}$ full. How many liters does the full tank hold?`, a: num(80), sol: M`The 18 liters fill $\frac58 - \frac25 = \frac{25 - 16}{40} = \frac{9}{40}$ of the tank, so the tank holds $18\div\frac{9}{40} = 18\cdot\frac{40}{9} = 80$ liters.`, hints: ['What fraction of the tank do the 12 liters fill?'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: fractions as scaling.** Multiplying by $\frac23$ means "shrink to two-thirds of the size." Shrinking $\frac34$ of a pizza to two-thirds of it leaves $\frac12$. Dividing by $\frac23$ undoes that shrink: it stretches by $\frac32$.` },
    { type: 'example', title: 'Simplify step by step', problem: M`Simplify $\frac{36}{48}$.`, steps: [{ md: M`gcd(36, 48) = 12.` }, { md: M`$\frac{36\div 12}{48\div 12} = \frac34$.` }] },
  ],
  cards: [
    { id: 'pa.frac.md.c1', front: M`$\frac ab\div\frac cd = ?$ and why?`, back: M`$\frac ab\cdot\frac dc$. Multiplying that by $\frac cd$ gives back $\frac ab$.` },
    { id: 'pa.frac.md.c2', front: M`When can you cancel in a fraction?`, back: M`Only common **factors** of the entire numerator and denominator, never terms that are added.` },
  ],
  book: { ref: 'AoPS Prealgebra §4.1–4.5', assign: 'Exercises in §4.2–4.5.' },
},
];
