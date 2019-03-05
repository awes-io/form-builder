# The &lt;fb-multi-block&gt; Component

It can be located only within the &lt;form-builder&gt; component and is visually presented as follows:

![fb-multi-block](https://storage.googleapis.com/static.awes.io/docs/fb-multi-block.gif)

## Example of using the component

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
    <template slot-scope="form">
        <fb-multi-block name="managers">
            <template slot-scope="block">
                <fb-checkbox name="active" label="Active" :id="block.id"></fb-checkbox>
                <fb-input
                    name="manager"
                    label="Manager name"
                    :id="block.id"
                    :disabled="! form.fields.managers[block.id].active"
                ></fb-input>
            </template>
        </fb-multi-block>
    </template>
</form-builder>
```
@vue
<form-builder url="/api-url" :default="{ managers: [{active: true, manager: 'Manager 1'}, {active: true, manager: 'Manager 2'}, {active: false, manager: 'Manager 3'}] }">
    <template slot-scope="form">
        <fb-multi-block name="managers">
            <template slot-scope="block">
                <fb-checkbox name="active" label="Active" :id="block.id"></fb-checkbox>
                <fb-input :disabled="! form.fields[`managers[${block.id}].active`]" name="manager" label="Manager name" :id="block.id"></fb-input>
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
