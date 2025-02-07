# Webpack

## Basic terms

- Entry: Starting point.
- Module: It is a physical file. Webpack creates a dependency graph from entry points and finds out all modules needed.
- Chunk: A code block which may combine or split from one or more modules.
- Loader: Module transformation.
- Plugin: Listening events dispatched from Webpack building process and running your logic at the targeted events. 
- Output: Where to create the bundle files for outputting? How to name it?

## Types of hooks

- SyncHook: Synchronous. `tap()` only.
- SyncBailHook: Synchronous. `tap()` only. If any value is returned except `undefined` by any plugin, no further plugin callback is invoked and that value is returned by hook.
- SyncWaterfallHook: Synchronous. `tap()` only. Called with arguments from the returned value of the previous plugin.
- SyncLoopHook: Synchronous. `tap()` only. It will be looped if any value is returned except `undefined`. Called with arguments from the returned value of the previous plugin.
- AsyncParallelHook: Asynchronous Parallel. `tap()`, `tapAsync()` or `tapPromise()`.
- AsyncParallelBailHook: Asynchronous Parallel. `tap()`, `tapAsync()` or `tapPromise()`. If any value is returned except `undefined` by any plugin, no further plugin callback is invoked and that value is returned by hook.
- AsyncSeriesHook: Asynchronous Series. `tap()`, `tapAsync()` or `tapPromise()`.
- AsyncSeriesBailHook: Asynchronous Series. `tap()`, `tapAsync()` or `tapPromise()`. If any value is returned except `undefined` by any plugin, no further plugin callback is invoked and that value is returned by hook.
- AsyncSeriesLoopHook: Asynchronous Series. `tap()`, `tapAsync()` or `tapPromise()`. It will be looped if any value is returned except `undefined`. Called with arguments from the returned value of the previous plugin.
- AsyncSeriesWaterfallHook: Asynchronous Series. `tap()`, `tapAsync()` or `tapPromise()`. Called with arguments from the returned value of the previous plugin.
- HookMap: Utilites
- MultiHook: Utilites
