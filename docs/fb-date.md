# The &lt;fb-date&gt; Component

It is a date and time field component. For selecting a period, please use the [Date range component](./fb-date-range.md) It can be located within the &lt;form-builder&gt; component or used with `v-model` directive and can be visualized as follows:

![fb-date](https://storage.googleapis.com/static.awes.io/docs/fb-date.gif)

The component uses [Tiny Date Picker](https://github.com/chrisdavies/tiny-date-picker) internally to render calendar

## Components
* [Form Builder](./form-builder.md)
* [Auto Captcha](./fb-auto-captcha.md)
* [Checkbox](./fb-checkbox.md)
* [Code](./fb-code.md)
* [Company Slug](./fb-company-slug.md)
* **Date**
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
    <fb-date name="date" label="Pick a date"></fb-date>
</form-builder>
```
<div class="vue-example">
<form-builder url="http://httpbin.org/post" disabled-dialog>
    <fb-date name="date" label="Pick a date"></fb-date>
</form-builder>
</div>


## Component properties

| Name                | Type               | Default             | Description                                       |
|---------------------|:------------------:|:-------------------:|---------------------------------------------------|
| **name**            | `String`           | `undefined`         | Field identifier in the data object               |
| **id**              | `Number`           | `undefined`         | Sequence number within the &lt;fb-multi-block&gt; component    |
| **label**           | `String`           | `''`                | Text in the &lt;label&gt; element                 |
| **min**             | `String`, `Number`, `Object` | calculated according to **yearRange** prop and current date | Minimal selectable date |
| **max**             | `String`, `Number`, `Object` | calculated according to **yearRange** prop and current date | Maximal selectable date |
| **year-range**      | `Number`           | `4`                 | Max year offset back and forth from current day, if **min** or **max** is not provided |
| **day-offset**      | `Number`           | `1`                 | Set this to 0 for Sunday. 1 is for Monday         |
| **value**           | `String`           | `undefined`         | Selected date (only stringified Date object)      |
| **time-range**      | `Boolean`, `Object`| `true`              | See [time range](#time-range-props) props         |
| **format**          | `String`           | 'MM/DD/YYYY' or 'MM/DD/YYYY HH:mm' with time range | Date format for input field |
| **disabled**        | `Boolean`, `Array` | `false`             | `Boolean` to disable whole field and `Array` of dates to disable specific date |
| **lang**            | `Object`           | see [lang object](#date-lang-object) | Language strings for current instance. Will be merged with defaults |

Every date property, i. e. **min**, **max**, and items in **disabled** array could be an ISO date string, timestamp or Date object - everything that [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse) method accepts.

The **value** property could only be a date in ISO String format

<h3 id="time-range-props">Time range propertires</h3>

| Name         | Type               | Default     | Description                                                       |
|--------------|:------------------:|:-----------:|-------------------------------------------------------------------|
| **min**      | `String`           | '00:00'     | Minimal time to start the range from, 24 format only              |
| **max**      | `String`           | `undefined` | Max value in 24h format, including itself, not more than '23:59'  |
| **step**     | `String`, `Number` | 30          | Range step in minutes                                             |
| **disabled** | `Boolean`, `Array` | false       | `true` to not render time range, or `Array` of specific intervals |

Every time value is a 24-hour formatted `String`.

> Don't forget leading zeros, `'5:00'` is incorrect. Correct one is `'05:00'`

To set time, it should be passed to the **value** prop of `fb-`


## Usage examples

Picking specific interval

```html
<form-builder url="http://httpbin.org/post">

    <!-- setting min and max dates -->
    <fb-date name="date-minmax" label="Pick a date" min="2019-05-09" max="2019-06-20" value="2019-05-20"></fb-date>

    <!-- disabling specific dates -->
    <fb-date name="date-disabled" label="Pick a date" min="2019-05-09" max="2019-06-20" value="2019-05-20" :disabled="['2019-05-22', '2019-05-23']"></fb-date>

</form-builder>
```
<div class="vue-example">
    <form-builder url="http://httpbin.org/post" disabled-dialog>
        <fb-date name="date1" label="Pick a date" min="2019-05-09" max="2019-06-20" value="2019-05-20"></fb-date>
        <fb-date name="date2" label="Pick a date" min="2019-05-09" max="2019-06-20" value="2019-05-20" :disabled="['2019-05-22', '2019-05-23']"></fb-date>
    </form-builder>
</div>

Configuring time range

```html
<form-builder url="http://httpbin.org/post">

    <!-- not rendered entirely -->
    <fb-date name="no-time" label="No time" :time-range="false"></fb-date>

    <!-- configuring time range -->
    <fb-date name="time-minmax" label="Configured time range" :time-range="{min: '09:00', max: '10:20', step: 10}"></fb-date>

    <!-- setting specific time buttons to disabled state -->
    <fb-date name="time-disabled" label="Disabled time" :time-range="{ disabled: ['09:30', '10:00'] }"></fb-date>

    <!-- setting time on current date (only stringified date is accepted) -->
    <fb-date name="time-selected" label="Selected time" :value="new Date(new Date().setHours(9, 30)).toUTCString()" :time-range="{min: '08:00'}"></fb-date>

</form-builder>
```

<div class="vue-example">
    <form-builder url="http://httpbin.org/post" disabled-dialog>
        <fb-date name="no-time" label="No time" :time-range="false"></fb-date>
        <fb-date name="time-minmax" label="Configured time range" :time-range="{min: '09:00', max: '10:20', step: 10}"></fb-date>
        <fb-date name="time-disabled" label="Disabled time" :time-range="{ disabled: ['09:30', '10:00'] }"></fb-date>
        <fb-date name="time-selected" label="Selected time" :value="new Date(new Date().setHours(9, 30)).toUTCString()" :time-range="{min: '08:00'}"></fb-date>
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