# Компонент &lt;fb-uploader&gt;

Компонент для загрузки файлов. Может находиться только внутри &lt;form-builder&gt;

Загружает файлы по указанному свойству `url` и при отправке формы отсылает пути к загруженным файлам

1. [Пример использования компонента](#fbup-example)
2. [Свойства компонента](#fbup-options)
3. [Особенности компонента](#fbup-features)


## <a name="fbup-example"></a> Пример использования компонента

```html
<form-builder url="/form-url">
    <fb-uploader name="files" url="/upload-files"></fb-uploader>
</form-builder>
```
@vue
<form-builder url="/form-url">
    <fb-uploader name="files" url="/upload-files"></fb-uploader>
</form-builder>
@endvue


## <a name="fbup-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **url(*)**          | `String`           | `undefined`         | Адрес для загрузки файлов                         |
| **format**          | `String`           | `undefined`         | Допустимые расширения через запятую               |
| **size**            | `Number`, `String` | `undefined`         | Максимальный размер файла в мегабайтах            |


## <a name="fbup-features"></a> Особенности компонента

Для корректной работы примера выше, после загрузки файла `test-file.txt` по адресу `/upload-files` должен приходить ответ вида

```json
{
    "meta": {
        "path": "/tmp/da8fhd7gh54da8fh74f7f747gh54df7f/test-file.txt"
    }
}
```

Этот путь и отправится в поле формы `files`