# The &lt;fb-code&gt; Component

It is a component of the field for entering code. It can be located only within the &lt;form-builder&gt; component. Here is a visual presentation of this component.

![fb-code](https://storage.googleapis.com/static.awes.io/docs/fb-code.gif)

## Example of using the component

```html
<form-builder url="/api-url">
    <fb-code name="code"></fb-code>
</form-builder>
```

@vue
<form-builder url="/api-url">
    <fb-code name="code"></fb-code>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **length**          | `Number`           | `6`                 | Number of digits in the code                      |
| **auto-submit**     | `Boolean`          | `true`              | Submit form if the code is entered correctly      |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
