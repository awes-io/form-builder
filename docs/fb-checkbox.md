# Компонент &lt;fb-checkbox&gt;

Может находиться только внутри &lt;form-builder&gt;

1. [Пример использования компонента](#fbcb-example)
2. [Свойства компонента](#fbcb-options)


## <a name="fbcb-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-checkbox name="agree" label="Agree with cookie policy"></fb-checkbox>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-checkbox name="agree" label="Agree with cookie policy"></fb-checkbox>
</form-builder>
@endvue


## <a name="fbcb-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **padding**         | `String`           | `undefined`         | Добавляет класс `.grid__cell_padding` (дополнительный отступ слева) |
| **theme**           | `String`           | `undefined`         | Добавляет класс `.checkbox_{theme}` (для стилизации) |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |
