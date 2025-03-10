# React Study Memo

## Prerequisite Knowledge

### Destructure Assignment

Syntax:
```
let [a, b] = array; // Variable a is array[0] and b is array[1].
let [a, , b] = array; // Variable a is array[0] and b is array[2]. array[1] is skipped.
let [a = defaultValue, b] = array; // Default value is used if value of array[0] is undefined. Also, undefined is returned if element is not existed. 
let [a, , b, ...rest] = array; // Variable rest is an array of all elements not assigned. array[1] is assigned to nothing and not present in rest.

let { a, b } = obj; // Variable a is obj["a"] and b is obj["b"].
let { a: a1, b: b1 } = obj; // Variable a1 is obj["a"] and b1 is obj["b"].
let { a: a1 = defaultValue, b = defaultValue } = obj; // Default value is used if value of obj["a"] is undefined. Also, undefined is returned if property is not existed.
let { a, b, ...rest } = obj; // Variable rest is an object of all properties not assigned.
let {[key]:a} = obj; // Computed property name is allowed. If key is "var", it looks for obj["var"].

let [a, b, ...{len}] = [1, 2, 3, 4]; // a: 1, b:2, len: 2. Do object destructuring assignment without binding to a variable.
let [a, b, ...[,arr]] = [1, 2, 3, 4]; // a: 1, b:2, arr: 4. Do array destructuring assignment without binding to a variable.
```

Destructuring assignment can be used:
- `for...in` 
- `for...of` e.g. `for (const {x,y} of [{x:1, y:1}, {x:2, y:2}]) console.log(x*y); // 1 4
- `for await...of`
- Function parameters. e.g. `const fn = ({x,y})=>x*y; fn({x:2,y:3}); // 6`
- Catch binding variable e.g. `try{throw {x:1,y:2}}catch({x,y}){console.log(x+y)} // 3`

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
[Reference: Computed property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)

### Arrow Function Expression

Syntax:
```
(para1, ...paraN)=>{statements}

only1Para=>{statements} // Parentheses can be omitted if it have only one parameter.

()=>{statements} // Parentheses required if it have no parameter.

()=>expression // Simplify coding by just writing an expression if only returns the expression within the statement.
()=>{return expression} // As same as above line
```

Limitation:
- Cannot used as constructor. 
  - Calling it with `new` throws TypeError.
  - No `new.target`. It is used on function expression for detecting is it called with `new` operator.
- No binding to `this`, `arguments`, `super`
  - Use rest parameter as alternative to `arguments`
- Cannot used as generator. Simplify, no `yield` within their body.

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

### Rest Parameter

Provides a simple way to implement variadic function.

> Variadic function accept indefinite number of arguments.

Syntax: `function(para, ...rest){}`

Restrictions:
- Only one rest parameter in function definition.
- Must be the last parameter.
- No trailing commas.
- No default value.

Example:
```
const fn1 = (item, ...children)=>{
	// children is array. Array's methods can be used. e.g. sort(), map(), foreach()...
};

function fn2(item, ...[,secondItem, thirdItem, ...rest]){
	// Destructure assignment allowed
	console.log(rest);
}
fn2(1,2,3,4,5,6,7); // [5,6,7]
```

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

### Spread Syntax

Spread syntax (`...`) can be used on:
- Function arguments list. e.g. `func(para1, ...iterableObj, para2)`
  - Replace `Function.prototype.apply()`. `myFunction.apply(null, array);` can be replaced with `myFunction(...array);`
  - Can use multiple times. e.g. `func(para1, ...iterableObj, ...iterableObj)`
  - Can be used on constructor with `new`. 
- Array literal. e.g. `[1, ...iterableObj, '4', 'five', 6]`
- Object literal. e.g. `{key1: 'value', ...obj, key2: 'value'}`

TODO

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

### Modules

TODO

[Reference: export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
[Reference: import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
[Reference: import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import)

### Naming Convention

Common conventions below:
- camelCase
- PascalCase
- CONSTANT_CASE
- snake_case
- camel_Snake_Case
- Pascal_Snake_Case
- kebab-case
- COBOL-CASE
- HTTP-Header-Case

### Template Literals

Template literals, also known as template string, is wrapped with paired backtick (`` ` ``) characters.

Features: 
- String allows across multiple lines.
- Interpolate the expressions via placeholder.
- Tagged template, may not result in string, can be used with custom tag function to perform whatever operations you want on the different parts of the template literal.

Placeholder is embedded expression delimited by a dollar sign and curly braces `${expression}`.
If no tag function, just performs string interpolation to do substitution of placeholders and then concatenate into a single s

To escape a backtick or dollar signs, put a backslash (`\`) before it.

Nested template literal is allowed. You can return template literal in the expression of placeholder.

Example:
```
`Single line`

`Multiple
Line`

`Your user ID is ${expression}. Score: ${expression}`

tagFuncti`Your score: ${expression}
Highest score: ${expression}
`tring is the value of string is as same as they were entered, 
> just 
Tag fuon
```
nction syntax: `function tagFunc(strings, ...expressions)`.

The first argument is an array of string value which is splitted by placeholder. 
(Also it has a special immutable property `raw` that allows accessing the raw strings.)
The remaining arguments are expression of the placeholders.
It does not even have to return a string.

> Raw slike [special characters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#using_special_characters_in_strings) are not processed, 
> by escaping all special characters. e.g. `\n` to `\\n`

`String.raw()` is a tag function and used to create raw string. 
```
String.raw`\n`; // returns "\\n"
```

> The return of `String.raw()` is similar with default behaviour (without tag function). 
> The difference is `String.raw()` return raw string.

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

### Promise

It is used for asynchronous operation and contains states:
- `pending`: initial state, neither fulfilled nor rejected.
- `fulfilled`: operation was completed successfully.
- `rejected`: operation failed.

> Static methods `Promise.resolve()` and `Promise.reject()` are used for create a `Promise` object that is resolved with given value or rejected with a given reason.
>
> Static method `Promise.try()` accepts a function and returns 
> - alreadly fulfilled if the function returns a value.
> - already rejected if the function throws an error.
> - asynchronously fulfilled or rejected if the function return a `Promise`.

Example:
```
const promise = ()=>new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo"); // or reject(new Error("Failed"));
  }, 3000);
});

// use Promise.withResolvers(). Maybe, it is more simplify.
const promise = ()=>{
  let {promise, resolve, reject} = Promise.withResolvers();
  setTimeout(() => {
    resolve("foo"); // or reject(new Error("Failed"));
  }, 3000);
  return promise;
};
```

You may run multiple `Promise` in concurrency via the following static methods which accept iterable of promises and return a `Promise`.
- `Promise.all()`: Rejected once any of the promises rejected; Otherwise, it is fulfilled.
- `Promise.allSettled()`: Fulfilled when all promises are completed regardless fulfilled or rejected.
- `Promise.any()`: Fulfilled once any of the promises is fulfilled and rejected when all of the promises are rejected.
- `Promise.race()`: Fulfilled or rejected is depended on the state of the first of the promises is completed with fulfilled or rejected.

> Methods are used for handling operation completed regardless fulfilled or rejected.
> - `then()`: accept callbacks for fulfilled and rejected.
> - `catch()`: accept callback for rejected. Shortcut for `then(undefined, onRejected)`.
> - `finally()` accept callback for operation completed regardless fulfilled or rejected.
> 
> Example:
> ```
> promise.then(value=>{
>   console.log(value); // foo
> },err=>{
>   console.log(err); // Error Object
> });
> ```
>
> It can deeply nested. Recommend: `AsyncFunction`.

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### Async Function

- contains zero or more `await` expressions.
- returns a new Promise instance
  - resolved with the value returned by the async function, or
  - rejected with uncaught exception within the async function.

Operator `await`
- returns 
  - fulfilled value if expression is instance of `Promise` or `Thenable` interface, or
  - value of expression if it is not instance of `Promise` or `Thenable` interface.
- throws exception with rejection reason once object, which is instance of `Promise` or `Thenable` interface, is rejected.

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

### Shorthand of Object Literal

You can simplify the code if variable name of property value is as same as property name.

```
const a = "foo";
const b = 42;
const c = {};

const o = {
  a: a,
  b: b,
  c: c,
};

const o = { a, b, c }; // Simplify by shorthand property names
```

A shorthand notation is also available for method, so that the keyword `function` is no longer necessary.

```
const o = {
  property: function (parameters){},
  property2: function*(parameters){}
};

// Simplify by shorthand method names

const o = {
  property(parameters){},
  *property2(parameters){}
};

// Async is also fine.

const o = {
  async property(parameters){},
  async *property2(parameters){}
};

```

> Object literal is also known as object initializer.

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)

### Class

It is used on traditional react component. 

[Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class)

## React Hooks

useState
useEffect
useCallback
useMemo
useContext
useReducer
useRef

Customized Hook