# The &lt;fb-select&gt; Component

This component is intended to select one or more options from a list of options. The [vue-multiselect](https://vue-multiselect.js.org/) component is used within it.

It can be located within the &lt;form-builder&gt; component, then it requires a `name` property, or it can be used with a `v-model` Vue directive

The component is visualized as follows:

![fb-select](https://static.awes.io/docs/fb-select.gif)

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
* **Select**
* [Slider](./slider.md)
* [Switcher](./switcher.md)
* [Textarea](./textarea.md)
* [Uploader](./uploader.md)
* [Validation Code](./code.md)

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
| **cell**            | `String`, `Number` | `undefined`         | Number of columns in the row. It can be 2 or 3    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **selectOptions**   | `Array`            | `[]`                | [Items array](#fbs-items)                         |
| **multiple**        | `Boolean`          | `true`              | You can select multiple items                     |
| **placeholder-text**| `String`           | `'Pick a value'`    | Text when no item is selected                     |
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
    <fb-radio-group name="equal" label="Equal option" :items="['Option 1', 'Option 2']"></fb-radio-group>
    <fb-radio-group name="different" label="Different option" :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-radio-group>
</form-builder>
