# Callable

Callable is
- reference to a function or method.
- created via:
  - Closure (A class that represents anonymous function) object.
    - Anonymous function syntax. `function(){}`
    - First-class callable syntax (Since PHP 8.1). `funcName(...)`
    - Arrow function syntax. `fn($a)=>$a*2`
    - Invoke `Closure::fromCallable`. `Closure::fromCallable('callable')`
  - Name of function or method, except language constructs (e.g. `echo`), in string.
    - `"functionName"`
    - `"className::staticMethodName"`
  - Array consist of class name or object in index 0 and method name in index 1.
    - `["className", "staticMethodName"]`
    - `[$object, "methodName"]`
    - `[MyClass::class, "staticMethodName"]`
    - `["className", "parent::method"]` (Deprecated since PHP 8.2)
  - Object with magic method `__invoke()` implemented.
    - `$object`
 
> Closure vs Callable
> Closure scope is bound when instance is created.
> Callable scope is resolved when it is called.

```
<?php
class Example {
    private function getText():string { return "Text"; }
    public function getClosure():callable { return $this->getText(...); }
    public function getCallable():callable { return [$this, "getText"]; }
    public function runCallable(){ return call_user_func($this->getCallable()); }
}

$obj = new Example();
$res = call_user_func($obj->getClosure());
var_dump($res); // Text
$res2 = $obj->runCallable();
var_dump($res2); // Text
$res3 = call_user_func($obj->getCallable()); // Fail, private method can not be accessed
```

# Pipe operator (`|>`)

Pipe operator
- added since PHP 8.5
- used to chain multiple callables from left to right
- taking the return value of the left callable and passing to the right callable as the first parameter

`$result = "Hello World" |> strtoupper(...) |> str_shuffle(...) |> trim(...);`

Prior to PHP 8.5, 

```
$result = trim(str_shuffle(strtoupper("Hello World"))); // Nested Call

$result = strtoupper("Hello World"); // Temp. variable
$result = str_shuffle($result);
$result = trim($result);
```

## Limitation and Notice

Callable
- MUST ONLY have a compulsory parameter which MUST NOT by-reference and follow by any number of optional parameters.
- have a return value 
  - return type `void` will be coerced to `null`.
  - if `strict_types` is declared, data type of the return value must be matched with next callable
- without parameter
  - user defined: no error and silently ignored
  - built-in: cause fatal error

> There is an exception for built-in functions ([`array_multisort`](https://www.php.net/manual/en/function.array-multisort.php), [`extract`](https://www.php.net/manual/en/function.extract.php)), that by-reference parameter is declared with `@prefer-ref`, do not cause error within pipe chain.