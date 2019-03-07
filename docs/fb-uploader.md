# The &lt;fb-uploader&gt; Component

This component is intended for uploading files. It can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it standalone with `v-model` Vue directive.

It uploads files according to the specified `url` property and sends paths to the uploaded files when submitting a form. Below, you can see the process of uploading files by using the &lt;fb-uploader&gt; component:

![fb-uploader](https://static.awes.io/docs/fb-uploader.gif)

## Components
* [General information](./form-builder.md)
* [Auto Captcha](./auto-captcha.md)
* [Checkbox](./checkbox.md)
* [Company Slug](./company-slug.md)
* [Editor](./editor.md)
* [Input](./input.md)
* [Multi Block](./multi-block.md)
* [Phone](./phone.md)
* [Radio Group](./radio-group.md)
* [Select](./select.md)
* [Slider](./slider.md)
* [Switcher](./switcher.md)
* [Textarea](./textarea.md)
* **Uploader**
* [Validation Code](./code.md)

## Example

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


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **url(*)**          | `String`           | `undefined`         | Address for uploading files                       |
| **format**          | `String`           | `undefined`         | Valid extensions separated by a comma             |
| **size**            | `Number`, `String` | `undefined`         | Maximum file size in megabytes                    |


## Component features

The example above requires the response of the following type after loading the `test-file.txt` file to `/upload-files` in order to run correctly:

```json
{
    "meta": {
        "path": "/tmp/da8fhd7gh54da8fh74f7f747gh54df7f/test-file.txt"
    }
}
```

This path will be sent to the field of the `files` form.
