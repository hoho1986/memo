# Destructuring Assignment

The syntax is a JavaScript expression that makes it possible to unpack values from arrays, or properties from objects, into distinct variables. Just like Perl and Python.

Syntax:

```
[distinct variables] = Source array
{distinct variables} = Source object
```

## Array

Example - basic:

```
let foo = ['one', 'two', 'three'];
const [red, yellow, green] = foo; // from a variable
// red = 'one'; yellow = 'two'; green = 'three'

let a, b; // declaring first
[a, b] = [1, 2]; // from a literal
// a = 1; b = 2

function f() {return [1, 2, 4];}
let [c, d] = f();  // declaring and destructuring at the same time from a return of function 
// c = 1; d = 2
```

Example - default value:

```
const c = [2];
let [a, b] = c;
// a = 2; b = undefined

[a=5, b=7] = c;
//  a = 2; b = 7
```

Example - rest assignment

```
const [a, ...b] = [1, 2, 3];
// a = 1; b = [2,3]
```

Example - ignoring some values:

```
function f() {return [1, 2, 4];}
let [a, ,b] = f(); 
// a = 1; b = 4

[a] = f(); // remained elements are ignored.
// a = 1;

[a, , , b] = [4, 2, 1, 0];
// a = 4; b = 0

[a, , , , b] = [4, 2, 1, 0];
// a = 4; b = undefined

let uri = /^(\w+)\:\/\/([^\/]+)\/(.*)$/.exec(url);
const [, protocol, fullhost, fullpath] = uri; 
// The matched text is the first element and can be ignored.
```

Example - swapping:

```
let a = 1;
let b = 3;
[a, b] = [b, a];
// a = 3; b = 1

const arr = [1,2,3];
[arr[2], arr[1]] = [arr[1], arr[2]];
// arr = [1,3,2]
```

## Object

Example - basic:

```
let o = { p: 42, q: true, others: 5 };
const { p, q } = o; // from a variable
// p = 42; q = true;

let {a, b} = {a: 1, b: 2}; // from a literal
// a = 1; b = 2
({a, b} = {a: 3, b: 4}); // the parentheses are required due to operator precedence.
// a = 3; b = 4;

let obj = { self: '123' };
obj.__proto__.proto = '456';
const { self, proto } = obj; // it will lookup the prototype chain.
// self = '123'; prot = '456'
```

Example - default value:

```
let { a, b } = { a: 3.1415 };
// a = 3.1415; b = undefiend

const {a = 10, b = 5} = { a: 3.1415 };
// a = 3.1415; b = 5
```

Example - rest assignment:

```
const v = { a: 10, b: 20, c: 30, d: 40, e: 50 };
v.__proto__.proto = 3.1415;
let {a, c, ...rest} = v; // rest variable must be the last parameter.
// a = 10; c = 30; rest = { b: 20, d: 40, e: 50 }

let proto;
({a, c, proto, ...rest} = v); // rest assignment do not lookup prototype chain.
// a = 10; c = 30; proto: 3.1415; rest = { b: 20, d: 40, e: 50 }
```

Example - new variable name:

```
const o = { p: 42, q: true };
const { p: foo, q: bar } = o;
// foo = 42; bar = true

const f = { 'fizz-buzz': true };
const { 'fizz-buzz': fizzBuzz } = f; // for invalid javascript identifier (invalid variable name)
// fizzBuzz = true

let key = 'f';
let {[key+"oo"]: fff} = {foo: 'bar'}; // accessed by computed property names.
// fff = 'bar';
```

Example - new variable name and default value:
```
const { a: aa = 10, b: bb = 5 } = { a: 3 };
// aa = 3; bb = 5
```

## Destructuring as function parameter

Example - destructuring object:

```
const data = {
    id: 42,
    displayName: 'jdoe',
    fullName: {
        firstName: 'John',
        lastName: 'Doe'
    }
};
function userId({id}) {
    return id;
} 
function whois({displayName, fullName: {firstName: name}}) {
  return `${displayName} is ${name}`;
}
userId(data);
// 42
whois(data);
// jdoe is John

userId();
// Uncaught TypeError

function userId({id} = {}) { // Redeclare the function with default value (just added = {} )
    return id;
} 
userId();
// undefined instead of Error

```

Example - destructuring array:

```
const data = [1, 2, 4, 8, 16, 32];
function pick135([a, , b, , c=10] = []){
    return `1: ${a} 3: ${b} 5: ${c}`;
}
pick135(data);
// 1: 1 3: 4 5: 16
```

## Destructuring with in iteration

Example - `for...of` statement:

```
const people = [
    {
        name: 'Mike Smith',
        family: {
            mother: 'Jane Smith',
            father: 'Harry Smith'
        },
        age: 35
    },
    {
        name: 'Tom Jones',
        family: {
            mother: 'Norah Jones',
            father: 'Richard Jones'
        },
        age: 25
    }
];
for (const {name: n, family: {father: f}} of people) { 
    console.log('Name: ' + n + ', Father: ' + f);
}
//Name: Mike Smith, Father: Harry Smith
//Name: Tom Jones, Father: Richard Jones
```

## Destructuring mixed object and array

Example: array within object

```
const metadata = {
  title: 'Scratchpad',
  translations: [
    {
        locale: 'de',
        localization_tags: [],
        last_edit: '2014-04-14T08:43:37',
        url: '/de/docs/Tools/Scratchpad',
        title: 'Notizblock'
    },
    {
        locale: 'fr',
        localization_tags: [],
        last_edit: '2014-04-14T08:43:37',
        url: '/fr/docs/Tools/Scratchpad',
        title: 'Bloc-notes'
    }
  ],
  url: '/en-US/docs/Tools/Scratchpad'
};

let {
    title: enTitle,
    translations: [ ,
        {
           title: frTitle,
        }
    ],
} = metadata;
// enTitle = 'Scratchpad'; frTitle = 'Bloc-notes'
```

Example: object within array

```
const props = [
    { id: 1, name: 'Fizz'},
    { id: 2, name: 'Buzz'},
    { id: 3, name: 'FizzBuzz'}
];
const [,, { name: fullName }] = props;
// fullName = 'FizzBuzz'
```

## See Also
- [Operator Precedence](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)
- [Computed property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)
