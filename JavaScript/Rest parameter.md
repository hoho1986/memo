# Rest parameter

It provides [variadic function](https://en.wikipedia.org/wiki/Variadic_function) in JavaScript.

## Syntax and key point
- It is parameter name prefixed with `...`
- It must be only one and the last parameter in the function definition.
- It is an array even no value is passed into.
- It is able to use destructuring assignment.

## Example: Rest parameter
```
function test(...a){
    return a;
}
const testing = (...a)=>a;

test(1,2,3); // return [1,2,3];
testing(); // return []; 
```

## Example: Rest parameter with destructuring assignment
```
function test(...[a, b, c]){
    console.log(a, b, c);
}

const testing = (...[a, b=3.1415, c=3.14159265359])=>console.log(a, b, c);

test(3.14); // log 3.14, undefined, undefined 
testing(3.14, null); // log 3.14, null, 3.14159265359
testing(null, undefined); // log null, 3.1415, 3.14159265359

```