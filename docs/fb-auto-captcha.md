# Компонент &lt;fb-auto-captcha&gt;

Компонент recaptcha. Может находиться только внутри &lt;form-builder&gt; и использует компонент [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha)

По-умолчанию поле скрыто, если не передано свойство `show`. Если в ответе с сервера есть ошибка для поля с идентификатором компонента, то поле показывается (отрисовывает recaptcha)

![fb-auto-catptcha](https://storage.googleapis.com/static.awes.io/docs/fb-auto-captcha.gif)


## Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-auto-captcha :show="true"></fb-auto-captcha>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-auto-captcha :show="true"></fb-auto-captcha>
</form-builder>
@endvue


## Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `'g-recaptcha-response'` | Идентификатор поля в объекте данных          |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **show**            | `Boolean`          | `false`             | Показать recaptcha                                |
