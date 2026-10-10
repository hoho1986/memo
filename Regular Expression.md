# Group

## Capturing Group

Syntax: `(...)`

Group ID starts at 1 from left to right.

Example: 
- Regular Expression: `/.*(ABC)/`
- Text: `Test ABC Beta`
- Result: Match `Test ABC` Group `ABC`

> For replacement, matched area will be replaced by new text which can embed placeholder `$ID` that will substitute with group content.

## Named Capturing Group

Syntax: `(?<name>...)`

Similar with capturing group plus customize name feature.

Example: 
- Regular Expression: `/.* (?<name>[A-Z]{3,})/`
- Text: `Test ABCD Beta`
- Result: Match `Test ABCD` Group `ABCD`

> Placeholder can either using `$ID` or `$<name>`.


## Non-capturing Group

Syntax: `(?:...)`

Similar with capturing group, such as applying quantifiers, without ID assignment feature.

Example: 
- Regular Expression: `/.* (?:[A-Z]{3,})/`
- Text: `Test ABCDE Beta`
- Result: Match `Test ABCDE`

## Zero-width Positive Lookahead Assertion

Syntax: `(?=...)`

It just performs and passes the assertion test, which is a part of previous pattern, at the position.
Since it is zero-width, it does not consume any characters and is not included in matched result.

Example:
- Regular Expression: `/apple(?= pie)/`
- Text: `apple pie apple pi`
- Result: Match `apple` (the first)

> When the assertion is encountered, it just stay at the location and perform the assertion test.
> `/.*(?=LOOK)A/` is logical wrong. It is impossible to have `LOOK` after `.*` and `A` after `.*` at the same time.
> The pointer stops at the assertion, and determine whether the following text matchs subpattern within the assertion.
> If the assertion is passed, the pointer resumes from where it stopped and the following text must be `LOOK`. 
> Therefore, the `A` after the assertion never matched.

## Zero-width Negative Lookahead Assertion

Syntax: `(?!...)`

It is similar with `Zero-width Positive Lookahead Assertion` and the difference is the assertion is **FAILED** instead of passed.

Example:
- Regular Expression: `/apple(?! pie)/`
- Text: `apple pie apple pi`
- Result: Match `apple` (the second)

## Zero-width Positive Lookbehind Assertion

Syntax: `(?<=...)`

It just performs and passes the assertion test, which is a part of following pattern, at the position.
Since it is zero-width, it does not consume any characters and is not included in matched result.

Example:
- Regular Expression: `/(?<=chocolate) pie/`
- Text: `chocolate pie apple pie`
- Result: Match ` pie` (the first)

## Zero-width Negative Lookbehind Assertion

Syntax: `(?<!...)`

It is similar with `Zero-width Positive Lookbehind Assertion` and the difference is the assertion is **FAILED** instead of passed.

Example:
- Regular Expression: `/(?<!chocolate) pie/`
- Text: `chocolate pie apple pie`
- Result: Match ` pie` (the second)

# Flags

## Multiline `m`

It is not activated by default.

Anchors `^` and `$` only match absolute beginning and end of the entire string respectively.
If it is activated, besides the absolute beginning and end of the entire string, it also matches the start and end of any line. 

Example:
Text: `apple\nboy\ncat\ndog`
Result for `/^cat/`: Not Matched
Result for `/^cat/m`: Matched