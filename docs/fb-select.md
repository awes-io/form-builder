# Компонент &lt;fb-select&gt;

Внутри используется компонент [vue-multiselect](https://vue-multiselect.js.org/)

Может находиться только внутри &lt;form-builder&gt;

1. [Пример использования компонента](#fbs-example)
2. [Свойства компонента](#fbs-options)
3. [Массив элементов](#fbs-items)


## <a name="fbs-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-select
        name="select"
        label="Select options"
        :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"
    ></fb-select>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-select name="select" label="Select options"></fb-select>
</form-builder>
@endvue


## <a name="fbs-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **selectOptions**   | `Array`            | `[]`                | [Массив элементов](#fbs-items)                    |
| **multiple**        | `Boolean`          | `true`              | Можно выбирать несколько элементов                |
| **placeholder-text**| `String`           | `'Pick a value'`    | Текст когда ничего не выбрано                     |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |


## <a name="fbs-items"></a> Массив элементов

Массив элементов для отображения может быть в двух вариантах

```javascript
const items = ['Item 1', 'Item 2', 'Item 3']
// В таком случае получим `<option value="Item 1">Item 1<option>`

const items = [
    {name: 'Item 1', value: 'val1'},
    {name: 'Item 2', value: 'val2'},
    {name: 'Item 3', value: 'val3'}
]
// В таком случае получим `<option value="val1">Item 1<option>`
```

@vue
<form-builder url="/api-url">
    <fb-radio-group name="equal" label="Equal option" :items="['Option 1', 'Option 2']"></fb-radio-group>
    <fb-radio-group name="different" label="Different option" :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-radio-group>
</form-builder>
@endvue