# Fibers Overview

Fibers
- Full-stack and interruptible functions.
- Neither parallel processing Nor threading.
- Cooperative multitasking.
- Suspended from any function call in the call-stack, and even it is called from the PHP VM, such as function provided to `foreach`.
- Execution is paused by pausing its entire execution stack until it is resumed at a later time. So, function calling method keeps unchanged.

> Types of multitasking
>
> - Cooperative multitasking refers to task scheduler can not suspend task until the task yield the right.
> - Preemptive multitasking refers to the task scheduler does context switching in force at time interval.
>
> Context switching refers to the task scheduler storing the state of current task and suspending it, then 
> loading the state of the next task and resuming that task.
>
> The task scheduler is typically part of the operating system.

> Common misconception
>
> Fiber does not provide asynchronous functionality. 
> The PHP process is blocked if blocked function, such as `sleep()`, is invoked.
>
> Asynchronous functionality can be achieved through an event loop and a scheduler. 
> Fiber can be used in conjunction with these.
>
> Asynchronous frameworks: [Revolt][linkRevolt], [AMPHP][linkAMPHP], [ReactPHP][linkReactPHP]

[linkRevolt]: https://revolt.run/
[linkAMPHP]: https://amphp.org/
[linkReactPHP]: https://reactphp.org/

> Compared with `Generator`
> 
> - [Generator][linkGenerator] is stackless and `yield` can only be invoked on scope of the current function.
> - Return type of the function must be `Generator`.
> - Single-thread manual iteration.

[linkGenerator]: https://www.php.net/manual/en/language.generators.overview.php

# Fibers Advantage

Before [Fiber][linkFiber] is available, asynchronous or non-blocking functionality is achieved by callback or [promise][linkPromisesAP]. 
Therefore, this causes callback hell and hard to debug.

> Method `then()` of the promise accepts callback functions that will be invoked either fulfilled or rejected.
>
> If several promises are used or relied on the result of another promise, the code become deeply nested, 
> making it hard to read and maintain.
> 
> When an error occurred deeply within the promise chain, stack traces jump between different callback contexts, 
> making it difficult to find out the actual flow that caused the error. 
>
> Example of callback hell
> ```
> function fetchUserData(int $userId): PromiseInterface {
>     return $this->httpClient->getAsync("/users/$userId")->then(function($response){
>         return json_decode($response->getBody());
>     })->then(function($userData) use ($userId) {
>         return$this->cache->setAsync("user:$userId", $userData);
>     })->then(function() use ($userId) {
>         return"User $userId cached";
>     });
> }
> ```

[linkFiber]: https://www.php.net/manual/en/language.fibers.php
[linkPromisesAP]: https://github.com/promises-aplus/promises-spec

# Fiber Lifecycle

1. Create: Provides a `callable` that will be invoked by the `Fiber` instance.
2. Start: Calls the `start()` of the instance, and the passed arguments will pass into the `callable` that had passed in `Fiber` construtor.
3. Running: Execution rights can be given away by calling `Fiber::suspend()` anywhere that within call-stack of the instance.
4. Suspended: Back to running state by calling the instance methods `resume()` or `throw()`. 
5. Terminated: It is terminated either value is returned or exception is thrown of the `callable` that had passed in `Fiber` construtor.

Parameters of `start()` pass into the callable that had passed in `Fiber` constructor.

`Fiber::suspend()` is used to pause current execution and its parameter is the return value of the method that started the execution. (i.e.`start()`, `resume()` or `throw()`)

Resume Fiber
- `resume()` is used to resume execution and its parameter is the return value of latest `Fiber::suspend()`.
- `throw()` require a `Throwable` instance as a parameter for resuming with an exception.

The method, that started the execution (i.e. `start()`, `resume()` or `throw()`), returns `NULL` if the callable, that had passed in `Fiber` constructor, has returned.

Get the return value of the callable, that has passed in `Fiber` constructor, via `getReturn()`.

> Methods of `Fiber`: [https://www.php.net/manual/en/class.fiber.php](https://www.php.net/manual/en/class.fiber.php)

> Before PHP 8.4, switching fibers during object destructor was not allowed.

```
<?php
function sub_function(){
    return Fiber::suspend(Fiber::getCurrent());
}
$objFiber = new Fiber(function(string ...$para):string {
    echo "Start of Fiber\n";
    
    $value = Fiber::suspend($para[0]??'Suspend1');
    echo "Resumed with: $value\n";

    $value2 = Fiber::suspend($para[1]??'Suspend2');
    echo "Resumed again with: $value2\n";
    
    $value3 = sub_function();
    echo "Resumed with compare result: ".($value3?"T":"F")."\n";

    return "End of Fiber";
});

echo "Before Starting\n";

if(!$objFiber->isStarted()) $suspended1 = $objFiber->start("Suspend 1", "Suspend 2");
echo "Suspended with: $suspended1\n";

if($objFiber->isSuspended()) $suspended2 = $objFiber->resume('Resume 1'); 
echo "Suspended again with: $suspended2\n";

if($objFiber->isSuspended()) $suspended3 = $objFiber->resume('Resume 2');
echo "Suspended with instance: ".($suspended3?"T":"F")."\n";

$suspended4 = $objFiber->resume($suspended3===$objFiber);

$result = $suspended4??$objFiber->getReturn();
echo "Return from Fiber: $result\n";
echo $objFiber->isRunning()?"Fiber is running\n":"Fiber is NOT running\n";
echo $objFiber->isTerminated()?"Fiber Terminated":"Fiber is still active";

/*
Before Starting
Start of Fiber
Suspended with: Suspend 1
Resumed with: Resume 1
Suspended again with: Suspend 2
Resumed again with: Resume 2
Suspended with instance: T
Resumed with compare result: T
Return from Fiber: End of Fiber
Fiber is NOT running
Fiber Terminated
*/
```

```
<?php
$objFiber1 = new Fiber(function():string {
    echo "Start of Fiber\n";
    throw new Exception("Throw - start()");
    return "End of Fiber";
});
try {
    $fromFiber = $objFiber1->start();
} catch (Throwable $e) {
    echo $e->getMessage()."\n";
}

$objFiber2 = new Fiber(function():string {
    echo "Start of Fiber\n";
    $way = "resume()";
    try {
        Fiber::suspend('Suspend');
    } catch (Throwable $e) {
        $way = "throw()";
    }   
    throw new Exception("Throw - $way");
    return "End of Fiber";
});
try {
    $fromFiber = $objFiber2->start();
    if(rand()%2 === 0) $objFiber2->throw(new Exception("throw an exception into Fiber"));
    else $objFiber2->resume("Resume");
} catch (Throwable $e) {
    echo $e->getMessage()."\n";
}

/*
Start of Fiber
Throw - start()
Start of Fiber
Throw - throw()
Throw - resume() or Throw - throw()
*/
```
