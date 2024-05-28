Vue App
Instanced via `Vue.createApp(option)`
Managed DOM element and its descendants by `mount('#selector')`

Vue Option
- `data` method, which is factory method, returns managed data 
- `methods` object, define methods
- `mounted` method, will be called after instance is mounted ????

Interpolation
Text -> "Mustache" Syntax (`{{ }}`)

Directives 
Special attribute prefixed with `v-`
v-once : One-time interpolation only. No update when data are changed.
v-html="property name of data" : the data is raw HTML code and do not escape it.
v-bind:attribute="property name of data" : attribute's value will synchronize with the specified property of data
v-on:event="property name of methods" : add an event listener with handling function specified with property of methods
v-model="property name of data" : used in input element, e.g. Input Text, provides two way binding
v-if="property name of data" : control the element keep or remove
v-for="item in data" : Loop the element with data

Vue Components
Similar to `Custom Elements` of `Web Components Spec`
Implemented `Slot API` and `is` special attribute.

Register component by calling instance method `component`.
Component option 
- `template` is output HTML code.
- `props` is properties for the component and should be passed in by parent scope.

[Object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)

# Vue instance

## Application instance
- Create new application instance with `createApp({options})`.
- Store and share data used within application instance including registered components.
- Most methods from application instance return same instance for allowing chaining.

## Root component and components
- Root component is starting point for rendering after mounted a DOM element. 
- `mount` method from the instance requires a selector and returns root component instance.
- As a convention, component instance is often assigned to a variable named `vm` which come from ViewModel of MVVM pattern.
- Every component have its own component instance. Also, some components have multiple instances at same time.
- All component instances will share the same application instance.
- Root component is really no different with other component. Configuration and behavior are same.

## Component instance properties
User defined properties. e.g.
- `data`
- `methods`
- `props`
- `computed`
- `inject`
- `setup`

Built-in properties have a prefix `$` to avoid conflicting with user-defined property names. e.g.
- `$attrs`
- `$emit`

## Lifecycle
### Hooks
Every component instance goes through a series of initialization steps before it is created. It provides life cycle hooks for giving opportunity to user adding their own code at specified stage.

Hooks usually used:
- `created`
- `mounted`
- `updated`
- `unmounted`

Hooks handler will be called with its `this` bound to the invoked instance. Do not use arrow function for the hook handler due to arrow function not bind to `this`.
### Diagram
1. Create application instance and be mounted to a DOM element.
2. Initialize events and lifecycle. Hooks `beforeCreate`.
3. Initialize injections and reactivity. Hooks `created`.
4. Has `template` option?  
   a. Yes. Compile template into render function. \*  
   b. No. Compile `element.innerHTML` as template. \*
5. Hooks `beforeMount`. Create `app.$el` and append it to `el`. Hooks `mounted`.
6. When data changes, Hooks `beforeUpdate`. Virtual DOM re-rendered and patch. Hooks `updated`.
7. When `unmount` method of application instance is called, Hooks `beforeUnmount`. After Unmounted, Hooks: `unmounted`.

*Template compilation is performed ahead-of-time if using a build step, e.g., with single-file components. 

# Template
- It is a valid HTML statement.
- It will compile to virtual DOM render functions.

> Virtual DOM with reactivity system is able to figure out the minimal effort to re-render and the minimal amount of DOM manipulations.
>
> You may customize rendering function (with optional JSX support) instead of template. (you should familiar with Virtual DOM )

## Interpolations
- Text: Mustache syntax `{{ data }}` 
- Raw HTML: Directive `v-html` will be used to specified data are raw HTML code and no escape on insertion. **(Beware of XSS)**
- Attribute: Directive `v-bind` will bind data to attribute. Do not render if bound value is `null` or `undefined`. In case of boolean attribute, such as `disabled`, with truthy data, the attribute value is empty string; otherwise it will be ommited.
- JavaScript expression: Beside the property name, powerful JavaScript expressions, with a restriction single expression only, are also available for data binding.

## Directives
- Special attribute with `v-` prefix.
- Its value is expected to be a single JavaScript expression. (except `v-for` and `v-on`)
- Its duty is apply side effects to the DOM reactively when its expression value is changed.
- Directive argument is denoted by a colon `:` after the directive name. e.g. v-on:**click**
- Directive dynamic argument can be dynamically evaluated to string as a JavaScript expression by wrapping with square brackets `[]`. e.g. v-on:\[targetEvent\] if targetEvent is focus, result: v-on:focus. 
  + Warning will be triggered if dynamic argument is evaluated to non-string. Beside evaluated to null, it is used to remove binding.
  + Expression with certain characters, such as space and quote, is invalid HTML attribute name. Use computed property instead.
  + All attribute name will converted to lowercase automatically.
  + All expressions run on sandbox and be limited on access. [Whitelist of Global](https://github.com/vuejs/vue-next/blob/master/packages/shared/src/globalsWhitelist.ts#L3)
- Directive modifier is a special postfixes denoted by a dot `.`. e.g. v-on:clik.**prevent** will call `event.preventDefault()` on triggered event.
- `v-bind` and `v-on` are used frequently so shorthands are provided. 
  + `<a v-bind:href="url"></a>` to `<a :href="url"></a>` or `<a :[prop]="url"></a>`
  + `<a v-on:click="handler"></a>` to `<a @click="handler"></a>` or `<a @[prop]="handler"></a>`

## Special case for binding class and style 
### Class
Beside an expression, it accepts:
- Object: property name is class name and property value (`data`, `computed`) is used to determine apply or not. Apply if the value is evaluated to [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).
- Array: Every item can be `name` of data(`data`, `computed`), `ternary expression` or `object`. The evaluated values will be the class name.

Example:
```
data(){
    return {
        isActive: true,
        hasError: false,
        activeClass: 'active',
        errorClass: 'text-danger'
    }
}

<div class="static" :class="{ active: isActive, 'text-danger': hasError }"></div>
<div class="static active"></div>

<div :class="[activeClass, errorClass]"></div>
<div class="active text-danger"></div>

<div :class="[isActive?activeClass:'', errorClass]"></div>
<div class="active text-danger"></div>

<div :class="[{ active: isActive }, errorClass]"></div>
<div class="active text-danger"></div>
```

Vue component with single root or element specified `$attrs` will use the same logic mentioned above. [Ref: Non-Prop Attributes](https://v3.vuejs.org/guide/component-attrs.html)

### Style
Beside an expression, it accepts:
- Object: property name is CSS property name (use **camelCase** or **"kebab-case"**) and property value is expression (which may be `name` of data(`data`, `computed`) or mixed)
- Name of data: It will return an JavaScript object.
- Array: Multiple objects. e.g. \[base, override\]

```
data(){
    return {
        activeColor: 'red',
        fontSize: 30,
        styleObject: {
          color: 'red',
          fontSize: '13px'
        }
    }
}

<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<div style="color: red; font-size:30px;"></div>

<div :style="styleObject"></div>
<div style="color: red; font-size:13px;"></div>
```

If the CSS property that require vendor prefixes, it will be added appropriate prefixes automatically. You may also provide prefixed values and the last supported value will be used. e.g. Result for`<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>` is `display: flex`.

# Conditional Rendering

## `v-if`, `v-else-if`, `v-else`
It is used for conditional rendering. Element with `v-if` or `v-else-if` will be rendered if its expression returns a truthy value. `v-else` will be rendered if preceeded directive(`v-if` or `v-else-if`) expression returns a falsy value. `v-else` and `v-else-if` must immediately follow `v-if` or `v-else-if`.

```
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>Not A/B/C</div>
```

## `v-show`
It is used for conditional displaying. Element with `v-show` will be displayed if its expression returns a truthy value. DOM element always be rendered and controlled via CSS property `display`. `<template>` element do not support `v-show`.

```
<h1 v-show="shown">Hello!</h1>
```

`<template>` is a special DOM element, created by Vue, which serves as an invisible wrapper, to group DOM elements. 

# List Rendering

## `v-for`

It is used to do list rendering with an array, an object or a range. Inside its block, we have full access to parent scope property. Its value is, not expression, a special syntax:
- `item in array`
- `(item, index) in array`
- `value in object`
- `(value, name) in object`
- `(value, name, index)
- `n in 10`
Where `item` is an element of the array being iterated, `value` is property value, `name` is property name, `index` is iterated counter started from **0**, `n` is current value for range and `10` is the looping times started from **1**. Delimiter `in` within syntax may use `of` instead. Beware the looping order is not guaranteed to be consistent due to difference across implementation of JavaScript engine.

```
data() {
    return {
        parentMessage: 'Parent',
        items: [{ message: 'Foo' }, { message: 'Bar' }],
        myObject: {title: 'How to do lists in Vue', publishedAt: '2016-04-10'}
    }
}

<ul><li v-for="(item, index) in items">{{ parentMessage }} - {{ index }} - {{ item.message }}</li></ul>
<ul><li>Parent - 0 - Foo</li><li>Parent - 1 - Bar</li></ul>

<ul><li v-for="(value, name, index) in myObject">{{ index }}. {{ name }}: {{ value }}</li></ul>
<ul><li>0. title: How to do lists in Vue</li><li>1. publishedAt: 2016-04-10</li></ul>

<span v-for="n in 3">{{ n }}</span>
<span>1</span><span>2</span><span>3</span>
```

Using `v-if` and `v-for` on same element is not recommended. If applied, `v-if` will be evaluated first and can not access variable from the scope of `v-for`. To fix it, use `template` element with `v-for` and element with `v-if` will be child of `template` element.

"In-place patch" strategy is the default method for updating the list rendered. If the order of the data item has changed, the strategy will patch each element in-place and ensure the rendering is correct at particular index. No moving on the DOM elements, so it is efficient. It is not suitable for output is rely on child component state or temporary DOM state (e.g. form input value).

Recommended to provide attribute `key` with `v-for` for tracking node unless it is simple, or use default behaviour for performance gains. 

`key` is generic mechanism to identify nodes. It is not only for `v-for`. Its value should be unique string or numeric. [Reference](https://v3.vuejs.org/api/special-attributes.html#key)

## Array Change Detection
The following methods are wrapped by Vue, so calling them will trigger view update.
- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

Also, you may assign a new array to trigger view update. e.g. `filter()`, `concat()`, `slice()`......

## Filtered/Sorted Results
Use `computed` or `methods` as source and provide `key` for tracking node on `v-for` element.

//TODO　v-for with a Component

# Event Handling

Benefit
- Add event listener on DOM element for looking up easily.
- JavaScript is pure logic and DOM free.
- Event listeners are attached and removed automatically.

## `v-on` 
It is used of add event listener. It is shorten to `@` symbol. Directive value can be `name of method` or `an inline JavaScript statement`. When using inline statement, you can pass `$event` variable, which is original DOM event, into method. Multiple methods in an event handler is allowed. It should be separated by a comma.

```
methods: {
    greet(event){
        //...
    },
    say(message, event){
        //...
    },
    greet2(){
        //...
    }
}

<button @click="counter += 1">Add 1</button> <!-- as same as <button v-on:click="counter += 1">Add 1</button> --> 

<button @click="greet">Greet</button>

<button @click="say('hi', $event)">Say hi</button>

<button @click="say('hi', $event), greet2()">run in order</button>
```

## Modifier for `v-on`
It is directive postfixes denoted by a dot `.`. Multiple modifiers for a directive are allowed. Order is important because code is generated in the same order.

### General
- `.stop`: call [`event.stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation).
- `.prevent`: call [`event.preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault). 
- `.capture`: [`useCapture`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters) in event listener.
- `.self`: Only trigger the event if [`event.target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target) is the element itself.
- `.once`: Triggered at most once. It can be used on [component event](https://v3.vuejs.org/guide/component-custom-events.html)
- `.passive`: Use `passive` option on `addEventListener`. [Details](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)

### Keyboard
-`.enter`: Captures `Enter`.
-`.tab`: Captures `Tab`.
-`.delete`: Captures both `Delete` and `Backspace`.
-`.esc`: Captures `Esc`.
-`.space`: Captures `Space`.
-`.up`: Captures `Up`.
-`.down`: Captures `Down`.
-`.left`: Captures `Left`.
-`.right`: Captures `Right`.
-`.ctrl`: Captures `Ctrl`.
-`.alt`: Captures `Alt`.
-`.shift`: Captures `Shift`.
-`.meta`: Captures `Meta`. Mac is `Command`; Windows is `Windows`; Sun Microsystems is `solid diamond`.
-`.exact`: Require exact combination of `.ctrl`, `.alt`, `.shift` and `.meta`. e.g. `.ctrl` will fire even if Alt or Shift is pressed. `.ctrl.exact` only fire if Ctrl is only pressed.

### Mouse
-`.left`: Captures `Left`.
-`.right`: Captures `Right`.
-`.middle`: Captures `Middle`.

# Form Binding
## `v-model`
It is syntax sugar that used to create two-way data bindings on form input, textarea and select elements. It always uses instance data instead of initial value from the elements. 

Events and properties used on elements
- text, textarea: property `value`; event `input`
- checkbox, radio: property `checked`; event `change`
- select: property `value`; event `change`

> Text interpolation within `textarea` element is not work, use `v-model` instead.
>
> Multiple checkboxes using same data for `v-model` results the data is in array.
>
> Multiple select results the data is in array.
>
> `Option` element with an empty value within `select` element should be set to `disabled`. Due to iOS will not fire event on it.
>
> Checkbox has 2 special attributes, which are `true-value` and `false-value`, for specified value used on `v-model` instead of boolean.

```
<input v-model="message" /><p>Message is: {{ message }}</p>

<textarea v-model="text"></textarea>
```
###  Modifiers for `v-model`
It is directive postfixes denoted by a dot `.`.
-`.lazy`: use `change` event instead of `input` event. 
-`.number`: the value will be converted to a number with parseFloat(). Original value in string will be returned if the value can not be parsed.
-`.trim`: whitespace from input will be trimmed automatically.

//TODO　v-model with a Component

## `v-bind`
Value bound from `v-model` is usually in static string (boolean for checkbox). With `v-bind`, it allows us to bind non-string value. 

```
<input type="radio" v-model="pick" v-bind:value="a" /> 
<!-- vm.pick === vm.a -->

<select v-model="selected"><option :value="{ number: 123 }">Choosen</option></select> 
<!-- console.assert(vm.selected.number === 123) will be passed -->
```

# Component (Basic)
Components can be registered in difference scope (`global` and `local`) ([Details](https://v3.vuejs.org/guide/component-registration.html)). Define a component globally for an instance by `component(name, options)`. Most options are as same as root instance.

Option `props` is custom attributes in array that used to define the data can be passed into component. It is a property on that component instance when a value is passsed to `props` and which may be used just like any other component property. 

Option `emits` can be an array that used to define events name that component will be sending out. Directive `v-on` (`@`) can be used on the component's tag that as same as normal DOM element. Also, component can emit an event itself via `$emit(event [,argument])`([Details](https://v3.vuejs.org/api/instance-methods.html#emit)). If `emits` option is an object, emitted event can be validated. Property name of the object is the events name and property value of the object is a validation function which returns boolean to indicate whether valid or not.

`v-model` on a component is equal to a **prop** named `modelValue` and a **emits** named `update:modelValue`. ([Details](https://v3.vuejs.org/guide/component-custom-events.html))
```
<myComponent v-model="searchText"></myComponent>
<myComponent :model-value="searchText" @update:model-value="searchText = $event"></myComponent>
```

`slots` element, which is defined by Vue, is a placeholder that represents content within the component tag. ([Details](https://v3.vuejs.org/guide/component-slots.html))
```
<myComponent>Hello World</myComponent>
app.component('alert-box', {
    template: `<div class="demo-box"><slot></slot></div>`
})
```

`component` element, which is defined by Vue, with a special attribute `is` can choose the component used dynamically. ([Details](https://v3.vuejs.org/guide/component-dynamic-async.html))

Some HTML elements have restrictions on its descendencies. e.g. `el`, `ol`...... Directive `v-is` is used for solving the issue. Because of directive value is in exprssion, component name need to be wrapped with quote. No limitation if string templates from
- String template e.g. template: '...'
- Single file componenet (.vue)
- \<script type="text/x-template"\>

```
app.component('custom-input', {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  template: `
    <input v-model="value">
  `,
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  }
})
```

# Component (Details)
## Props
All `props` is a **one way down binding** between child and parent. It will flow down to the child when parent property update. You **must not** update it inside component. If you want to update, you should 
- create a local data and use prop as initial value
- using computed value for transformation

> Object and array are passed by reference. Updating inside component is also affect parent state.
>
> In DOM, use kebab-cased instead of camelCase.  e.g. use post-title instead of postTitle.

### Option: `props`
- Array: list the attribute names of component in string 
  ```
  ['title', 'likes', 'isPublished', 'commentIds', 'author']
  ```
- Object: properties' name and values contain attribute names and requirements respectively. Warning will be shown on JavaScript console if it fails to fulfil the requirements. 
  ```
  props: {
    propA: Number, // Basic type check (`null` and `undefined` values will pass any type validation)
    propB: [String, Number], // Multiple possible types
    propC: {
      type: String,
      required: true // Required string
    },
    propD: {
      type: Number,
      default: 100 // Default value
    },
    propE: {
      type: Object,
      default: function() { // Object or array defaults must be returned from a factory function
        return { message: 'hello' };
      }
    },
    propF: {
      validator: function(value) { // Custom validator function
        return ['success', 'warning', 'danger'].indexOf(value) !== -1; // The value must match one of these strings
      }
    },
    // Function with a default value
    propG: {
      type: Function,
      default: function() { // For function, this is not a factory function and is a function to serve as a default value
        return 'Default function'
      }
    }
  }
  ```
> It is validated before a component instance is created. Instance properties (`data`, `computed` ...) will not be available.
>
> For type checking, it can be [native](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects) or custom constructor function. Data will be checked with `instanceof`.
  
### Passing Prop to component
- Static: by component's attribute
  ```
  <blog-post title="My journey with Vue"></blog-post>
  ```
- Dynamic: by using directive `v-bind` (`:`)
  ```
  <blog-post :title="post.title"></blog-post>
  ```

Both value is JavaScript expression.
```
<!-- Passing a number -->
<blog-post :likes="42"></blog-post>

<!-- Passing a boolean -->
<blog-post is-published></blog-post> <!-- imply true -->
<blog-post :is-published="false"></blog-post>

<!-- Passing an array -->
<blog-post :comment-ids="[234, 266, 273]"></blog-post>

<!-- Passing an object -->
<blog-post :author="{name: 'Veronica',company: 'Veridian Dynamics'}"></blog-post>

<!-- Passing properties of an object -->
post: {id: 1, title: 'My Journey with Vue'}
<blog-post v-bind="post"></blog-post> equivalent <blog-post v-bind:id="post.id" v-bind:title="post.title"></blog-post>

<!-- Passing data -->
<blog-post :author="author"></blog-post>
```


# Vue Option
## data
- It requires a function that returns an object and be called during instance initialization.
- The object will wrap in reactivity system and store on instance properties `$data`.
- Top level properties of the object will be exposed directly to instance for convenience.
- Properties added after initialization will not tracked by reactivity system. Where necessary, add the properties, with value `null` or `undefined`, will be used to the object.
- Prefix `$` is used to expose Vue built-in API to component instance. Also, prefix `_` is reserved for internal using. Avoid top-level properties of the object which name is started with the characters.
## methods
- It require an object that contains desired methods. 
- Keyword `this` will be bound to component instance for the methods. So, avoid arrow function.
- The methods are accessible from within the component's templates.
- The methods can be called via property name or expressions.
- The methods accessing any reactive data will be tracked as a rendering dependency (as same as reactive data used in template).
- The methods called from a template should not have any side effects (Changing data or triggering asynchronous processes). If you want to do that, you should use lifecycle hook instead.
- If method is for component which will use multiple times, instance method can be created at lifecycle hook. e.g. `created(){ this.handler = function(){}}`.
## computed
- Computed properties is used for handling complex logic for keeping template as simple as possible.
- It require an object that contains methods for generating computed properties.
- Computed properties will be cached based on their reactive dependencies. It only re-evaluate when some of its reactive dependencies have changed.
-By defualt, it is getter functions only. Setter functions are available and updated data once invoked.

```
computed: {
  userinfo() {
    return this.userinfo;
  }
  fullName: {
    // getter
    get() {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set(newValue) {
      const names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
```

## watch
- It is suitable for running asynchronous or expensive operations when data changing.
- It requires an object that contaitns property names which are being watched (top-level `data`, `props`, or `computed` property name) and callback functions (new value and old value will be passed in as arguments)
- Alternative, you may use [$watch API](https://v3.vuejs.org/api/instance-methods.html#watch) instead.

