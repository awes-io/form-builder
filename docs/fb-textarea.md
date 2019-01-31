# Компонент &lt;fb-input&gt;

Компонент текстовой области. При заполнении текксто автоматически увеличивает высоту.

Может находиться только внутри &lt;form-builder&gt;

1. [Пример использования компонента](#fbt-example)
2. [Свойства компонента](#fbt-options)


## <a name="fbt-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-textarea name="first_name" label="Enter your name"></fb-textarea>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-textarea name="first_name" label="Enter your name"></fb-textarea>
</form-builder>
@endvue


## <a name="fbt-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **fixsize**         | `Boolean`          | `false`             | Отключить автоматическое изменение высоты         |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |
