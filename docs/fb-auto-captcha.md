# The &lt;fb-auto-captcha&gt; Component

The Recaptcha component. It can be located only within the &lt;form-builder&gt; component with non-editable name of `g-recaptcha-response` and uses the [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha) component.

By default, the field is hidden if the `show`property is not passed. If the server response contains an error for the field with component identifier, the field will be displayed (that is, the recaptcha will appear). In the  visual presentation below, you can watch this component in action.

![fb-auto-catptcha](https://static.awes.io/docs/fb-auto-captcha.gif)

## Components
* [General information](./form-builder.md)
* **Auto Captcha**
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
* [Validation Code](./code.md)

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
