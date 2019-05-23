<template>
    <div
        class="fb-date is-range fb-element"
        @focusout="_focusoutHandler"
    >
        
        <!-- start date -->
        <label
            class="fb-input fb-date__fb-input"
            :class="{ 'fb-input_disabled': isDisabled, 'fb-input_active': startDateFormatted }"
        >

            <span
                class="fb-input__label fb-input__label_field"
            >
                {{ labelStart || $lang.FORMS_DATERANGE_START_LABEL }}
            </span>

            <input
                class="fb-input__field"
                :disabled="isDisabled"
                :value="startDateFormatted"
                readonly
                @focus="showPicker"
                @blur="_focusoutHandler"
            >
        </label><!-- / start date -->

        <!-- end date -->
        <label
            class="fb-input fb-date__fb-input"
            :class="{ 'fb-input_disabled': isDisabled, 'fb-input_active': endDateFormatted }"
        >
            <span
                class="fb-input__label fb-input__label_field"
            >
                {{ labelEnd || $lang.FORMS_DATERANGE_END_LABEL }}
            </span>

            <input
                class="fb-input__field"
                :disabled="isDisabled"
                :value="endDateFormatted"
                readonly
                @focus="showPicker"
                @blur="_focusoutHandler"
            >
        </label><!-- / end date -->

        <div
            class="fb-date__picker"
            :class="{'is-opened': isOpened}"
            ref="picker"
        ></div>

        <fb-input
            :name="startName"
            type="hidden"
        />
        <fb-input
            :name="endName"
            type="hidden"
        />
    </div>
</template>


<script>
import { DateRangePicker } from 'tiny-date-picker/src/date-range-picker'
import { parse, format } from 'date-fns'
import baseMixin from '../js/mixins/fb-base.js'
import dateMixin from '../js/mixins/fb-date.js'

export default {

    name: 'fb-date-range',

    mixins: [ baseMixin, dateMixin ],


    props: {

        labelStart: String,

        labelEnd: String,

        valueStart: String,

        valueEnd: String
    },


    computed: {

        startName() {
            return this.realName + '_start'
        },

        endName() {
            return this.realName + '_end'
        },

        startDate: {

            get() {
                let value = this.formId ?
                    this.$store.getters['forms/fieldValue'](this.formId, this.startName) :
                    this.valueStart
                return value && parse(value) || ''
            },

            set(value) {
                let isoValue = value && value.toISOString()
                if ( this.formId ) {
                    this._setField( this.startName, isoValue )
                } else {
                    this.$emit('input', { start: value, end: this.valueEnd })
                }
            }
        },

        startDateFormatted() {
            return this.startDate && format(this.startDate, this.format) || ''
        },

        endDate: {

            get() {
                let value = this.formId ?
                    this.$store.getters['forms/fieldValue'](this.formId, this.endName) :
                    this.valueEnd
                return value && parse(value) || ''
            },

            set(value) {
                let isoValue = value && value.toISOString()
                if ( this.formId ) {
                    this._setField( this.endName, isoValue )
                } else {
                    this.$emit('input', { start: this.valueStart, end: value })
                }
            }
        },

        endDateFormatted() {
            return this.endDate && format(this.endDate, this.format) || ''
        }
    },


    methods: {

        init() {
            const OPTIONS = this._getPickerOptions()
            this.picker = new DateRangePicker(this.$refs.picker, { startOpts: OPTIONS, endOpts: OPTIONS })
            this.picker.setState({ start: this.startDate, end: this.endDate })

            this.$watch('startDate', start => {
                this.picker.setState({ start, end: this.endDate })
            })

            this.$watch('endDate', end => {
                this.picker.setState({ start: this.startDate, end })
            })

            this.picker.on('statechange', this._setDates)
        },

        _setDates($event, { state }) {
            this.startDate = state.start
            this.endDate = state.end
            if ( state.end ) {
                this.hidePicker()
            }
        },

        _setField( fieldName, value ) {
            this.$store.commit('forms/setFieldValue', {
                formName: this.formId,
                fieldName,
                value
            })
        }
    },


    mounted() {
        this.init()
    }
}
</script>