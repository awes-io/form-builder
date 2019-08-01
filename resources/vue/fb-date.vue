<template>
    <div
        class="fb-date fb-element"
        @focusout="_focusoutHandler"
    >
        
        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >
            <label
                class="fb-input fb-date__fb-input"
                :class="{ 'fb-input_disabled': isDisabled, 'fb-input_active': dateFormatted, 'fb-input_error': hasError, 'animated shake': shake }"
            >

                <span
                    class="fb-input__label fb-input__label_field"
                >
                    {{ label }}
                </span>
            
            
                <input
                    class="fb-input__field"
                    :class="{ 'is-focusable': isFocusable, 'in-focus': inFocus, 'has-label': label }"
                    :disabled="isDisabled"
                    :value="dateFormatted"
                    readonly
                    @focus="showPicker"
                    @blur="_focusoutHandler"
                    ref="element"
                >
            </label>
        </fb-error-wrap>

        <div
            class="fb-date__picker"
            :class="{'has-time': hasTime, 'is-opened': isOpened}"
            :tabindex="isOpened ? '0' : null"
            @click="_setDate"
        >
            <ui-calendar
                :class="{'has-time': hasTime}"
                :month="showDate.month()"
                :year="showDate.year()"
                :value="date"
                :lang="_lang"
            >
                <template #header>

                    <!-- header bar -->
                    <ui-calendar-header
                        :month="showDate.month()"
                        :year="showDate.year()"
                        :prevDisabled="!_inMinRange(showDate.subtract(1, 'month'), 'month')"
                        :nextDisabled="!_inMaxRange(showDate.add(1, 'month'), 'month')"
                        :lang="_lang"
                        @prevMonth="showDate = showDate.subtract(1, 'month')"
                        @nextMonth="showDate = showDate.add(1, 'month')"
                        @setMonth="calendarView = 'months'"
                        @setYear="calendarView = (years.length > 1) ? 'years' : 'days'"
                    />

                    <!-- time -->
                    <time-range
                        v-if="hasTime"
                        v-model="time"
                        v-bind="timeRangeOptions"
                        class="fb-date__time-range"
                    />

                    <!-- month picker -->
                    <ui-calendar-months
                        v-if="calendarView === 'months'"
                        :month="showDate.get('month')"
                        :monthsDisabled="monthsDisabled"
                        :lang="_lang"
                        @setMonth="showDate = showDate.month($event); calendarView = 'days'"
                    />

                    <!-- year picker -->
                    <ui-calendar-years
                        v-if="calendarView === 'years'"
                        :year="showDate.year()"
                        :years="years"
                        @setYear="showDate = showDate.year($event); calendarView = 'days'"
                    />
                    
                </template>

                <template #day="{date, timestamp, isSelected, isEdge, isToday}">
                    <button
                        type="button"
                        class="ui-calendar__day"
                        :class="{
                            'is-selected': isSelected,
                            'is-edge': isEdge,
                            'is-today': isToday
                        }"
                        :disabled="isEdge || _isDisabled(date)"
                        :data-set-date="timestamp"
                        :key="timestamp"
                    >
                        {{ date.getDate() }}
                    </button>
                </template>

                <template #footer v-if="hasTime">
                    <div class="ui-calendar__footer">
                        <button
                            type="button"
                            class="ui-calendar__footer-button"
                            @click="hidePicker"
                        >
                            {{ $lang.FORMS_DATEPICKER.close }}
                        </button>
                    </div>
                </template>
            </ui-calendar>
   
        </div>

        <fb-input
            :name="realName"
            type="hidden"
            @error="err => inputError = err"
        />
    </div>
</template>

<script>
import { timeArrayToString, stringToTimeArray } from '../js/modules/time'
import fieldMixin from '../js/mixins/fb-field.js'
import dateMixin from '../js/mixins/fb-date.js'
import TimeRange from './time-range.vue'

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
                    return 'DD/MM/YYYY'
                }
                return 'DD/MM/YYYY HH:mm'
            }
        }
    },


    data() {
        return {
            inputError: undefined,
            calendarView: 'days'
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
                value = this.$dayjs(value)
                value = value.isValid() ? value.format(!this.hasTime && 'YYYY-MM-DD') : ''
                if ( this.formId ) {
                    this.formValue = value
                } else {
                    this.$emit('input', value)
                }
            }
        },

        time: {

            get() {
                let current = this._parse(this.date)
                return timeArrayToString([current.getHours(), current.getMinutes()])
            },

            set(time) {
                let date = this._addTime( this._parseOrNow(this.date), time )
                this.date = date
            }
        },

        dateFormatted() {
            return this.date && this.$dayjs(this.date).format(this.format) || ''
        },

        hasTime() {
            return !! this.timeRange
        },

        timeRangeOptions() {
            return AWES.utils.object.isObject( this.timeRange ) ? this.timeRange : {}
        },

        isDisabled() {
            return this.formLoading || this.isMultiblockDisabled || ! Array.isArray(this.disabled) && this.disabled
        },

        error() {
            return this.inputError
        }
    },


    methods: {

        _parse(input) {
            return this.$dayjs(input).toDate()
        },

        _parseOrNow(input) {
            let _parsed = this.$dayjs(input)
            return _parsed.isValid() ? _parsed.toDate() : new Date()
        },

        _addTime(date, timeString) {
            let timeArray = stringToTimeArray(timeString)
            date = this._parse(date)
            date.setHours(...timeArray)
            return date
        },

        _setDate($event) {

            let date = $event.target.getAttribute('data-set-date')

            if ( ! date ) return

            date = date && new Date(+date)

            if ( this.hasTime ) {
                let _date = this._addTime(date, this.time)
                this.date = _date
            } else {
                this.date = date
                this.hidePicker()
            }
        }
    }
}
</script>