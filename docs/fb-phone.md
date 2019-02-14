# Компонент &lt;fb-phone&gt;

Внутри используется компонент [vue-tel-input](https://github.com/EducationLink/vue-tel-input)

Может находиться только внутри &lt;form-builder&gt;

![fb-phone](https://storage.googleapis.com/static.awes.io/docs/fb-phone.gif)


## Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-phone name="phone" label="Telephone"></fb-phone>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-phone name="phone" label="Telephone"></fb-phone>
</form-builder>
@endvue


## Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |
