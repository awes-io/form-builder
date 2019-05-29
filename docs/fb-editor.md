# The &lt;fb-editor&gt; Component

It is a component for writing and changing code. You paste your code in the window and can see the result and other changes in real time, as in the screenshot below. 

![fb-editor](https://static.awes.io/docs/fb-editor.png)

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* [Date](./fb-date.md)
* [Date range](./fb-date-range.md)
* **Editor**
* [Input](./fb-input.md)
* [Multi block](./fb-multi-block.md)
* [Phone](./fb-phone.md)
* [Radio Group](./fb-radio-group.md)
* [Select](./fb-select.md)
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* [Textarea](./fb-textarea.md)
* [Uploader](./fb-uploader.md)

## Default configuration

You can globally add options for the text editor in the `AWES_CONFIG.formBuilder.fbEditor` field.

[Option list](https://www.tiny.cloud/docs/configure/)

### Example:

```javascript
const AWES_CONFIG = {
    formBuilder: {
        fbEditor: {
            content_css: ['/path-to.css'] // adds <link rel="stylesheet" href="/path-to.css"/> in the editor’s iframe
        }
    }
}
```
