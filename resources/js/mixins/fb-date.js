export default {

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
            default: 'MM/DD/YYYY'
        },

        disabled: {
            type: [Boolean, Array],
            default: false
        },

        lang: Object
    },


    data() {
        return {
            picker: null,
            isOpened: false
        }
    },


    computed: {

        isDisabledArray() {
            return Array.isArray(this.disabled)
        },

        disabledDates() {
            return this.isDisabledArray ?
                this.disabled.map( str => new Date(str).setHours(0,0,0,0) ) :
                []
        }
    },


    methods: {

        _getPickerOptions() {
            let offset = this.yearRange * 31536000000
            let now = new Date().getTime()

            let min = this.min && this.$dayjs(this.min).toDate()
            let max = this.max && this.$dayjs(this.max).toDate()

            min = min && min.getTime() ? min : new Date(now - offset)
            max = max && max.getTime() ? max : new Date(now + offset)

            return {
                min,
                max,
                dayOffset: this.dayOffset,
                lang: Object.assign({}, this.$lang.FORMS_DATEPICKER, this.lang),
                dateClass: currentDate => {
                    // check disabled
                    if ( this.disabled !== false && this.isDisabledArray ) {
                        return this.disabledDates.includes( currentDate.getTime() ) ? 'dp-day-disabled' : ''
                    } else if ( this.disabled ) {
                        return 'dp-day-disabled'
                    } else {
                        return ''
                    }
                },
            }
        },

        showPicker() {
            this.isOpened = true
        },

        hidePicker() {
            this.isOpened = false
        },

        _focusoutHandler($event) {

            clearTimeout(this.__showPicker);

            this.__showPicker = setTimeout(() => {
                if ( !this.$el.contains(document.activeElement) ) {
                    this.hidePicker()
                }
            }, 10)
        }
    }
}