# Logical operators OR & AND

**In JavaScript, logical operator `&&` and `||` can return non-boolean value.**

## Logical OR 

Syntax: `expression1 || expression2`.

if expression1 can be evaluated to `true`, returns expression1; else, returns expression2.

> It can use to provide default value. 
> `const cfg = loaded || {};`

## Logical AND 

Syntax: `expression1 && expression2`.

It evaluates operands from left to right.
It returns immediately with value once it is evaluated to falsy.
If all values are evaluated to `true`, the last operand is returned.

## See Also
- [Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
- [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)