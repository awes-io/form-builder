<template>
    <div :class="['fb-switcher', {'fb-switcher_error': hasError, 'fb-switcher_active': isActive, 'fb-switcher_disabled': isDisabled}]"
        @keyup.space="toggleValue(rangeValue)">

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >

            <div class="fb-switcher__field-wrap" :data-awes="$options.name + '.' + name">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="1"
                    :value="rangeValue"
                    v-on="{ change: formId ? formValueHandler : vModelHandler }"
                    v-bind="$attrs"
                    class="fb-switcher__field"
                    :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
                    :disabled="isDisabled"
                    @focus="inFocus = true"
                    @blur="inFocus = false"
                    @keydown.enter.prevent="focusNext"
                    @mousedown="checkClick(rangeValue)"
                    ref="element"
                >
            </div>

            <span class="fb-switcher__label" @click="toggleValue(rangeValue)">{{ label }}</span>

        </fb-error-wrap>

    </div>
</template>

<script>
import checkboxFieldMixin from '../js/mixins/fb-checkbox-field.js';

export default {

    name: 'fb-switcher',

    inheritAttrs: false,

    mixins: [ checkboxFieldMixin ],


    computed: {

        rangeValue() {
            return Number( this.formId ? this.formValue : this.vModelChecked )
        }
    },


    methods: {

        formValueHandler($event) {
            let checked = +$event.target.value
            this.formValue = this.isNumeric ? checked : Boolean(checked)
            if ( this.error ) this.resetError()
        },

        vModelHandler($event) {
            let response

            if (this.vModelArray) {

                // switch the value in array
                response = this.value.slice()
                if ($event.target.value && !this.vModelChecked) {
                    response.push(this.computedValue)
                } else if (!$event.target.checked && this.vModelChecked) {
                    response.splice(response.findIndex(item => item === this.computedValue), 1)
                }
            } else {

                // switch single value
                response = Boolean($event.target.value)
            }

            this.$emit('input', response)
        },

        checkClick(currentValue) {
            this._clickTimestamp = new Date().getTime()
            this._value = currentValue
            window.addEventListener('mouseup', this.mouseReleased, false)
        },

        mouseReleased() {
            window.removeEventListener('mouseup', this.mouseReleased, false)
            let now = new Date().getTime()

            if ( now - this._clickTimestamp < 500 &&
                this._value === this.rangeValue) {
                // this is a click, queue switch theme
                setTimeout(this.toggleValue, 0, this._value)
            }
            delete this._clickTimestamp
            delete this._value
        },

        toggleValue( oldValue ) {
            if ( this.isDisabled ) return
            let _event = { target: {value: oldValue ? 0 : 1} }
            if ( this.formId ) {
                this.formValueHandler(_event)
            } else {
                this.vModelHandler(_event)
            }
        }
    }
}
</script>
