# PHP reference

PHP reference means accessing same content by difference variable names.

- It is symbol table aliases.
- It is not pointer and do not perform pointer arithmetic.
- it is not memory address.

> Variable does not store PHP object and it store the object identifier, which is used for finding actual object, instead. 
> The same identifier will be retrieved regardless copy or reference.

## Assigning by reference

Let variables refer to the same content.

```
$a = &$b
//`$a` and `$b` point to same content.
// Beside variable, the same syntax can be used with function that returns reference.
```

> Undefined variable will be cretaed once trying to assign, pass, or return it by reference.

```
$var1 = 1;
$var2 = 2;

function test1(){
    global $var1, $var2; // You can imagine that `global $var1` is the short form of `$var1 = $GLOBALS["var1"];`
    $var2 = &$var1; // Scope of $var2 is only within function. It is difference with $var2 in global.
}

function test2(){
    global $var1;
    $GLOBALS["var2"] = &$var1; // Superglobals are always available in all scopes.
}

test1();
echo $var2; //2
test2();
echo $var2; //1
```

> Strictly it is not assignment by reference, elements in `array()` expression can be referenced via prefixing `&`. 
> However, it may cause a potentially dangerous. 
> Normal assignment (not by reference) with a reference on the right side does not turn the left side into a reference, but references inside arrays are preserved in normal assignments (it also apply to function calls where array is passed by value).
> In other words, reference of array is element by element basis; reference of elements is dissociated from reference status of array container.
> 
> ```
> $a = 1;
> $arr1 = [&$a,2,3];
> $arr2 = $arr1;
> $arr2[0]++;
> // $arr1 = $arr2 = [2,2,3]
> ```

## Passing by reference

Passing variable into function by reference allows modification within the function.
Beside variable, returned reference is also accepted.

Syntax: prepend `&` before argument

```
function Test(int &$a){
    $a++;
}

$c = 0;
Test($c);
echo $c; //1
```

## Returning by reference

```
class Test{
    public $v = 10;
    
    public function &getV(){
        return $this->v;
    }
}

$obj = new Test();
$ref = &$obj->getV();
$obj->v = 20;
echo $ref; //20
$ref = 30;
echo $obj->v; // 30
```

> Use `&` in 2 places. 
> One is used to indicate return by reference.
> Another is used to indicate reference binding instead of normal assignment.

> Do not use return by reference to increase performance. 
> Engine will optimize automatically. 
> Use only when you have a technical reason.

## Unset reference

When unset a reference, it is just break the binding between variable name and content.

```
$a = 1;
$b = &$a;
unset($a); 
//Only break the binding between `$a` and the content. `$b` is still unchanged.
```

> Only content without any reference can be garbage collected