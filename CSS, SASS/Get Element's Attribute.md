# CSS Get Element's Attribute

Use `attr()` retrieve the value of an attribute of the selected element and use it in the stylesheet. 
Pseudo-elements can also be used and the value will be retrieved from attribute of pseudo-element's originating element.

**Currently only work on `content`.**

```
<p data-foo="hello">world</p>
[data-foo]::before {content: attr(data-foo) " ";} 
```