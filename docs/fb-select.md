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
* [Date](./fb-date.md)
* [Date range](./fb-date-range.md)
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
        :select-options="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"
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
| **select-options**  | `Array`            | `[]`                | [Items array](#fbs-items). If the value type is `String`, then it's treated like an url for AJAX-select |
| **url**             | `String`           | `undefined`         | Url for AJAX options                              |
| **options-name**    | `String`           | `'name'`            | A key of select's `&lt;option&gt;` text           |
| **options-value**   | `String`           | `'value'`           | A key of select's `&lt;option&gt;` value attribute |
| **multiple**        | `Boolean`          | `true`              | You can select multiple items                     |
| **taggable**        | `Boolean`          | `false`             | Ability to add new values by typing in search field |
| **placeholder-text**| `String`           | `'Pick a value'`    | Text when no item is selected                     |
| **debounce**        | `String, Number`   | `1000`              | AJAX-request debounce on user input               |
| **auto-fetch**      | `String, Boolean`  | `false`             | Fetch AJAX-options before user starts typing. If a string is provided, it will be injected into AJAX-url template |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |


## Items array

```html
<!-- with default keys -->
<fb-select select-options="[
    {name: 'Item 1', value: 'val1'},
    {name: 'Item 2', value: 'val2'},
    {name: 'Item 3', value: 'val3'}
]"></fb-select>

<!-- with custom keys (one or both) -->
<fb-select options-name="label" options-value="val" select-options="[
    {label: 'Item 1', val: 'val1'},
    {label: 'Item 2', val: 'val2'},
    {label: 'Item 3', val: 'val3'}
]"></fb-select>
```

<form-builder url="/api-url">
    <fb-select name="select" label="Select option" :select-options="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-select>
</form-builder>


## AJAX select

```html
<form-builder url="/api-url">
    <fb-select name="select" label="Select option" url="/api-url/search?q=%s"></fb-select>
</form-builder>
```

The component may get it's options asyncronously via **GET**-request if the `select-options` property is a `String`.

If you need to filter values depending on user input, you may pass a template to `select-options` property, where `%s` will be replaced with **non-escaped** input text.

By default, options will not be auto fetched from api url. To enable auto fetching, provide `auto-fetch` prop. You may also inject default value in api url template, like this:

```html
<fb-select name="select" label="Select option" url="/api-url/search?q=%s" auto-fetch="all"></fb-select>
<!-- on initial render, select will get options from /api-url/search?q=all -->
```

Default select options could be combined with AJAX options

```html
<fb-select name="numbers" label="Select option" select-options="['one', 'two']" url="/other-numbers?q=%s"></fb-select>
<!-- on initial render, select will get options from /api-url/search?q=all -->
```