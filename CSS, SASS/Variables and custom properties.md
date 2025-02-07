# CSS variables and custom properties

Custom property is defined with property's name that begins with a double hyphen (--).
It is case-sensitive.

The value of custom property can be used in other declarations using `var()`.

```
:root { --main-bg-color: brown;}
body{background-color: var(--main-bg-color);}
```