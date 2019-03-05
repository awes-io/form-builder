# The &lt;fb-textarea&gt; Component

This is a text area component. When filling in the text area, it will automatically increase its height.

This component can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` Vue directive. Below, you will see a text area field in different states and its display style.

![fb-textarea](https://static.awes.io/docs/fb-textarea.png)

## Components
* [General information](./form-builder.md)
* [Auto Captcha](./auto-captcha.md)
* [Checkbox](./checkbox.md)
* [Company Slug](./company-slug.md)
* [Editor](./editor.md)
* [Input](./input.md)
* [Multi Block](./multi-block.md)
* [Phone](./phone.md)
* [Radio Group](./radio-group.md)
* [Select](./select.md)
* [Slider](./slider.md)
* [Switcher](./switcher.md)
* **Textarea**
* [Uploader](./uploader.md)
* [Validation Code](./code.md)

## Example

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
| **cell**            | `String`, `Number` | `undefined`         | Number of columns in the row. It can be 2 or 3    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **fixsize**         | `Boolean`          | `false`             | Disable automatic height change                   |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
