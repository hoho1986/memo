# Reflection

Reflection can be used to query and manipulate structure of classes, interfaces, methods, properties at runtime.

# Common Usage
- DI container: Getting type of the parameters of the constructor by reflection implements automatically injection.
- Automated testing and mocking: Testing private or protected properties or methods by using reflection to bypass the access restriction.
- Object serialization and deserailization: Access and modify the private or protected properties by reflection.
- Dynamic framework routing: Handle request and dynamically invoke them according to analyzed names of classes and methods of controllers.
- Retrieve doc comments and attributes: Attributes and doc comments can be accessed easily through reflection since PHP 8. 

> Doc comments is a special comment that started with `/** ` and ended with `*/`.

# Disadvantage
- Breaking encapsulation of OOP: 
  Retrieve, modify or execute, in force, the private or protected properties or methods will break the encapsulation. 
  Beside, moditifying private or protected properties of third party libraries may break the program after the libraries will be updated.
- Much overhead: 
  Due to reflection need doing dynamic queries and inspections at runtime, it is impossible to enjoy the optimization from comilper.
  Caching mechanism may be implemented if reflection can not avoid.

# Examples

```
<?php
namespace Sample;
/** TestingDocComment */
#[TestingAttribute]
class Testing {
    private const PI = 3.14;
    public function __construct(
        private ?string $secret = NULL
    ){}
    private function getLevy(int $tax=0):float{
        return 1.0+$tax;
    }
}

$obj = new Testing("P@ssw0rd");

$reflector = new \ReflectionClass(Testing::class); // Looking up class structure
echo $reflector->getName().PHP_EOL; // Sample\Testing
echo $reflector->getShortName().PHP_EOL; // Testing
var_dump($reflector->getConstants()); // ["PI"=>3.14]
echo $reflector->getDocComment().PHP_EOL; // /** TestingDocComment */
$attr = $reflector->getAttributes("Sample\TestingAttribute");
var_dump($attr);
/*
array(1) {
  [0]=>
  object(ReflectionAttribute)#3 (1) {
    ["name"]=>
    string(23) "Sample\TestingAttribute"
  }
}
*/

$refPro = new \ReflectionProperty(Testing::class, "secret"); // Access private property
echo $refPro->getValue($obj).PHP_EOL; // P@ssw0rd
$refPro->setValue($obj, "P@SS");
echo $refPro->getValue($obj).PHP_EOL; // P@SS

$refFn = new \ReflectionMethod(Testing::class, "getLevy"); // Access private method
$fn = $refFn->getClosure($obj);
echo $fn().PHP_EOL; // 1

$refPara = new \ReflectionParameter($fn, "tax"); // Getting parameter detail
echo $refPara->getType().PHP_EOL; // int
echo $refPara->getDefaultValue().PHP_EOL; //0

```