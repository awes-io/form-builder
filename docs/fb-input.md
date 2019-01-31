# Компонент &lt;fb-input&gt;

Компонент текстового поля. Может находиться только внутри &lt;form-builder&gt;

1. [Пример использования компонента](#fbi-example)
2. [Свойства компонента](#fbi-options)
3. [Особенности компонента](#fbi-features)


## <a name="fbi-example"></a> Пример использования компонента

```html
<form-builder url="/api-url">
    <fb-input name="first_name" label="Enter your name"></fb-input>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-input name="first_name" label="Enter your name"></fb-input>
</form-builder>
@endvue


## <a name="fbi-options"></a> Свойства компонента

| Название            | Тип                | По-умолчанию        | Описание                                          |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name(*)**         | `String`           | `undefined`         | Идентификатор поля в объекте данных               |
| **id**              | `Number`           | `undefined`         | Порядковый номер внутри &lt;fb-multi-block&gt;    |
| **cell**            | `String`, `Number` | `undefined`         | Количество колонок в ряду. Может быть 2 или 3     |
| **label**           | `String`           | `''`                | Текст в элементе &lt;label&gt;                    |
| **mask**            | `String`           | `undefined`         | Маска для директивы `v-mask`, подробнее [тут](https://github.com/vuejs-tips/vue-the-mask#tokens) |
| **enter-skip**      | `Boolean`          | `false`             | Пропускать поле при переключении по <kbd>enter</kbd> |
| **focus**           | `Boolean`          | `false`             | Установить фокус в это поле при загрузке страницы |


## <a name="fbi-features"></a> Особенности компонента

### HTML-атрибуты текстового поля

Страндартные атрибуты, кроме `class` и `style` передаются в элемент `&lt;input&gt;`

```html
<form-builder url="/api-url">
    <fb-input
    name="email"
    label="Enter your email"
    type="email"
    class="my-class"
    disabled></fb-input>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <fb-input name="email" label="Enter your email" type="email" class="my-class" disabled></fb-input>
</form-builder>
@endvue

#### type="checkbox" и type="radio"

Не стоит использовать &lt;fb-input type="checkbox"&gt; или &lt;fb-input type="radio"&gt;. Для этих типов есть отдельные компоненты [&lt;fb-checkbox&gt;](./fb-checkbox.md) и [&lt;fb-radio&gt;](./fb-radio.md)

#### type="password"

Если передается `type="password"`, то в поле автоматически появляется кнопка скрыть/показать пароль

@vue
<form-builder url="/api-url">
    <fb-input name="password" label="Enter your password" type="password"></fb-input>
</form-builder>
@endvue
