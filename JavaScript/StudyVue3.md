# Vue.js 3 Study

## Play Now
* [https://play.vuejs.org/](https://play.vuejs.org/)
* [https://vite.new/vue](https://vite.new/vue)

## API Styles
- Options
    - JSON object with specified properties. e.g. `data`, `methods`, `mounted`, ...
    - Keyword `this` inside functions defined as properties on the JSON object points to component instance.
    - Suggest using it in environment without building tools.
- Composition:
    - Invoke API functions from Vue.
    - Code at `script` element with attribute `setup`.
    - Suggest using it in environment with building tools.

> `<script setup>` Pros:
> - Succinct code.
> - Declare props and emit events with pure TypeScript.
> - Template is compiled into a render function in same scope without intermediate proxy. (Better runtime performance)

## Getting Started
Vue application instance via `createApp()` which requires a component as root component.

```
import { createApp } from 'vue';
const app = createApp({}); // root component options
// or
import { createApp } from 'vue';
import RootComponent from './root.vue';
const app = createApp(RootComponent);
```

Vue application exposes a [`.config` object](https://vuejs.org/api/application.html#app-config) for configuration such as error handlers, component registration, ... 
It should be done before mounting application.

Rendered by Vue via mounting application. Invoke `mount()`, which accepts `Element` or `Selector`, to choose the container element. 
If root component does not have `template`, Vue will use the `innerHTML` of the container element.

> It is possible to have multiple Vue application instances on the same page.

> Return value of `mount()` is root component instance.

## Template
- All Vue templates are valid HTML.
- For text interpolation, use `Mustache Syntax {{ }}`. Example: `<span>Message: {{ msg }}</span>`
- Mustache Syntax accepts a Javascript expression.

## Reactivity

### Basic

Once you use reactivity in the template, all changing on the value will be automatically detected and updated related DOM by Vue.

#### Composition API

Declared by `ref()` which accepts an argument and returns a ref object with property `value`.
To access in a component's template, you have to declare and return it within component's `setup()`.

Example:
```
import { ref } from 'vue';
export default {
  setup() {
    const count = ref(0);
    function increment() {
      count.value++; // .value is needed in JavaScript
    }
    return {count, increment};
  }
}

<button @click="increment">{{ count }}</button> <!-- .value is not needed in Template -->`
```

It is quite verbose for exposing state manually. Use `<script setup>` at Single-File Components (SFC). 
Top-level imports, variables and functions declared are automatically usable in the template of the same component.

Example:
```
<script setup>
    import { ref } from 'vue'
    const count = ref(0);
    function increment() {
      count.value++; // .value is needed in JavaScript
    }
</script>
<template>
    <button @click="increment">{{ count }}</button>
</template>
```

Beside primitive data type, `ref()` can hold any data type including deeply nested objects, arrays or `Map`. 
For non-primitive, it will be turned into reactive proxies via `reactive()`. 
For performance, it is possible to opt-out of deep reactivity and only `.value` is tracked via [**shallow refs**](https://vuejs.org/api/reactivity-advanced.html#shallowref).

DOM update is not applied synchronously. 
Vue buffers all changes in same update cycle to ensure each component is updated once.
Waiting for DOM update, you can use `nextTick()`.

Example:
```
import { nextTick } from 'vue';
async function increment() {
  count.value++;
  await nextTick();
  // Now the DOM is updated
}
```

Also, there is another way to declare reactive state. 
Use `reactive()` to make object itself reactive. 
It is JavaScript Proxy, so Vue can intercept the access and mutation for reactivity tracking and triggering.

By default, it is deeply conversion.
- Nested objects are also wrapped with `reactive` once accessed.
- It is also called `ref()` internally if object value is `ref()` instance.

It is possible to opt-out of deep reactivity via [`shallowReactive()`](https://vuejs.org/api/reactivity-advanced.html#shallowreactive).

> `ref()` wraps value in a special object.

> - It is difference between original object and created proxy.
> - Only proxy is reactive.
> - Calling `reactive()` on same object will return same proxy.
> - Calling `reactive()` on existing proxy will return same proxy.
> - Nested object is also applied. (It is also proxy.)

Limitation of `reactive()`
- Object only. No primitive types.
- Cannot replace entire object. 
- No destructure assignment. 

```
let state = reactive({ count: 0 });
state = reactive({ count: 1 }); // { count: 0 } reactivity connection lost.
let { count } = state;  // It is discouneted when destructured.
```

Ref as property of reactive
- A ref as property of reactive is unwrapped automatically except within array or Map.
- A ref as property of reactive link to existing ref, the old ref will be replaced by new ref.

```
const count = ref(0);
const state = reactive({count});
console.log(state.count); // 0
state.count = 1;
const otherCount = ref(2);
state.count = otherCount;
console.log(state.count); // 2

const books = reactive([ref('Vue 3 Guide')]);
console.log(books[0].value);
```

Unwrapping in template
- Ref unwrapping in templates only applies if the ref is a top-level property in the template render context.
- It will be unwrapped if it is only for text interpolation.

```
const count = ref(0);
const object = { id: ref(0) };

{{ object.id + 1 }} // Not working
{{ object.id }} // Working
```

## V-Directives

### V-Directives Syntax
`Name:Argument.Modifiers="Value"`
- Name is started with v- and also may be omitted.
- Argument follows `:` or shorthand symbol.
- Modifier is started with `.` and it is multiple. e.g.`@input.stop.lazy`.
- Value is interpreted as Javascript expression

### `v-html`
The content will be treated as HTML instead of plain text.

Example: `<span v-html="rawHtml"></span>`

> Notice: Prevent XSS vulnerabilities 

### `v-bind`
Update attributes of HTML elements. 

Example: `<div v-bind:id="dynamicId"></div>` 

Shorthand: `:`

Example: `<div :id="dynamicId"></div>`

For boolean attributes, it will include only the value IS NOT falsy value.

Setting attributes in batch:
```
const attrs = {id: 'container',class: 'wrapper'};
<div v-bind="attrs"></div>
```

