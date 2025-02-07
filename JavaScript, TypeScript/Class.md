# JavaScript Class

Class is defined with either class declaration or class expression.
Unlike function declaration, it is no hoisting, must be defined before using, for class declaration.

Class body, where class structure are defined, is enclosed with curly brackets **{}** and executed with strict mode. 

```
class <identifier> {} // class declaration
const <identifier> = class {}; // class expression
const <identifier> = class <identifier named> {}; // class (named) expression
```

> The name of class can be accessed via `name` property.

## Class Body

### Constructor

Constructor is a special method for creating and initializing a new instance of a class.

Syntax: `constructor([arguments]){ [statements] }`

`SyntaxError` will be thrown if the class contains more than one constructor.

For child class, call `super()` within constructor to initialize parent class.

If it is not provided, implicit constructor supplied is `constructor(){}` or `constructor(...arg){super(...arg);}`.

> Constructor likes normal function, it can use default values, rest parameters, destructuring assignment, etc...

> Class constructor must be literal name. Computed property name is not allowed.
> ```
> ['constructor'](){
>   // it is public method. 
> }
> ```

### Static initialization blocks (ES2022)

Syntax: `static { [statements] }`

It provides more flexible initialization of static properties, allows statements (e.g. try catch) be executed during initialization.

In a class body, it can have any number of static initialization blocks.
All the blocks have their own variable scope.
It can access private properties for sharing them between instance and other classes or functions declared in the same scope (like friend in C++ class). 

> Any `var` declarations within the static initialization block are never hoisted.
> 
> Unlike class, a static initialization block may not have any decorators.

Initialization is executed at class evaluation time.
The order of execution is the order of declaration.
If parent class is existed, any child classes will be initialized after initialization of parent class. 

> During class evaluation time,
> - keyword `this` refers to the class constructor function
> - keyword `super` refers to prototype chain of the class constructor function

However, `SyntaxError` will be thrown if
- `super()` is called within the block, or
- attempt access arguments of the class constructor function.

Example:

```
let shareFn;
class A {
  static fieldA = 'A.A';
}
class B extends A {
  static fieldA = 'B.A'
  static {
    let x = super.fieldA;  // access super class static property
    console.log(x); // A.A
  }
  static{
    let x = this.fieldA; // access self class static property
    console.log(x); // B.A
  }
  #pField;
  constructor(v) {
    super();
    this.#pField = v; // set to private field
  }
  static{
    shareFn = o=>o.#pField; // share private property
  }
}
const b1 = new B('B1');
const b2 = new B('B2');
console.log(shareFn(b2)); // B2
console.log(shareFn(b1)); // B1

// 4 lines in console are A.A, B.A, B2, B1

```

### Static fields and methods

#### Static fields

Syntax: `static <identifier>[= value]`

- are only once per class (do not copy to instance of class)
- are usually store the instance reference for singleton design pattern or fixed configuration
- added to class's constructor function via `Object.defineProperty()` at class evaluation time
- computed name allowed. Syntax: Replace <identifier> by expression enclosed with square brackets

```
const sessionPrefix = "XXX";
class Test{
    static radius = 5;
    static circumference = this.radius * 2 * Math.PI; 
    static [`${sessionPrefix}-Timestamp`] = Date.now(); // Computed name is XXX-Timestamp
}
```

> During class evaluation time,
> - keyword `this` refers to the class constructor function
> - keyword `super` refers to prototype chain of the class constructor function

#### Static methods

Syntax: `static [async] [*]<identifier>([arguments]){ statements }`.

- are only once per class (do not copy to prototype object of class)
- are usually be utility methods to create an instance
- added to class's constructor function via `Object.defineProperty()` at class evaluation time
- computed name allowed. Syntax: Replace <identifier> by expression enclosed with square brackets
- besides general function, generators, async and async generator function are allowed.

```
class Test{
    static generalMethod(){
        return 'General Function';
    }
    static *generatorMethod(){
        yield 3;
        yield 1;
        yield 4;
    }
    static async asyncMethod(){
        return new Promise(resolve=>{
            setTimeout(()=>{resolve(3.14159)}, 3000);
        });
    }
    static async *asyncGeneratorMethod(){
        for(let i=0; i<3; i++){
            yield await test.asyncMethod();
        }
    }
}
console.log(Test.generalMethod());
for(const g of Test.generatorMethod()) console.log(g);
Test.asyncMethod().then(e=>{console.log(e)});
(async ()=>{
    for await (const g of Test.asyncGeneratorMethod()) console.log(g);
})();

/* Console:
General Function
3
1
4
3.14159
3.14159
3.14159
3.14159
*/
```

### Instance fields and methods

#### Instance fields

Syntax: `<identifier>[= value]`.

- can be declared at the time needed
- are declared up-front to let class definition more self-documenting, and it is **always present**
- added to the instance via `Object.defineProperty()` at construction time.
- computed name allowed. Syntax: Replace <identifier> by expression enclosed with square brackets

> Construction time 
> - in base class, which is before execution of `constructor()`
> - in subclass, which is just after return of `super()`

> During the construction time,
> - keyword `this` refers to instance of class
> - keyword `super` refers to prototype chain of instance being created

```
class Sample{
    field1 = 3.0; // declared with initializer
    field2; // declared without initializer is assigned to `undefined`
    constructor(f1){
        this.f1 = f1; // declared at the needed time
    }
}
```

#### Instance methods

Syntax: `[async] [*]<identifier>([arguments]){ statements }`

- are available on all instances of the class
- are shared with all instances (the difference is data on instances)
- added to `prototype` property of the class via `Object.defineProperty()` at class evaluation time.
- computed name allowed. Syntax: Replace <identifier> by expression enclosed with square brackets
- besides general function, generators, async and async generator function are allowed.

> Getters and setters are public methods.

> Within method,
> - keyword `this` refer to instance
> - keyword `super` refer to prototype chain of instance 

```
class Test{
    generalMethod(){
        return 'General';
    }
    *generatorMethod(){
        yield 3;
        yield 1;
        yield 4;
    }
    async asyncMethod(){
        return new Promise(resolve=>{
            setTimeout(()=>{resolve(3.14159)}, 3000);
        });
    }
    async *asyncGeneratorMethod(){
        for(let i=0; i<3; i++){
            yield await this.asyncMethod();
        }
    }
}
const o = new Test();
console.log(o.generalMethod());
for(const g of o.generatorMethod()) console.log(g);
o.asyncMethod().then(e=>{console.log(e)});
(async ()=>{
    for await (const g of o.asyncGeneratorMethod()) console.log(g);
})();

/* Console:
General
3
1
4
3.14159
3.14159
3.14159
3.14159
*/
```

### Private static fields and methods

By default, class fields and methods are public.
To have privacy encapsulation, declared with prefix a hash (#) on identifier. The hash is a part of identifier.
It is enforced natively and better than emulated the behavior with closure.

#### Private static fields

Syntax: `static #<identifier>[= value]`

- are only once per class (do not copy to instance of class)
- only accessible on the class which are declared. (Child classes can not access too)
- added to class's constructor function via `Object.defineProperty()` at class evaluation time
- are usually store the instance reference for singleton design pattern or fixed configuration
- computed name is not allowed.

#### Private static methods

Syntax: `static [async] [*]#<identifier>([arguments]){ statements }`.

- are only once per class (do not copy to prototype object of class)
- only accessible on the class which are declared. (Child classes can not access too)
- added to class's constructor function via `Object.defineProperty()` at class evaluation time
- besides general function, generators, async and async generator function are allowed.
- are usually be utility methods to create an instance
- computed name is not allowed

```
class Test{
    static #radius = 5;
    static #circumference = this.#radius * Math.PI * 2; 
    
    static #generalMethod(){
        return Test.#circumference;
    }
    static *#generatorMethod(){
        yield 3;
        yield 1;
        yield 4;
    }
    static async #asyncMethod(){
        return new Promise(resolve=>{
            setTimeout(()=>{resolve(3.14159)}, 3000);
        });
    }
    static async *#asyncGeneratorMethod(){
        for(let i=0; i<3; i++){
            yield await Test.#asyncMethod();
        }
    }
    
    static run(){
        console.log(Test.#generalMethod());
        for(const g of Test.#generatorMethod()) console.log(g);
        Test.#asyncMethod().then(e=>{console.log(e)});
        (async ()=>{
            for await (const g of Test.#asyncGeneratorMethod()) console.log(g);
        })();
    }
}
Test.run();
/* Console:
31.41592653589793
3
1
4
3.14159
3.14159
3.14159
3.14159
*/
```

### Private instance fields and methods

#### Private instance fields

Syntax: `#<identifier>[= value]`.

- must be declared.
- can not be deleted.
- added to the instance via `Object.defineProperty()` at construction time.
- computed name is not allowed.
- only accessible on the class which are declared. (Child classes can not access too)

#### Private instance methods

Syntax: `[async] [*]#<identifier>([arguments]){ statements }`

- are available on all instances of the class
- are shared with all instances (the difference is data on instances)
- added to instance via `Object.defineProperty()` at construction time.
- computed name is not allowed.
- only accessible on the class which are declared. (Child classes can not access too)
- besides general function, generators, async and async generator function are allowed.

> Getters and setters can also be private methods.

```
class Test{
    #prefixVal = "";
    #radius = 5;
    #circumference = this.#radius * Math.PI * 2; 
    
    get #prefix(){
        return this.#prefixVal;
    }
    
    set #prefix(value){
        this.#prefixVal = value;
    }
    
    #generalMethod(){
        return this.#circumference;
    }
    *#generatorMethod(){
        yield 3;
        yield 1;
        yield 4;
    }
    async #asyncMethod(){
        return new Promise(resolve=>{
            setTimeout(()=>{resolve(3.14159)}, 3000);
        });
    }
    async *#asyncGeneratorMethod(){
        for(let i=0; i<3; i++){
            yield await this.#asyncMethod();
        }
    }
    static run(){
        const o = new Test();
        o.#prefix = "SSS";
        console.log(o.#prefix);
        console.log(o.#generalMethod());
        for(const g of o.#generatorMethod()) console.log(g);
        o.#asyncMethod().then(e=>{console.log(e)});
        (async ()=>{
            for await (const g of o.#asyncGeneratorMethod()) console.log(g);
        })();
    }
}
Test.run();

/* Console:
SSS
31.41592653589793
3
1
4
3.14159
3.14159
3.14159
3.14159
*/
```

> Beware `this`, where will be pointed.
> 
> ```
> class Test{
>     static radius = 10;
>     static circumference = this.radius * Math.PI * 2; // class evaluation. `this` always point to class
> 
>     static getCircumference(){
>         return this.circumference; 
>         // `this` may not work as your expected. Use class identifier instead.
>     }
> }
> 
> const t = Test.getCircumference; 
> Test.getCircumference(); // 62.83185307179586
> t(); // this is undefined
> ```

## Inheritance

In ECMAScript, it allows single inheritance only. One class can only have a parent class. 
In some languages, such as C++, allow multiple inheritance.

### Child class with keyword `extends`

By using keyword `extends` to inherit features from parent class. 
Child class should call `super()` before using keyword `this`.

```
class <identifier> extends <parent class> {} // class declaration
const <identifier> = class extends <parent class> {}; // class expression
const <identifier> = class <identifier named> extends <parent class> {}; // class (named) expression
```

Example:
```
class Base{
    constructor(name){
        this.name = name;
    }
    sayIt(){
        return this.name;
    }
}

class Sub extends Base{
    constructor(name){
        super(name); // super must be called before using keyword `this`.
    }
    // if constructor is not defined, default implied constructor is `constructor(...arg){ super(...arg); }`.
    sayTwice(){
        return this.name+" "+this.name;
    }
}

const o = new Sub("Ken");
console.log(o.sayIt()); // Ken
console.log(o.sayTwice()); // Ken Ken
```

Example: Parent class is traditional prototype based constructable function
```
function Base(name){
    this.name = name;
}
Base.prototype.sayIt = function(){
    return this.name;
}

class Sub extends Base{
    constructor(name){
        super(name);
    }
    sayTwice(){
        return this.name+" "+this.name;
    }
}

const o = new Sub("Ken");
console.log(o.sayIt()); // Ken
console.log(o.sayTwice()); // Ken Ken
```

> In traditional prototype based, prototype object of child class should set to prototype object of parent class.
>
> ```
> function Base(){}
> Base.prototype.fnBase = function(){
>     return "Base";
> };
> 
> function Sub(){}
> Sub.prototype = Object.create(base.prototype);
> Sub.prototype.constructor = sub;
> Sub.prototype.fnSub = function(){
>     return "Sub";
> }
> Sub.prototype.fnBase = function(){
>     return "It is Sub";
> };
> ```

Example: Parent class is not traditional prototype based constructable function
```
const Base = {
    sayIt(){
        return this.name;
    }
};

class Sub{
    constructor(name){
        this.name = name;
    }
    sayTwice(){
        return this.name+" "+this.name;
    }
}

Object.setPrototypeOf(Sub.prototype, Base); // not recommended.

const o = new Sub("Ken");
console.log(o.sayIt()); // Ken
console.log(o.sayTwice()); // Ken Ken
```

> Altered existed `[[Prototype]]` causes performance issue. Create an object with desired `[[Prototype]]` with `Object.create()`

### Override constructor for derived object

Using `Symbol.species`
- specifies a constructor function for creating derived objects.
- allows child class to override the default constructor.

> **Explanation and use case**
>
> Once an instance needs to call its constructor during running time, it calls the constructor function returned from `Symbol.species` instead of its constructor.
>
> When provide a library for third party, it is better to return the instance of built-in class instead of an inherited class.

Example:

Without `Symbol.species`
```
class XArray extends Array {}
let a = new XArray(3,1,4,1,5,9); // a instanceof XArray -> true
let m = a.map(v=>v*2); // m instanceof XArray -> true
```

With `Symbol.species`
```
class XArray extends Array {
    static get [Symbol.species](){ return Array; }
}
let a = new XArray(3,1,4,1,5,9); // a instanceof XArray -> true
let m = a.map(v=>v*2); // m instanceof XArray -> false
```

### Call parent methods via `super`

Use keyword `super` to call parent methods. Traditional prototype based can not do it.

```
class base{
    fnBase(){
        return "base";
    }
}
class sub extends base{
    fnSub(){
        return "sub";
    }
    fnBase(){
        const ss = super.fnBase();
        return "It is Sub "+ss;
    }
}

const sss = new sub();
sss.fnSub(); // Sub
sss.fnBase(); // It is Sub base

```

### Mixins

Mixin, a OOP term, is a class which contains methods for other classes.
It may conflict with duplicate naming, to minimize it, good naming for methods within mixin.

One of the implementation
```

// Return a child class with mixin methods with parant class provided from function parameter.

let calculatorMixin = Base => class extends Base {
  calc() { }
};

let randomizerMixin = Base => class extends Base {
  randomize() { }
};

// Use

class Foo { }
class Bar extends calculatorMixin(randomizerMixin(Foo)) { }

```

## Supplement

### Prototype chain and prototype property

`Object.[[Prototype]]`, which is equivalent to non-standard accessor `Object.__proto__`, is used to designate prototype, which is an object too, of Object.

`prototype` property, which is an object, of a function is `[[Prototype]]` of all instances created by the function used as constructor.

Every object has an own `[[Prototype]]` which is used for looking for non-existed properties.
If properties are also not existed on `[[Prototype]]` object, it continues looking for non-existed properties on `[[Prototype]]` of the object and until `[[Prototype]]` is `null`.
Prototype chain is linkage of `[[Prototype]]` until `null` is reached.

## See Also
- [Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [Default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)
- [Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters)
- [Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [Decorators](https://github.com/tc39/proposal-decorators)
- [Well-known Symbols](https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-well-known-symbols)
- [Performance issue of Object.setPrototypeOf()](https://mathiasbynens.be/notes/prototypes)
- [Object.setPrototypeOf()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)
- [Object.create()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [ECMA Class Definition](https://tc39.es/ecma262/multipage/ecmascript-language-functions-and-classes.html#sec-class-definitions)
