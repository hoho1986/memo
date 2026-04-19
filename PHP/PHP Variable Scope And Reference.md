# Variable Scope

## Global & Function Scope

PHP has
- function scope
- global scope

Any variable defined outside a function is set to global scope.
Any variable defined inside a named function or an anonymous function is set to the function scope.

> Arrow function (Syntax: `fn(argument_list) => expression`) can use the variables from its parent scope automatically.

```php
<?php
$v = "global scope";
function test(){ 
    $v = "function scope";
}
```

When a file is included, the code in the file inherits the variable scope of that line.

> File can be included with [language constructs](https://www.php.net/manual/en/reserved.keywords.php) `include`, `require`, `include_once` or `require_once`.

```php
inc.php
<?php
echo $var;

main.php
<?php
$var="global";
function test(){ 
    $var="function";
    include 'inc.php';
}
test();
include 'inc.php';

// function
// global
```

## Access Global Scope

There are 2 ways to access global scope
- Keyword `global`
  - accepts list of variables separated by comma
  - new global variable will be created and assign `NULL` if it does not exist
- Superglobal `$GLOBALS` array

> [Superglobals](https://www.php.net/manual/en/language.variables.superglobals.php) are always available in all scopes.

```php
<?php
$a = 1;
$b = 2;
function sumit(){
    global $a, $b, $c; // global variable $c is created and assign NULL.
    $b = $a + $b;
}
sumit();
echo $b; // 3
```

```php
<?php
$a = 1;
$b = 2;
function sum(){
    $GLOBALS['b'] = $GLOBALS['a'] + $GLOBALS['b'];
}
sum();
echo $b; // 3
```

## Static Variable Within Function Scope

Static variable does not lose its value after leaving the function scope.
It can be initialized using constant expression and dynamic exprssion is supported since PHP 8.3.0.
Statement for declaring static variable only run one time.

```php
<?php
function printOneToTen(){
    static $a = 0; // Infinite loop without static
    echo ++$a.PHP_EOL;
    if($a < 10) printOneToTen();
}
printOneToTen(); 
```

Static variable also will lose its value due to anonymous function is discarded.

```php
<?php
function ex() {
    $af = function(){
        static $a = 0;
        $a++;
        return $a;
    };
    return $af();
}
$v = ex();
$v = ex();
$v = ex();
$v = ex();
echo $v.PHP_EOL; // Get 1. Get 4 if $af is declared with static.
```

Since PHP 8.1.0, inherited static method will share static variables with parent method.

```php
<?php
class P{
    public static function num(){
        static $n = 0;
        return ++$n;
    }
}
class C extends P {}

echo P::num().PHP_EOL; // 1
echo P::num().PHP_EOL; // 2
echo C::num().PHP_EOL; // 1. After PHP 8.1.0, get 3
echo C::num().PHP_EOL; // 2. After PHP 8.1.0, get 4
```

## References With Global & Static Variables

`static` and `global` for variables is implemented with reference. 
For example, global variable statement within a function actually creates a reference to the global variable.
The following examples cause unexpected behaviour