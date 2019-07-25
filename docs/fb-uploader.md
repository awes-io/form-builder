# The &lt;fb-uploader&gt; Component

This component is intended for uploading files. It can be located within the &lt;form-builder&gt; component, then it requires `name` property, or it standalone with `v-model` Vue directive.

It uploads files according to the specified `url` property and sends paths to the uploaded files when submitting a form. Below, you can see the process of uploading files by using the &lt;fb-uploader&gt; component:

![fb-uploader](https://static.awes.io/docs/fb-uploader.gif)

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* [Date](./fb-date.md)
* [Date range](./fb-date-range.md)
* [Editor](./fb-editor.md)
* [Input](./fb-input.md)
* [Multi block](./fb-multi-block.md)
* [Phone](./fb-phone.md)
* [Radio Group](./fb-radio-group.md)
* [Seleсt](./fb-select.md)
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* [Textarea](./fb-textarea.md)
* Uploader

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
| **size**            | `Number`, `String` | `2`                 | Maximum file size in megabytes                    |
| **single**          | `Boolean`          | `false`             | Only one file allowed. Uploading of the next file will erase previous |
| **date-format**     | `String`           | `MM.DD.YYYY`        | Uploaded date format                              |


## Component events

| Name              | Data (type)            | Description                     |
|-------------------|:----------------------:|---------------------------------|
| **added**         | file (File)            | Fires after file upload started |
| **uploaded**      | file (File)            | Fires after file is uploaded    |
| **error**         | Error message (String) | Fires is error is occurred      |


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
