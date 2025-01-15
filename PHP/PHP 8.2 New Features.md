# PHP 8.2 New Features

## Deprecation: Dynamic properties

Dynamic properties
- Non-existent properties will be created automatically on the instance only.
- Declared with attribute `#[\AllowDynamicProperties]`.
- Deprecated since PHP 8.2. (Planned to remove since PHP 9.0)

> **Not applied to `stdClass`, which is generic empty class with dynamic properties, and its sub-classes.**

> Do not confused with property overloading (`__get()`, `__set()`, `__isset()` and `__unset()`). It is not deprecated.
>
> ** Using dynamic properties within overloading methods are still deprecated.**

## Readonly Classes

For class declared with `readonly` modifier,
- All properties are readonly properties. (equivalent with adding `readonly` modifier to properties)
- All properties must be typed and not static.
- Dynamic properties are not allowed.
- Only be extended if the sub-class is also readonly class. 

> Readonly properties
> - Immutable after initialization.
> - Typed properties must be used and use `mixed` for no type constraints.
> - Using default value on readonly properties is not allowed. Use constant instead.
> - Readonly static properties are not supported.

## Type System 

### Stand-alone Type

Added since PHP8.2
- `null`
- `true`
- `false`

> You can declared return type as `false` instead of `bool`. 

### Disjunctive Normal Form (DNF) Types

Allow us to combine different types by union and intersection. 
**Rule: when combining union and intersection types, intersection types must be grouped with brackets. **

Intersection: Fulfill all types declared. Types are joined by `&` symbol.

Union: Fulfill one of types declared. Types are joined by `|` symbol. 

> Allow following types as stand-alone types : .

Type aliases
- `mixed`: object|resource|array|string|float|int|bool|null
- `iterable`: Traversable|array

> NO user defined type aliases.

## Traits Constants
- Declare constants in trait is allowed.
- Access constants through the name of trait is prohibited.
- Access constants via the class that uses the trait. `ClassName::LEVY_RATE`

## Extensions
- Random: random number generation

# Other Notes
Class property can not declared with type `callable` due to its context-dependent behaviour. Use `Closure` as workaround. 