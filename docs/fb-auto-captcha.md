# Компонент &lt;fb-input&gt;

Компонент recaptcha. Может находиться только внутри &lt;form-builder&gt; и использует компонент [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha)

По-умолчанию поле скрыто, если не передано свойство `show`. Если в ответе с сервера есть ошибка для поля с идентификатором компонента, то поле показывается (отрисовывает recaptcha)

1. [Пример использования компонента](#fbrc-example)
2. [Свойства компонента](#fbrc-options)


## <a name="fbrc-example"></a> Пример использования компонента

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


## <a name="fbrc-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `'g-recaptcha-response'` | Идентификатор поля в объекте данных          |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **show**            | `Boolean`          | `false`             | Показать recaptcha                                |
