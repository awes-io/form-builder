# The &lt;fb-phone&gt; Component

This component is intended for the international telephone input. The [vue-tel-input](https://github.com/EducationLink/vue-tel-input) component is used within it.

It can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` directive. Below you can see how this component functions.

![fb-phone](https://static.awes.io/docs/fb-phone.gif)

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
* **Phone**
* [Radio Group](./fb-radio-group.md)
* [Select](./fb-select.md)
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* [Textarea](./fb-textarea.md)
* [Uploader](./fb-uploader.md)

## Example

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
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |
| **default-country** | `String`           | `''`                | Default country, will override the country fetched from IP address of user  |