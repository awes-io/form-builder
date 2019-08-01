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
            class="fb-date__picker is-range"
            :class="{'is-opened': isOpened}"
            :tabindex="isOpened ? '0' : null"
            v-on="listeners"
        >
            <!-- left calendar -->
            <ui-calendar
                class="is-left"
                :month="showDate.month()"
                :year="showDate.year()"
                :lang="_lang"
            >
                <template #header>
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
                </template>

                <template #day="{date, timestamp, isEdge, isToday}">
                    <button
                        type="button"
                        class="ui-calendar__day"
                        :class="{
                            'is-selected': _isSelected(timestamp),
                            'in-range': _inSelectedRange(timestamp),
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
            </ui-calendar><!-- / left calendar -->

            <!-- right calendar -->
            <ui-calendar
                class="is-right"
                :month="nextShowDate.month()"
                :year="nextShowDate.year()"
                :lang="_lang"
            >
                <template #header>
                    <ui-calendar-header
                        :month="nextShowDate.month()"
                        :year="nextShowDate.year()"
                        :prevDisabled="true"
                        :nextDisabled="!_inMaxRange(nextShowDate.add(1, 'month'), 'month')"
                        :lang="_lang"
                        @nextMonth="showDate = showDate.add(2, 'month')"
                        @setMonth="calendarView = 'months'"
                        @setYear="calendarView = (years.length > 1) ? 'years' : 'days'"
                    />
                </template>

                <template #day="{date, timestamp, isEdge, isToday}">
                    <button
                        type="button"
                        class="ui-calendar__day"
                        :class="{
                            'is-selected': _isSelected(timestamp),
                            'in-range': _inSelectedRange(timestamp),
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
            </ui-calendar><!-- right calendar -->

            <!-- month picker -->
            <ui-calendar-months
                v-if="calendarView === 'months'"
                :month="showDate.month()"
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

        </div>

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
            endError: null,
            calendarView: 'days',
            hoverMode: false,
            hoveredTimestamp: null,
            isRangeInverted: false
        }
    },


    computed: {

        nextShowDate() {
            return this.showDate.add(1, 'month')
        },

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

        _startDateTimestamp() {
            return this.startDate && this.startDate.getTime()
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

        _endDateTimestamp() {
            return this.endDate && this.endDate.getTime()
        },

        endDateFormatted() {
            return this.endDate && this.$dayjs(this.endDate).format(this.format) || ''
        },

        error() {
            return [this.startError, this.endError]
        },

        listeners() {
            const _listeners = {
                click: this._setDates,
            }

            if ( this.hoverMode ) {
                _listeners['mouseover'] = this._setRangeHovered
            }

            return _listeners
        }
    },


    methods: {

        _isSelected(timestamp) {

            return this._startDateTimestamp === timestamp ||
                this._endDateTimestamp === timestamp
        },

        _inSelectedRange(timestamp) {
            if ( this.hoverMode ) {
                if ( this.isRangeInverted ) {
                    return this.hoveredTimestamp < timestamp
                        && timestamp < this._startDateTimestamp
                } else {
                    return this._startDateTimestamp < timestamp
                        && timestamp < this.hoveredTimestamp
                }
            } else if ( this.startDate && this.endDate ) {
                return this._startDateTimestamp < timestamp
                        && timestamp < this._endDateTimestamp
            }
        },

        _setDates($event) {

            let date = $event.target.getAttribute('data-set-date')

            if ( ! date ) return

            date = new Date(+date)

            if ( !this.startDate || this.endDate ) {
                this.startDate = date
                this.endDate = undefined
                this.hoverMode = true
            } else {
                let reverse = this.startDate.getTime() > date.getTime()
                this.endDate = reverse ? this.startDate : date
                this.startDate = reverse ? date : this.startDate
                this.hoverMode = false
                this.hidePicker()
            }
        },

        _setRangeHovered($event) {

            let date = $event.target.getAttribute('data-set-date')

            if ( ! date ) return

            this.hoveredTimestamp = +date
            this.isRangeInverted = date < this._startDateTimestamp
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
    }
}
</script>