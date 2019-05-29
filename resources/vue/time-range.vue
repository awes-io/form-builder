<template>
    <div class="time-range">
        <ul class="time-range__intervals">
            <li
                v-for="interval in timeIntervals"
                :key="interval"
                class="time-range__interval"
            >
                <button
                    type="button"
                    class="time-range__button"
                    :class="{'is-current': value === interval, 'is-disabled': _isDisabled(interval)}"
                    :disabled="_isDisabled(interval)"
                    @click="_isDisabled(interval) ? null : $emit('input', interval)"
                >
                    {{ interval }}
                </button>
            </li>
        </ul>
    </div>
</template>


<script>
import {
    stringToTimeArray,
    timeArrayToString,
    timeArrayToMinutes
} from '../js/modules/time'

export default {

    name: 'TimeRange',


    props: {

        value: String,

        min: {
            type: String,
            default: '00:00' // 24h format
        },

        max: String,

        step: {
            type: [String, Number],
            default: 30 // minutes
        },

        disabled: {
            type: [Boolean, Array],
            default: false
        }
    },


    computed: {

        endTimeMinutes() {
            return this.max && timeArrayToMinutes(stringToTimeArray(this.max))
        },

        timeIntervals() {
            let intervals = []
            let current = stringToTimeArray(this.min)

            while ( current[0] < 24 && this._inRange(current) ) {
                intervals.push( timeArrayToString(current) )
                current = this._nextPeriod( current )
            }

            return intervals
        }
    },


    methods: {

        _nextPeriod( prevTimeArray ) {
            let [hours, minutes] = prevTimeArray

            minutes = minutes + Number(this.step)

            if ( minutes >= 60 ) {
                let _hours = Math.floor( minutes / 60 )
                minutes = minutes - _hours * 60
                hours = hours + _hours
            }

            return [hours, minutes]
        },

        _inRange( timeArray ) {
            if ( ! this.endTimeMinutes ) {
                return true
            }
            return timeArrayToMinutes(timeArray) <= this.endTimeMinutes
        },

        _isDisabled( timeStr ) {
            return Array.isArray(this.disabled) ? this.disabled.indexOf(timeStr) > -1 : this.disabled
        }
    }
}
</script>