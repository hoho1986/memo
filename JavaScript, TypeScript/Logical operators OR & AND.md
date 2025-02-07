# Logical operators OR & AND

**In JavaScript, logical operator `&&` and `||` can return non-boolean value.**

## Logical OR 

Syntax: `expression || expression`.

It evaluates operands from left to right.
It returns immediately with value once operand is evaluated to **truthy**.
If all values are evaluated to **falsy**, the last operand is returned.

> It can use to provide default value. 
> 
> `const cfg = loaded || {};`

## Logical AND 

Syntax: `expression && expression`.

It evaluates operands from left to right.
It returns immediately with value once operand is evaluated to **falsy**.
If all values are evaluated to **truthy**, the last operand is returned.

## See Also
- [Nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator)
- [Falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
