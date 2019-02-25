# The  &lt;fb-switcher&gt; Component

The `input[type="range"]`-based switcher 0/1. It can be located only within the &lt;form-builder&gt; component. Here is how the switcher component functions as well as how it is displayed.

![fb-switcher](https://storage.googleapis.com/static.awes.io/docs/fb-switcher.gif)


## Example of using the component

```html
<form-builder url="/api-url">
    <fb-switcher name="active" label="Active"></fb-switcher>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-switcher name="active" label="Active"></fb-switcher>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **cell**            | `String`, `Number` | `undefined`         | Number of columns in the row. It can be 2 or 3    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **padding**         | `String`           | `undefined`         | It adds the `.grid__cell_padding` class (for the additional left padding) |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
