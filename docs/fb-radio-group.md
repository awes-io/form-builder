# Компонент &lt;fb-radio-group&gt;

Может находиться только внутри &lt;form-builder&gt;

![fb-radio-group](https://storage.googleapis.com/static.awes.io/docs/fb-radio-group.png)

## Пример использования компонента

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


## Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **items**           | `Array`            | `undefined`         | [Массив радио-кнопок](#fbrg-items)                |
| **box**             | `Boolean`          | `false`             | Добавляет классы для стилизации с рамкой          |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |


<h2 id="fbrg-items">Массив радио-кнопок</h2>

Массив элементов для отображения может быть в двух вариантах

```javascript
const items = ['Item 1', 'Item 2', 'Item 3']
// В таком случае получим радио-кнопки c одинаковыми `<label>` и `value`

const items = [
    {name: 'Item 1', value: 'val1'},
    {name: 'Item 2', value: 'val2'},
    {name: 'Item 3', value: 'val3'}
]
// В таком случае текс внутри `<label>` равен `name`
// а атрибут `value` равен `value`
```

@vue
<form-builder url="/api-url">
    <fb-radio-group name="equal" label="Equal option" :items="['Option 1', 'Option 2']"></fb-radio-group>
    <fb-radio-group name="different" label="Different option" :items="[{name: 'Option 1', value:'option_1'}, {name: 'Option 2', value:'option_2'}]"></fb-radio-group>
</form-builder>
@endvue


## Стилизация радио-кнопки

С помощью слота по-умолчанию можно стилизовать внешний вид кнопок

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

В слот передаются переменные:

| Название            | Тип                | Описание                         |
|---------------------|:------------------:|----------------------------------|
| **item**            | `Object`           | Текущий элемент массива `items`  |
| **checked**         | `Boolean`          | Отмечена ли данная кнопка        |
| **focused**         | `Boolean`          | Фокус находится на данной кнопке |