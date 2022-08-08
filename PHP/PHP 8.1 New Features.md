# PHP 8.1 New Features

## Enumerations 

Since PHP 8.1, use `enum` instead of a set of constatnts and have out of box validation.

```PHP 8.1
enum Status
{
    case Draft;
    case Published;
    case Archived;
}
function acceptStatus(Status $status) {...}
```

## Readonly Properties

Value of readonly class member can not be changed once it is assigned.
It is useful for model value objects and data-transfer objects.

```PHP 8.1
class BlogData{
    public readonly Status $status;
    public function __construct(Status $status){
        $this->status = $status;
    }
}
```

## First-class Callable Syntax

It uses to create anonymous functions, aka Closure object, from callable.
It supersedes existing callable syntax using strings and arrays.
It can be used for static analysis.
It has the same semantics as `Closure::fromCallable(callable $callback):Closure` that is respects the scope at the point where it is created.
It **CAN NOT** combined with `nullsafe operator`.

Syntax: `CallableExpr(...)`.  
`CallableExpr` accepts any expression that can be directly called in the PHP grammar.

```PHP 8.1
$foo = $this->foo(...); // $foo = [$this, 'foo'];
$fn = strlen(...); // $fn = Closure::fromCallable('strlen');
```

```PHP 8.1
class Foo{
    private function pm():string{
        return __METHOD__;
    }
    public function tradCallable():array{
        return [$this, 'pm']; // Plain array
    }
    public function fcCallable():callable{
        // the scope is where the callable is acquired.
        return $this->pm(...); // identical to Closure::fromCallable([$this, 'pm']);
    }
}
$objFoo = new Foo();
$c = $objFoo->tradCallable();
$c(); // Fatal error. Call private method from global scope.
$c = $objFoo->fcCallable();
echo $c(); // Foo::pm
```

## New in initializers

Object can be used as
- default parameter values
- static variables
- global constants
- attribute arguments (allow to use nested attributes)

```PHP 8.1
class Test{
    public function __construct(
        public DateTime $dtIssued = new DateTime()
    ){
    }
}
echo (new Test())->dtIssued->format("c"); //2022-08-03T09:25:55+00:00
```

```PHP 8.1
class User{
    #[\Assert\All(
        new \Assert\NotNull,
        new \Assert\Length(min: 5)
    )]
    public string $name = '';
}
```

## Pure Intersection Types

Intersection type for a value that needs to satisfy multiple constraints at the same time.
Mixing intersection and union is not supported currently.

Using data type of either non-class, `self`, `parent` or `static` is result in an error.

```PHP 8.1
function intersection(Iterator&Countable $value) {
    var_dump($value);
}
```

## Never return type

`never`
- Data type for return only
- Indicate function is no return. This means that it
  - calls `exit()` or something similar
  - throws an exception
  - is infinite loop
- Cannot be part of union type
- Subtype of every other type (can be replaced by any other type during inheritance)  

```PHP 8.1
function redirect(string $uri):never{
    header('Location: '.$uri);
    exit();
}
```

## Final class constants

Define constants that can not be overridden by child classes.

```PHP 8.1
class Foo {
    final public const XX = "foo";
}

class Bar extends Foo {
    public const XX = "bar"; // Fatal error
}
```

> Can declare `final`
> - classes
> - methods (private is not allowed except for constructor)
> - constants

## Explicit Octal numeral notation

Since PHP 8.1, octal numbers use `0o` as prefix.

```PHP 8.1
0o16 === 14
```

## Fiber

Fiber is a function with:
- full stack
- interruptible
  - suspended from anywhere in the call-stack
  - pausing execution within the fiber until it is resumed

Each fiber has its own call stack, allowing them 
- to be paused anywhere even within deeply nested function or PHP VM
- and maintain its return type.

Fiber can be called as normal function due to the entire execution stack is paused.

Execution of fiber can be interrupted via `Fiber::suspend()` which may 
- returns value from `Fiber::resume()` 
- throws an exception.

Once execution suspended, following actions can be taken
- resume execution by `Fiber::resume()`
- throw exception via `Fiber::throw()`

> Generator
> - no stack
> - return generator instanace

```PHP8.1
$fiber = new Fiber(function (): void {
   $value = Fiber::suspend('fiber');
   echo "Value used to resume fiber: ", $value, PHP_EOL;
});
$value = $fiber->start();
echo "Value from fiber suspending: ", $value, PHP_EOL;
$fiber->resume('test');

// Value from fiber suspending: fiber
// Value used to resume fiber: test
```

## Unpacking support for string-keyed arrays

Unpacking syntax: An array or object (implemented `Traversable`) prefixed by `...`.

Unpacking an array follows the semantics of `array_merge()` that is
- latest string keys overwrite all earlier items
- keys in integer are renumbered

Prior to PHP 8.1, it is fatal error on code below.

```PHP 8.1
$arrayA = ['a' => 1]; $arrayB = ['b' => 2];
$result = ['a' => 0, ...$arrayA, ...$arrayB]; // ['a'=>1, 'b'=>2]
```

Unpacking named arguments for a function call is possible since PHP 8.1. Name conflict is not allowed.

```PHP 8.1
function foo($val1, $val2){
    return $val1*$val2;
}
echo foo(...["val1"=>1, "val2"=>2]); //2
```

## Featuures updated
- added fullpath into item of array of uploaded fules.
