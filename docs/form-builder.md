# Компонент &lt;form-builder&gt;

Компонент динамических форм. Регистрирует хранилище `Vuex` в переменной `Vue.prototype.$awesForms`. Внешние данные, которые указываются через параметр `store-data` берутся из общего хранилища `AWES._store`

![form-builder](https://storage.googleapis.com/static.awes.io/docs/form-builder.gif)


## Пример использования компонента

```html
<form-builder url="/api-url">
    <!-- поля формы и другие компоненты -->
</form-builder>
```

## Свойства компонента

| Название            | Тип       | По-умолчанию        | Описание                                          |
|---------------------|:---------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`  | form-builder-${uid} | Идентификатор, для вызова и прослушивания событий |
| **url(*)**          | `String`  | `undefined`         | Обязательное поле. Адрес, куда отправлять форму   |
| **method**          | `String`  | `'post'`            | Метод отправки данных                             |
| **default**         | `Object`  | `null`              | Объект с данными                                  |
| **store-data**      | `String`  | `undefined`         | Название поля с данными в `AWES._store`           |
| **disabled-dialog** | `Boolean` | `false`             | Отключить проверку закрытия окна                  |
| **auto-submit**     | `Boolean` | `false`             | Автоматическая отправка формы                     |
| **cancelbtn**       | `Boolean` | `false`             | Показать кнопку "отмена"                          |
| **send-text**       | `String`  | `'Send'`            | Текст в кнопке "отправить"                        |
| **cancel-text**     | `String`  | `'Cancel'`          | Текст в кнопке "отмена"                           |
| **loading-text**    | `String`  | `'Loading...'`      | Текст в кнопке "отправить" при отправке           |


## События компонента

| Название                     | Тип       | Описание                                        |
|------------------------------|:---------:|-------------------------------------------------|
| **form-builder:before-send** | *AWES*    | Вызывается в шине событий перед отправкой формы |
| **send**                     | *Vue*     | Если есть обработчик для этого события, то форма не отправляется, а данные передаются в обработчик |
| **sended**                   | *Vue*     | Возникает после отправки формы, передаёт в обработчик данные с сервера |
| **cancel**                   | *Vue*     | Нажата кнопка "отмена"                          |


## Языковые переменные

```javascript
{
    FORMS_SEND: 'Send',
    FORMS_CANCEL: 'Cancel',
    FORMS_LOADING: 'Loading...',
    FORMS_CONFIRM: 'Are you shure? All not submitted data will be erased...',
    FORMS_MULTIBLOCK_ADD: 'add',
    FORMS_SELECT_LABEL: 'Select a value',
    FORMS_SELECT_PLACEHOLDER: 'Pick a value',
    FORMS_UPLOAD_DROP: 'Drag and drop file or',
    FORMS_UPLOAD_ADD: 'Add file',
    FORMS_UPLOAD_FORMAT: 'File formats only',
    FORMS_UPLOAD_SIZE: 'Size of files no more then',
    FORMS_UPLOAD_REMOVE: 'Remove file',
    FORMS_UPLOADER_EXTENSION_ERROR: 'File %s has wrong extension',
    FORMS_UPLOADER_SIZE_ERROR: 'File %s is too big',
    FORMS_EDITOR_VISUAL: 'Visual',
    FORMS_EDITOR_CODE: 'Code'
}
```