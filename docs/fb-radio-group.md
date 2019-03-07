# The &lt;fb-radio-group&gt; Component

Using this component, you can create a group of radio buttons. It can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it can be used with `v-model` Vue directive. The example below shows several different groups of radio buttons which you can customize at your own discretion.

![fb-radio-group](https://static.awes.io/docs/fb-radio-group.png)

## Components
* [General information](./form-builder.md)
* [Auto Captcha](./auto-captcha.md)
* [Checkbox](./checkbox.md)
* [Company Slug](./company-slug.md)
* [Editor](./editor.md)
* [Input](./input.md)
* [Multi Block](./multi-block.md)
* [Phone](./phone.md)
* **Radio Group**
* [Select](./select.md)
* [Slider](./slider.md)
* [Switcher](./switcher.md)
* [Textarea](./textarea.md)
* [Uploader](./uploader.md)
* [Validation Code](./code.md)

## Example

```html
<form-builder url="/api-url">
    <fb-radio-group
        name="options"
        label="Choose option"
        :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"
    ></fb-radio-group>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-radio-group name="options" label="Choose option" :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-radio-group>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **items**           | `Array`            | `undefined`         | [Array of radio buttons](#fbrg-items)             |
| **box**             | `Boolean`          | `false`             | It adds classes for styling with a frame          |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |


<h2 id="fbrg-items">Array of radio buttons</h2>

There are two options for displaying the items array:

```javascript
const items = ['Item 1', 'Item 2', 'Item 3']
// In such case, we will get radio buttons with the same `<label>` and `value`

const items = [
    {name: 'Item 1', value: 'val1'},
    {name: 'Item 2', value: 'val2'},
    {name: 'Item 3', value: 'val3'}
]
// In such case, the text within the `<label>` element is equal to `name`
// and the `value` attribute is equal to `value`
```

@vue
<form-builder url="/api-url">
    <fb-radio-group name="equal" label="Equal option" :items="['Option 1', 'Option 2']"></fb-radio-group>
    <fb-radio-group name="different" label="Different option" :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-radio-group>
</form-builder>
@endvue


## Styling of the radio button

Using the slot, by default, you can style the appearance of buttons. Please use the following HTML code snippet to customize your buttons:

```html
<form-builder url="/api-url">
    <fb-radio-group
        name="custom"
        label="Customized options"
        :items="[
            {heading: 'Heading 1', subtitle: 'Subtitle 1', value: 1},
            {heading: 'Heading 2', subtitle: 'Subtitle 2', value: 2},
        ]"
    >
        <template slot-scope="radio">
            <span class="my-box">
                <span
                    :class="['my-box__heading', {'is-checked': radio.checked, 'is-focused': radio.focused}]"
                >{{ radio.heading }}</span>
                <em class="my-box__subtitle">{{ radio.subtitle }}</em>
            </span>
        </template>
    </fb-radio-group>
</form-builder>
```

The following variables are passed to the slot:

| Name                | Type               | Description                      |
|---------------------|:------------------:|----------------------------------|
| **item**            | `Object`           | The current item of the `items` array  |
| **checked**         | `Boolean`          | It indicates whether the button is checked  |
| **focused**         | `Boolean`          | The focus is set on this button |
