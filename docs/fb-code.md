# Компонент &lt;fb-code&gt;

Компеннет поля для ввода кода. Может находиться только внутри &lt;form-builder&gt;

![fb-code](https://storage.googleapis.com/static.awes.io/docs/fb-code.gif)

## Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-code name="code"></fb-code>
</form-builder>
```

@vue
<form-builder url="/api-url">
    <fb-code name="code"></fb-code>
</form-builder>
@endvue


## Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **length**          | `Number`           | `6`                 | Количество цифр в коде                            |
| **auto-submit**     | `Boolean`          | `true`              | Отправлять форму, если код введен                 |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |
