<template>
    <div class="ui-calendar-header">
        <time
            class="ui-calendar-header__caption"
            :datetime="dayjsDate.format('YYYY-MM')"
        >
            <slot :dayjsDate="dayjsDate">

                <!-- month -->
                <button
                    class="ui-calendar-header__button is-month"
                    data-emit="setMonth"
                    type="button"
                >
                    {{ $lang.FORMS_DATEPICKER.months[dayjsDate.month()] }}
                </button>

                <!-- year -->
                <button
                    class="ui-calendar-header__button is-year"
                    data-emit="setYear"
                    type="button"
                >
                    {{ dayjsDate.year() }}
                </button>
            </slot>
        </time>
        <slot name="buttons">
            <button
                class="ui-calendar-header__button is-prev"
                :disabled="prevDisabled"
                type="button"
                data-emit="prevMonth"
            >
                previous month
            </button>
            <button
                class="ui-calendar-header__button is-next"
                :disabled="nextDisabled"
                type="button"
                data-emit="nextMonth"
            >
                next month
            </button>
        </slot>
    </div>
</template>


<script>
export default {

    name: 'UiCalendarHeader',

    props: {

        date: {
            type: [String, Number, Date],
            required: true,
            validator(val) {
                return new Date(val).getTime()
            }
        },

        min: [String, Number, Date],

        max: [String, Number, Date],

        yearRange: {
            type: Number,
            default: 4
        }
    },

    computed: {

        dayjsDate() {
            return this.$dayjs(this.date)
        },

        dayjsMin() {
            return this.min && this.$dayjs(this.min)
        },

        dayjsMax() {
            return this.max && this.$dayjs(this.max)
        },

        prevButtonDisabled() {
            return !this._inMinRange(this.dayjsDate.subtract(1, 'month'), 'month')
        },

        nextButtonDisabled() {
            return !this._inMaxRange(this.dayjsDate.add(1, 'month'), 'month')
        },

        monthsNames() {
            return this.$lang.FORMS_DATEPICKER.months
        },

        months() {
            return this.monthsNames.map((name, index) => {

                let _dayjsDate = this.dayjsDate.month(index)
                let _inMinRange = this._inMinRange(_dayjsDate, 'month')
                let _inMaxRange = this._inMaxRange(_dayjsDate, 'month')

                return {
                    name,
                    index,
                    disabled: !(_inMinRange && _inMaxRange)
                }
            })
        },

        years() {
            let _years = [ this.dayjsDate.year() ]

            for ( let i = 1, max = this.yearRange; i < max; i++ ) {

                let _minYear = this.dayjsDate.subtract(i, 'year')
                if ( this._inMinRange(_minYear, 'year') ) {
                    _years.unshift(_minYear.year())
                }

                let _maxYear = this.dayjsDate.add(i, 'year')
                if ( this._inMaxRange(_maxYear, 'year') ) {
                    _years.push(_maxYear.year())
                }
            }

            return _years.length > 1 && _years
        }
    },

    methods: {

        setMonth(monthIndex) {
            this.$emit('input', this.dayjsDate.month(monthIndex))
        },

        setYear(year) {
            let _dayjsDate = this.dayjsDate.year(year)
            if ( ! this._inMinRange(_dayjsDate) ) {
                _dayjsDate = this.dayjsMin
            } else if ( ! this._inMaxRange(_dayjsDate) ) {
                _dayjsDate = this.dayjsMax
            }
            this.$emit('input', _dayjsDate)
        },

        addMonth() {
            this.$emit('input', this.dayjsDate.add(1, 'month'))
        },

        subtractMonth() {
            this.$emit('input', this.dayjsDate.subtract(1, 'month'))
        },

        _inMinRange(dayjsDate, unit) {
            let min = this.dayjsMin
            return min && (dayjsDate.isSame(min, unit) || dayjsDate.isAfter(min, unit))
        },

        _inMaxRange(dayjsDate, unit) {
            let max = this.dayjsMax
            return max && (dayjsDate.isSame(max, unit) || dayjsDate.isBefore(max, unit))
        }
    }
}
</script>