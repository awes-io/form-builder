# Компонент &lt;fb-multi-block&gt;

Может находиться только внутри &lt;form-builder&gt;

![fb-multi-block](https://storage.googleapis.com/static.awes.io/docs/fb-multi-block.gif)

## Пример использования компонента

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
                <fb-input :disabled="! form.fields.managers[block.id].active" name="manager" label="Manager name" :id="block.id"></fb-input>
            </template>
        </fb-multi-block>
    </template>
</form-builder>
@endvue


## Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **label**           | `String`           | `'add'`             | Текст в кнопке "добавить"                         |
