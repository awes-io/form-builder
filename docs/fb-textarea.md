# The &lt;fb-textarea&gt; Component

This is a text area component. When filling in the text area, it will automatically increase its height.

This component can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` Vue directive. Below, you will see a text area field in different states and its display style.

![fb-textarea](https://static.awes.io/docs/fb-textarea.png)

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* [Date](./fb-date.md)
* [Date range](./fb-date-range.md)
* [Editor](./fb-editor.md)
* [Input](./fb-input.md)
* [Multi block](./fb-multi-block.md)
* [Phone](./fb-phone.md)
* [Radio Group](./fb-radio-group.md)
* [Select](./fb-select.md)
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* **Textarea**
* [Uploader](./fb-uploader.md)

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
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **fixsize**         | `Boolean`          | `false`             | Disable automatic height change                   |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |