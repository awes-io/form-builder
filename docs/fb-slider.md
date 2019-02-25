# The &lt;fb-slider&gt; Component

This slider component consists of a horizontal slider and a handle that can be moved with the mouse. You can also specify the minimum and maximal values.

The component can be located only within the &lt;form-builder&gt; component. Below, you will see this component in action.

![fb-slider](https://storage.googleapis.com/static.awes.io/docs/fb-slider.gif)


## Example of using the component

```html
<form-builder url="/api-url">
    <fb-slider name="opacity" label="Choose opacity level"></fb-slider>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-slider name="opacity" label="Choose opacity level"></fb-slider>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **cell**            | `String`, `Number` | `undefined`         | Number of columns in the row. It can be 2 or 3    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **min**             | `Number`           | `0`                 | Minimum value                                     |
| **max**             | `Number`           | `100`               | Maximum value                                     |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
