import uiCalendar from '@awes-io/utilities/resources/vue/components/calendar.vue'
import uiCalendarHeader from '@awes-io/utilities/resources/vue/components/calendar-header.vue'
import uiCalendarMonths from '@awes-io/utilities/resources/vue/components/calendar-months.vue'
import uiCalendarYears from '@awes-io/utilities/resources/vue/components/calendar-years.vue'

export default {

    components: {
        uiCalendar,
        uiCalendarHeader,
        uiCalendarMonths,
        uiCalendarYears
    },

    props: {

        min: {
            type: [String, Number, Object]
        },

        max: {
            type: [String, Number, Object]
        },

        yearRange: {
            type: Number,
            default: 4
        },

        dayOffset: {
            type: Number,
            default: 1
        },

        format: {
            type: String,
            default: 'DD/MM/YYYY'
        },

        disabled: {
            type: [Boolean, Array],
            default: false
        },

        lang: Object
    },


    data() {
        return {
            showDate: this.$dayjs(),
            isOpened: false
        }
    },


    computed: {

        dayjsShowDate() {
            return this.$dayjs(this.showDate)
        },

        dayjsMin() {
            return this.min && this.$dayjs(this.min)
        },

        dayjsMax() {
            return this.max && this.$dayjs(this.max)
        },
 
        monthsDisabled() {
            if ( this.min || this.max ) {
                return Array.from(Array(12).keys()).filter( index => {

                    let _dayjsDate = this.dayjsShowDate.set('month', index)

                    return ! this._inRange(_dayjsDate, 'month')
                })
            }
        },

        years() {
            let _years = [ this.dayjsShowDate.year() ]

            for ( let i = 1, max = this.yearRange; i < max; i++ ) {

                let _minYear = this.dayjsShowDate.subtract(i, 'year')
                if ( this._inMinRange(_minYear, 'year') ) {
                    _years.unshift(_minYear.year())
                }

                let _maxYear = this.dayjsShowDate.add(i, 'year')
                if ( this._inMaxRange(_maxYear, 'year') ) {
                    _years.push(_maxYear.year())
                }
            }

            return _years
        },

        isDisabledArray() {
            return Array.isArray(this.disabled)
        },

        dayjsDisabledDates() {
            return this.isDisabledArray ?
                this.disabled.map(val => this.$dayjs(val)) :
                []
        },

        _lang() {
            let {
                months: monthsFull,
                days: weekdays,
                prevMonth,
                nextMonth
            } = this.$lang.FORMS_DATEPICKER

            return {
                monthsFull, weekdays, prevMonth, nextMonth
            }
        }
    },


    methods: {

        showPicker() {
            this.isOpened = true
        },

        hidePicker() {
            this.isOpened = false
        },

        _inMinRange(dayjsDate, unit) {
            let min = this.dayjsMin
            if ( min ) {
                return dayjsDate.isSame(min, unit) ||
                    dayjsDate.isAfter(min, unit)
            } else {
                return true
            }
        },

        _inMaxRange(dayjsDate, unit) {
            let max = this.dayjsMax
            if ( max ) {
                return dayjsDate.isSame(max, unit) ||
                    dayjsDate.isBefore(max, unit)
            } else {
                return true
            }
        },

        _inRange(dayjsDate, unit) {
            return this._inMinRange(dayjsDate, unit) && this._inMaxRange(dayjsDate, unit) 
        },

        _isDisabled(date) {

            if ( this.disabled && ! this.isDisabledArray ) {
                return true
            }

            let dayjsDate = this.$dayjs(date)

            if ( this.isDisabledArray && this.disabled.some( djs => djs.isSame(dayjsDate, 'day') ) ) {
                return true
            }

            if ( ! this._inRange(dayjsDate, 'day') ) {
                return true
            }

            return false
        },

        _focusoutHandler($event) {

            clearTimeout(this.__showPicker);

            this.__showPicker = setTimeout(() => {
                if ( !this.$el.contains(document.activeElement) ) {
                    this.hidePicker()
                }
            }, 10)
        }
    },


    created() {

        // check pre-set value
        if ( this.date ) {

            let _showDate = this.$dayjs(this.date)

            if (_showDate.isValid() ) {
                this.showDate = _showDate
            }
        }

        // check limits
        if ( ! this._inRange(this.showDate) ) {
            this.showDate = this.dayjsMin || this.dayjsMax
        }
    }
}