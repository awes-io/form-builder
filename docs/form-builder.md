# The &lt;form-builder&gt; Component

It is a VueJS component of dynamic forms. It registers the `Vuex` store-modlue in the `this.$store.forms` variable. The
external data which are specified via the `store-data` parameter are extracted from the `$store` general storage. As you can see from the example below, this component allows creating a form with different input fields, checkboxes, and buttons as well as validating it before submitting.

## Components
* **Form Builder**
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
* [Select](./fb-select.md)
* [Slider](./fb-slider.md)
* [Switcher](./fb-switcher.md)
* [Textarea](./fb-textarea.md)
* [Uploader](./fb-uploader.md)

## Example

```html
<form-builder url="/api-url">
    <!-- form fields and other components -->
</form-builder>
```

## Component properties

| Name                | Type      | Default             | Description                                       |
|---------------------|:---------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`  | form-builder-${uid} | Identifier for calling and listening to the events |
| **url(*)**          | `String`  | `undefined`         | Required field. Address where the form should be sent. Acceps a template, for example `/api/update/{records[0].id}`, will search for value in current form default data |
| **method**          | `String`  | `'post'`            | Data submission method                            |
| **default**         | `Object`  | `null`              | Object with  data                                 |
| **store-data**      | `String`  | `undefined`         | Name of the data field in global `$store`           |
| **disabled-dialog** | `Boolean` | `false`             | Disable window closing check                      |
| **auto-submit**     | `Boolean` | `false`             | Automatic form submission                         |
| **debounce**        | `Number`, `String`  | `400`     | Timeout before sending data to server on user input  |
| **send-text**       | `String`  | `'Send'`            | Text in the “Send” button                         |
| **cancel-text**     | `String`  | `'Cancel'`          | Text in the “Cancel” button                       |
| **loading-text**    | `String`  | `'Loading...'`      | Text in the “Send” button while sending           |


## Component events

| Name                         | Type      | Description                                     |
|------------------------------|:---------:|-------------------------------------------------|
| **form-builder:before-send** | *AWES*    | It is called in the event bus before submitting the form |
| **send**                     | *Vue*     | If there is a handler for this event, the form will not be sent and the data will be transferred to the handler |
| **sended**                   | *Vue*     | It appears after sending the form and transfers data from the server to the handler |
| **cancel**                   | *Vue*     | The “Cancel” button is pressed. If there is no handler for this event, cancel button will not be shown |


## Language variables

```javascript
{
    FORMS_SEND: 'Send',
    FORMS_CANCEL: 'Cancel',
    FORMS_LOADING: 'Loading...',
    FORMS_CONFIRM: 'Are you shure? All not submitted data will be erased...',
    FORMS_MULTIBLOCK_ADD: '+ add',
    FORMS_SELECT_LABEL: 'Select a value',
    FORMS_SELECT_PLACEHOLDER: 'Pick a value',
    FORMS_SELECT_AJAX_PLACEHOLDER: 'Start typing...',
    FORMS_SELECT_EMPTY: 'Nothing found',
    FORMS_SELECT_ADD_TAG: 'Add new value',
    FORMS_UPLOAD_DROP: 'Drag and drop file or',
    FORMS_UPLOAD_ADD: 'Add file',
    FORMS_UPLOAD_FORMAT: 'File formats only',
    FORMS_UPLOAD_SIZE: 'Size of files no more then',
    FORMS_UPLOAD_REMOVE: 'Remove file',
    FORMS_UPLOAD_LOADING: 'Uploading',
    FORMS_UPLOAD_DONE: 'Finished',
    FORMS_UPLOAD_ERROR: 'Error',
    FORMS_UPLOADER_EXTENSION_ERROR: 'File %s has wrong extension',
    FORMS_UPLOADER_SIZE_ERROR: 'File %s is too big',
    FORMS_EDITOR_VISUAL: 'Visual',
    FORMS_EDITOR_CODE: 'Code',
    FORMS_DATERANGE_START_LABEL: 'Start date',
    FORMS_DATERANGE_END_LABEL: 'End date',
    FORMS_DATEPICKER: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thirsday', 'Friday', 'Saturday'],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ],
        today: 'Today',
        clear: 'Clear',
        close: 'Close'
    }
}
```
