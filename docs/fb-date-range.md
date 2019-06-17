# The &lt;fb-date-range&gt; Component

A component for selecting a period of time by choosing start and end date (time is not included). For selecting a specific date and time, please use the [Date component](./fb-date.md) It can be located within the &lt;form-builder&gt; component or used with `v-model` directive and can be visualized as follows:

![fb-date-range](https://storage.googleapis.com/static.awes.io/docs/fb-date-range.gif)

The component uses [Tiny Date Range Picker](https://github.com/chrisdavies/tiny-date-picker) internally to render calendars

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* [Date](./fb-date.md)
* **Date range**
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
    <fb-date-range name="period"></fb-date>
</form-builder>
```
<div class="vue-example">
<form-builder url="http://httpbin.org/post" disabled-dialog>
    <fb-date-range name="period"></fb-date>
</form-builder>
</div>


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label-start**     | `String`           | `'Start date'`      | Text in the &lt;label&gt; element for 1st field   |
| **label-end**       | `String`           | `'End date'`        | Text in the &lt;label&gt; element for 2nd field   |
| **min**             | `String`, `Number`, `Object` | calculated according to **yearRange** prop and current date | Minimal selectable date |
| **max**             | `String`, `Number`, `Object` | calculated according to **yearRange** prop and current date | Maximal selectable date |
| **year-range**      | `Number`           | `4`                 | Max year offset back and forth from current day, if **min** or **max** is not provided |
| **day-offset**      | `Number`           | `1`                 | Set this to 0 for Sunday. 1 is for Monday         |
| **value-start**     | `String`           | `undefined`         | Selected start date                               |
| **value-end**       | `String`           | `undefined`         | Selected end date                                 |
| **format**          | `String`           | 'MM/DD/YYYY'        | Date format for input fields                      |
| **disabled**        | `Boolean`          | `false`             | Are the inputs disabled                           |
| **lang**            | `Object`           | see [lang object](#date-lang-object) | Language strings for current instance. Will be merged with defaults |

The **min** and **max** props could be an ISO date string, timestamp, or Date object - everything that [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) method accepts.

The **value** property could only be a date in ISO String format


## Usage examples

```html
<form-builder url="http://httpbin.org/post" disabled-dialog>

    <!-- setting min and max dates -->
    <fb-date-range name="range" min="2019-05-09" max="2019-06-20" value-start="2019-05-15" value-end="2019-06-06"></fb-date-range>

    <!-- disabling inputs -->
    <fb-date-range name="range-disabled" min="2019-05-09" max="2019-06-20" disabled></fb-date-range>

</form-builder>
```
<div class="vue-example">
    <form-builder url="http://httpbin.org/post" disabled-dialog>
        <fb-date-range name="range" min="2019-05-09" max="2019-06-20" value-start="2019-05-15" value-end="2019-06-06"></fb-date-range>
        <fb-date-range name="range-disabled" min="2019-05-09" max="2019-06-20" disabled></fb-date-range>
    </form-builder>
</div>


<h2 id="date-lang-object">Lang object</h2>

```javascript
AWES_CONFIG = {
    lang: {
        FORMS_DATEPICKER: {
            // here are the default values
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
            close: 'Close'
        }
    }
}
```