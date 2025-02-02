# PHP 8.4 New Features

## Property hooks

Object properties now can provide their associated get and set functions.

```
class Person {
    // A "virtual" property.  It may not be set explicitly.
    public string $fullName {
        get => $this->firstName . ' ' . $this->lastName;
    }

    // All write operations go through this hook, and the result is what is written.
    // Read access happens normally.
    public string $firstName {
        set => ucfirst(strtolower($value));
    }

    // All write operations go through this hook, which has to write to the backing value itself.
    // Read access happens normally.
    public string $lastName {
        set {
            if (strlen($value) < 2) {
                throw new \InvalidArgumentException('Too short');
            }
            $this->lastName = $value;
        }
    }
}

$p = new Person();

$p->firstName = 'peter';
print $p->firstName; // Prints "Peter"
$p->lastName = 'Peterson';
print $p->fullName; // Prints "Peter Peterson"
```

## Asymmetric Visibility

Object properties now can have difference visibility for get and set operations.

First visibility modifier controls get operation. 
Optional second visibility modifier controls set operation.
The visibility of get operation must not be narrower than the visibility of set operation.
e.g. Visibility must be public for get once public visibility on set operation.

```
class Example{
    public protected(set) string $name;
}
```

## `#[\Deprecated]` Attribute

The `#[\Deprecated]` attribute is used to mark functions, methods, class constants as deprecated.
Existing PHP deprecations have been updated to use the `#[\Deprecated]` attribute.
The only difference between PHP and user defined deprecations is emitted error code.
Error code of user defined deprecations is `E_USER_DEPRECATED` instead of `E_DEPRECATED`.

```
class PhpVersion{
    #[\Deprecated(
        message: "use PhpVersion::getVersion() instead",
        since: "8.4",
    )]
    public function getPhpVersion():string{
        return $this->getVersion();
    }
}
```

## New ext-dom features and HTML5 support

New DOM API is under namespace `Dom`, supports parsing HTML5 and adds several functions.
Added 2 new classes:
- `Dom\HTMLDocument`
- `Dom\XMLDocument`

## Object API for BCMath

New class `BcMath\Number` supports arbitrary precision numbers and enables object oriented usage and standard mathematical operators.

## New `array_*()` functions

 - `array_find()`
 - `array_find_key()`
 - `array_any()`
 - `array_all()`

## PDO driver specific subclasses

New subclasses of `PDO`:
- `Pdo\Dblib`
- `Pdo\Firebird`
- `Pdo\MySql`
- `Pdo\Odbc`
- `Pdo\Pgsql`
- `Pdo\Sqlite`

```
$conn = PDO::connect('sqlite:foo.db', $username, $password);
// $conn is object(Pdo\Sqlite)
```

## `new MyClass()->method()` without parentheses

Before PHP 8.4, using properties or methods of a newly created instance must be wrapped with parentheses.

```
var_dump((new Object())->getVersion()); // Before PHP 8.4

var_dump(new Object()->getVersion()); // Since PHP 8.4
```

## Lazy Object

Create object with deferred initialization until the object is accessed. 
Lazy ghost objects are indistinguishable from non-lazy object.
Available on user-defined class. (Other internal classes are not supported exclude `stdClass`)

> [Documentation](https://www.php.net/manual/en/language.oop5.lazy-objects.php)

Two strategies are supported.
- Ghost Objects (Lazy Ghosts): 
  - It is initialized in-place. 
  - Once initialized, No indistinguishable from normal instance and never lazy. 
  - Suitable for both instantiation and initialization are under control.
  - Destructor is only called if the object has been initialized.
- Virtual Proxies (Lazy Proxies): 
  - Once initialized, it is proxy to real instance. Any operation on lazy proxy is forwarded to real instance.
  - Unlike ghost object, it do not care the instantiation and initialization of real instance and the process can be delegated to another party. 
  - Difference identities between proxy and real instance.
  - Destructor is only called on the real instance if one exists. 

Lazy object can be created by `ReflectionClass::newLazyGhost()` or `ReflectionClass::newLazyProxy()`.
Both methods accept a function that will be called during object initialization.

> Reset to lazy after instantiation via `ReflectionClass::resetAsLazyGhost()` or `ReflectionClass::resetAsLazyProxy()`.

> The initialization function of lazy proxy is used as factory and must returns real instance for the proxy object. 
> After initialization, all operations on proxy object are forwarded to real instance (including properties are marked with `ReflectionProperty::skipLazyInitialization()` or `ReflectionProperty::setRawValueWithoutLazyInitialization()`).
> The initialization function of lazy ghost is optional, used to initialize the object state, retrieves an object created with `ReflectionClass::newInstanceWithoutConstructor()` from the first parameter and must return `null` or nothing.

Lazy object will be initialized by one of following operations:
- Interacting with the object will trigger automatic initialization. e.g. cloning object
- Marking all properties to non-lazy by via `ReflectionProperty::skipLazyInitialization()` or `ReflectionProperty::setRawValueWithoutLazyInitialization()`.
- Calling explicitly `ReflectionClass::initializeLazyObject()` or `ReflectionClass::markLazyObjectAsInitialized()`.

> Lazy object is initialized when all properties are marked non-lazy.

> It is possible to bypass initialization caused by accessing a property with marking the property as non-lazy via `ReflectionProperty::skipLazyInitialization()` or `ReflectionProperty::setRawValueWithoutLazyInitialization() before accessing.

```
<?php
class Example{
    public function __construct(private int $data){ }
}

$reflector = new ReflectionClass(Example::class);

// Lazy Ghosts or
$object = $reflector->newLazyGhost(function (Example $ghost):void{
    // Fetch data or dependencies
    $data = ...;
    // Initialize
    $ghost->__construct($data);
});

// Lazy Proxies
$object = $reflector->newLazyProxy(function (Example $ghost):void{
    // Fetch data or dependencies
    $data = ...;
	// Create and return the real instance
    return new Example($data);
});

$reflector->getProperty('data')->skipLazyInitialization($object); // trigger initialization without this line
$reflector->getProperty('data')->setValue($object, 1);

$reflector->getProperty('data')->setRawValueWithoutLazyInitialization($object, 1);



```

## Added functions

- `request_parse_body()`: it supports `application/x-www-form-urlencoded` and `multipart/form-data`. e.g. `[$_POST, $_FILES] = request_parse_body();` 
- `DateTime::createFromTimestamp()`
- `DateTimeImmutable::createFromTimestamp()`

## Deprecations

- Using `_` as a class name (exclude class name started with `_`)
- Implicitly nullable parameter (should explicitly annotation null) e.g. `function foo(T1 $a = null){}` -> `function foo(?T1 $a = null){}` or `function foo(T1|null $a = null){}`

## References

- [https://www.php.net/manual/en/migration84.php](https://www.php.net/manual/en/migration84.php)
- [https://www.php.net/releases/8.4/en.php](https://www.php.net/releases/8.4/en.php)