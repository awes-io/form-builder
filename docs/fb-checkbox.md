# The &lt;fb-checkbox&gt; Component

It can be located within the &lt;form-builder&gt; component, then it looks for the value, by the path given in the `name` property, or sets one if nothing found with a value of `value` property. Outside form component it can be used with a `v-model` directive

![fb-checkbox](https://storage.googleapis.com/static.awes.io/docs/fb-checkbox.png)


## Example of using the component

```html
<form-builder url="/api-url">
    <fb-checkbox name="agree" label="Agree with cookie policy"></fb-checkbox>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-checkbox name="agree" label="Agree with cookie policy"></fb-checkbox>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **value**           | `Boolean, Number, Array` | `0`           | Used internally for Vue `v-model` directive       |
| **default-value**   | `String`           | value of label prop | An HTML `value` attribute of checkbox (for multiple chechboxes, used in `v-model`) |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
