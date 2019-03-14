# The &lt;fb-select&gt; Component

This component is intended to select one or more options from a list of options. The [vue-multiselect](https://vue-multiselect.js.org/) component is used within it.

It can be located within the &lt;form-builder&gt; component, then it requires a `name` property, or it can be used with a `v-model` Vue directive

The component is visualized as follows:

![fb-select](https://static.awes.io/docs/fb-select.gif)

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* [Editor](./fb-editor.md)
* [Input](./fb-input.md)
* [Multi block](./fb-multi-block.md)
* [Phone](./fb-phone.md)
* [Radio Group](./fb-radio-group.md)
* **Seleсt**
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* [Textarea](./fb-textarea.md)
* [Uploader](./fb-uploader.md)

## Example

```html
<form-builder url="/api-url">
    <fb-select
        name="select"
        label="Select options"
        :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"
    ></fb-select>
</form-builder>
```

<form-builder url="/api-url">
    <fb-select name="select" label="Select options"></fb-select>
</form-builder>


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **selectOptions**   | `Array, String`    | `[]`                | [Items array](#fbs-items). If the value type is `String`, then it's treated like an url for AJAX-select |
| **multiple**        | `Boolean`          | `true`              | You can select multiple items                     |
| **placeholder-text**| `String`           | `'Pick a value'`    | Text when no item is selected                     |
| **debounce**        | `String, Number`   | `1000`              | AJAX-request debounce on user input               |
| **auto-fetch**      | `Boolean`          | `true`              | Fetch no-templated AJAX-options before user starts typing |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |


## Items array

There are two options for displaying the items array:

```javascript
const items = ['Item 1', 'Item 2', 'Item 3']
// In such case, we will get the following result: `<option value="Item 1">Item 1<option>`

const items = [
    {name: 'Item 1', value: 'val1'},
    {name: 'Item 2', value: 'val2'},
    {name: 'Item 3', value: 'val3'}
]
// And in such case, we will get the following result: `<option value="val1">Item 1<option>`
```

<form-builder url="/api-url">
    <fb-select name="select" label="Select option" :select-options="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-select>
</form-builder>


## AJAX select

```html
<form-builder url="/api-url">
    <fb-select name="select" label="Select option" select-options="/api-url/search?q=%s"></fb-select>
</form-builder>
```

The component may get it's options asyncronously via **GET**-request if the `select-options` property is a `String`.

If you need to filter values depending on user input, you may pass a template to `select-options` property, where `%s` will be replaced with **non-escaped** input text.

By default, if the `select-options` is not a template, options will be auto fetched from api url. To disable this behaviour, provide `:auto-fetch="false"`, then the component will wait for user input