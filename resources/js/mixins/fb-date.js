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

        lang: Object
    },


    data() {
        return {
            picker: null,
            isOpened: false
        }
    },


    methods: {

        _getPickerOptions() {
            let offset = this.yearRange * 31536000000
            let now = new Date().getTime()

            let min = this.min && parse(this.min) 
            let max = this.max && parse(this.max)

            min = min && min.getTime() ? min : new Date(now - offset)
            max = max && max.getTime() ? max : new Date(now + offset)

            return {
                min,
                max,
                dayOffset: this.dayOffset,
                lang: Object.assign({}, this.$lang.FORMS_DATEPICKER, this.lang)
            }
        },

        showPicker() {
            this.isOpened = true
        },

        hidePicker() {
            this.isOpened = false
            this.isTouch = false
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