# Компонент &lt;fb-slider&gt;

Компонент ползунок. Может находиться только внутри &lt;form-builder&gt;

1. [Пример использования компонента](#fbsl-example)
2. [Свойства компонента](#fbsl-options)


## <a name="fbsl-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-slider name="opacity" label="Choose opacity level"></fb-slider>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-slider name="opacity" label="Choose opacity level"></fb-slider>
</form-builder>
@endvue


## <a name="fbsl-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **min**             | `Number`           | `0`                 | Минимальное значение                              |
| **max**             | `Number`           | `100`               | Максимальное значение                             |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |
