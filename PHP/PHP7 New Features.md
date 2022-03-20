# Strict typing
By default, weak mode is used. PHP will fix the wrong type if possible. For example, `int` is given for where `string` is expected and it will convert to `string`. 

Since PHP 7, use `declare(strict_types=1)`, which is per file basis, to enable strict typing. 

`TypeError` will be thrown for non-matching type. The only exception is `int` given for where `float` is expected.

# Scalar type declarations
Function can define the data type for its parameters. 

The parameters can be made to accept `NULL` if its default value is set to `NULL`. Since PHP7.1, prefixing the type with a question mark (`?`) instead of setting its default value.

Valid data types:
- Class / Interface name (since PHP 5.0.0)
- `self` (since PHP 5.0.0)
- `array` (since PHP 5.1.0)
- `callable` (since PHP 5.4.0)
- `bool` (since PHP 7.0.0)
- `float` (since PHP 7.0.0)
- `int` (since PHP 7.0.0)
- `string` (since PHP 7.0.0)
- `iterable` (since PHP 7.1.0)
  > Array or object that implement the `Traversable` interface
- `object` (since PHP 7.2.0)

```
function sum(int ...$ints) {
    return array_sum($ints);
}
echo sum(1,2,3); //6

function test(?string $name){ //Since 7.1
    var_dump($name);
}
```

# Return type declarations
Function can define the data type for its return since PHP 7. 

The valid data type is as same as parameter declaration.

Since PHP 7.1.0, return values can be `NULL` by prefixing the type with a question mark (`?`). Also, `void` return type is introduced and `NULL` is not valid return value for a void function. 

```
function sum(int ...$ints):int {
    return array_sum($ints);
}

function testReturn(): ?string { //Since PHP7.1
    return null;
}

function swap(&$left, &$right): void { //Since PHP7.1
    if ($left === $right) return;
    $tmp = $left;
    $left = $right;
    $right = $tmp;
}
```

Since PHP 7.1.0, `E_COMPILE_ERROR` will be triggered with following conditions:
- Return statements have no argument and return type is not void
- Return statements have an argument and return type is void

> When overriding a parent method, the child's method **MUST** match return type declaration on the parent.

# Null coalescing operator
Null coalescing operator (`??`) is a syntactic sugar for simplifying using of ternary in conjunction with `isset()`.

It returns **FIRST** operand if it exists and is not `NULL`; otherwise, it returns **SECOND** operand.

```
$id = $_GET['id'] ?? NULL;
//it is equivalent to
$id = isset($_GET['id']) ? $_GET['id'] : NULL;
```

# Spaceship operator 
Spaceship operator (`<=>`) is used for comparing two expressions and returns -1, 0 or 1. Comparisons are performed according to [type comparison rules](https://www.php.net/manual/en/types.comparisons.php).

```
echo 1 <=> 2; // -1
echo 1 <=> 1; // 0
echo 2 <=> 1; // 1
```

# Constant arrays using define()
Before PHP 7, only `const` accepts `array`.

```
define('ANIMALS', ['dog', 'cat', 'bird']);
```

# Anonymous classes
Use `new class` to define an anonymous class.

```
$app->setLogger(new class implements Logger {
    public function log(string $msg) {
        echo $msg;
    }
});
```
Anonymous class, like normal class, can pass arguments to constructor, extend other classes (including outer class), implement interfaces and use traits. 
```
new class("World") extends SomeClass implements SomeInterface {
    use SomeTrait;
    private $name;
    public function __construct($name)
    {
        $this->name = "Hello ".$name;
    }
}
```
> Anonymous class get a name from PHP engine. All instances from the class will get the same class name.

# Unicode codepoint escape syntax 
- Any valid Unicode codepoint in hexadecimal form
- Leading zeros is optional
- Output UTF-8 to double-quoted string or heredoc
```
echo "\u{aa}"; //ª
echo "\u{0000aa}"; //ª
echo "\u{9999}"; //香
```

# Closure::call()
`Closure::call()` is used for temporary binding an object scope to a closure and invoking it. `Closure` is a class used to represent anonymous function.

```
class A {private $x = 1;}
$getX = function() {return $this->x;};
echo $getX->call(new A);
```

# Filtered unserialize() 
It provides better security during unserializing object. Developer can whitelist class, which can be unserialized, for handling untrusted data.

```
// converts all objects into __PHP_Incomplete_Class object
$data = unserialize($foo, ["allowed_classes" => false]);

// converts all objects into __PHP_Incomplete_Class object except those of MyClass and MyClass2
$data = unserialize($foo, ["allowed_classes" => ["MyClass", "MyClass2"]]);

// default behaviour (same as omitting the second argument) that accepts all classes
$data = unserialize($foo, ["allowed_classes" => true]);
```

# IntlChar
`IntlChar` provides additional ICU (International Components for Unicode) functionality. In order to use, extension `Intl` must be installed.

# Expectations
`Expectations` are a backwards compatible enhancement to the older `assert()` function. `assert()` is a language construct in PHP7. It allows assertions being effected in development environment and optimised away without any cost in production.

Altough `assert_options()` can still be used to control behaviour for backward compatibility, PHP7 should use two new configuration directives to control the behaviour and not call `assert_options()`.

Configuration directives
- [zend.assertions](https://www.php.net/manual/en/ini.core.php#ini.zend.assertions)
- [assert.exception](https://www.php.net/manual/en/info.configuration.php#ini.assert.exception)

```
ini_set('assert.exception', 1);
class CustomError extends AssertionError {}
assert(false, new CustomError('Some error message')); //Fatal error: Uncaught CustomError: Some error message
```

# Group use declarations
Classes, functions and constants being imported from the same `namespace` can now be grouped together in a single `use` statement. Trailing comma within group-use syntax is allowed since PHP7.2.

```
use some\namespace\ClassA;
use some\namespace\ClassB;
use some\namespace\ClassC as C;
// equivalent
use some\namespace\{ClassA, ClassB, ClassC as C}; //PHP7
use some\namespace\{ClassA, ClassB, ClassC as C,}; //PHP7.2

use function some\namespace\fn_a;
use function some\namespace\fn_b;
use function some\namespace\fn_c;
// equivalent
use function some\namespace\{fn_a, fn_b, fn_c}; //PHP7
use function some\namespace\{fn_a, fn_b, fn_c,}; //PHP7.2

use const some\namespace\ConstA;
use const some\namespace\ConstB;
use const some\namespace\ConstC;
// equivalent
use const some\namespace\{ConstA, ConstB, ConstC}; // PHP7
use const some\namespace\{ConstA, ConstB, ConstC,}; // PHP7.2


```

# Generator Return Expressions
Generator function introduced since PHP5.5. Since PHP7, `return` statement can be used for a final expression to be returned. However, return by reference is **NOT** allowed. The return value can be fetched via `Generator::getReturn()` and only used once when generator has finished yielding values.

```
$gen = (function() {
    yield 1;
    yield 2;

    return 3;
})();

foreach ($gen as $val) {
    echo $val, PHP_EOL;
}

echo $gen->getReturn(), PHP_EOL;
// Output:
// 1
// 2
// 3
```

# Generator delegation 
Generators can now delegate to another generator, `Traversable` object or `array` automatically by `yield from`.

```
function gen() {
    yield 1;
    yield 2;
    yield from gen2();
}
function gen2(){
    yield 3;
    yield 4;
}
foreach (gen() as $val){
    echo $val." ";
}
//Output: 1 2 3 4 
```

# Integer division with intdiv() 
`intdiv()` provides integer division.

```
echo intdiv(6,2); //3
```

# Session options
Since PHP7, `session_start()` accept array of options that override session configuration directives normally set in php.ini.

```
session_start([
    'cache_limiter' => 'private',
    'read_and_close' => true,
]);
```

# preg_replace_callback_array()
`preg_replace_callback_array()` is similar to `preg_replace_callback()`. It can register callback per regular expression.

```
$subject = 'Aaaaaa Bbb';
preg_replace_callback_array(
    [
        '~[a]+~i' => function ($match) {
            echo strlen($match[0]), ' matches for "a" found', PHP_EOL;
        },
        '~[b]+~i' => function ($match) {
            echo strlen($match[0]), ' matches for "b" found', PHP_EOL;
        }
    ],
    $subject
);

//output:
//6 matches for "a" found
//3 matches for "b" found
```

# CSPRNG Functions
Two new functions, which are under cryptographically secure pseudorandom number generator (CSPRNG), have been added to  generate cryptographically secure integers and strings.
- [random_bytes()](https://www.php.net/manual/en/function.random-bytes.php)
- [random_int()](https://www.php.net/manual/en/function.random-int.php)

# list() can always unpack objects implementing ArrayAccess
Before PHP7, unpacking object that implemented `ArrayAccess` via `list()` is not guaranteed. It is fixed on PHP7.

# Other Features
Class member access on cloning has been added.

```
(clone $foo)->bar();
```

# Symmetric array destructuring (PHP7.1)
The shorthand array syntax (`[]`) may now be used to destructure arrays for assignments. `list()` is still supported.

```
$data = [[1, 'Tom'],[2, 'Fred']];
[$id, $name] = $data[0];
foreach($data as [$id,$name]) echo "({$id}) {$name}";
```

# Class constant visibility (PHP7.1)
Visibility of class constants has been added.

```
class ConstDemo
{
    const PUBLIC_CONST_A = 1;
    public const PUBLIC_CONST_B = 2;
    protected const PROTECTED_CONST = 3;
    private const PRIVATE_CONST = 4;
}
```

# Multi catch exception handling (PHP7.1)
Multiple exceptions per catch block may now be specified using the pipe character (`|`).

```
try {
    // some code
} catch (FirstException | SecondException $e) {
    // handle first and second exceptions
}
```

# Support for keys in list() (PHP7.1)
Now can specify key in `list()` or shorthand array syntax (`[]`).

```
$data = [ ["id" => 1, "name" => 'Tom'], ["id" => 2, "name" => 'Fred'] ];
["name"=>$n] = $data[0];
echo $n;
```

# Support for negative string offsets (PHP7.1)
Negative string offsets has been added.

```
$string = 'bar';
echo "The last character of '$string' is '$string[-1]'.\n";
```

# Support for AEAD in ext/openssl (PHP7.1)
Support for AEAD (modes GCM and CCM) have been added by extending the `openssl_encrypt()` and `openssl_decrypt()` functions with additional parameters. 

# Convert callables to Closures with Closure::fromCallable() (PHP7.1)
A new static method `Closure::fromCallable()` has been introduced to the Closure class to allow for callables to be easily converted into Closure objects. 

```
class Test {
    public function exposeFunction(){
        return Closure::fromCallable([$this, 'privateFunction']);
    }
    private function privateFunction($param){
        var_dump($param);
    }
}
$privFunc = (new Test)->exposeFunction();
$privFunc('some value'); //output: some value
```

# Asynchronous signal handling (PHP7.1)
A new function called `pcntl_async_signals()`, which is Process Control functions, has been introduced to enable asynchronous signal handling without using ticks.

# HTTP/2 server push support in ext/curl (PHP7.1)
Support for server push has been added to the CURL extension(> v7.46). It can be done via `curl_multi_setopt()` function with the new `CURLMOPT_PUSHFUNCTION` constant. Constants `CURL_PUSH_OK` and `CURL_PUSH_DENY` have also been added for server push callback.

# Stream Context Options (PHP7.1)
The [`tcp_nodelay`](https://www.php.net/manual/en/context.socket.php#context.socket.tcp_nodelay) stream context option has been added. 

# Extension loading by name (PHP7.2)
Shared extensions no longer require their file extension. It is also applied to `dl` function.

# Abstract method overriding (PHP7.2)
Abstract methods can now be overridden when an abstract class extends another abstract class. 

```
abstract class A {
    abstract function test(string $s);
}
abstract class B extends A{
    abstract function test($s) : int; // overridden maintain same parameters and covariance for return
}
```

# Sodium is now a core extension (PHP7.2)
The modern [Sodium](https://www.php.net/manual/en/book.sodium.php) cryptography library has now become a core extension in PHP.

# Password hashing with Argon2 (PHP7.2)
Argon2 has been added to the [password hashing API](https://www.php.net/manual/en/book.password.php).

The following constants have been added:
- `PASSWORD_ARGON2I`
- `PASSWORD_ARGON2_DEFAULT_MEMORY_COST`
- `PASSWORD_ARGON2_DEFAULT_TIME_COST`
- `PASSWORD_ARGON2_DEFAULT_THREADS`


# Extended string types for PDO (PHP7.2)
PDO's string type has been extended to support the national character type when emulating prepares.

The following constants have been added:
- `PDO::PARAM_STR_NATL`
- `PDO::PARAM_STR_CHAR`
- `PDO::ATTR_DEFAULT_STR_PARAM`

```
$db->quote('über', PDO::PARAM_STR | PDO::PARAM_STR_NATL);
```

# Additional emulated prepares debugging information for PDO (PHP7.2)
The `PDOStatement::debugDumpParams()` method has been updated to include the SQL being sent to the DB, where the full, raw query (including the replaced placeholders with their bounded values) will be shown. 

This has been added to aid with debugging emulated prepares (it will only be available when emulated prepares are turned on). 

# Support for extended operations in LDAP (PHP7.2)
Support for EXOP has been added to the LDAP extension.

The following functions and constants have been added:
- [ldap_parse_exop()](https://www.php.net/manual/en/function.ldap-parse-exop.php)
- [ldap_exop()](https://www.php.net/manual/en/function.ldap-exop.php)
- [ldap_exop_passwd()](https://www.php.net/manual/en/function.ldap-exop-passwd.php)
- [ldap_exop_whoami()](https://www.php.net/manual/en/function.ldap-exop-whoami.php)
- `LDAP_EXOP_START_TLS`
- `LDAP_EXOP_MODIFY_PASSWD`
- `LDAP_EXOP_REFRESH`
- `LDAP_EXOP_WHO_AM_I`
- `LDAP_EXOP_TURN`

 
# Address Information additions to the Sockets extension (PHP7.2)
The sockets extension now has the ability to lookup address information, as well as connect to it, bind to it, and explain it.

The following functions have been added:
- [socket_addrinfo_lookup()](https://www.php.net/manual/en/function.socket-addrinfo-lookup.php)
- [socket_addrinfo_connect()](https://www.php.net/manual/en/function.socket-addrinfo-connect.php)
- [socket_addrinfo_bind()](https://www.php.net/manual/en/function.socket-addrinfo-bind.php)
- [socket_addrinfo_explain()](https://www.php.net/manual/en/function.socket-addrinfo-explain.php)

# Parameter type widening (PHP7.2)
Parameter types from **overridden methods** and from **interface implementations** may now be omitted.

```
interface A {
    public function Test(array $input);
}
class B implements A {
    public function Test($input){} // type omitted for $input
}
```

# proc_nice() support on Windows (PHP7.2)
The [proc_nice()](https://www.php.net/manual/en/function.proc-nice.php) function is now supported on Windows. 

# pack() and unpack() endian support (PHP7.2)
The [pack()](https://www.php.net/manual/en/function.pack.php) and [unpack()](https://www.php.net/manual/en/function.unpack.php) functions now support float and double in both little and big endian. 

# Enhancements to the EXIF extension (PHP7.2)
The EXIF extension has been updated to support a much larger range of formats via `exif_read_data()` function.

The following functions accept streams as their first argument:
- [exif_read_data()](https://www.php.net/manual/en/function.exif-read-data.php)
- [exif_thumbnail()](https://www.php.net/manual/en/function.exif-thumbnail.php)

# New features in PCRE (PHP7.2)
The J modifier for setting PCRE_DUPNAMES has been added. 

# SQLite3 allows writing BLOBs (PHP7.2)
`SQLite3::openBlob()` now allows to open BLOB fields in write mode; formerly only read mode was supported. 

# Oracle OCI8 Transparent Application Failover Callbacks (PHP7.2)
Support for [Oracle Database Transparent Application Failover (TAF)](https://www.php.net/manual/en/oci8.taf.php) callbacks has been added. TAF allows PHP OCI8 applications to automatically reconnect to a preconfigured database when a connection is broken. The new TAF callback support allows PHP applications to monitor and control reconnection during failover. 

# Enhancements to the ZIP extension (PHP7.2)
Read and write support for encrypted archives has been added (requires libzip 1.2.0).

The ZipArchive class now implements the Countable interface.

The zip:// stream now accepts a 'password' context option. 

# More Flexible Heredoc and Nowdoc Syntax (PHP7.3)
The closing marker for doc strings is no longer required to be followed by a semicolon or newline. Additionally the closing marker may be indented, in which case the indentation will be stripped from all lines in the doc string. 

# Array Destructuring supports Reference Assignments (PHP7.3)
Array destructuring now supports reference assignments. It is also available for `list()`.

```
[&$a, [$b, &$c]] = $d;
```

# Instanceof Operator accepts Literals (PHP7.3)
`instanceof` now allows literals as the first operand and always `FALSE`

# CompileError Exception instead of some Compilation Errors  (PHP7.3)
A new `CompileError` exception has been added. It is inherited from `ParseError`. A small number of compilation errors will now throw a `CompileError` instead of generating a fatal error. More errors may be converted in the future. 

# Trailing Commas are allowed in Calls (PHP7.3)
Trailing commas in function and method calls are now allowed. 

# Argon2id Support (PHP7.3)
The `--with-password-argon2[=dir]` configure argument now provides support for both Argon2i and Argon2id hashes in the `password_hash()`, `password_verify()`, `password_get_info()`, and `password_needs_rehash()` functions. Passwords may be hashed and verified using the `PASSWORD_ARGON2ID` constant. Support for both Argon2i and Argon2id in the `password_*()` functions now requires PHP be linked against libargon2 reference library ≥ 20161029. 

# FastCGI Process Manager (PHP7.3)
New options have been added to customize the FPM logging.
-`log_limit`
-`log_buffering`
-`decorate_workers_output`

# BC Math Functions (PHP7.3)
`bcscale()` can now also be used as getter to retrieve the current scale in use. 

# Lightweight Directory Access Protocol (PHP7.3)
Full support for LDAP Controls has been added to the LDAP querying functions and `ldap_parse_result()`:
- A $serverctrls parameter to send controls to the server in `ldap_add()`, `ldap_mod_replace()`, `ldap_mod_add()`, `ldap_mod_del()`, `ldap_rename()`, `ldap_compare()`, `ldap_delete()`, `ldap_modify_batch()`, `ldap_search()`, `ldap_list()` and `ldap_read()` has been added.
- The out parameter $serverctrls to get controls from the server in `ldap_parse_result()` has been added.
- Support for `LDAP_OPT_SERVER_CONTROLS` and `LDAP_OPT_CLIENT_CONTROLS` in `ldap_get_option()` and `ldap_set_option()` has been fixed.

# Multibyte String Functions (PHP7.3)
- Support for full case-mapping and case-folding has been added.
- Case-insensitive string operations now use case-folding instead of case- mapping during comparisons.
- `mb_convert_case()` with MB_CASE_TITLE now performs title-case conversion based on the Cased and CaseIgnorable derived Unicode properties. In particular this also improves handling of quotes and apostrophes. 
- The Multibyte String data tables have been updated for Unicode 11. 
- The Multibyte String Functions now correctly support strings larger than 2GB.
- Performance of the Multibyte String extension has been significantly improved across the board. 
- The `mb_ereg_*` functions now support named captures. Matching functions like mb_ereg() will now return named captures both using their group number and their name, similar to PCRE: 

# Readline (PHP7.3)
Support for the `completion_append_character and completion_suppress_append` options has been added to `readline_info()`. These options are only available if PHP is linked against libreadline (rather than libedit).

# Typed properties (PHP7.4)
Class properties now support type declarations. 

```
class User {
    public int $id;
    public string $name;
}
```

The valid data type is as same as parameter declaration with an exception `callable` type. `Callable` type is **NOT** supported because its behavior is context dependent.

```
class Test {
    public callable $cb;
    public function __construct() {
        $this->cb = [$this, 'method']; //A callable for a method of an object is presented by an array with object at index 0 and method name at index 1.
    }
    private function method() {}
}
$obj = new Test();
($obj->cb)(); //$obj->cb is NOT callable here
```

According to example above, it is possible to write a legal value to a property and then proceed to read an illegal value from the same property.

`Closure` and `Closure::fromCallable()` can be used as a robust alternative.

# Arrow functions (PHP7.4)
`Arrow functions` define functions with implicit by-value scope binding. As same as anonymous function, it is implemented `Closure` class. It have the basic form `fn (argument_list) => expr`. It is **NOT** support statement with curly braces.

> It is possible to use `func_num_args()`, `func_get_arg()`, and `func_get_args()` from within an arrow function.

```
//by value automatically
$y=1;
$fn1 = fn($x) => $x + $y;
// equivalent
$fn2 = function ($x) use ($y) {
    return $x + $y;
};
$fn1(4); //5

$x = 1;
$fn = fn() => $x++; //$x is pass by value
$fn();
echo $x; //1

//Nested arrow functiion
$z = 1;
$fn = fn($x) => fn($y) => $x * $y + $z;
$fn(2)(3);//7

//parameter and return types, default values, variadics(`...`), pass by reference and return by reference
fn&(array $x=[], int &$r, ...$rest):array => $x;
```

# Limited return type covariance and argument type contravariance (PHP7.4)
Full variance support is only available if autoloading is used. Inside a single file only non-cyclic type references are possible, because all classes need to be available before they are referenced. 

# Null coalescing assignment operator (PHP7.4)

```
$array['key'] ??= computeDefault();
// is roughly equivalent to
if (!isset($array['key'])) {
    $array['key'] = computeDefault();
}
```

# Unpacking inside arrays (PHP7.4)

```
$parts = ['apple', 'pear'];
$fruits = ['banana', 'orange', ...$parts, 'watermelon'];
// ['banana', 'orange', 'apple', 'pear', 'watermelon'];
```

# Numeric literal separator (PHP7.4)
Numeric literals can contain underscores between digits. e.g. `0xCAFE_F00D`

# Weak references (PHP7.4)
Weak references allow the programmer to retain a reference to an object that does not prevent the object from being destroyed. 

# Allow exceptions from __toString() (PHP7.4)
Throwing exceptions from `__toString()` is now permitted. Previously this resulted in a fatal error.

Existing recoverable fatal errors in string conversions have been converted to `Error` exceptions. 

# CURL (PHP7.4)
`CURLFile` now supports stream wrappers in addition to plain file names, if the extension has been built against libcurl >= 7.56.0. 

# Filter (PHP7.4)
The `FILTER_VALIDATE_FLOAT` filter now supports the min_range and max_range options, with the same semantics as `FILTER_VALIDATE_INT`. 

# FFI (PHP7.4)
FFI is a new extension, which provides a simple way to call native functions, access native variables, and create/access data structures defined in C libraries. 

# GD (PHP7.4)
Added the `IMG_FILTER_SCATTER` image filter to apply a scatter filter to images.

# Hash (PHP7.4)
Added crc32c hash using Castagnoli's polynomial. This CRC32 variant is used by storage systems, such as iSCSI, SCTP, Btrfs and ext4. 

# Multibyte String (PHP7.4)
Added the `mb_str_split()` function, which provides the same functionality as `str_split()`, but operating on code points rather than bytes. 

# OPcache (PHP7.4)
[Support for preloading code](https://www.php.net/manual/en/opcache.preloading.php) has been added. 

# Regular Expressions (Perl-Compatible) (PHP7.4)
The `preg_replace_callback()` and `preg_replace_callback_array()` functions now accept an additional flags argument, with support for the `PREG_OFFSET_CAPTURE` and `PREG_UNMATCHED_AS_NULL` flags. This influences the format of the matches array passed to to the callback function. 

# PDO (PHP7.4)
The username and password can now be specified as part of the PDO DSN for the mysql, mssql, sybase, dblib, firebird and oci drivers. Previously this was only supported by the pgsql driver. If a username/password is specified both in the constructor and the DSN, the constructor takes precedence.

It is now possible to escape question marks in SQL queries to avoid them being interpreted as parameter placeholders. Writing ?? allows sending a single question mark to the database and e.g. use the PostgreSQL JSON key exists (?) operator. 

# PDO_OCI (PHP7.4)
`PDOStatement::getColumnMeta()` is now available. 

# PDO_SQLite (PHP7.4)
`PDOStatement::getAttribute(PDO::SQLITE_ATTR_READONLY_STATEMENT)` allows checking whether the statement is read-only, i.e. if it doesn't modify the database.

`PDO::setAttribute(PDO::SQLITE_ATTR_EXTENDED_RESULT_CODES, true)` enables the use of SQLite3 extended result codes in `PDO::errorInfo()` and `PDOStatement::errorInfo()`. 

# SQLite3 (PHP7.4)
Added `QLite3::lastExtendedErrorCode()` to fetch the last extended result code.

Added `SQLite3::enableExtendedResultCodes($enable = true)`, which will make `SQLite3::lastErrorCode()` return extended result codes. 

# strip_tags() with array of tag names (PHP7.4)
`strip_tags()` now also accepts an array of allowed tags: instead of `strip_tags($str, '<a><p>')` you can now write `strip_tags($str, ['a', 'p'])`. 

# Custom object serialization (PHP7.4)
A new mechanism for custom object serialization has been added, which uses two new magic methods: `__serialize` and `__unserialize`.  Serializable interface will be deprecated in the future. 

```
// Returns array containing all the necessary state of the object.
public function __serialize(): array;
// Restores the object state from the given data array.
public function __unserialize(array $data): void;
```

# Array merge functions without arguments (PHP7.4)
`array_merge()` and `array_merge_recursive()` may now be called without any arguments, in which case they will return an empty array. This is useful in conjunction with the spread operator, e.g. array_merge(...$arrays). 

# proc_open() function (PHP7.4)
[`proc_open()`](https://www.php.net/manual/en/function.proc-open.php) now accepts an array instead of a string for the command. In this case the process will be opened directly (without going through a shell) and PHP will take care of any necessary argument escaping. Also, it now supports redirect and null descriptors. 

# argon2i(d) without libargon (PHP7.4)
`password_hash()` now has the argon2i and argon2id implementations from the sodium extension when PHP is built without libargon. 
