# Spread Syntax

Iterable, such as array, via spread syntax, which is notated with `...`, can
- expand to arguments for function calls;
- expand to elements for array literals;
- expand to key-value pairs for object literals

## Example: function

Be careful, the iterable may exceed the limit of arguments for a function call implemented by JavaScript engine.

Replace `Function.prototype.apply()`

```
const arr = ["PI", 3.14, 15];
function testing(s, n1, n2){
    console.log(s, n1, n2);
}

testing(...arr); //log "PI", 3.14, 15
testing.apply(null, arr); // same result as above.
```

Use in \[\[Construct\]\]

```
const xmas = new Date(...[2000, 12-1, 25]); // Function.prototype.apply() can not used for constructor.
console.log(xmas); // Date Object Mon Dec 25 2000 00:00:00 GMT+0800 (Hong Kong Standard Time)
```

Multiple times

```
const arr = [3, ".", 1];
function testing(n1, s, n2, n3, n4, n5){
    console.log(n1, s, n2, n3, n4, n5);
}
testing(...arr, 4, ...[1, 5]); // log 3, ".", 1, 4, 1, 5
```

## Example: array literal

Succinct array literal

```
const a = [1, 4];
const b = [3, ...a, 1, 5];

console.log(b); //log [3, 1, 4, 1, 5]
```

Copy an array

```
let a = [3, 1, 4, 1, 5];
let b = [...a];

b[0]=6;

console.log(a); //log [3, 1, 4, 1, 5]
console.log(b); //log [6, 1, 4, 1, 5]
```

> Only **first** level will be copied
> 
> ```
> let a = [[3,1], [3,2], [3,3]];
> let b = [...a, [3,4]];
> console.log(b); //log [[3,1], [3,2], [3,3], [3,4]]
> 
> b[0][1] = 0;
> console.log(a); //log [[3,0], [3,2], [3,3]]
> console.log(b); //log [[3,0], [3,2], [3,3], [3,4]]
> ```

Concatenate arrays

```
let a = [1, 2, 3];
let b = [4, 5, 6];

let r1 = a.concat(b);
let r2 = [...a, ...b];
console.log(r1); // log [1, 2, 3, 4, 5, 6]
console.log(r2); // log [1, 2, 3, 4, 5, 6]

let r3 = [...b, ...a];
b.unshift(a); // Unlike spread syntax, which will create a new instance, unshift will modify itself.

console.log(r3); // log [4, 5, 6, 1, 2, 3]
console.log(b); // log [4, 5, 6, 1, 2, 3]
```

## Example: object literal

Replace `Object.assign()`
```
let obj1 = { a: 'hello', x: 42 };
let obj2 = { a: 'world', y: 13 };

let cloned = { ...obj1 };
let cloned2 = Object.assign({}, obj1);
console.log(cloned); // log { a: 'hello', x: 42 }
console.log(cloned2); // log { a: 'hello', x: 42 }

let merged = { ...obj1, ...obj2 };
let merged2 = Object.assign({}, obj1, obj2);
console.log(merged); // log {a: 'world', x: 42, y: 13 }
console.log(merged2); // log {a: 'world', x: 42, y: 13 }
```

> Note: `Object.assign()` triggers setters, whereas spread syntax doesn't.
>
> ```
> let obj = {
>     x: 0, 
>     set y(y){
>         console.log("set y "+y);
>     }
> };
> 
> obj = Object.assign(obj, {y:0});
> console.log(obj); //log 2 lines set y 0 and {x: 0, y: setter}
> 
> let spread = {...obj, y:0};
> console.log(spread); // log {x: 0, y: 0}
> ```

## What is iterable

An object or its prototype chain implemented `@@iterator` method, which is available via constant `Symbol.iterator`, is iterable.  

Built-in iterables:
- String
- Array
- TypedArray
- Map
- Set

```
const testing = (...rest)=>rest.forEach(v=>console.log(v)); // Rest parameters & arrow function

let text = "abc";
testing(...text); // log 3 lines A, B and C

let iterable = {
    [Symbol.iterator]: function(){
        return {
            next: function(){
                let val = Math.random();
                if(Math.random()>0.7)
                    return {done: true, value: undefined};
                else
                    return {done: false, value: val};
            }
        };
    }
};
testing(...iterable); // log zero or multiple lines
```

## See Also

- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
- [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)

## Reference

- [Spread syntax (...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)