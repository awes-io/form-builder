# The &lt;fb-editor&gt; Component

It is a component for writing and changing code. You paste your code in the window and can see the result and other changes in real time, as in the screenshot below. 

![fb-editor](https://static.awes.io/docs/fb-editor.png)

## Components
* [General information](./form-builder.md)
* [Auto Captcha](./auto-captcha.md)
* [Checkbox](./checkbox.md)
* [Company Slug](./company-slug.md)
* **Editor**
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
