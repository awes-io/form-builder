# Компонент &lt;fb-switcher&gt;

Переключатель 0/1 на основе `input[type="range"]`. Может находиться только внутри &lt;form-builder&gt;

1. [Пример использования компонента](#fbsw-example)
2. [Свойства компонента](#fbsw-options)


## <a name="fbsw-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-switcher name="active" label="Active"></fb-switcher>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-switcher name="active" label="Active"></fb-switcher>
</form-builder>
@endvue


## <a name="fbsw-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **padding**         | `String`           | `undefined`         | Добавляет класс `.grid__cell_padding` (дополнительный отступ слева) |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |
