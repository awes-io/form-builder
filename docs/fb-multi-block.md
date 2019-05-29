# The &lt;fb-multi-block&gt; Component

It can be located only within the &lt;form-builder&gt; component and is visually presented as follows:

![fb-multi-block](https://static.awes.io/docs/fb-multi-block.gif)

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
* **Multi block**
* [Phone](./fb-phone.md)
* [Radio Group](./fb-radio-group.md)
* [Select](./fb-select.md)
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* [Textarea](./fb-textarea.md)
* [Uploader](./fb-uploader.md)

## Example

```html
<form-builder
    url="/api-url"
    :default="{
        managers: [
            {active: true, manager: 'Manager 1'},
            {active: true, manager: 'Manager 2'},
            {active: false, manager: 'Manager 3'}
        ]
    }"
>
    <template slot-scope="fields">
        <fb-multi-block name="managers">
            <template slot-scope="block">
                <fb-checkbox name="active" label="Active" :id="block.id"></fb-checkbox>
                <fb-input
                    name="manager"
                    label="Manager name"
                    :id="block.id"
                    :disabled="! fields[`managers[${block.id}].active`]"
                ></fb-input>
            </template>
        </fb-multi-block>
    </template>
</form-builder>
```
@vue
<form-builder url="/api-url" :default="{ managers: [{active: true, manager: 'Manager 1'}, {active: true, manager: 'Manager 2'}, {active: false, manager: 'Manager 3'}] }">
    <template slot-scope="fields">
        <fb-multi-block name="managers">
            <template slot-scope="block">
                <fb-checkbox name="active" label="Active" :id="block.id"></fb-checkbox>
                <fb-input :disabled="! fields[`managers[${block.id}].active`]" name="manager" label="Manager name" :id="block.id"></fb-input>
            </template>
        </fb-multi-block>
    </template>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component   |
| **label**           | `String`           | `'add'`             | Text in the “Add” button                          |
