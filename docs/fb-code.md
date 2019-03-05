# The &lt;fb-code&gt; Component

It is a component of the field for entering code. It can be located only within the &lt;form-builder&gt; component.

> Note! **auto-submit** property is removed use the same property on the  &lt;form-builder&gt; itself

Here is a visual presentation of this component.

![fb-code](https://storage.googleapis.com/static.awes.io/docs/fb-code.gif)

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
* [Textarea](./textarea.md)
* [Uploader](./uploader.md)
* **Validation Code**

## Example

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
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
