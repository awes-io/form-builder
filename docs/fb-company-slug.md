# Компонент &lt;fb-input&gt;

Компонент для преобразования текста в url (использует библиотеку [urlify](https://github.com/Gottox/node-urlify))

Может находиться только внутри &lt;form-builder&gt; и требует наличие &lt;fb-input&gt; из которого преобразуется субдомен.

1. [Пример использования компонента](#fbcs-example)
2. [Свойства компонента](#fbcs-options)
3. [Особенности компонента](#fbcs-features)


## <a name="fbcs-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-input name="company" label="Enter company name"></fb-input>
    <fb-company-slug name="slug" input="company"></fb-company-slug>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-input name="company" label="Enter company name"></fb-input>
    <fb-company-slug name="slug" input="company"></fb-company-slug>
</form-builder>
@endvue


## <a name="fbcs-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **domain**          | `String`           | `'awescrm.de'`      | Основной домен                                    |
| **input(*)**        | `String`           | `undefined`         | Идентификатор поля, из которого строится субдомен |
| **max-length**      | `Number`           | `32`                | Mаксимальная длина субдомена                      |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |


## <a name="fbcs-features"></a> Особенности компонента

### Конфигурация компонента

Для переопределения настроек по-умолчанию необходимо переопределить их в `AWES_CONFIG`

```javascript
// приведены настройки по-умолчанию
const AWES_CONFIG = {
    companySlug: {
        domain: 'awescrm.de',
        length: 32,
        // настройки библиотеки urlify, подробнее тут https://github.com/Gottox/node-urlify#browser-1
        ulrifyOptions: {
            spaces: '-',
            toLower: true,
            trim: true,
            addEToUmlauts: true,
            nonPrintable: '',
            failureOutput: ''
        }
    }
}
```