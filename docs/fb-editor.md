# The &lt;fb-editor&gt; Component

It is a component for writing and changing code. You paste your code in the window and can see the result and other changes in real time, as in the screenshot below. 

![fb-editor](https://storage.googleapis.com/static.awes.io/docs/fb-editor.png)

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