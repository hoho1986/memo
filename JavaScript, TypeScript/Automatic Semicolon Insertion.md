# Automatic Semicolon Insertion (ASI)

Specification: [ECMA-262 Automatic Semicolon Insertion](https://262.ecma-international.org/15.0/index.html#sec-automatic-semicolon-insertion)

Semicolon `;` is required at the end of some statements. Including:
- var, let, const
- Expression statements
- do...while
- continue, break, return, throw
- debugger
- Class field declarations (public or private)
- import, export

After the code has been parsed to tokens according to lexical grammer, doing ASI to make invalid token sequences to valid syntax.
There are 3 cases where semicolons are automatically inserted.

## Case 1: Offending token

When a token (called the offending token) not allowed by the grammer is encountered, a semicolon is automatically inserted before if one or more of the following conditions is true:
- The offending token is separated from the previous token by at least one line terminator (including block comment).
- The offending token is `}`.
- The previous token is `)` and the inserted semicolon would parsed as the terminating semicolon of a `do-while` statement.

```
{ 1
2 } 3

// After ASI
{ 1
;2 ;} 3;
```

```
do {
  // ...
} while (condition)
const a = 1

// After ASI
do {
  // ...
} while (condition);
const a = 1
```

Not Applicable
- Within `for` statement's head.
- The previous token is `)` and not terminating `do-while` statement.

```
for (
  let a = 1 // No ASI here
  a < 10 // No ASI here
  a++
) {}

if (Math.random() > 0.5)
const x = 1
```

## Case 2: End Of The Stream

When the end of the input stream of tokens, a semicolon is inserted at the end if the parser is unable to parse the input token stream as a complete program.
It is a complement to the previous rule, specifically for the case without "offending token" but the end of input stream.

```
const a = 1

// After ASI
const a = 1;
```

## Case 3: Restricted Token

Restricted tokens are some tokens must be 
the first token for a terminal or 
nonterminal immediately following the annotation `[no LineTerminator here]`.

When restricted token is separated from the previous token by at least one line terminator, a semicolon is automatically inserted before the restricted token.

Restricted tokens include:
- expr `<here>` ++, expr `<here>` --
- continue `<here>` lbl
- break `<here>` lbl
- return `<here>` expr
- throw `<here>` expr
- yield `<here>` expr
- yield `<here>` \* expr
- (param) `<here>` =\> {}
- async `<here>` function, async `<here>` prop(), async `<here>` function\*, async `<here>` \*prop(), async `<here>` (param) `<here>` => {}

```
a = b
++c

// After ASI
a = b;
++c;
```

```
return
a + b

// After ASI
return;
a + b; // unreachable
```

```
const foo = (a, b)
  => a + b

// After ASI, Invalid syntax
const foo = (a, b);
  => a + b
```

```
async
function foo() {}

// After ASI, Invalid syntax
async;
function foo() {}
```

> If a line starts with:
> - `(` treats as function call.
> - `[` treats as property accessor or [computed property name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names).
> - `` ` `` treats as tagged template literal.
> - `+`, `-`, `/` treats as arithmetic operators. (`/` is used for regular expression literal)

> Semicolon is required when two or more statements are on the same line. (Semicolon is optional before the line break)