# CSS variables and custom properties

Custom property is defined with property's name that begins with a double hyphen (--).
It is case-sensitive.

The value of custom property can be used in other declarations using `var()`.

```
:root { --main-bg-color: brown;}
body{background-color: var(--main-bg-color);}
```

**Optional fallback value**

Syntax: `var(--custom-property, fallback)`.

Examples: `var(--bg-color, red)`, `var(--bg-font, initial)`

Fallback will be used only the custom property does not have usable value:
- **guaranteed-invalid value**.
- Property is not delcared, or delcared with `@property` without descriptor `initial-value`.
- The value of custom property is invalid at computed-value time. e.g. `45deg` is set to `background-color`.

> In CSS, guaranteed-invalid value is `initial`.
