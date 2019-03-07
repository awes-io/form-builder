# The  &lt;fb-switcher&gt; Component

The `input[type="range"]`-based switcher 0/1. It can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` Vue directive. Here is how the switcher component functions as well as how it is displayed.

![fb-switcher](https://storage.googleapis.com/static.awes.io/docs/fb-switcher.gif)


## Example of using the component

```html
<form-builder url="/api-url">
    <fb-switcher name="active" label="Active"></fb-switcher>
</form-builder>
```

<form-builder url="/api-url">
    <fb-switcher name="active" label="Active"></fb-switcher>
</form-builder>


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
