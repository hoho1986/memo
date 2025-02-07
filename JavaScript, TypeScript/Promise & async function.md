# Promise and async function

## Async function
- instance of `AsyncFunction`
- returns a new Promise instance
  - resolved with the value returned by the async function
  - rejected with uncaught exception within the async function
- contains zero or more `await` expressions.

## Operator `await`
- returns 
  - fulfilled value if expression is instance of `Promise` or `Thenable` interface
  - value of expression if it is not instance of `Promise` or `Thenable` interface
- throws exception with rejection reason once object, which is instance of `Promise` or `Thenable` interface, is rejected.