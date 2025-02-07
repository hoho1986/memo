# Object Initializer

It is a comma-delimited list, which is zero or more pairs of property names and associated values, enclosed in curly braces `{}`.

# Traditional notation

Example: an empty object

```
let obj = {};
```

Example: an example object

```
let x = 0, y = 0, z = 0;
let obj = {
    w: 0,
    x: x,
    y: y,
    z: z,
    another: {
        // skip
    },
    
    /* normal functions */
    getW: function(){ 
        return this.w;
    },
    setW: function(value){
        this.w = value;
    },
    
    /* getter & setter */
    get w() {
        return this.getW();
    },
    set w(value){
        this.setW(value);
    },
    
    /* generator */
    getGenerator: function*(){
        //skip
    },
    
    /* async function and generator */
    getAsync: async function(){
        await Promise;
    },
    getAsyncGenerator: async function*(){
        //skip
    }
};
```

> Compare with JavaScript Object Notation (JSON)
>
> - Property name of JSON must be enclosed with double quotes `" "`.
> - Short name can not be used in JSON.
> - In JSON, values of the following data types are accepted:
>   - strings
>   - numbers
>   - arrays
>   - true
>   - false
>   - null
>   - JSON Object

## Enhanced notation since ES2015

Shorthands and computed property name are introduced since ES2015.

Example: shorthand:
> Traditional notation
> ```
> let x = 0, y = 0, z = 0;
> let obj = { 
>     /* properties */
>     x: x,
>     y: y,
>     z: z,
>     
>     /* normal functions */
>     getX: function(){ 
>         return this.x;
>     },
>     setX: function(value){
>         this.x = value;
>     },
>     
>     /* generator */
>     getGenerator: function*(){
>         //skip
>     },
>     
>     /* async function and generator */
>     getAsync: async function(){
>         await Promise;
>     },
>     getAsyncGenerator: async function*(){
>         //skip
>     }
> };
> ```

```
let x = 0, y = 0, z = 0;
let obj = {
    /* properties */
    x, y, z,
    
    /* normal functions */
    getX(){ 
        return this.x;
    },
    setX(value){
        this.x = value;
    },
    
    /* generator */
    *getGenerator(){
        //skip
    },
    
    /* async function and generator */
    async getAsync(){
        await Promise;
    },
    async* getAsyncGenerator(){
        //skip
    }
};
```

Example: computed property name:

```
const p1 = 'posX';
const p2 = 'Y';
let c3 = {
    [p1]: 0,
    ['pos'+p2]: 0 // computed property name is expression in brackets [].
};
// c3 = {posX: 0, posY: 0}

let obj = {
    [exprssion]: 0,
    get [exprssion]() {},
    set [exprssion](value) {},
    [exprssion](...rest) {},
    *[exprssion](...rest) {},
    async [exprssion](...rest) {},
    async* [exprssion](...rest) {},
};
```

Example: mix with traditional notation:

```
let w = 3, x = 0, y = 0, z = 0;
let obj = {
    x, 
    y: w, 
    z,
    getX(){
        return this.x;
    },
    getY: function(){
        return this.y;
    }
};
```

## Property accessors

It is used to access object's properties. 2 notations:
- Dot `.` notation, which only used on property name is JavaScript identifier.
- Bracket `[]` notation

```
let x = 0, y = 0, z = 0;
let s1 = {x, y, z, "12A": 0};

console.log(s1.x); // Dot notation
console.log(s1['x']); // Bracket notation
console.log(s1["12A"]); // Bracket notation only due to property name is invalid JavaScript identifier.
```

> JavaScript identifier
> - A sequence of characters, which are unicode letters , $, \_, and digits, used to identify a variable, function, or property.
> - It is case-sensitive and not start with a digit.

## Duplicated property name

In ES5 strict mode, it is `SyntaxError`. Removed since ES2015, computed property name made duplication possible at runtime.

The latest value of property will override the previous value.

## Prototype object
To define prototype, use `__proto__` property in the object initializer.
Unlike normal property, it only allows once within the object initializer.
It must be defined with traditional notation, shorthands and computed property name will define the property instead of changing prototype.

```
let protoObj = {};
let o1 = {}; // [[Prototype]] Object.prototype
let o2 = {__proto__: null} // [[Prototype]] null
let o3 = {'__proto__': protoObj} // [[Prototype]] protoObj

let o4 = {['__proto__']: protoObj} // [[Prototype]] Object.prototype, o4['__proto__'] protoObj
```

## See Also
- [Prototype Chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)