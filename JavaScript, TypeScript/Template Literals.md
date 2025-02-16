# Template Literal

Template literals, also known as template string, is wrapped with paired backtick (`` ` ``) characters.

Features: 
- String allows across multiple lines.
- Interpolate the expressions.
- Tagged template, may not result in string, can be used with custom tag function to perform whatever operations you want on the different parts of the template literal.

## Syntax

In template literal, almost all characters are allowed, 
including line breaks and other whitespace characters, 
except invalid escape sequences unless tag function used.

Placeholder is embedded expression delimited by a dollar sign and curly braces `${expression}`.
If no tag function, just performs string interpolation to do substitution of placeholders and then concatenate into a single string.

To escape a backtick or dollar signs, put a backslash (`\`) before it.

Nested template literal is allowed. You can return template literal in the expression of placeholder.

```
`Single line`

`Multiple
Line`

`Your user ID is ${expression}. Score: ${expression}`

tagFunction`Your score: ${expression}
Highest score: ${expression}
`
```

## Tagged templates

### Tag Function

Syntax: `function tagFunc(strings, ...expressions)`.

The first argument is an array of string value which is splitted by placeholder.
The remaining arguments are expression of the placeholders.

Identifier do not have to be plain text. Any expression with [operator precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#table) 
greater than 16 can be used. 

It does not even have to return a string.

Furthermore, the first argument, which is immutable, has a special immutable property `raw` that allows accessing the raw strings.

> Raw string is the value of string is as same as they were entered, 
> just like [special characters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#using_special_characters_in_strings) are not processed, 
> by escaping all special characters. e.g. `\n` to `\\n`

`String.raw()` is a tag function and used to create raw string. 
```
String.raw`\n`; // returns "\\n"
```

> The return of `String.raw()` is similar with default behaviour (without tag function). 
> The difference is `String.raw()` return raw string.

Unless it is tagged template literal, the [escape sequences](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#escape_sequences) **MUST** be well-formed.
Altough syntax error is not triggered, the first argument of the tag function is `[undefined]` and keep raw string in `raw` property.
