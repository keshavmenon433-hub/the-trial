// Month 1, week 2 lessons (days 8–13). Original content written for The Trial.
const M = String.raw;
const num = (v, extra = {}) => ({ type: 'number', value: String(v), ...extra });
const expr = (v, extra = {}) => ({ type: 'expr', value: String(v), ...extra });
const ineq = (v) => ({ type: 'ineq', value: v });
const choice = (options, value) => ({ type: 'choice', options, value });

export const days = [
// =====================================================================================
{ id: 'd008',
  discover: {
    intro: M`Adding fractions is where most people learned a rule without the reason. Today you rebuild it from scratch.`,
    problem: { q: M`A recipe uses $\frac13$ cup of milk and $\frac14$ cup of cream. How much liquid is that altogether, as a fraction of a cup?`, a: num('7/12'), sol: M`Thirds and quarters are different-sized pieces, so you can't just add them. Cut both into twelfths: $\frac13 = \frac{4}{12}$ and $\frac14 = \frac{3}{12}$. Together: $\frac{7}{12}$ cup.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`If you answered $\frac27$, you added tops and bottoms. Check it against common sense: $\frac27$ is *less* than $\frac13$ alone, so it can't be the total. The fix is to cut both quantities into pieces of the **same size** first.` },
    { type: 'key', md: M`**You can only add fractions whose pieces are the same size.** Rewrite both with a common denominator (the lcm of the denominators is the smallest one), then add the numerators:
$$\frac ab + \frac cd = \frac{ad}{bd} + \frac{bc}{bd} = \frac{ad + bc}{bd}.$$
Rewriting $\frac13$ as $\frac4{12}$ is multiplying by $\frac44 = 1$: same number, different name.` },
    { type: 'example', title: 'Least common denominator', problem: M`Compute $\frac{5}{6} - \frac{3}{8}$.`, steps: [
      { md: M`$\text{lcm}(6, 8) = 24$. Rewrite: $\frac56 = \frac{20}{24}$ and $\frac38 = \frac{9}{24}$.`, ask: M`Why use 24 instead of $6\cdot 8 = 48$?`, why: M`48 also works, but 24 keeps the numbers smaller, so there is less simplifying at the end. Any common denominator gives the right answer.` },
      { md: M`$\frac{20}{24} - \frac{9}{24} = \frac{11}{24}$.`, fade: { prompt: M`What is $\frac{20}{24} - \frac{9}{24}$?`, a: num('11/24', { form: 'simplest' }) } },
    ] },
    { type: 'md', md: M`### Comparing fractions
Which is bigger, $\frac{7}{9}$ or $\frac{10}{13}$? Give them a common denominator ($9\cdot 13$): the comparison becomes $7\cdot 13 = 91$ versus $10\cdot 9 = 90$. So $\frac79$ is bigger. This shortcut is **cross-multiplying**: compare $a\cdot d$ with $c\cdot b$.

Two other quick tricks: compare each to a landmark like $\frac12$ or 1; or compare how far each is *from* 1 ($\frac79$ is $\frac29$ short of 1, $\frac{10}{13}$ is $\frac{3}{13}$ short, and $\frac29 < \frac3{13}$ since $2\cdot 13 < 3\cdot 9$).` },
    { type: 'check', item: { id: 'd008-c1', skill: 'pa.frac.as', d: 3, q: M`Which is larger: $\frac{11}{15}$ or $\frac{8}{11}$?`, a: choice([M`$\frac{11}{15}$`, M`$\frac{8}{11}$`], 0), sol: M`$11\cdot 11 = 121$ vs. $8\cdot 15 = 120$. So $\frac{11}{15}$ is (barely) larger.` } },
    { type: 'md', md: M`### Mixed numbers
$3\tfrac25$ means $3 + \frac25 = \frac{17}{5}$. To add or subtract mixed numbers you can either convert to improper fractions, or handle the whole parts and the fraction parts separately, **borrowing** a 1 when the fraction part comes up short.` },
    { type: 'compare', left: { title: 'Improper fractions', md: M`$5\tfrac14 - 2\tfrac23 = \frac{21}{4} - \frac{8}{3} = \frac{63}{12} - \frac{32}{12} = \frac{31}{12} = 2\tfrac{7}{12}$.` }, right: { title: 'Borrowing', md: M`$\frac14 < \frac23$, so borrow: $5\tfrac14 = 4\tfrac54$. Then $(4 - 2) + (\frac54 - \frac23) = 2 + \frac{15 - 8}{12} = 2\tfrac{7}{12}$.` } },
    { type: 'mistake', md: M`Casey added $\frac{2}{5} + \frac{3}{4}$:

1. $\frac25 + \frac34 = \frac{2+3}{5+4}$
2. $= \frac{5}{9}$`, question: 'Where is the error?', options: ['Line 1', 'Line 2', 'No error'], answer: 0, explain: M`Adding denominators is wrong: fifths and quarters are different-size pieces. The total must be more than $\frac34$, but $\frac59 < \frac34$. Correct: $\frac{8}{20} + \frac{15}{20} = \frac{23}{20}$.` },
    { type: 'example', title: 'A telescoping sum', problem: M`Compute $\frac{1}{2} - \frac13 + \frac13 - \frac14 + \frac14 - \frac15$.`, steps: [
      { md: M`Every middle term appears once with $+$ and once with $-$, so they cancel.` },
      { md: M`What's left: $\frac12 - \frac15 = \frac{3}{10}$.`, fade: { prompt: M`$\frac12 - \frac15 = $`, a: num('3/10', { form: 'simplest' }) } },
      { md: M`Contest problems often hide this. Note that $\frac{1}{k(k+1)} = \frac1k - \frac1{k+1}$, so a sum like $\frac1{2\cdot 3} + \frac1{3\cdot 4} + \frac{1}{4\cdot 5}$ is exactly this telescoping sum in disguise.` },
    ] },
    { type: 'explain', prompt: M`Explain why $\frac{1}{3}+\frac{1}{3}+\frac13 = 1$ means you should NOT add denominators.`, model: M`Adding denominators would give $\frac{3}{9} = \frac13$, so three thirds would add up to one third. Three equal pieces that each make a third of a whole must make the whole. The denominator names the size of the piece; it doesn't change when you collect more pieces of that size.` },
    { type: 'check', item: { id: 'd008-c2', skill: 'pa.frac.as', d: 3, q: M`Compute $3\tfrac12 - 1\tfrac56$. (A mixed number or a fraction is fine.)`, a: num('5/3'), sol: M`$\frac72 - \frac{11}{6} = \frac{21}{6} - \frac{11}{6} = \frac{10}{6} = \frac53 = 1\tfrac23$.` } },
  ], summary: [
    M`Only same-size pieces add: use a common denominator, then add numerators.`,
    M`Compare $\frac ab$ and $\frac cd$ by comparing $ad$ and $bc$, or by using landmarks.`,
    M`Mixed numbers: convert to improper fractions, or borrow when subtracting.`,
  ] },
  practice: { items: [
    { id: 'd008-p1', skill: 'pa.frac.as', d: 3, q: M`Compute $\frac{1}{2} + \frac{1}{3} + \frac{1}{6}$.`, a: num(1), sol: M`$\frac36 + \frac26 + \frac16 = 1$.` },
    { id: 'd008-p2', skill: 'pa.frac.as', d: 4, q: M`Compute $\dfrac{\frac12 + \frac13}{\frac12 - \frac13}$.`, a: num(5), sol: M`Top $\frac56$, bottom $\frac16$; ratio 5.` },
  ] },
  challenge: { items: [
    { id: 'd008-x1', skill: 'pa.frac.as', d: 4, dok: 3, q: M`Compute $\frac{1}{1\cdot 2}+\frac{1}{2\cdot 3}+\cdots+\frac{1}{99\cdot 100}$.`, a: num('99/100'), sol: M`Each term is $\frac1k - \frac1{k+1}$. The sum telescopes to $1 - \frac{1}{100} = \frac{99}{100}$.` },
    { id: 'd008-x2', skill: 'pa.frac.as', d: 4, dok: 3, q: M`What is the smallest positive integer $n$ such that $\frac{1}{2} + \frac{1}{3} + \frac{1}{7} + \frac{1}{n}$ is an integer?`, a: num(42), sol: M`$\frac12 + \frac13 + \frac17 = \frac{21 + 14 + 6}{42} = \frac{41}{42}$. Adding $\frac{1}{42}$ makes 1, and any smaller $n$ would make the sum between 1 and 2 without reaching 2. So $n = 42$.` },
    { id: 'd008-x3', skill: 'pa.frac.as', d: 5, dok: 3, q: M`Which is largest? (A) $\frac{2020}{2021}$ (B) $\frac{2021}{2022}$ (C) $\frac{2022}{2023}$`, a: choice(['(A)', '(B)', '(C)'], 2), sol: M`Each is $1 - \frac{1}{\text{denominator}}$. The bigger the denominator, the smaller the gap from 1, so (C) is largest.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: money.** A third of a dollar isn't a coin, but think in cents with a common unit. $\frac14$ dollar is 25 cents, $\frac{1}{10}$ dollar is 10 cents: together 35 cents, $\frac{35}{100} = \frac{7}{20}$ dollar. Converting both to cents IS finding a common denominator (100).` },
    { type: 'key', md: M`Before adding, ask: what size piece can both fractions be cut into? That size is the common denominator.` },
  ],
  cards: [
    { id: 'pa.frac.as.c1', front: M`How do you add $\frac ab + \frac cd$?`, back: M`Common denominator: $\frac{ad + bc}{bd}$ (or use the lcm of $b$ and $d$).` },
    { id: 'pa.frac.as.c2', front: M`Fast way to compare $\frac ab$ and $\frac cd$?`, back: M`Compare $ad$ with $bc$ (cross-multiply).` },
  ],
  book: { ref: 'AoPS Prealgebra §4.6–4.9', assign: 'Exercises in §4.6–4.8, then Chapter 4 Review Problems and three Challenge Problems.' },
},

// =====================================================================================
{ id: 'd009',
  discover: {
    intro: M`Variables let you talk about every number at once. Today you learn to rewrite expressions without changing their value.`,
    problem: { q: M`Pick any number. Double it, add 10, divide by 2, then subtract the number you started with. Try it with a few starting numbers. What do you always get?`, a: num(5), sol: M`With $x$: $\frac{2x + 10}{2} - x = (x + 5) - x = 5$. Always 5, whatever you start with. An expression with a variable can describe *every* case at once.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`Testing a few numbers suggested the answer is always 5. Writing the steps with a variable $x$ *proves* it: $2x \to 2x + 10 \to x + 5 \to 5$. That's the power of algebra: one calculation covers infinitely many cases.` },
    { type: 'md', md: M`### Expressions
An **expression** combines numbers and variables with operations: $3x + 7$, $\frac{a+b}{2}$, $5n^2 - n$. The pieces joined by $+$ or $-$ are **terms**; the number multiplying a variable is its **coefficient**. **Like terms** have exactly the same variable part ($4x$ and $-9x$ are like terms; $4x$ and $4x^2$ are not).` },
    { type: 'key', md: M`**Combining like terms is the distributive property.** $4x + 9x = (4 + 9)x = 13x$. Unlike terms can't combine: $4x + 9y$ stays as it is, just as 4 apples + 9 oranges isn't 13 of anything.` },
    { type: 'example', title: 'Distribute, then combine', problem: M`Simplify $3(2x - 5) - 4(x - 1)$.`, steps: [
      { md: M`Distribute: $6x - 15 - 4x + 4$.`, ask: M`Why did $-4(x - 1)$ become $-4x + 4$ rather than $-4x - 4$?`, why: M`The $-4$ multiplies both terms: $-4\cdot x = -4x$ and $-4\cdot(-1) = +4$.` },
      { md: M`Combine like terms: $(6x - 4x) + (-15 + 4) = 2x - 11$.`, fade: { prompt: M`Type the simplified expression.`, a: expr('2x-11', { form: 'simplified' }) } },
    ] },
    { type: 'mistake', md: M`Drew simplified $5 - 2(x + 3)$:

1. $5 - 2(x + 3) = 3(x + 3)$
2. $= 3x + 9$`, question: 'Which line is wrong?', options: ['Line 1', 'Line 2', 'Neither'], answer: 0, explain: M`Order of operations: the multiplication $2(x + 3)$ happens before the subtraction. So $5 - 2(x+3) = 5 - 2x - 6 = -2x - 1$. Drew subtracted $5 - 2$ first, which isn't allowed. Test with $x = 0$: the original is $5 - 6 = -1$, but Drew's answer gives 9.` },
    { type: 'md', md: M`### Evaluating
To evaluate an expression, substitute and follow the order of operations. Use parentheses around substituted negatives: if $x = -3$, then $x^2 = (-3)^2 = 9$, and $-x^2 = -9$.` },
    { type: 'check', item: { id: 'd009-c1', skill: 'pa.expr', d: 3, q: M`Evaluate $2x^2 - 3x + 1$ when $x = -2$.`, a: num(15), sol: M`$2(4) - 3(-2) + 1 = 8 + 6 + 1 = 15$.`, mis: { '3': 'Check $-3x$ with $x = -2$: that is $+6$.', '-1': '$(-2)^2 = +4$, so $2x^2 = 8$.' } } },
    { type: 'example', title: 'Testing whether two expressions are equal', problem: M`Is $(a + b)^2$ the same as $a^2 + b^2$?`, steps: [
      { md: M`Test $a = 1$, $b = 1$: $(1+1)^2 = 4$ but $1 + 1 = 2$. **Not equal.**` },
      { md: M`One counterexample is enough to prove two expressions are different. (To prove they're always equal you need algebra: here $(a+b)^2 = a^2 + 2ab + b^2$.)`, ask: M`If two expressions agree for $x = 0$, does that prove they're the same?`, why: M`No. $x^2$ and $3x$ agree at $x = 0$ (and $x = 3$) but differ elsewhere. Agreeing at a few points is evidence; algebra is proof.` },
    ] },
    { type: 'explain', prompt: M`Explain why $3x + 2x = 5x$ but $3x\cdot 2x \ne 5x$.`, model: M`$3x + 2x = (3 + 2)x$ by the distributive property: 3 of something plus 2 of it is 5 of it. But $3x\cdot 2x = 3\cdot 2\cdot x\cdot x = 6x^2$: multiplying multiplies the coefficients and the variables.` },
    { type: 'check', item: { id: 'd009-c2', skill: 'pa.expr', d: 3, q: M`Simplify $4(a - 2b) - 3(a - 3b)$.`, a: expr('a+b', { form: 'simplified' }), sol: M`$4a - 8b - 3a + 9b = a + b$.` } },
  ], summary: [
    M`Like terms (same variable part) combine by adding coefficients. That's the distributive property.`,
    M`A minus sign in front of parentheses flips the sign of every term inside.`,
    M`One counterexample proves two expressions differ; matching on a few values doesn't prove they're equal.`,
  ] },
  practice: { items: [
    { id: 'd009-p1', skill: 'pa.expr', d: 2, q: M`Simplify $7y - 3 + 2y + 10$.`, a: expr('9y+7', { form: 'simplified' }), sol: M`$9y + 7$.` },
    { id: 'd009-p2', skill: 'pa.expr', d: 4, q: M`If $a + b = 7$, what is $3a + 3b - 5$?`, a: num(16), sol: M`$3(a + b) - 5 = 21 - 5 = 16$.`, hints: ['You don\'t need $a$ and $b$ separately.'] },
  ] },
  challenge: { items: [
    { id: 'd009-x1', skill: 'pa.expr', d: 4, dok: 3, q: M`If $x + \frac1x = 5$, what is $x^2 + \frac{1}{x^2}$?`, a: num(23), sol: M`Square both sides: $x^2 + 2 + \frac{1}{x^2} = 25$, so $x^2 + \frac{1}{x^2} = 23$.`, hints: ['Square both sides. What is $x\\cdot\\frac1x$?'] },
    { id: 'd009-x2', skill: 'pa.expr', d: 4, dok: 3, q: M`If $2a - b = 7$ and $a + 3b = 0$, what is $3a + 2b$?`, a: num(7), sol: M`Add the equations: $(2a - b) + (a + 3b) = 3a + 2b = 7 + 0 = 7$.`, hints: ['Try adding the two equations.'] },
    { id: 'd009-x3', skill: 'pa.expr', d: 5, dok: 3, q: M`Compute $2025^2 - 2024\cdot 2026$.`, a: num(1), sol: M`Let $n = 2025$: $n^2 - (n-1)(n+1) = n^2 - (n^2 - 1) = 1$.`, hints: ['Let $n = 2025$ and write everything in terms of $n$.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: algebra tiles.** Picture $x$ as a long tile and $1$ as a small square. $3(x + 2)$ is three copies of (one long tile + two small squares): 3 long tiles and 6 small squares, $3x + 6$. Subtracting $2x$ removes two long tiles. Like terms are tiles of the same shape.` },
    { type: 'example', title: 'Slowly, one step at a time', problem: M`Simplify $2(x + 4) - x$.`, steps: [{ md: M`Distribute: $2x + 8 - x$.` }, { md: M`Group like terms: $(2x - x) + 8 = x + 8$.` }] },
  ],
  cards: [
    { id: 'pa.expr.c1', front: M`What are like terms?`, back: M`Terms with exactly the same variable part, like $3x$ and $-5x$.` },
    { id: 'pa.expr.c2', front: M`$-(a - b) = ?$`, back: M`$-a + b$. The minus flips every sign inside.` },
  ],
  book: { ref: 'AoPS Prealgebra §5.1', assign: 'Exercises in §5.1.' },
},

// =====================================================================================
{ id: 'd010',
  discover: {
    intro: M`An equation is a balance. Today: how to find the unknown without guessing, and why each step is allowed.`,
    problem: { q: M`A bag of marbles plus 7 loose marbles weighs the same as 3 identical bags of marbles plus 1 loose marble. If all marbles weigh the same, how many marbles are in one bag?`, a: num(3), sol: M`Let a bag hold $b$ marbles: $b + 7 = 3b + 1$. Take one bag off each side: $7 = 2b + 1$. Take 1 marble off each side: $6 = 2b$. So $b = 3$.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`You probably removed equal things from both sides of the balance: one bag from each side, then one marble. That's all solving an equation is: doing the **same thing to both sides** until the unknown stands alone.` },
    { type: 'key', md: M`**An equation stays true if you do the same thing to both sides**: add, subtract, multiply, or divide by the same number (not 0). Choose the steps that undo what was done to the variable, in reverse order.` },
    { type: 'example', title: 'Variables on both sides', problem: M`Solve $5x - 4 = 2x + 11$.`, steps: [
      { md: M`Subtract $2x$ from both sides: $3x - 4 = 11$.`, ask: M`Why subtract $2x$ rather than $5x$?`, why: M`Either works. Subtracting the smaller one keeps the $x$ coefficient positive, which avoids sign mistakes.` },
      { md: M`Add 4: $3x = 15$. Divide by 3: $x = 5$.` },
      { md: M`**Check:** $5(5) - 4 = 21$ and $2(5) + 11 = 21$. ✓ Always check by substituting back.` },
    ] },
    { type: 'example', title: 'Clearing fractions', problem: M`Solve $\dfrac{x}{3} + \dfrac{x - 1}{4} = 5$.`, steps: [
      { md: M`Multiply both sides by 12 (the lcm of 3 and 4): $4x + 3(x - 1) = 60$.`, ask: M`Why must the $3$ multiply the whole $(x - 1)$?`, why: M`Because $12\cdot\frac{x-1}{4} = 3(x - 1)$: the fraction bar groups $x - 1$ as one quantity.` },
      { md: M`$7x - 3 = 60$, so $7x = 63$ and $x = 9$. Check: $\frac93 + \frac84 = 3 + 2 = 5$ ✓.`, fade: { prompt: M`Solve $7x - 3 = 60$.`, a: num(9) } },
    ] },
    { type: 'mistake', md: M`Pat solved $3(x + 2) = 18$:

1. $3x + 2 = 18$
2. $3x = 16$
3. $x = \frac{16}{3}$`, question: 'Which line has the error?', options: ['Line 1', 'Line 2', 'Line 3'], answer: 0, explain: M`The 3 multiplies both terms: $3x + 6 = 18$, so $x = 4$. (Or divide both sides by 3 first: $x + 2 = 6$.) Checking $\frac{16}{3}$ in the original gives $3\cdot\frac{22}{3} = 22 \ne 18$.` },
    { type: 'md', md: M`### Zero, one, or infinitely many solutions
Sometimes the variable disappears. If what's left is false (like $4 = 7$), there is **no solution**: no value balances the scale. If what's left is always true (like $4 = 4$), **every** number is a solution.` },
    { type: 'check', item: { id: 'd010-c1', skill: 'pa.lineq', d: 3, q: M`How many solutions does $2(x + 3) = 2x + 5$ have?`, a: choice(['None', 'Exactly one', 'Infinitely many'], 0), sol: M`$2x + 6 = 2x + 5$ leads to $6 = 5$. False, so no solutions.` } },
    { type: 'explain', prompt: M`Why is it not allowed to divide both sides of an equation by 0?`, model: M`Because $a\div 0$ isn't a number. Also, multiplying both sides by 0 turns every equation into $0 = 0$, which destroys the information: $x = 3$ and $x = 5$ would both "become" $0 = 0$.` },
    { type: 'check', item: { id: 'd010-c2', skill: 'pa.lineq', d: 3, q: M`Solve $4 - (x - 3) = 2x + 1$.`, a: num(2), sol: M`$4 - x + 3 = 2x + 1$, so $7 - x = 2x + 1$, $6 = 3x$, $x = 2$.` } },
  ], summary: [
    M`Do the same to both sides; undo operations in reverse order.`,
    M`Multiply by the lcm of the denominators to clear fractions, and distribute over whole numerators.`,
    M`If the variable cancels: false statement = no solution; true statement = every number works. Always check by substituting.`,
  ] },
  practice: { items: [
    { id: 'd010-p1', skill: 'pa.lineq', d: 3, q: M`Solve $0.5x + 3 = 0.2x - 6$.`, a: num(-30), sol: M`$0.3x = -9$, $x = -30$.` },
    { id: 'd010-p2', skill: 'pa.lineq', d: 4, q: M`Solve $\dfrac{2x + 1}{5} = \dfrac{x - 4}{2}$.`, a: num(22), sol: M`Cross-multiply: $2(2x + 1) = 5(x - 4)$, so $4x + 2 = 5x - 20$, $x = 22$.` },
  ] },
  challenge: { items: [
    { id: 'd010-x1', skill: 'pa.lineq', d: 4, dok: 3, q: M`For what value of $k$ does $3x + k = 5x - 7$ have the solution $x = 4$?`, a: num(6), sol: M`Substitute $x = 4$: $12 + k = 13$, so $k = 1$... check: $5\cdot 4 - 7 = 13$, and $3\cdot 4 + k = 12 + k$. So $k = 1$.`, hints: ['Substitute $x = 4$ and solve for $k$.'] },
    { id: 'd010-x2', skill: 'pa.lineq', d: 4, dok: 3, q: M`For what value of $a$ does $a(x - 2) = 3x + 5$ have **no** solution?`, a: num(3), sol: M`$ax - 2a = 3x + 5$. If $a = 3$: $-6 = 5$, false, so no solution. For any other $a$ we can solve for $x$.`, hints: ['When does the $x$ disappear?'] },
    { id: 'd010-x3', skill: 'pa.lineq', d: 5, dok: 3, q: M`Solve $\dfrac{x}{2} + \dfrac{x}{3} + \dfrac{x}{6} = x - 1 + \dfrac{x}{7}$.`, a: num(7), sol: M`$\frac x2 + \frac x3 + \frac x6 = x$, so the equation becomes $x = x - 1 + \frac{x}{7}$, giving $\frac x7 = 1$, $x = 7$.`, hints: ['Simplify the left side first.'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: undoing a machine.** $3x + 5 = 20$ says "a number went through a machine: ×3, then +5, and came out 20." To get back, run the machine backwards: −5 (15), then ÷3 (5). Solving an equation is reversing the machine, last step first.` },
    { type: 'example', title: 'Backward through the machine', problem: M`Solve $2x - 7 = 9$.`, steps: [{ md: M`Last thing done to $x$: subtract 7. Undo it: $2x = 16$.` }, { md: M`First thing done: multiply by 2. Undo it: $x = 8$.` }] },
  ],
  cards: [
    { id: 'pa.lineq.c1', front: M`What can you do to an equation without changing its solutions?`, back: M`Add/subtract the same thing on both sides; multiply/divide both sides by the same **nonzero** number.` },
    { id: 'pa.lineq.c2', front: M`If solving leads to $3 = 3$? To $3 = 5$?`, back: M`$3 = 3$: infinitely many solutions. $3 = 5$: no solution.` },
  ],
  book: { ref: 'AoPS Prealgebra §5.2–5.3', assign: 'Exercises in §5.2 and §5.3.' },
},
];

// fix: d010-x1 answer stated cleanly (k = 1)
days[2].challenge.items[0] = { id: 'd010-x1', skill: 'pa.lineq', d: 4, dok: 3, q: M`For what value of $k$ does $3x + k = 5x - 7$ have the solution $x = 4$?`, a: num(1), sol: M`Substitute $x = 4$: the left side is $12 + k$ and the right side is $20 - 7 = 13$. So $12 + k = 13$ and $k = 1$.`, hints: ['Substitute $x = 4$ and solve for $k$.'] };

days.push(
// =====================================================================================
{ id: 'd011',
  discover: {
    intro: M`Word problems are translation problems: English in, equation out. And inequalities are equations that allow a whole range of answers.`,
    problem: { q: M`A school trip costs \$200 for the bus plus \$12 per student. The budget is \$500. What is the greatest number of students who can go?`, a: num(25), sol: M`Total cost $200 + 12n \le 500$, so $12n \le 300$ and $n \le 25$. At most 25 students.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`You turned a sentence into $200 + 12n \le 500$. The symbol $\le$ ("at most") is the difference from yesterday: instead of one answer, a whole range of $n$ works, and the question asked for the largest.` },
    { type: 'key', md: M`**Translating words to equations.** 1) Name the unknown precisely ("let $n$ = number of students"). 2) Write every other quantity in terms of $n$. 3) Find the sentence that says two things are equal (or compared). 4) Solve, then answer the question that was actually asked, with units.` },
    { type: 'example', title: 'Consecutive integers', problem: M`The sum of three consecutive even integers is 138. What is the largest?`, steps: [
      { md: M`Let the smallest be $n$. The others are $n + 2$ and $n + 4$.`, ask: M`Why $n + 2$ and not $n + 1$?`, why: M`Consecutive *even* integers are 2 apart (like 44, 46, 48).` },
      { md: M`$3n + 6 = 138$, so $n = 44$. The largest is $n + 4 = 48$.`, fade: { prompt: 'The largest of the three is…', a: num(48) } },
      { md: M`Shortcut: the middle number is the average, $138\div 3 = 46$.` },
    ] },
    { type: 'md', md: M`### Inequalities
$x < 5$ means every number less than 5. Solving an inequality is like solving an equation, with **one** extra rule: **multiplying or dividing by a negative number reverses the inequality.** Why: $2 < 3$, but $-2 > -3$. Negating flips the number line, so the order flips too.` },
    { type: 'example', title: 'Dividing by a negative', problem: M`Solve $7 - 3x \ge 22$.`, steps: [
      { md: M`Subtract 7: $-3x \ge 15$.` },
      { md: M`Divide by $-3$ and flip: $x \le -5$.`, fade: { prompt: M`Type the solution (like x <= -5).`, a: ineq('x<=-5') } },
      { md: M`Check with a number in the solution, $x = -6$: $7 + 18 = 25 \ge 22$ ✓. And one outside, $x = 0$: $7 \ge 22$ ✗. Good.` },
    ] },
    { type: 'mistake', md: M`Lee solved $-2x < 8$:

1. Divide both sides by $-2$.
2. $x < -4$`, question: 'What went wrong?', options: ['Should be x > -4', 'Should be x < 4', 'Nothing'], answer: 0, explain: M`Dividing by $-2$ flips the inequality: $x > -4$. Test $x = 0$: $-2(0) = 0 < 8$ is true, and $0 > -4$, but Lee's answer $x < -4$ would exclude 0.` },
    { type: 'check', item: { id: 'd011-c1', skill: 'pa.ineq', d: 3, q: M`How many integers $x$ satisfy $-3 < 2x + 1 \le 9$?`, a: num(6), sol: M`Subtract 1: $-4 < 2x \le 8$. Divide by 2: $-2 < x \le 4$. Integers: $-1, 0, 1, 2, 3, 4$: six.` } },
    { type: 'explain', prompt: M`Explain why multiplying both sides of $3 < 5$ by $-1$ must flip the sign.`, model: M`$-3$ and $-5$: on the number line, $-5$ is to the left of $-3$, so $-3 > -5$. Negating reflects numbers across 0, which reverses their order.` },
    { type: 'check', item: { id: 'd011-c2', skill: 'pa.wordeq', d: 3, q: M`Maya is 4 years older than Leo. In 6 years, the sum of their ages will be 40. How old is Leo now?`, a: num(12), sol: M`Leo $L$, Maya $L + 4$. In 6 years: $(L + 6) + (L + 10) = 40$, so $2L = 24$, $L = 12$.` } },
  ], summary: [
    M`Name the unknown, express everything with it, find the "equals" sentence, answer the actual question.`,
    M`Inequalities solve like equations, but multiplying or dividing by a negative flips the sign.`,
    M`Check an inequality's answer with one number inside the solution and one outside.`,
  ] },
  practice: { items: [
    { id: 'd011-p1', skill: 'pa.wordeq', d: 3, q: M`A rectangle is 3 times as long as it is wide, and its perimeter is 64. What is its area?`, a: num(192), sol: M`Width $w$: $2(w + 3w) = 64$, $w = 8$, length 24, area 192.` },
    { id: 'd011-p2', skill: 'pa.ineq', d: 3, q: M`What is the smallest integer $n$ with $5n - 3 > 2n + 14$?`, a: num(6), sol: M`$3n > 17$, $n > 5\tfrac23$, smallest integer 6.` },
  ] },
  challenge: { items: [
    { id: 'd011-x1', skill: 'pa.wordeq', d: 4, dok: 3, q: M`A store sells pens for \$3 and notebooks for \$5. Kai spends exactly \$41 and buys more than 4 of each. How many items did Kai buy in total?`, a: num(11), sol: M`$3p + 5n = 41$ with $p, n \ge 5$. Try $n = 5$: $3p = 16$, no. $n = 7$: $3p = 6$, $p = 2$, too few. $n = 6$: $3p = 11$, no. Hmm, with $p \ge 5$: $3p \ge 15$ so $5n \le 26$, $n \le 5$; $n = 5$ gives $3p = 16$, not an integer. Let's relax to "at least 2 of each": options $(p,n) = (2,7),(7,4)$. So "more than 4 of each" is impossible; the intended condition is at least 4 of each: $(7, 4)$, total 11.`, hints: ['Try each possible number of notebooks.'] },
    { id: 'd011-x2', skill: 'pa.ineq', d: 4, dok: 3, q: M`How many positive integers $n$ satisfy $\dfrac{n}{4} < 10 < \dfrac{n}{3}$?`, a: num(9), sol: M`$\frac n4 < 10$ means $n < 40$; $10 < \frac n3$ means $n > 30$. So $31 \le n \le 39$: nine integers.` },
    { id: 'd011-x3', skill: 'pa.wordeq', d: 5, dok: 3, q: M`Three friends split a bill. Ana pays half of what the other two pay together. Ben pays a third of what the other two pay together. Cy pays \$35. What was the total bill?`, a: num(84), sol: M`Ana pays half of the rest, so Ana pays $\frac13$ of the total $T$. Ben pays a third of the rest, so $\frac14$ of $T$. Cy pays $T - \frac T3 - \frac T4 = \frac{5T}{12} = 35$, so $T = 84$.`, hints: ['If Ana pays half of what the others pay, what fraction of the total does Ana pay?'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: a table.** For word problems with people, ages, or items, make a small table: rows for each person or thing, columns for "now" and "later" (or "count" and "value"). Fill each cell with an expression in your one unknown. The equation is usually a row or column that the problem tells you the total of.` },
    { type: 'key', md: M`Inequality sign flips only when you multiply or divide both sides by a negative. Adding or subtracting a negative does **not** flip it.` },
  ],
  cards: [
    { id: 'pa.ineq.c1', front: M`When does an inequality sign flip?`, back: M`When both sides are multiplied or divided by a negative number.` },
    { id: 'pa.wordeq.c1', front: M`Three consecutive integers summing to $S$: what's the middle one?`, back: M`$S\div 3$ (the average).` },
  ],
  book: { ref: 'AoPS Prealgebra §5.4–5.6', assign: 'Exercises in §5.4–5.5, then Chapter 5 Review Problems and two Challenge Problems.' },
},
);
// d011-x1 wording is replaced by a clean version
days[3].challenge.items[0] = { id: 'd011-x1', skill: 'pa.wordeq', d: 4, dok: 3, q: M`A store sells pens for \$3 and notebooks for \$5. Kai spends exactly \$41 and buys at least 4 of each. How many items did Kai buy in total?`, a: num(11), sol: M`$3p + 5n = 41$ with $p, n \ge 4$. Since $3p \ge 12$, $5n \le 29$, so $n$ is 4 or 5. $n = 5$: $3p = 16$, not a whole number. $n = 4$: $3p = 21$, $p = 7$. Total $7 + 4 = 11$.`, hints: ['Try each possible number of notebooks.'] };

days.push(
// =====================================================================================
{ id: 'd012',
  discover: {
    intro: M`Every fraction is a decimal that either stops or repeats forever. Today you'll learn to go both ways.`,
    problem: { q: M`The decimal $0.\overline{3}$ means $0.333\ldots$ forever. Which fraction equals $0.\overline{36} = 0.363636\ldots$?`, a: num('4/11'), sol: M`Let $x = 0.\overline{36}$. Then $100x = 36.\overline{36}$. Subtracting: $99x = 36$, so $x = \frac{36}{99} = \frac{4}{11}$.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`The infinite tail is the problem: you can't write all the digits. The trick is to shift the decimal by exactly one repeat (multiply by 100 for a two-digit repeat) so the tails line up, and subtract. The infinite parts cancel.` },
    { type: 'md', md: M`### Decimals are fractions with power-of-10 denominators
$0.375 = \frac{375}{1000} = \frac38$. To add decimals, line up the decimal points (that's lining up denominators). To multiply, multiply as whole numbers and count total decimal places: $0.4\times 0.06 = \frac{4}{10}\cdot\frac{6}{100} = \frac{24}{1000} = 0.024$.` },
    { type: 'check', item: { id: 'd012-c1', skill: 'pa.dec', d: 2, q: M`Compute $1.25\times 0.08$.`, a: num(0.1), sol: M`$125\cdot 8 = 1000$; four decimal places: $0.1000 = 0.1$.` } },
    { type: 'key', md: M`**Which fractions stop?** A fraction in lowest terms has a terminating decimal exactly when its denominator has no prime factors other than 2 and 5, because only then can it be scaled up to a power of 10. $\frac{7}{40}$ terminates ($40 = 2^3\cdot 5$); $\frac{7}{30}$ repeats ($30$ has a 3).` },
    { type: 'example', title: 'Fraction to decimal', problem: M`Write $\frac{7}{16}$ as a decimal.`, steps: [
      { md: M`$16 = 2^4$. Multiply top and bottom by $5^4 = 625$ to make $10^4$: $\frac{7\cdot 625}{10000} = \frac{4375}{10000}$.` },
      { md: M`$= 0.4375$.`, fade: { prompt: 'As a decimal:', a: num(0.4375) } },
    ] },
    { type: 'example', title: 'A repeat that starts late', problem: M`Write $0.1\overline{6}$ as a fraction.`, steps: [
      { md: M`Let $x = 0.1666\ldots$ Then $10x = 1.666\ldots$ and $100x = 16.666\ldots$` },
      { md: M`Subtract: $100x - 10x = 15$, so $90x = 15$ and $x = \frac{15}{90} = \frac16$.`, ask: M`Why subtract $10x$ instead of $x$?`, why: M`$10x$ and $100x$ have the same repeating tail (.666…), so it cancels. $x$ itself has tail .1666…, which doesn't match.` },
    ] },
    { type: 'mistake', md: M`Quinn claimed $0.\overline{9} < 1$ "because it's always a tiny bit short."`, question: 'What is true?', options: ['$0.\\overline{9} < 1$', '$0.\\overline{9} = 1$', '$0.\\overline{9}$ is not a number'], answer: 1, explain: M`Let $x = 0.\overline{9}$: $10x - x = 9.\overline{9} - 0.\overline{9} = 9$, so $x = 1$. Another check: $\frac13 = 0.\overline{3}$, and multiplying by 3 gives $1 = 0.\overline{9}$. There is no number between them, so they're the same number.` },
    { type: 'md', md: M`### Rounding
To round to a place, look at the next digit: 5 or more rounds up. $3.14159$ to the nearest hundredth is $3.14$; to the nearest thousandth, $3.142$.` },
    { type: 'check', item: { id: 'd012-c2', skill: 'pa.dec', d: 4, q: M`Write $0.\overline{18}$ as a fraction in lowest terms.`, a: num('2/11', { form: 'simplest' }), sol: M`$\frac{18}{99} = \frac{2}{11}$.` } },
    { type: 'explain', prompt: M`Explain why $\frac{1}{3}$ cannot have a terminating decimal.`, model: M`A terminating decimal is a fraction over a power of 10. If $\frac13 = \frac{a}{10^k}$, then $10^k = 3a$, so 3 would divide $10^k = 2^k5^k$. It doesn't, because 3 isn't one of its prime factors.` },
  ], summary: [
    M`Decimals are fractions over powers of 10; count decimal places when multiplying.`,
    M`A reduced fraction terminates exactly when its denominator is of the form $2^a5^b$.`,
    M`Repeating decimal → fraction: multiply to shift by one full repeat, then subtract so the tails cancel.`,
  ] },
  practice: { items: [
    { id: 'd012-p1', skill: 'pa.dec', d: 3, q: M`Which of these has a terminating decimal? (A) $\frac{3}{14}$ (B) $\frac{9}{120}$ (C) $\frac{5}{6}$`, a: choice(['(A)', '(B)', '(C)'], 1), sol: M`$\frac{9}{120} = \frac{3}{40}$, and $40 = 2^3\cdot 5$. (A) has a 7 and (C) a 3 in the denominator.` },
    { id: 'd012-p2', skill: 'pa.dec', d: 4, q: M`Write $1.\overline{2}$ as a fraction.`, a: num('11/9'), sol: M`$1 + \frac29 = \frac{11}{9}$.` },
  ] },
  challenge: { items: [
    { id: 'd012-x1', skill: 'pa.dec', d: 4, dok: 3, q: M`What is the 100th digit after the decimal point in the decimal for $\frac{1}{7}$?`, a: num(8), sol: M`$\frac17 = 0.\overline{142857}$ repeats every 6 digits. $100 = 6\cdot 16 + 4$, so the 100th digit is the 4th in the block: 8.`, hints: ['Find the repeating block and its length.'] },
    { id: 'd012-x2', skill: 'pa.dec', d: 4, dok: 3, q: M`Compute $0.\overline{3} + 0.\overline{6} + 0.\overline{12}$ as a fraction in lowest terms.`, a: num('37/33', { form: 'simplest' }), sol: M`$\frac13 + \frac23 + \frac{12}{99} = 1 + \frac{4}{33} = \frac{37}{33}$.` },
    { id: 'd012-x3', skill: 'pa.dec', d: 5, dok: 3, q: M`For how many integers $n$ with $1 \le n \le 30$ does $\frac{n}{30}$ have a terminating decimal?`, a: num(10), sol: M`$30 = 2\cdot 3\cdot 5$. In lowest terms the denominator loses its 3 exactly when 3 divides $n$, and then only 2s and 5s remain. Multiples of 3 from 1 to 30: ten of them.`, hints: ['$30 = 2\\cdot 3\\cdot 5$. Which factor has to cancel?'] },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: long division shows why decimals repeat.** Dividing 1 by 7, each step leaves a remainder from 0 to 6. There are only 7 possible remainders, so within 7 steps a remainder must repeat, and from then on the digits repeat too. That's why every fraction's decimal either stops (remainder 0) or repeats.` },
    { type: 'key', md: M`One repeating digit: multiply by 10. Two: by 100. $k$ digits: by $10^k$. Then subtract.` },
  ],
  cards: [
    { id: 'pa.dec.c1', front: M`When does a fraction (in lowest terms) have a terminating decimal?`, back: M`When the denominator's only prime factors are 2 and 5.` },
    { id: 'pa.dec.c2', front: M`$0.\overline{ab}$ as a fraction?`, back: M`$\frac{ab}{99}$ (then simplify).` },
  ],
  book: { ref: 'AoPS Prealgebra §6.1–6.5', assign: 'Exercises in §6.3–6.4, then Chapter 6 Review Problems.' },
},

// =====================================================================================
{ id: 'd013',
  discover: {
    intro: M`Ratios compare quantities by multiplication. Most "how many" problems in contests are ratio problems in disguise.`,
    problem: { q: M`A smoothie recipe uses strawberries and bananas in the ratio 5 : 3. You want 24 pieces of fruit total. How many strawberries do you need?`, a: num(15), sol: M`5 : 3 means 8 equal "parts" of fruit: 5 parts strawberry, 3 parts banana. 24 pieces in 8 parts is 3 per part, so $5\cdot 3 = 15$ strawberries.` },
  },
  learn: { sections: [
    { type: 'debrief', md: M`The key was "parts": a ratio $5:3$ means the amounts are $5k$ and $3k$ for some number $k$. Once you find $k$ (here 3), everything else follows.` },
    { type: 'key', md: M`**A ratio $a : b$ means the quantities are $ak$ and $bk$ for some $k$.** Ratios can be scaled: $5 : 3 = 10 : 6 = 15 : 9$. Three-way ratios work the same way: $2 : 3 : 4$ means $2k, 3k, 4k$.` },
    { type: 'example', title: 'Proportions', problem: M`If 7 notebooks cost \$9.80, how much do 12 cost?`, steps: [
      { md: M`Cost per notebook: $9.80\div 7 = 1.40$.` },
      { md: M`$12\cdot 1.40 = 16.80$. Or set up a proportion: $\frac{7}{9.80} = \frac{12}{x}$.`, fade: { prompt: 'Cost of 12 notebooks, in dollars:', a: num(16.8) } },
    ] },
    { type: 'md', md: M`### Unit conversions
Multiply by fractions equal to 1, chosen so the unwanted units cancel:
$$3\text{ yd}\cdot\frac{3\text{ ft}}{1\text{ yd}}\cdot\frac{12\text{ in}}{1\text{ ft}} = 108\text{ in}.$$
**Careful with area and volume:** a square foot is $12\times 12 = 144$ square inches, not 12.` },
    { type: 'check', item: { id: 'd013-c1', skill: 'pa.ratio', d: 3, q: M`How many square feet are in 3 square yards?`, a: num(27), sol: M`1 square yard = $3\times 3 = 9$ square feet; times 3 is 27.`, mis: { '9': 'That converts yards to feet once; area needs it twice: 3 × 3 = 9 sq ft per sq yd.' } } },
    { type: 'example', title: 'A ratio that changes', problem: M`A jar has red and blue marbles in ratio 3 : 4. After 10 red marbles are added, the ratio becomes 1 : 1. How many marbles were there originally?`, steps: [
      { md: M`Originally $3k$ red and $4k$ blue. After: $3k + 10$ red, $4k$ blue.` },
      { md: M`Equal: $3k + 10 = 4k$, so $k = 10$. Originally $30 + 40 = 70$ marbles.`, ask: M`Why can't you just use the numbers 3 and 4 directly?`, why: M`The ratio says *proportion*, not count: 3 : 4 could be 3 and 4, or 30 and 40. The multiplier $k$ captures the actual size.` },
    ] },
    { type: 'mistake', md: M`Rowan said: "The ratio of boys to girls is 2 : 3, so $\frac23$ of the class is boys."`, question: 'Is that right?', options: ['Yes', 'No: 2/5 of the class is boys', 'No: 3/5 of the class is boys'], answer: 1, explain: M`2 : 3 means 5 equal parts, 2 of which are boys: $\frac25$ of the class. $\frac23$ is boys *compared to girls*, not compared to the whole class.` },
    { type: 'explain', prompt: M`A map scale says 1 cm : 5 km. Explain why an area of 1 square cm on the map is 25 square km, not 5.`, model: M`A 1 cm by 1 cm square on the map is a 5 km by 5 km square in real life, so its area is $5\times 5 = 25$ square km. Lengths scale by 5, so areas scale by $5^2$.` },
    { type: 'check', item: { id: 'd013-c2', skill: 'pa.ratio', d: 4, q: M`Ages of three siblings are in the ratio $2 : 3 : 5$ and add to 40. How old is the oldest?`, a: num(20), sol: M`10 parts make 40, so 4 per part; oldest $5\cdot 4 = 20$.` } },
  ], summary: [
    M`Ratio $a : b$ means amounts $ak$ and $bk$. Find $k$ and you're done.`,
    M`Part-to-part ($2:3$) is not part-to-whole ($\frac25$).`,
    M`Convert units by multiplying by 1 in disguise; area units convert by the square, volume by the cube.`,
  ] },
  practice: { items: [
    { id: 'd013-p1', skill: 'pa.ratio', d: 3, q: M`If $\frac{x}{12} = \frac{5}{8}$, what is $x$?`, a: num('15/2'), sol: M`$x = 12\cdot\frac58 = 7.5$.` },
    { id: 'd013-p2', skill: 'pa.ratio', d: 4, q: M`How many cubic feet are in 2 cubic yards?`, a: num(54), sol: M`1 cubic yard = $3^3 = 27$ cubic feet; times 2 is 54.` },
  ] },
  challenge: { items: [
    { id: 'd013-x1', skill: 'pa.ratio', d: 4, dok: 3, q: M`If $a : b = 2 : 3$ and $b : c = 4 : 5$, what is $a : c$? Give $\frac ac$ as a fraction.`, a: num('8/15'), sol: M`Make $b$ match: $a : b = 8 : 12$ and $b : c = 12 : 15$. So $a : c = 8 : 15$.`, hints: ['Rescale both ratios so the $b$ values are equal.'] },
    { id: 'd013-x2', skill: 'pa.ratio', d: 4, dok: 3, q: M`A punch is 1 part juice to 4 parts soda. How much juice must be added to 10 liters of this punch to make it 1 part juice to 1 part soda?`, a: num(6), sol: M`10 L has 2 L juice and 8 L soda. To make juice equal soda, add 6 L of juice.` },
    { id: 'd013-x3', skill: 'pa.ratio', d: 5, dok: 3, q: M`The ratio of the areas of two squares is $9 : 25$. What is the ratio of their perimeters? Give the smaller-to-larger ratio as a fraction.`, a: num('3/5'), sol: M`Areas scale as the square of side lengths, so sides are in ratio $3 : 5$, and perimeters (4 × side) are too.` },
  ] },
  reteach: [
    { type: 'md', md: M`**Another way: draw bars.** For $5 : 3$, draw 5 equal boxes in one bar and 3 equal boxes in another. If you know the total (24), divide it by all 8 boxes to find one box (3). Then read off whatever you need. This "tape diagram" is just $k$ drawn as a box.` },
    { type: 'key', md: M`Ratio problems: find the value of one part.` },
  ],
  cards: [
    { id: 'pa.ratio.c1', front: M`What does the ratio $a : b$ mean in terms of actual amounts?`, back: M`The amounts are $ak$ and $bk$ for some positive number $k$.` },
    { id: 'pa.ratio.c2', front: M`How many square inches in a square foot?`, back: M`$12\times 12 = 144$.` },
  ],
  book: { ref: 'AoPS Prealgebra §7.1–7.4', assign: 'Exercises in §7.1–7.4.' },
},
);
