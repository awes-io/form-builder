<template>
    <div
        class="fb-date fb-element"
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
                    ref="element"
                >
            </label>
        </fb-error-wrap>

        <div
            class="fb-date__picker is-reservation"
            :class="{'is-opened': isOpened}"
        >

            <div class="fb-reservation">

                <!-- calendar -->
                <div
                    class="fb-reservation__calendar"
                    :class="{'is-visible': ! showTime}"
                >

                    <div class="ui-calendar__header">
                        <time
                            class="ui-calendar__caption"
                            :datetime="`${year}-${month + 1}`"
                        >
                            {{ monthName }} {{ year }}
                        </time>
                        <button
                            class="ui-calendar__button is-prev"
                            :disabled="prevButtonDisabled"
                            type="button"
                            @click="setMonth(month - 1)"
                        >
                            previouse month
                        </button>
                        <button
                            class="ui-calendar__button is-next"
                            type="button"
                            @click="setMonth(month + 1)"
                        >
                            next month
                        </button>
                    </div>

                    <ui-calendar
                        class="fb-reservation__ui-calendar"
                        v-bind="{month, year, firstDay}"
                        :value="date"
                        :lang="{weekdays: $lang.FORMS_DATEPICKER.days}"
                    >
                        <button
                            slot="day"
                            slot-scope="{date: calendarDate, timestamp, isSelected, isEdge}"
                            class="ui-calendar__day"
                            :class="{
                                'is-edge': isEdge,
                                'is-selected': isSelected,
                                'is-today': timestamp === today,
                                'is-disabled': !availableDays[timestamp]
                            }"
                            :disabled="!availableDays[timestamp]"
                            type="button"
                            :data-date="isEdge ? null : timestamp"
                            v-on="isEdge || !availableDays[timestamp] ? {} : { click: _setDate }"
                        >
                            {{ calendarDate.getDate() }}
                        </button>
                    </ui-calendar>
                </div><!-- / calendar -->

                <!-- time range -->
                <div
                    v-show="!! date"
                    class="fb-reservation__time"
                    :class="{'is-visible': showTime}"
                >
                    <div class="ui-calendar__header">

                        <button
                            class="ui-calendar__button is-prev fb-reservation__hide-time"
                            type="button"
                            @click="showTime = false"
                        >
                            show datepicker
                        </button>

                        <time
                            class="ui-calendar__caption"
                            :datetime="dateInfo.datetime"
                        >
                            <slot name="time-header" v-bind="dateInfo">
                                {{ dateInfo.weekdayName }}, {{ dateInfo.monthName }} {{ dateInfo.day }}
                                <span class="fb-reservation__caption-year">{{ dateInfo.year }}</span>
                            </slot>
                        </time>
                    </div>
                    <div class="ui-calendar__time-range">
                        <ul v-if="availableTime" @click="_setTime">
                            <li
                                v-for="{time_start, status, format24h, format12h} in availableTime"
                                :key="time_start"
                            >
                                <button
                                    type="button"
                                    class="ui-calendar__button"
                                    :class="[{
                                        'is-selected': time === format24h,
                                        'is-disabled': status !== 'available'
                                    }, 'is-' + status]"
                                    :disabled="status !== 'available'"
                                    :data-time="format24h"
                                >
                                    {{ is24hFormat ? format24h : format12h }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div><!-- / time range -->

                <!-- loading overlay -->
                <div class="fb-reservation__loading" v-show="isLoading">
                    <slot name="loading">
                        Loading...
                    </slot>
                </div>
            </div>
        </div>

        <fb-input
            :name="realName"
            type="hidden"
            @error="err => inputError = err"
        />
    </div>
</template>


<script>
import dateMixin from '../js/mixins/fb-date.js'
import focusMixin from '../js/mixins/fb-focus.js'
import FbReservation from './fb-reservation.vue'

export default {

    name: 'fb-reservation-dropdown',


    extends: FbReservation,


    mixins: [ focusMixin, dateMixin ],


    props: {

        format: {
            type: String,
            default: 'MM/DD/YYYY HH:mm'
        },

        label: String
    },


    data() {
        return {
            inputError: undefined
        }
    },


    computed: {

        dateFormatted() {
            return this.selected && this.$dayjs(this.selected).format(this.format) || ''
        }
    },


    watch: {

        selected(newValue, oldValue) {

            if ( newValue /*&& ! oldValue*/ ) {
                this.hidePicker()
            }
        },

        isOpened(isOpened) {
            if ( isOpened ) {
                this._setClickWatcher()
            } else {
                this._unsetClickWatcher()
            }
        }
    },


    methods: {

        _setClickWatcher() {
            setTimeout( () => {
                document.addEventListener('click', this._offClickHandler, true)
            }, 10)
        },

        _unsetClickWatcher() {
            document.removeEventListener('click', this._offClickHandler, true)
        },

        _offClickHandler($event) {
            if ( $event.target !== this.$el && ! this.$el.contains($event.target) ) {
                this.hidePicker()
            }
        }
    },


    beforeDestroy() {
        this._unsetClickWatcher()
    }
}
</script>