# The &lt;fb-checkbox&gt; Component

It can be located within the &lt;form-builder&gt; component, then it looks for the value, by the path given in the `name` property, or sets one if nothing found with a value of `value` property. Outside form component it can be used with a `v-model` directive

![fb-checkbox](https://static.awes.io/docs/fb-checkbox.png)

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* **Checkbox**
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
    <fb-checkbox name="agree" label="Agree with cookie policy"></fb-checkbox>
</form-builder>
```
<div class="vue-example">
<form-builder url="/api-url">
    <fb-checkbox name="agree" label="Agree with cookie policy"></fb-checkbox>
</form-builder>
</div>


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


## Multiple checkboxes with single name

To create a multiple checkbox, provide a single `name` prop and different `default-value` props on **every** `fb-checkbox` component. If you wish to pre-select some of checkboxes, set a `default` prop of `form-builder` with an array of default values

```html
<div class="vue-example">
    <form-builder url="/api-url" :default="{multiple: ['two']}">
        <fb-checkbox name="multiple" label="Check 1" default-value="one"></fb-checkbox>
        <fb-checkbox name="multiple" label="Check 2" default-value="two"></fb-checkbox>
        <fb-checkbox name="multiple" label="Check 2" default-value="three"></fb-checkbox>
    </form-builder>
</div>
```

<div class="vue-example">
    <form-builder url="//httpbin.org/post" disabled-dialog :default="{multiple: ['two']}">
        <fb-checkbox name="multiple" label="Check 1" default-value="one"></fb-checkbox>
        <fb-checkbox name="multiple" label="Check 2" default-value="two"></fb-checkbox>
        <fb-checkbox name="multiple" label="Check 3" default-value="three"></fb-checkbox>
    </form-builder>
</div>