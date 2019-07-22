# The &lt;fb-input&gt; Component

It is a text field component. It can be located within the &lt;form-builder&gt; component or used with `v-model` directive and can be visualized as follows:

![fb-input](https://static.awes.io/docs/fb-input.png)

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* [Date](./fb-date.md)
* [Date range](./fb-date-range.md)
* [Editor](./fb-editor.md)
* **Input**
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
    <fb-input name="first_name" label="Enter your name"></fb-input>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-input name="first_name" label="Enter your name"></fb-input>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **mask**            | `String`           | `undefined`         | Mask for the `v-mask` directive. Click [here](https://github.com/vuejs-tips/vue-the-mask#tokens) for more information |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |


## Component features

### HTML attributes of the text field

All standard attributes, except `class` and `style`, are passed to the `&lt;input&gt;` element, for example:

```html
<form-builder url="/api-url">
    <fb-input
    name="email"
    label="Enter your email"
    type="email"
    class="my-class"
    disabled></fb-input>
</form-builder>
```

<form-builder url="/api-url">
    <fb-input name="email" label="Enter your email" type="email" class="my-class" disabled></fb-input>
</form-builder>

#### type="checkbox" and type="radio"

Note: Don’t use &lt;fb-input type="checkbox"&gt; or &lt;fb-input type="radio"&gt;. There are individual components such as [&lt;fb-checkbox&gt;](./fb-checkbox.md) and [&lt;fb-radio&gt;](./fb-radio.md) for these types.

#### type="password"

If `type="password"` is passed, the Hide/Show Password button will automatically appear in the field.

<form-builder url="/api-url">
    <fb-input name="password" label="Enter your password" type="password"></fb-input>
</form-builder>
