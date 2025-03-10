# Promise and async function

## Promise
It is used for asynchronous operation and contains states:
- `pending`: initial state, neither fulfilled nor rejected.
- `fulfilled`: operation was completed successfully.
- `rejected`: operation failed.

> Static methods `Promise.resolve()` and `Promise.reject()` are used for create a `Promise` object that is resolved with given value or rejected with a given reason.
>
> Static method `Promise.try()` accepts a function and returns 
> - alreadly fulfilled if the function returns a value.
> - already rejected if the function throws an error.
> - asynchronously fulfilled or rejected if the function return a `Promise`.

Example:
```
const promise = (()=>new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo"); // or reject(new Error("Failed"));
  }, 3000);
}))();
```

`Promise.withResolvers()` returns a plain object containing properties `promise`, `resolve` and `reject`.

Example:
```
const promise = (()=>{
  let {promise, resolve, reject} = Promise.withResolvers();
  setTimeout(() => {
    resolve("foo"); // or reject(new Error("Failed"));
  }, 3000);
  return promise;
})();
```

Methods are used for handling operation completed regardless fulfilled or rejected.
- `then()`: accept callbacks for fulfilled and rejected.
- `catch()`: accept callback for rejected. Shortcut for `then(undefined, onRejected)`.
- `finally()` accept callback for operation completed regardless fulfilled or rejected.

Example:
```
promise.then(value=>{
  console.log(value); // foo
},err=>{
  console.log(err); // Error Object
});
```

> It can deeply nested. Recommend: `AsyncFunction`.

### Promise Concurrency
The following static methods accept iterable of promises and return a `Promise`.
- `Promise.all()`: Fulfilled only all of the promises are fulfilled; rejected once any of the promises rejected.
- `Promise.allSettled()`: Fulfilled when all promises are completed regardless fulfilled or rejected. Fulfilled value is array of object with property `status` either `"fulfilled"` or `"rejected"` and `value` for fulfilled or `reason` for rejected.
- `Promise.any()`: Fulfilled once any of the promises is fulfilled and rejected when all of the promises are rejected. Fulfilled value takes the first fulfilled.
- `Promise.race()`: Fulfilled or rejected is depended on the state of the first of the promises is completed with fulfilled or rejected.

> Use Cases:
> `Promise.any()`: Resources from difference CDN and use the fast.
> `Promise.race()`: Create a promise that will rejected with timeout seconds. 

## Async function
- instance of `AsyncFunction`
- contains zero or more `await` expressions.
- returns a new Promise instance
  - resolved with the value returned by the async function
  - rejected with uncaught exception within the async function

## Operator `await`
- returns 
  - fulfilled value if expression is instance of `Promise` or `Thenable` interface
  - value of expression if it is not instance of `Promise` or `Thenable` interface
- throws exception with rejection reason once object, which is instance of `Promise` or `Thenable` interface, is rejected.