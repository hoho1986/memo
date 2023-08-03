# C Programming Language

## Entry Point

Function `main`, will be called once application is called, returns value in `int` type. 

> The return value can be retrieved by caller.

> Application should return zero if work as expected. In other words, it should return non-zero value in abnormal case.

## Data type
- Integer
  - `short`
  - `int`
  - `long`
  - `long long`
- Float
  - `float`
  - `double`
  - `long double`
- Character
  - `char` - an 8-bit byte.
- Boolean
  - `bool` - Added on C99 standard. Before, falsy value is zero and null.

> The size for data types above are variant and depended on compiler. 
> Use `sizeof(<datatype>)` to get the size in byte used by compiler.

> In C11 standard, unicode character should use data types `char16_t` and `char32_t` declared in `uchar.h`.

> In C11 standard, it recommends using data types declared in `stdint.h` to avoid compiler dependency. 
> e.g. `int8_t`, `int16_t`, `int32_t`, `int64_t`, `uint8_t`, `uint16_t`, `uint32_t`, `uint64_t`, ...

## Literal
- Integer
  - Decimal: No decimal point. e.g. 10
  - Octal: Prefix `0`. e.g. 077
  - Hexadecimal: Prefix `0x`. e.g. 0xAA
  - Default is `int`, use suffix `l` or `L` to declare `long`. e.g. 1000l
  - Specify unsigned with suffix `u` or `U`. e.g. 10u
  - Suffixes can be used at the same time. e.g. 10ul, 10lu
- Float
  - Suffix `f` or `F` are used for float point value. e.g. 3.14f
  - Scientific notation are also accepted. e.g. 7.7e9
- Character
  - Enclosed with single quote. e.g. 'A'
  - Escape characters:
    - `\n` new line
    - `\t` horizontal tab
    - `\v` vertical tab
    - `\b` backspace
    - `\r` carriage return
    - `\f` form feed
    - `\a` alert bell
    - `\\` backslash
    - `\?` question mark
    - `\'` single quote
    - `\"` double quote
    - `\nnn` in octal
    - `\xnn` in hexadecimal
    - `\unnnn` unicode code point
    - `\unnnnnnnn` unicode code point

> String is enclosed with double quote. e.g. "String".
> It is just an array of char and the last element of the array is `\0`. 

## Variable

Syntax: 
- `<type> <name>;`
- `<type> <name> = <expression>;`

> Unexpected value will be retrieved from unassigned variable.

> Expression returns value.

Prefix for type:
- `const` read only variable. 
- `unsigned` for positive integer only.
- `signed` optional. It holds positive and negative integer.

## Operation & Operator

## Flow Control

## Array

## String Processing

## Pointer

## Preprocessor & Marco

## Standard Libraries