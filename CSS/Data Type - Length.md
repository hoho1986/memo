# CSS <length>

The <length> is a CSS data type for representing a distance.

Syntax: `<number>[unit]`

The <number> is a CSS data type for representing either an integer or a number with a fractional component.

## Units
- Absolute
  - `cm` Centimeters. 1cm = 37.795px
  - `mm` Millimeters. 1mm = 1/10cm = 3.780px
  - `Q` Quarter-millimeters. 1Q = 1/40cm = 0.945px
  - `in` Inches. 1in = 96px
  - `pc` Picas. 1pc = 1/6in = 16px
  - `pt` Points. 1pt = 1/72in = 1.3333px
  - `px` CSS Pixels. 1px = 1/96in
- Relative
  - Font
    - `cap` Experimental. The "cap height" (nominal height of capital letters) of the element's font.
    - `ch` Advance measure of glyph 0(U+0030) of the element's font. If it cannot be measured, it must be assumed to be 0.5em wide by 1em tall.    
    - `em` Calculated font size of the parent element.
    - `ex` The x-height of the element's font.
    - `ic` Experimental. Advance measure of glyph 水(U+6C34) of the element's font.
    - `lh` Experimental. Computed value of the `line-height` property of the element.
    - `rem` The `font-size` of the root element (\<html\>). If used in `font-size` of root element, initial value will be used.
    - `rlh` Experimental. Computed value of the `line-height` property of the root element (\<html\>). If used in `font-size` or `line-height` of root element, initial value will be used.
  - Viewport
    - `vw` Viewport Width. 1vw = 1% of the width of the viewport's initial containing block.
    - `vh` Viewport Height. 1vh = 1% of the height of the viewport's initial containing block.
    - `vmin` Smaller value of viewport height and width.
    - `vmax` Larger value of viewport height and width.
    - `vi` Experimental. 1vi = 1% of the size of the initial containing block, in the direction of the root element's inline axis.
    - `vb` Experimental. 1vb = 1% of the size of the initial containing block, in the direction of the root element's block axis.

Advance measure is the width or height of the glyph. For horizontal axis, the width of the glyph will be used.

> A CSS Pixel is exactly 1/96 inch.
>
> Window.devicePixelRatio is ratio of physical pixels to CSS pixels.
>
> Root element (\<html\>) pseudo-class is `:root`.

## See Also
- [CSS data types](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Types)