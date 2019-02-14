# Компонент &lt;fb-uploader&gt;

Компонент для загрузки файлов. Может находиться только внутри &lt;form-builder&gt;

Загружает файлы по указанному свойству `url` и при отправке формы отсылает пути к загруженным файлам

![fb-uploader](https://storage.googleapis.com/static.awes.io/docs/fb-uploader.gif)

## Пример использования компонента

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


## Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **url(*)**          | `String`           | `undefined`         | Адрес для загрузки файлов                         |
| **format**          | `String`           | `undefined`         | Допустимые расширения через запятую               |
| **size**            | `Number`, `String` | `undefined`         | Максимальный размер файла в мегабайтах            |


## Особенности компонента

Для корректной работы примера выше, после загрузки файла `test-file.txt` по адресу `/upload-files` должен приходить ответ вида

```json
{
    "meta": {
        "path": "/tmp/da8fhd7gh54da8fh74f7f747gh54df7f/test-file.txt"
    }
}
```

Этот путь и отправится в поле формы `files`