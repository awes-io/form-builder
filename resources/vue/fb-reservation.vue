<template>
    <div
        class="fb-reservation fb-element"
        :class="{'has-error': hasError}"
        tabindex="0"
    >
        <fb-error-wrap
            class="fb-reservation__error"
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        ></fb-error-wrap>

        <slot name="title"></slot>

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
        </div>

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
        </div>

        <!-- input field -->
        <fb-input
            :name="realName"
            type="hidden"
            @error="_handleError"
        ></fb-input>

        <!-- loading overlay -->
        <div class="fb-reservation__loading" v-show="isLoading">
            <slot name="loading">
                Loading...
            </slot>
        </div>

    </div>
</template>


<script>
import uiCalendar from '@awes-io/utilities/resources/vue/components/calendar.vue'
import baseMixin from '../js/mixins/fb-base.js'
import errorMixin from '../js/mixins/fb-error.js'

export default {

    name: 'fb-reservation',


    mixins: [ baseMixin, errorMixin ],


    components: { uiCalendar },


    props: {

        url: {
            type: String,
            required: true
        },

        firstDay: {
            type: Number,
            default: 1
        }
    },


    data() {
        return {
            timeZone: null,
            isLoading: false,
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            today: new Date().setHours(0,0,0,0),
            date: null,
            time: null,
            showTime: false,
            is24hFormat: true,
            days: [],
            inputError: undefined
        }
    },


    computed: {

        selected: {

            get() {
                return this.$store.getters['forms/fieldValue'](this.formId, this.realName)
            },

            set(value) {
                this.$store.commit('forms/setFieldValue', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value
                });
            }
        },

        monthName() {
            return this.$lang.FORMS_DATEPICKER.months[this.month]
        },

        dateInfo() {
            if ( this.date ) {

                let day = this.date.getDate()
                let year = this.date.getFullYear()
                let month = this.date.getMonth()
                let weekDay = this.date.getDay()

                return {
                    weekdayName: this.$lang.FORMS_DATEPICKER.daysFull[weekDay],
                    monthName: this.$lang.FORMS_DATEPICKER.months[month],
                    day,
                    year,
                    datetime: this._formatDatestring( this.date )
                }
            } else {
                return {} // stub
            }
        },

        availableDays() {

            let _days = {}

            this.days.forEach( day => {

                if ( day.status !== 'available' ) return

                let _date = this._parseDatestring(day.date)

                _days[ _date.getTime() ] = day.spots
            })

            return _days
        },

        availableTime() {

            if ( this.date ) {
                return this.$get(this.availableDays, `${this.date.getTime()}`, [])
                    .map( ({ start_time, status }) => {

                        let _date = this.$dayjs(start_time)

                        return {
                            format24h: _date.format('HH:mm'),
                            format12h: _date.format('hh:mm A'),
                            start_time,
                            status
                        }
                    })
            }

            return null
        },

        prevButtonDisabled() {
            let _today = new Date(this.today)
            return this.year === _today.getFullYear() &&
                this.month === _today.getMonth()
        }
    },


    methods: {

        fetchData() {
            AWES.on('core:ajax', this._showLoader)

            let range_start = this.$dayjs(new Date(this.year, this.month)).set('date', 1)
            let range_end = range_start.add(1, 'month')
            range_start = this._formatDatestring(range_start)
            range_end = this._formatDatestring(range_end)

            AWES.ajax({timezone: this.timeZone, range_start, range_end}, this.url, 'GET')
                .then( ({ data }) => {
                    this.days = this.$get(data, 'data.days', [])
                    this.today = this._parseDatestring( this.$get(data, 'data.today') ).getTime()
                    this.is24hFormat = this.$get(data, 'data.format') === '24h'
                })
                .finally(() => {
                    this.isLoading = false
                    AWES.off('core:ajax', this._showLoader)
                })
        },

        _showLoader($event) {
            let { url, active } = $event.detail
            if ( this.url === url ) {
                this.isLoading = active
            }
        },

        _parseDatestring(str) {
            return this.$dayjs(str, 'YYYY-MM-DD').toDate()
        },

        _formatDatestring(date) {
            return this.$dayjs(date).format('YYYY-MM-DD')
        },

        _setDate($event) {
            const calendarDate = new Date(+$event.target.getAttribute('data-date'))
            this.date = calendarDate
            this.time = null
            this.selected = undefined
            this.showTime = true
        },

        _setTime($event) {
            const time = $event.target.getAttribute('data-time')
            if ( ! time ) return
            this.time = time
            const [hours, minutes] = time.split(':')
            let date = new Date(this.date)
            this.selected = this.$dayjs(date.setHours(hours, minutes, 0, 0)).format('YYYY-MM-DDTHH:mm:ssZ')
        },

        setMonth(month) {
            switch (month) {
                case -1:
                    this.month = 11
                    this.year -= 1
                    break
                case 12:
                    this.month = 0
                    this.year += 1
                    break
                default:
                    this.month = month
            }
            this.fetchData()
        },

        _handleError(err) {
            if ( ! AWES.utils.object.isEmpty(err) ) {
                this.inputError = err
            }
        },

        clickTooltip() {
            this.showTooltip = false
            this.inputError = undefined
        },
    },


    beforeMount() {
        if ( window.Intl ) {
            this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    },


    mounted() {
        this.$nextTick(() => {
            if ( this.selected ) {
                let selected = this.$dayjs(this.selected)
                this.date = new Date( selected.toDate().setHours(0,0,0,0) )
                this.time = selected.format('HH:mm')
            }
            this.fetchData()
        })
    }
}
</script>