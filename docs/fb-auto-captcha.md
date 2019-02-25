# The &lt;fb-auto-captcha&gt; Component

The Recaptcha component. It can be located only within the &lt;form-builder&gt; component and uses the [vue-recaptcha](https://github.com/DanSnow/vue-recaptcha) component.

By default, the field is hidden if the `show`property is not passed. If the server response contains an error for the field with component identifier, the field will be displayed (that is, the recaptcha will appear). In the  visual presentation below, you can watch this component in action.

![fb-auto-catptcha](https://storage.googleapis.com/static.awes.io/docs/fb-auto-captcha.gif)


## Example of using the component

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


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `'g-recaptcha-response'` | Field identifier in the data object          |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component   |
| **cell**            | `String`, `Number` | `undefined`         | Number of columns in the row. It can be 2 or 3    |
| **show**            | `Boolean`          | `false`             | Show recaptcha                                    |
