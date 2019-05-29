<template>
    <div
        class="fb-date fb-element"
        @focusout="_focusoutHandler"
    >
        
        <label
            class="fb-input fb-date__fb-input"
            :class="{ 'fb-input_disabled': isDisabled, 'fb-input_active': dateFormatted }"
        >

            <span
                class="fb-input__label fb-input__label_field"
            >
                {{ label }}
            </span>

            <input
                class="fb-input__field"
                :class="{ 'is-focusable': isFocusable, 'in-focus': inFocus }"
                :disabled="isDisabled"
                :value="dateFormatted"
                readonly
                @focus="showPicker"
                @blur="_focusoutHandler"
                ref="element"
            >
        </label>

        <div
            class="fb-date__picker"
            :class="{'has-time': hasTime, 'is-opened': isOpened}"
        >
            <div
                class="dp-wrapper"
                @click="_calendarClickHandler"
                ref="picker"
            ></div>

            <time-range
                v-if="hasTime"
                v-model="time"
                v-bind="timeRangeOptions"
                class="fb-date__time-range"
            />
        </div>

        <fb-input
            :name="realName"
            type="hidden"
        />
    </div>
</template>

<script>
import { TinyDatePicker } from 'tiny-date-picker/src/date-range-picker'
import { parse, format } from 'date-fns'
import { timeArrayToString, stringToTimeArray } from '../js/modules/time'
import fieldMixin from '../js/mixins/fb-field.js'
import dateMixin from '../js/mixins/fb-date.js'
import TimeRange from './time-range.vue'

function parseOrNow(input) {
    let output = parse(input)
    return output.getTime() ? output : new Date()
}

export default {

    name: 'fb-date',

    mixins: [ fieldMixin, dateMixin ],


    props: {

        value: String,

        timeRange: {
            type: [Boolean, Object],
            default: true
        },

        format: {
            type: String,
            default() {
                let props = this.$options.propsData
                if ( props.timeRange === false ) {
                    return 'MM/DD/YYYY'
                }
                return 'MM/DD/YYYY HH:mm'
            }
        }
    },


    components: {
        TimeRange
    },


    computed: {

        date: {

            get() {
                return this.formId ? this.formValue : this.value
            },

            set(value) {
                value = value && value.toISOString()
                if ( this.formId ) {
                    this.formValue = value
                } else {
                    this.$emit('input', value)
                }
            }
        },

        time: {

            get() {
                let current = parse(this.date)
                return timeArrayToString([current.getHours(), current.getMinutes()])
            },

            set(time) {
                let date = this._addTime( parseOrNow(this.date), time )
                this.date = date
            }
        },

        dateFormatted() {
            return this.date && format(this.date, this.format) || ''
        },

        hasTime() {
            return !! this.timeRange
        },

        timeRangeOptions() {
            return AWES.utils.object.isObject( this.timeRange ) ? this.timeRange : {}
        },

        isDisabled() {
            return this.formLoading || this.isMultiblockDisabled || ! Array.isArray(this.disabled) && this.disabled
        }
    },


    methods: {


        init() {
            const OPTIONS = this._getPickerOptions()
            OPTIONS.mode = 'dp-permanent'
            this.picker = new TinyDatePicker(this.$refs.picker, OPTIONS)

            this.$watch('date', {
                handler() {
                    let selectedDate = parse(this.date)
                    selectedDate.setHours(0,0,0,0)
                    this.picker.setState({ selectedDate })
                },
                immediate: true
            })
            
            this.picker.on('select', this._setDate)
        },

        _addTime(date, timeString) {
            let timeArray = stringToTimeArray(timeString)
            date = parse(date)
            date.setHours(...timeArray)
            return date
        },

        _setDate($event, { state }) {
            if ( !! this.timeRange ) {
                let date = this._addTime(state.selectedDate, this.time)
                this.date = date
            } else {
                this.date = state.selectedDate
                this.hidePicker()
            }
        },

        _calendarClickHandler($event) {
            let target = $event.target
            if ( target.className === 'dp-close' ) {
                this.hidePicker()
            }
        }
    },


    mounted() {
        this.$nextTick(this.init)
    }
}
</script>