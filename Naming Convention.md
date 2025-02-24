# Naming Convention

Multiple-word Formats:
- flatcase: twowords
- UPPERCASE: TWOWORDS
- camelCase: twoWords
- PascalCase, UpperCamelCase: TwoWords
- snake_case: two_words
- MACRO_CASE, CONSTANT_CASE, SCREAMING_SNAKE_CASE, ALL_CAPS: two_words
- camel_Snake_Case: two_words
- Pascal_Snake_Case, Title_Case: two_words
- kebab-case, dash-case, lisp-case, spinal-case: two-words
- TRAIN-CASE, COBOL-CASE, SCREAMING-KEBAB-CASE: TWO-WORDS
- Train-Case, HTTP-Header-Case: Two-Words

## Hungarian Notation

It is camel-case with data type prefixed.

Datatype
- b: boolean
- c: count of items
- f: flag or float
- p: pointer
- ch: char, 8-bit integer
- i: integer
- db: double
- l: long
- u8: unsigned 8-bit integer 
- u16: unsigned 16-bit integer
- u32: unsigned 32-bit integer
- fn: function
- arru8: array of unsigned 8-bit integer
- dw: double word
- str: string
- us: unsafed string
- sz: string with zero-terminated
- hwnd: handle to a window

For example, lpszName: long pointer to a zero-terminated string.