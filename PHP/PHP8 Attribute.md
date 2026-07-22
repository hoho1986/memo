# Attributes

Attribute
- introduce since PHP 8.0.
- allows adding metadata, which can be retrieved programmatically via Reflection APIs, into code. e.g. `classes`, `methods`, `properties`...
- has no impact during execution.

## Declaring Attributes

In order to use attributes, declare a standard class with `#[Attribute]` attribute.
By default, attribute can be used in any declaration unless it is specified.
Also, attribute can not be repeated on same declaration unless it is set to repeatable.
To change the default behaviour, using following constants:
- `Attribute::TARGET_CLASS`
- `Attribute::TARGET_FUNCTION`
- `Attribute::TARGET_METHOD`
- `Attribute::TARGET_PROPERTY`
- `Attribute::TARGET_CLASS_CONSTANT`
- `Attribute::TARGET_PARAMETER`
- `Attribute::TARGET_CONSTANT`
- `Attribute::TARGET_ALL`
- `Attribute::IS_REPEATABLE`

Multiple constants are allowed via bitwise operator.
Click [here](https://www.php.net/manual/en/class.attribute.php#attribute.constants) to get latest constants.

> The `Attribute` class is declared `final`, which prevents it from being extended.

Attribute can be applied to class declaration.
```
#[Attribute(Attribute::TARGET_CLASS)]
class Foo {} 
```

Attribute can be applied to method and function declaration.
```
#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_FUNCTION)]
class Foo {} 
```

Attribute can be repeated.
```
#[Attribute(Attribute::TARGET_ALL | Attribute::IS_REPEATABLE)]
class Foo {} 
```

Attribute can have zero or more parameters which will be passed to class constructor of the attribute.
```
#[Attribute]
class CustomAttribute {
    public function __construct(
        public string $message
    ) {
    }
}
```

> Any expression that can be used as a class constant can be used as attribute parameter.

Example
```
<?php
#[Attribute(Attribute::TARGET_METHOD | Attribute::TARGET_FUNCTION)]
class AttrMethod {
    public function __construct(
        public ?string $fnName = NULL
    ){
    }
} 

#[Attribute]
class FooAttribute {
    public function __construct(
        public int $uid = 0
    ){
        if(!$uid) $this->uid = rand();
    }
}
```

## Using Attributes

Syntax: 
- Single attribute: `#[Attribute]`
- Multiple attributes
  - separated by space(s) or newline: `#[Attribute] #[Attribute2]` 
  - separated by comma in same bracket: `#[Attribute, Attribute2]`

Attributes name can be resolved to class name. 
The class name can be tidied up via `use` statement that following standard class name resolution.

> If an attribute does not map to a class, [Reflection API](https://www.php.net/manual/en/book.reflection.php) does not fetch the attribute instance anymore.

There is a new method, that returns array of [`ReflectionAttribute`](https://www.php.net/manual/en/class.reflectionattribute.php) instance, for reflection API to get attributes.

List of classes that have `getAttributes()` method
- ReflectionClass
- ReflectionClassConstant
- ReflectionConstant
- ReflectionFunctionAbstract
- ReflectionParameter
- ReflectionProperty

Example
```
<?php
#[FooAttribute]
class Foo {
    #[ConstAttr]
    #[FooAttribute]
    private const LEVY = 0.1;

    public function __construct(
        private string $foo
    ){}
    
    #[AttrMethod('getFoo')]
    public function getFoo(#[FooAttribute(3)] $prefix): string{
        return $prefix."\n".$this->foo;
    }
}

$reflector = new ReflectionClass(Foo::class);
$allAttr = $reflector->getAttributes(); 
$objRefAttr = $allAttr[0]; // return a ReflectionAttribute instance
echo $objRefAttr->newInstance()->uid; // 39726. Random number

$reflector = new ReflectionClassConstant(Foo::class, "LEVY");
$allAttr = $reflector->getAttributes("FooAttribute"); 
$objRefAttr = $allAttr[0]; // return a ReflectionAttribute instance
echo $objRefAttr->newInstance()->uid; // 39726. Random number
$allAttr = $reflector->getAttributes("ConstAttr"); 
$objRefAttr = $allAttr[0]; // return a ReflectionAttribute instance
echo $objRefAttr->newInstance()->uid; // Fail to initialize

// https://www.php.net/manual/en/reflectionclass.getattributes.php

```

```
<?php
interface Color {}
#[Attribute]
class Red implements Color {}
#[Attribute]
class Yellow implements Color {}
#[Attribute]
class Green implements Color {}

#[Red]
#[Green]
class Sample{}

$rc = new ReflectionClass(Sample::class);
$attr1 = $rc->getAttributes(Red::class);
var_dump($attr1);
/*
array(1) {
  [0]=>
  object(ReflectionAttribute)#2 (1) {
    ["name"]=>
    string(3) "Red"
  }
}
*/

$attr2 = $rc->getAttributes(Color::class);
var_dump($attr2);
/*
array(0) {
}
*/

$attr3 = $rc->getAttributes(Color::class, ReflectionAttribute::IS_INSTANCEOF);
var_dump($attr3);
/*
array(2) {
  [0]=>
  object(ReflectionAttribute)#3 (1) {
    ["name"]=>
    string(3) "Red"
  }
  [1]=>
  object(ReflectionAttribute)#4 (1) {
    ["name"]=>
    string(5) "Green"
  }
}
*/
```

## Built-in Attributes

### `Deprecated` (Since PHP 8.4)

It marks the function or method that will be removed in future version.

```
#[Deprecated("Use newFunction() instead")]
function oldFunction(){
    // ... implementation
}
```

### `Override` (Since PHP 8.3)

It marks the method that is intended to override the parent's method. 
Certainly, PHP will raise warning if no corresponding method on parent class.

```
class Child extends Parent {
    #[Override]
    public function defaultMethod(){
        // ... implementation
    }
}
```

### `ReturnTypeWillChange` (Since PHP 8.1)

It is used to handle PHP cross-version compatibility and suppress the deprecated notice which is come from overridden method with incompatible return type.
No effect on user defined classes.

```
public class FriendList implements ArrayAccess {
    #[ReturnTypeWillChange]
    public function offsetExists($offset){
        return isset($this->data[$offset]);
    }
}
```

> `LanguageLevelTypeAware` is, vendor-defined attribute, version-specific type hinting for built-in PHP functions and methods.
> It handles a parameter or return type has changed across different PHP versions.

### `AllowDynamicProperties` (Since PHP 8.2)

Dynamic properties is assigning a non-existent property will be created automatically and only available on the instance.
It is used to mark classes that allow dynamic properties.
Child classes are also allowed even do not explicitly declare `#[AllowDynamicProperties]`.

```
#[AllowDynamicProperties]
class ClassAllowsDynamicProperties { }
```

> `stdClass` is a generic empty class with dynamic properties, so it does not require `#[AllowDynamicProperties]` attribute.

### `DelayedTargetValidation` (Since PHP 8.5)

It is used to delay target validation for **internal attributes** from compile time to when the attribute is instantiated.

```
class Child extends Base {
    #[DelayedTargetValidation]
    #[Override]
    public const NAME = 'child';
}
```

### `NoDiscard` (Since PHP 8.5)

It is used to indicate that the return value of a function or a method should not be discarded.

```
#[NoDiscard("Acces token should be stored for further usage.")]
function getToken():string{
    // ....
}
```

### `SensitiveParameter` (Since PHP 8.2)

It is used to mark a parameter that is sensitive and prevents showing the value in the stack trace.

```
function auth (#[SensitiveParameter] $uid){
}
```

> Reference: [Predefined Attributes](https://www.php.net/manual/en/reserved.attributes.php)

## Vendor-defined Attributes

### `SuppressWarnings` 

As its name, it is vendor-defined attribute, and it can suppress warnings for specific code segments.

```
#[SuppressWarnings("SomeWarning")]
function someFunction() {
    // Function implementation
}
```
