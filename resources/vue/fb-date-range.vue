<template>
    <div
        class="fb-date is-range fb-element"
        @focusout="_focusoutHandler"
    >
        
        <!-- start date -->        
        <label
            class="fb-input fb-date__fb-input"
            :class="{ 'fb-input_disabled': isDisabled, 'fb-input_active': startDateFormatted, 'fb-input_error': hasError && error[0], 'animated shake': shake && error[0] }"
        >
            <fb-error-wrap
                :open="showTooltip && !!error[0]"
                :error="error[0]"
                @clickTooltip="clickTooltip"
            ></fb-error-wrap>

            <span
                class="fb-input__label fb-input__label_field"
            >
                {{ labelStart || $lang.FORMS_DATERANGE_START_LABEL }}
            </span>

            <input
                class="fb-input__field has-label"
                :disabled="isDisabled"
                :value="startDateFormatted"
                readonly
                ref="element"
                @focus="showPicker"
                @blur="_focusoutHandler"
            >
        </label><!-- / start date -->

        <!-- end date -->
        <label
            class="fb-input fb-date__fb-input"
            :class="{ 'fb-input_disabled': isDisabled, 'fb-input_active': endDateFormatted, 'fb-input_error': hasError && error[1], 'animated shake': shake && error[1] }"
        >

            <fb-error-wrap
                :open="showTooltip && !!error[1]"
                :error="error[1]"
                @clickTooltip="clickTooltip"
            ></fb-error-wrap>

            <span
                class="fb-input__label fb-input__label_field"
            >
                {{ labelEnd || $lang.FORMS_DATERANGE_END_LABEL }}
            </span>

            <input
                class="fb-input__field has-label"
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
            :value="valueStart"
            type="hidden"
            @error="err => startError = err"
        />
        <fb-input
            :name="endName"
            :value="valueEnd"
            type="hidden"
            @error="err => endError = err"
        />
    </div>
</template>


<script>
import { DateRangePicker } from 'tiny-date-picker/src/date-range-picker'
import baseMixin from '../js/mixins/fb-base.js'
import dateMixin from '../js/mixins/fb-date.js'
import errorMixin from '../js/mixins/fb-error.js'

export default {

    name: 'fb-date-range',

    mixins: [ baseMixin, dateMixin, errorMixin ],


    props: {

        labelStart: String,

        labelEnd: String,

        valueStart: String,

        valueEnd: String
    },


    data() {
        return {
            startError: null,
            endError: null
        }
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
                return value && this.$dayjs(value).toDate() || ''
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
            return this.startDate && this.$dayjs(this.startDate).format(this.format) || ''
        },

        endDate: {

            get() {
                let value = this.formId ?
                    this.$store.getters['forms/fieldValue'](this.formId, this.endName) :
                    this.valueEnd
                return value && this.$dayjs(value).toDate() || ''
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
            return this.endDate && this.$dayjs(this.endDate).format(this.format) || ''
        },

        error() {
            return [this.startError, this.endError]
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
        },

        setFocus(state) {
            try {
                let useMethod = (state !== false) ? 'focus' : 'blur';
                this.$refs.element[useMethod]()
            } catch (e) {
                console.warn('Error while setting focus');
                console.error(e)
            }
        }
    },


    mounted() {
        this.init()
    }
}
</script>