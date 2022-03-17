# JavaScript Class

Class is, in fact a special function, defined with either class declaration or class expression.
Unlike function declaration, it is no hoisting, must be defined before using, for class declaration.

Class body, where members, methods or constructor are defined, is enclosed with curly brackets **{}** and executed with strict mode. 

```
class <identifier> {} // class declaration
const <identifier> = class {}; // class expression
const <identifier> = class <identifier named> {}; // class (named) expression
```

> The name of class can be accessed via `name` property.

## Class Body

### Constructor

Constructor is a special method for creating and initializing a new instance of a class.
`SyntaxError` will be thrown if the class contains more than one constructor.
Call `super` within constructor to initialize parent class.

### Static initialization blocks (ES2022)

Syntax: `static {}`

It provides more flexible initialization of static properties, allows statements (e.g. try catch) be executed during initialization.

In a class body, it can have any number of static initialization blocks.
All of the blocks have their own variable scope.
It can access private properties for sharing them between instance and other classes or functions declared in the same scope (like friend in C++ class). 

Initialization is executed in context of current class declaration.
The order of execution for the block is the order of declaration.
If super class is existed, any sub classes will be initialized after initialization of super class. 

Keyword `this` within the block refers to the constructor object of the class.
If super class is existed, access static properties of the super class via `super.<property>`.
However, `SyntaxError` will be thrown if `super()` is called within the block or attempt access arguments of the class constructor function.

> Any `var` declarations within the static initialization block are never hoisted.
>
> The reason of accessing private properties within static initialization block is the scope of the block is nested within the lexical scope of the class body.
>
> A static initialization block may not have any decorators.

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

### Methods, generators

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions

### Static methods and members


### binding this 

```
class Shape{
	static name = "Shape";
	static getDefaultConf(){
		// skip
		return cfg;
	}
	
	#privateField = "value";
	
	constructor(fillColor, borderColor) {
		this.fillColor = fillColor;
		this.borderColor = borderColor;
	}
	// methods and generators
	getFillColor(){
		return this.fillColor;
	}
	setFillColor(c){
		this.fillColor = c;
	}
	*gen(){
		//skip
		yield f;
	}
	// getters and setters
	get fillColor(){
		return this.getFillColor();
	}
	set fillColor(c){
		this.setFillColor(c);
	}
}
```

# See Also
hoisted

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Class_static_initialization_blocks
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields