# The &lt;fb-phone&gt; Component

This component is intended for the international telephone input. The [vue-tel-input](https://github.com/EducationLink/vue-tel-input) component is used within it.

It can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` directive. Below you can see how this component functions.

![fb-phone](https://storage.googleapis.com/static.awes.io/docs/fb-phone.gif)


## Example of using the component

```html
<form-builder url="/api-url">
    <fb-phone name="phone" label="Telephone"></fb-phone>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-phone name="phone" label="Telephone"></fb-phone>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component   |
| **cell**            | `String`, `Number` | `undefined`         | Number of columns in the row. It can be 2 or 3    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
