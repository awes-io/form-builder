# The &lt;fb-textarea&gt; Component

This is a text area component. When filling in the text area, it will automatically increase its height.

This component can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` Vue directive. Below, you will see a text area field in different states and its display style.

![fb-textarea](https://storage.googleapis.com/static.awes.io/docs/fb-textarea.png)


## Example of using the component

```html
<form-builder url="/api-url">
    <fb-textarea name="first_name" label="Enter your name"></fb-textarea>
</form-builder>
```

<form-builder url="/api-url">
    <fb-textarea name="first_name" label="Enter your name"></fb-textarea>
</form-builder>


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **fixsize**         | `Boolean`          | `false`             | Disable automatic height change                   |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
