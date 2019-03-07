# The &lt;fb-company-slug&gt; Component

It is a component for converting text into URL (It uses the [urlify](https://github.com/Gottox/node-urlify) library).

It can be located within the &lt;form-builder&gt; component, or can be used with `v-model` directive. You may provide a string from other form-builder text field to transform to subdomain with an `input` property


This component visually looks like:

![fb-company-slug](https://static.awes.io/docs/fb-company-slug.gif)

## Components
* [General information](./form-builder.md)
* [Auto Captcha](./auto-captcha.md)
* [Checkbox](./checkbox.md)
* **Company Slug**
* [Editor](./editor.md)
* [Input](./input.md)
* [Multi Block](./multi-block.md)
* [Phone](./phone.md)
* [Radio Group](./radio-group.md)
* [Select](./select.md)
* [Slider](./slider.md)
* [Switcher](./switcher.md)
* [Textarea](./textarea.md)
* [Uploader](./uploader.md)
* [Validation Code](./code.md)

## <a name="fbcs-example"></a> Example of using the component

```html
<form-builder url="/api-url">
    <template slot-scope="form">
        <fb-input name="company" label="Enter company name"></fb-input>
        <fb-company-slug name="slug" input="form.fields['company']"></fb-company-slug>
    </template>
</form-builder>
```
@vue
<form-builder url="/api-url">
    <template slot-scope="form">
        <fb-input name="company" label="Enter company name"></fb-input>
        <fb-company-slug name="slug" input="form.fields['company']"></fb-company-slug>
    </template>
</form-builder>
@endvue


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **domain**          | `String`           | `'awescrm.de'`      | Main domain                                       |
| **input**           | `String`           | `undefined`         | String to transofm into subdomain                 |
| **maxlength**       | `Number`           | `32`                | Maximum length of the subdomain                   |
| **enter-skip**      | `Boolean`          | `false`             | Skip field when switching by the <kbd>enter</kbd> button |
| **focus**           | `Boolean`          | `false`             | Set focus on this field when loading a page       |


## Component features

### Component configuration

To override the default settings, please override them in `AWES_CONFIG`.

```javascript
// Here are the default settings
const AWES_CONFIG = {
    companySlug: {
        domain: 'awescrm.de',
        length: 32,
        // Settings of the urlify library, read more here https://github.com/Gottox/node-urlify#browser-1
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
