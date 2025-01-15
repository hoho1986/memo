# PHP 8.3 New Features

## Type checking during overriden.

You must keep same type during overriden since PHP 8.3.

## Class constant access by the value of variable

Below code is invalid before PHP 8.3.

```php
class Foo {
    const PHP = 'PHP 8.3';
}
$searchableConstant = 'PHP';
var_dump(Foo::{$searchableConstant});
```

## Deep-cloning of readonly properties

Readonly properties may be modified once within the magic method `__clone()`.

## Attribute: `#[\Override]`

Ensure that a method with the same name exists in a parent class or in an implemented interface.

## Function: `json_validate()`

Validate JSON is more efficient than `json_decode()`.

## Minor
- Anonymous classes can now be readonly.
- SQLite3: Default error mode set to exceptions.
- More Appropriate Date/Time Exceptions.
- Command line linter supports multiple files. `php -l foo.php bar.php`