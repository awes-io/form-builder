# The &lt;fb-auto-captcha&gt; Component

The Recaptcha component. It can be located only within the &lt;form-builder&gt; component with non-editable name of `g-recaptcha-response` and uses the [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha) component.

By default, the field is hidden if the `show`property is not passed. If the server response contains an error for the field with component identifier, the field will be displayed (that is, the recaptcha will appear). In the  visual presentation below, you can watch this component in action.

![fb-auto-captcha](https://static.awes.io/docs/fb-auto-captcha.gif)

## Components
* [Form Builder](./form-builder.md)
* **Auto Captcha**
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
* [Textarea](./fb-textarea.md)
* [Uploader](./fb-uploader.md)

## Example

```html
<form-builder url="/api-url">
    <fb-auto-captcha :show="true"></fb-auto-captcha>
</form-builder>
```

<form-builder url="/api-url">
    <fb-auto-captcha :show="true"></fb-auto-captcha>
</form-builder>


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component   |
| **show**            | `Boolean`          | `false`             | Show recaptcha                                    |
