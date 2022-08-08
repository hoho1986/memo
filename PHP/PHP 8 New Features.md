# PHP 8 New Features

## Named arguments

- Specify only required parameters, skipping optional ones.
- Arguments are order-independent and self-documented.

```PHP 8.0
// Syntax: htmlspecialchars(string $string, int $flags = ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401,?string $encoding = null, bool $double_encode = true):string
htmlspecialchars($string, double_encode: false);
```

## Attributes

Since PHP 8.0, you can use structured metadata with native syntax. 

Syntax: enclosed with a starting `#[` and a corresponding ending `]`.

```PHP 8.0
class PostsController{
    #[Route("/api/posts/{id}", methods: ["GET"])]
    public function get($id) { /* ... */ }
}
```

Before PHP 8.0, you can use comment type PHPDoc annotations.

## Constructor property promotion

```PHP 8.0
class Point {
  public function __construct(
    public float $x = 0.0,
    public float $y = 0.0,
    public float $z = 0.0,
  ){}
}
```

It is equivalent to the code below:

```PHP 7
class Point {
  public float $x;
  public float $y;
  public float $z;

  public function __construct(
    float $x = 0.0,
    float $y = 0.0,
    float $z = 0.0
  ) {
    $this->x = $x;
    $this->y = $y;
    $this->z = $z;
  }
}
```

## Union types and mixed

Type declaration uses on funciton parameters, return values and class properties.

Since PHP 8.0, Union type avaiable and its syntax: `Type1|Type2|...`.

`null` can only be a part of unions. Notation `?T` is shorthand of `T|null`.

Type `mixed` is equivalent to the union type **object|resource|array|string|int|float|bool|null**.

Example:

```PHP 8.0
class Number {
  public function __construct(
    private int|float $number
  ) {}
}

new Number('NaN'); // TypeError
```

Before PHP8, PHPDoc annotation is used. It is just comment and do nothing even it is violated.

## Match expression
- match is expression
- strict comparsion
- match branches only accept single line expression

```PHP 8.0
$a = match (8.0) {
  '8.0' => "Oh no!",
  8.0 => "This is what I expected",
}; //$a = "This is what I expected"
```

## Nullsafe operator

Using nullsafe operator, it returns null once a reference within chainig is null.

``` PHP 8.0
$country = $session?->user?->getAddress()?->country;
```

It is equivalent to the code below:

```PHP 7
$country =  null;
if ($session !== null) {
  $user = $session->user;
  if ($user !== null) {
    $address = $user->getAddress();
    if ($address !== null) {
      $country = $address->country;
    }
  }
}
```

## Saner string to number comparisons

Since PHP 8.0, use number comparison during comparing to a numeric string. Otherwise, it converts number to string and uses string comparison.

```PHP 8.0
$a = 0 == 'foobar'; //$a is false since PHP 8.0 and true before PHP 8.0
```

## Behaviour changed on class

- Any number of function parameters may now be replaced by a variadic argument, as long as the types are compatible. 
  ```PHP 8.0
  class A {
      public function method(int $many, string $parameters, $here) {}
  }
  class B extends A {
      public function method(...$everything) {}
  }
  ```
- `static` (late static binding) can now be used as a return type
   ```PHP 8.0
   class Test {
       public function create(): static {
           return new static();
       }
   }
   ```
- Private methods declared on a parent class do not affect the methods declared on child classes with an exception of **final private constructors**.
  ```PHP 8.0
  class ParentClass {
      private function method1() {}
      private function method2() {}
      private static function method3() {}
      private final function method4() {} // Throws a warning. Keyword `final` has no effect.
  }
  class ChildClass extends ParentClass {
      public abstract function method1() {}
      public static function method2() {}
      public function method3() {}
      public function method4() {}
  }
  ```
- Get class name of an object via `$object::class`. It is equivalent to `get_class($object)`.
- Keyword `new` and `instanceof` can now be used with arbitrary expressions. e.g. `new (expr)(...args)`, `$o instanceof (expr)`.
- Traits can now define abstract private methods.
- Keyword `throw` can now be used as an expression. `$fn = fn()=> throw new Exception("")`

## Behaviour changed on fatal errors

- Error control operator `@` no longer silences fatal error.
- Incompatible method signatures triggers fatal error.

## Miscellaneous

- Optional trailing comma is now allowed in function's parameter list.
  ``` PHP 8.0
  funciton test(int $para1, int para2,){}
  ```
- Catch an exception without storing it in a variable. 
  ``` PHP 8.0
  try{}
  catch(Exception){}
  ```

## New functions

- `get_debug_type(mixed $value):string`: `get_debug_type($bar)` is similar with `is_object($bar)?get_class($bar):gettype($bar)`
- `get_resource_id(resource $resource):int)`: a type-safe way for generating the integer identifier for a resource.
- `fdiv(float $num1, float $num2):float` — divides two numbers, according to IEEE 754.
- `str_contains(string $haystack, string $needle):bool`: determine if a string contains a given substring.
- `str_starts_with(string $haystack, string $needle):bool`: checks if a string starts with a given substring.
- `str_ends_with(string $haystack, string $needle):bool`: checks if a string ends with a given substring.

## New classes and interfaces

- `WeakMap`: it is a map which accepts objects as keys. Once remaining refenece of the key object is WeekMap only, remove item from the map and do garbage collection.
- `ValueError`: it is used for valid type with incorrect value. e.g. integer expected greater than 0, however negative value is inputted.                                                                                                 
- `PhpToken`: alternative to `token_get_all()`
- `DOMParentNode`: new for DOM traversal and manipulation
- `DOMChildNode`: new for DOM traversal and manipulation
- `Stringable`: allow union type string|Stringable to accept either a string primitive or an object that can be cast to a string. 

## Reference

- [PHP 8.0 attributes](https://php.watch/versions/8.0/attributes)