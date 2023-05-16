# PHP-DI 7

## Terms

- Dependency Injection (DI) is a method for writing better code.
- DI Container is a utility for helping on injecting dependencies.

> DI will prepare all required dependencies and be used directly.  
> Service locator is just looking for the service. We still have responsible for creating its dependencies.

> As before PHP-DI 7, annotation is used instead of attribute.  

## Best Practices

- Never get an entry from container directly. (always use DI)
- Writing code decoupled from container.
- Interfaces with type-hinting. Configure how to implement the interfaces in the container's configuration.

### As controllers

Usually, there are many dependencies required within controllers. 
Use `$container->get(...)` within controller, and it is the behaviour of service locator.
Inject dependencies in the constructor, and it is not good idea when many dependencies are required.

In general, controller will not have any business logic, and it is just routing in between model and view.
It is dedicated for single purpose and not possible for reusing.
Once the logic is being changed, usually have to rewrite it at all.
Recommend to use property injection because it is no major drawback.

```
class UserController {
    /**
     * @Inject
     * @var FormFactoryInterface
     */
    private $formFactory;
    public function createForm($type, $data, $options)    {
        // $this->formFactory->...
    }
}
```

> **Cons of property injection**
> - Breaking the encapsulation while injecting into private property
> - No explicit dependency. It is not shown that the property is required for the class to be worked.
> - Once using the attribute for injecting dependencies, the class is depended on the container. (Violate point 2 of the best practices)

### As services

It is intended to be reused. Suggest to use **constructor injection** and **auto-wiring**.
```
class OrderService implements OrderServiceInterface {
    private $paymentService;
    public function __construct(PaymentServiceInterface $paymentService){
        $this->paymentService = $paymentService;
    }
}
```
Auto-wiring will try to determine the dependencies required by its type. 
However, it is not good enough in some cases. e.g. scalar type.
At that point, explicitly define what to inject.
```
[
OrderService::class => DI\create()->constructor(DI\get(SomeOtherService::class), 'a value'),
OrderService::class => DI\autowire()->constructorParameter('paramName', 'a value'),
]
```

> Example of interfaces with type-hinting
> ```
> [
>     OrderServiceInterface::class => DI\get(OrderService::class),
>     // Specific the class used to implement the interface.
> ]
> ```

### Using third parties libraries

Recommend to define dependencies in configuration file with anonymous function.

```
[
    Psr\Log\LoggerInterface::class => DI\factory(function () {
        $logger = new Logger('mylog');
        $fileHandler = new StreamHandler('path/to/your.log', Logger::DEBUG);
        $fileHandler->setFormatter(new LineFormatter());
        $logger->pushHandler($fileHandler);
        return $logger;
    }),
]
```

## Container

**Container looks for injection**

There have 3-way to define what to inject in a class:
- auto-wiring (PHP reflection)
- attributes
- PHP definitions

**Pre-configured container**

Just initialize `Container`.

```
$container = new DI\Container();
```

Auto-wiring will be enabled and no attributes by default.


**Container builder for customization**

Use `ContainerBuilder` to customize the container.

```
$builder = new DI\ContainerBuilder();
//...
$container = $builder->build();
```

> For PHP-DI 6:
>
> phpDoc may not correct if using annotations. Ignore errors with `$builder->ignorePhpDocErrors(true);`
> 
> If annotations are invalid, you may disable the feature with `$builder->useAnnotations(false);` temporarily to fix it.


Improve performance at production environment:

```
$builder->enableCompilation(__DIR__ . '/tmp');
$builder->writeProxiesToFile(true, __DIR__ . '/tmp/proxies');
```

Just as a simple container by disabling extra features:

```
$builder->useAutowiring(false);
$builder->useAttributes(false);
```

**Using container**

- `get` & `has`
   It is both defined at PSR11. We encourage use interfaces with type-hinting.
   
   ```
   $container->get("Service");
   $container->has("Service");
   ```
  
- `set`
   Create an entry to the container. Recommend to use definition file.
   
   ```
  $container->set('foo', 'bar');
  $container->set('MyInterface', \DI\create('MyClass'));
  $container->set('myClosure', \DI\value(function() { /* ... */ }));
  // Closure functions without wrapped by DI\value are interpreted as factories by default.
   ```
  
- `make`
   This is defined in `DI\FactoryInterface`. 
   It works like `get()` except it will **resolve the entry every time it is called**.
   If the entry is
   - an object, a new instance will be created every time
   - a factory, the factory will be called every time
   - an alias, the alias will be resolved every time
   
   Only the entry will be resolved every time. It is not include the dependencies of the entry.
   If the entry is an alias, the entry which the alias points to will be resolved only once.

   If second parameter is provided and resolved entry is an object being created, the second parameter will be used for constructing the new object.
   Missing parameters of constructor function will be resolved from the container.

   It is useful for creating objects which are not be stored inside the container (e.g. Not services, Not Stateless) but have dependencies.
   It is also useful for overriding some parameters of an object's constructor.

   It is not recommend to use `make()` inside a service, controller, or whatever to avoid coupling with the container.
   Suggest to use type-hinting for automatically bounding to `DI\Container` without any configuration.

- `call`
   It can invoke any PHP callable and just like built-in `call_user_func()` with additional features offered.
   - named parameters
     ```
     $container->call(function ($foo, $bar) {
         // ...
     }, [
         'foo' => 'Hello', 
         'bar' => 'World',
     ]);
     ```
   - dependency injection based on the type-hinting
     ```
     $container->call(function (Logger $logger, EntityManager $em){
         // ...
     });
     ```
   - dependency injection based on explicit definition
     ```
     $container->call(function ($dbHost) {
         // ...
     }, [
         // Either indexed by parameter names
        'dbHost' => \DI\get('db.host'),
     ]);
     ```
   Mixed usage is allowed
   ```
   $container->call(function (Logger $logger, $dbHost, $operation) {
       // ...
   }, [
       'operation' => 'delete',
       'dbHost'    => \DI\get('db.host'),
   ]);
  ```
  `call()` is defined in `Invoker\InvokerInterface`, as same as `make()`, which allows interfaces with type-hinting are bound to `DI\Container` automatically without any configuration.
  
  > **Callable**
  > - Closures
  > - Functions
  > - Object methods and static methods
  > - Invokable objects (implemented __invoke())
  > - Invokable classes in callable format. e.g. `My\CallableClass`
  > - Object methods in callable format. e.g. `['MyClass', 'someMethod']`
  > 
  > Callable format will be resolved by the container using `$container->get()`. No need to call `$container->get()` manually.

- `injectOn`
   Inject dependencies to object which is already created. It is better to use `get` and `make`.
   
   ```
   class UserController extends BaseController {
       /**
        * @Inject
        * @var SomeService
        */
        private $someService;
        public function __construct() {
            $container->injectOn($this);
            // Now the dependencies are injected
            $this->someService->doSomething(); 
        }
   }
   ```
  Although constructor injection is not work, other kind of injections are still work, whether using attributes or configuration in definition file. 

> You may extend the `Container`. 
> However, only the classes and interfaces tagged with `@api` annotation are fixed for public usage.
> All other classes and interfaces are internal usage and no guarantee on backward compatibility.

## Definitions

Define **What to inject** and **Where to inject**.

### The priority

From the highest to least:
1. Explicit definition on the container (e.g. `$container->set()`)
2. PHP definitions (if defined multiple times, the last one will be used.)
3. Attributes
4. Auto-wiring

### Auto-wiring

Auto-wiring means the container create and inject its dependencies automatically.
PHP-DI uses reflection, which is native PHP feature, to find out what parameters are needed for constructor function.
No performance affection once the container is precompiled.

```
class UserRepository {
    // ...
}
class UserRegistrationService {
    public function __construct(UserRepository $repository) {
        //...
    }
}
```

> It is enabled by default. 
> You may disable this feature by `$containerBuilder->useAutowiring(false);`.

It fails without type-hinting in constructor function. 
For those classes, it requires explicitly declaration in PHP definitions with `DI\autowire()`.

```
class Database {
    public function __construct($dbHost, $dbPort){
        // ...
    }
}
```

### Attributes

It is a native feature since PHP 8.
No performance issues if the container is compiled.
For non-compiled container, by using PHP reflection, the overhead is minimal.

It is easy to enable by `$containerBuilder->useAttributes(true);`.

#### #[Inject]

`#[Inject]` defines
- where should inject something?
- what it should inject?

Used on:
- constructor (constructor injection)
- methods (setter / method injection)
- properties (property injection): Injection will execute after constructor is executed, so injectable properties will be `null` at constructor execution.

Notes:
- Import the attribute class via use `DI\Attribute\Inject`;
- Ignore types declared in phpdoc. Only types specified in PHP code are considered.
- Ignore on the method to call with `Container::call()`
- `#[Inject]` is implicit on all constructors (It is called to create an object)
- `DI\Attribute\Injectable` is optional for a class. It is enabled by default.

```
use DI\Attribute\Inject;
class Example {
    /**
     * Attribute combined with a type on the property:
     */
    #[Inject]
    private Foo $property1;

    /**
     * Explicit definition of the entry to inject:
     */
    #[Inject('db.host')]
    private $property2;

    /**
     * Alternative to the above:
     */
    #[Inject(name: 'db.host')]
    private $property3;

    /**
     * The constructor is of course always called, but the
     * #[Inject] attribute can be used on a parameter
     * to specify what to inject.
     */
    public function __construct(Foo $foo, #[Inject('db.host')] $dbHost){
    }

    /**
     * #[Inject] tells PHP-DI to call the method.
     * By default, PHP-DI uses the PHP types to find the service to inject:
     */
    #[Inject]
    public function method1(Foo $param){
    }

    /**
     * #[Inject] can be used at the parameter level to
     * specify what to inject.
     * Note: #[Inject] *must be place* on the function too.
     */
    #[Inject]
    public function method2(#[Inject('db.host')] $param){
    }

    /**
     * Explicit definition of the entries to inject:
     */
    #[Inject(['db.host', 'db.name'])]
    public function method3($param1, $param2){
    }

    /**
     * Explicit definition of parameters by their name
     * (types are used for the other parameters):
     */
    #[Inject(['param2' => 'db.host'])]
    public function method4(Foo $param1, $param2){
    }
}
```

#### Limitation

Can not be defined with attribute:

- values (instead of classes)
- mapping interfaces to implementations
- defining entries with anonymous function

### Definitions

You may add definitions via `$containerBuilder->addDefinitions()`, which accepts
- array: definitions in array, or
- string: filepath point to a php file which returns an array

Definitions are written using Domain Specific Language (DSL) in PHP.
```
use Psr\Log\LoggerInterface;
use Monolog\Logger;

// - import namespaced function since PHP 5.6
use function DI\create;

return [
   //- ::class is magic contant since PHP 5.5
   LoggerInterface::class => create(Logger::class)
];
```

> **Lazy loading**
> 
> You may have large amount of definitions. It will not be created until 
> - required from container
> - being injected to another object
> 
> An only exception is defined object as `values` (Not recommended)

#### Types
- Values:
  Simple PHP value (aka parameter in Symfony)
  ```
  return [
    'database.host' => 'localhost',
    'database.port' => 5000,
    'report.recipients' => ['bob@example.com', 'alice@example.com'],
  ];
  ```
  You may also define object by creating them directly:
  ```
  return [
    'Foo' => new Foo(),
  ];
  ```
  It is bad idea that object will be created for every request even it is not used.
  Also, it will prevent compilation of container. 

- Factories: 
  It is PHP callables that return the instance. 
  Only be called when it is actually needed.
  Just like any other definition, it is called once and the same result is returned every time when it is resolved.
  
  Factories can be defined using helper `DI\factory()` or closure (aka anonymous functions).
  ```
  // Sample Code 1
  use Psr\Container\ContainerInterface;
  use function DI\factory;
  
  return [
      'Foo' => function (ContainerInterface $c) {
          return new Foo($c->get('db.host'));
      },
      // as same as
      'Foo' => DI\factory(function (ContainerInterface $c) {
          return new Foo($c->get('db.host'));
      }),
  ];
  ```

  Other services can be injected via type-hinting (registered in the container or enabled auto-wiring)
  ```
  return [
    'LoggerInterface' => DI\create('MyLogger'),
    'Foo' => function (LoggerInterface $logger) {
        return new Foo($logger);
    },
  ];
  ```
  
  In case of the service can not be injected automatically, the helper `DI\factory()` can help.
  ```
  return [
    'Database' => DI\factory(function ($host) {...})
    ->parameter('host', DI\get('db.host')),
  ];
  ```
  Besides that, you may inject container itself. 
  Type-hinting uses interface `Psr\Container\ContainerInterface` and not the implementation `DI\Container`.
  @see Sample Code 1.

  It accepts class method which also is PHP callable.
  ```
  class FooFactory {
    public function create(Bar $bar) {
      return new Foo($bar);
    }
  }
  return [
    Foo::class => DI\factory([new FooFactory, 'create']), // not recommended!
  ];
  ```
  It is bad idea.
  - created on every request even it is not used.
  - harder to pass dependencies in the factory.
  
  Suggest to let container create the factory:
  ```
  return [
    Foo::class => DI\factory([FooFactory::class, 'create']),
    // Alternative: you may pass 'Namespace\To\FooFactory::create' as parameter value.
    // Certainly, it also can static method in this way. 
  ];
  // It is equivalent to 
  $factory = $container->get(FooFactory::class);
  return $factory->create(...);
  ```
  Notes:
  - No object will be created for static method. It will call statically.
  - Container entry name can be used, e.g. pass `['foo_bar_baz', 'build']` or `'foo_bar_baz::build'` into `DI\factory()`, and allowing configuration for foo_bar_baz and its dependencies.
  - Invokable object is also PHP callable, so `InvokableFooFactory::class` is accepted in `DI\factory()`. You may use `'invokable_foo_factory'` if it is defined in container.
  - All closures will be considered as factories even they are nested into other definitions like `create()`, `env()`, ... (@see nesting definitions) 

  > **Request entry**
  > 
  > You can retrieve the name of entry is being resolved by injecting `DI\Factory\RequestedEntry` as a type-hinting.
  > You may inject container or any other services at the same time. The order of arguments is not a matter.
  > So you can create difference entries using same closure.
  > 
  > ```
  > use DI\Factory\RequestedEntry;
  > return [
  >   'Foo' => function (RequestedEntry $entry) {
  >     // $entry->getName() contains the requested name
  >     $class = $entry->getName();
  >     return new $class();
  >   },
  > ];
  > ```

  > **Definitions overridden**
  > 
  > You can override a previous entry using a decorator. (@see definition overridden)
  > 
  > ```
  > return [
  >   // decorate an entry previously defined in another file
  >   'WebserviceApi' => DI\decorate(function ($previous, ContainerInterface $c) {
  >       return new CachedApi($previous, $c->get('cache'));
  >   }),
  > ];
  > ```

- Objects: 
  Although factories are power, in some case we can use simpler solution `DI\create()`.
  ```
  return [
    'Logger' => DI\create(), // Create object by instantiate the Logger class
    'LoggerInterface' => DI\create('MyLogger'), // Mapping an interface to an implementation
    'logger.for.backend' => DI\create('Logger'), // Arbitrary name for the entry
  ];
  ```
  Passing constructor parameters to help helper  `DI\create()`.
  ```
  return [
    'Logger' => DI\create()
        ->constructor('app.log', DI\get('log.level'), DI\get('FileWriter')),
  ];
  ```
  Injection of property, method (aka setter)
  ```
  return [
    'Database' => DI\create()->method('setLogger', DI\get('Logger')),
    ->method('addBackend', 'file') // The method can call twice
    'Foo' => DI\create()->property('bar', DI\get('Bar')),
  ;
  ```
  Just like other definitions, object created by `create()`
  - lazy loading (created only when needed)
  - resolved once and same instance will be injected everywhere

- Autowired objects:
  Only for autowired is enabled container. 
  Helper `DI\autowire()` uses to customize how object be autowired.
  `DI\autowire()` behaves like `DI\create()` except we just override what we need instead of building from scratch.

   ```
   return [
     'MyLogger' => DI\autowire(), // Not required for no option
     'LoggerInterface' => DI\autowire('MyLogger'), // Mapping an interface to an implementation
     'logger.for.backend' => DI\autowire('MyLogger'), // Arbitrary name for the entry
   ];
   ```
   
   Like `DI\create()`, you can explicitly set constructor parameters:

   ```
   return [
    'Logger' => DI\autowire()->constructor('app.log', DI\get('log.level'), DI\get('FileWriter')),
   ];
   ```
   
   As well as property, method (aka setter) injections:

   ```
   return [
     'Database' => DI\autowire()->method('setLogger', DI\get('Logger')),
     'Foo' => DI\autowire()->property('bar', DI\get('Bar')),
   ];
   ```
   
   Define the parameters can not auto-wiring by type-hinting.

   ```
   return [
     'Logger'=>DI\autowire()
       ->constructorParameter('filename', 'app.log') // Constructor $filename parameter
       ->methodParameter('setHandler', 'handler', DI\get('SyslogHandler')), // setHandler's $handler parameter
   ];
   ```

- Aliases: 
  Alias an entry via helper `DI\get()`:
  ```
  return [
    'doctrine.entity_manager' => DI\get('Doctrine\ORM\EntityManager'),
  ];
  ```

- Environment variables: 
  Get environment variables by helper `DI\env()`:
  ```
  return [
    'db1.url' => DI\env('DATABASE_URL'),
    'db2.url' => DI\env('DATABASE_URL', 'postgresql://user:pass@localhost/db'), // with a default value
    'db2.host' => DI\env('DATABASE_HOST', DI\get('db.host')), // with a default value from another entry
  ];
  ```

- String expressions:
  Concatenate strings entries via helper `DI\string()`:
  ```
  return [
    'path.tmp' => '/tmp',
    'log.file' => DI\string('{path.tmp}/app.log'),
  ];
  ```

- Arrays:
  Entries can be arrays containing simple values or other entries:
  ```
  return [
    'report.recipients' => [
        'bob@example.com',
        'alice@example.com',
    ],
    'log.handlers' => [
        DI\get('Monolog\Handler\StreamHandler'),
        DI\get('Monolog\Handler\EmailHandler'),
    ],
  ];
  ```
  > Additional features for multiple definition. @see definition overridden.  

- Wildcards:
  It is used to define batch of entries and useful for binding interfaces to implementations.
  ```
  return [
    'Blog\Domain\*RepositoryInterface' => DI\create('Blog\Architecture\*DoctrineRepository'),
    // Blog\Domain\UserRepositoryInterface => Blog\Architecture\UserDoctrineRepository
  ];
  ```
  Notes:
  - Do not match across namespaces
  - Exact matching (no `*`) always be chosen (Exact matching have higher priority than wildcard)
  - In case of conflicts (both wildcard matching), the first match is used.

#### Nesting definition 

Nesting definition can keep container tidy by avoiding unnecessary entries.

```
return [
  'Foo' => DI\create()->constructor(DI\string('{root_directory}/test.json'), DI\create('Bar')),
];
```

Keep in mind that **closures inside configuration are always interpreted as factories even nested inside other definitions.**
Using anonymous function for other than factory, the function must be wrapped with helper `DI\value()`.

```
return [
  'router' => DI\create(Router::class)->method('setErrorHandler', DI\value(function () {
    // ...
  })),
];
```

### Explicit definitions

Besides defining entries in array, you can set it with `$container->set()`. 
However, it will not be compiled.

```
$container->set('db.host', 'localhost');
$container->set('My\Class', \DI\create()->constructor('some raw value')));
```

Using array definition is recommended since it is compilable. 

Beware, adding definitions on the fly to compiled container is not allowed.

### Definitions overridden

```
class Foo {
    public function __construct(Bar $param1) {
    }
}
```

It uses auto-wiring and can be overridden by adding attributes at constructor or definition.

```
#[Inject(['my.specific.service'])]
public function __construct(Bar $param1) {
}
```

```
[
    'Foo' => DI\create()->constructor(DI\get('another.specific.service')),
    // ...
]
```

### Extending definitions

**Objects**

- `DI\create()`: Override completely any previous definition even auto-wiring.
- `DI\autowire()`: Override specific parameters if an object is built with auto-wiring or attributes.

```
class Foo {
  public function __construct(Bar $param1, $param2) {
    // ...
  }
}

return [
  Foo::class => DI\autowire()->constructorParameter('param2', 'Hello!'),
];
```

In above example, `$param2` is specified and `$param1` is not affected and will be auto-wired.

Either `DI\create()` or `DI\autowire()` do not allow extending definitions.

```
return [
    Database::class => DI\autowire()->constructorParameter('host', '192.168.34.121'),
];

return [
    Database::class => DI\autowire()->constructorParameter('port', 3306),
];
// The latest definition completely override the first definition.
```

**Arrays**

Use `DI\add()` to add entries from another array or file to an array even not declared yet. 

```
return [
    'array' => [
      DI\get(Entry::class),
    ],
];
return [
    'array' => DI\add([
       DI\get(NewEntry::class),
    ]),
];
```

Array will be overridden entirely if `DI\add()` is omitted.

**Decorators**

It can override any kind of previous definitions. (factory, object, value, environment variables, ...)

`DI\decorate()` requires a callback which accepts previous definitions and container as parameters.

```
return [
    ProductRepository::class => function () {
        return new DatabaseRepository();
    },
];
return [
    ProductRepository::class => DI\decorate(function ($previous, ContainerInterface $c) {
        // Wrap the database repository in a cache proxy
        return new CachedRepository($previous);
    }),
];
```

## Inside PHP-DI

Main
- The main component is the `Container` class.
- It can be created by a helper class `ContainerBuilder`.
- Its main role is return entries by their entry name.
- It has 2 subcomponents
  - a `DefinitionSource` that returns a **Definition** for an entry name.
  - a list of `DefinitionResolver` that resolve a value from a **Definition**. (create it if a value is an object)

Definitions
- a simple value (string, number, object instance…): `ValueDefinition`
- a factory/callable returning the value: `FactoryDefinition`
- a definition of an entry alias: `Reference`
- a definition of a class: `ObjectDefinition`
- a definition of an environment variable: `EnvironmentVariableDefinition`

> The class definition describes how the container should create a class instance (what parameters the constructor takes, …).

### Annotations (PHP-DI 6)

It is written in PHP docblock comments and disabled by default.
No performance issues if the container is compiled.

Additional package **Doctrine Annotations** is required for enabling this feature. Installed by `composer require doctrine/annotations`.
Also, enable the feature by `$containerBuilder->useAnnotations(true);`.

#### @Inject

`@Inject` defines
- where should inject something?
- what it should inject?

Optionally, using `@var` and `@param` tag to define what should be injected.

Used on:
- constructor (constructor injection)
- methods (setter / method injection)
- properties (property injection): Injection will execute after constructor is executed, so injectable properties will be null at constructor execution.

Notes:
- PHP setting `opcache.save_comments` is `1`
- Case-sensitive for keyword `Inject` and `Injectable`
- Parameter within `@Inject()` must be in quotes.
- Use double quotes instead of single quotes. e.g. @Inject("foo")
- While using `@Inject()` accompany by `@var` or `@param`, correct namespace must be used.
- `@Inject()` can not be used on method to call with `Container::call()`. (it will be ignored)

```
use DI\Annotation\Inject; // Optional
`@Injectable` is optional annotation. By default, all classes are injectable. 
/**
 * @Injectable(lazy=true) 
 */
class Example
{
    /**
     * Annotation combined with phpdoc:
     *
     * @Inject
     * @var Foo
     */
    private $property1;

    /**
     * Explicit definition of the entry to inject:
     *
     * @Inject("db.host")
     */
    private $property2;

    /**
     * Annotation combined with phpdoc:
     *
     * @Inject
     * @param Foo $param1
     * @param Bar $param2
     */
    public function __construct($param1, $param2) {
      //..
    }

    /**
     * Annotation combined with the type-hint:
     *
     * @Inject
     */
    public function method1(Foo $param) {
      //..
    }

    /**
     * Explicit definition of the entries to inject:
     *
     * @Inject({"db.host", "db.name"})
     */
    public function method2($param1, $param2){
      //..
    }

    /**
     * Explicit definition of parameters by their name:
     *
     * @Inject({"param2" = "db.host"})
     */
    public function method3(Foo $param1, $param2) {
      //..
    }
}
```

#### Limitation

Can not be defined with annotation:

- values (instead of classes)
- mapping interfaces to implementations
- defining entries with anonymous function

## Reference
- [https://learnku.com/docs/php-di/6.0/](https://learnku.com/docs/php-di/6.0/)
- [https://php-di.org/doc/](https://php-di.org/doc/)