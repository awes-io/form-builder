<template>
    <div :class="['fb-switcher', 'fb-element', {'fb-switcher_error': hasError, 'fb-switcher_active': isActive, 'fb-switcher_disabled': isDisabled}]"
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
                    v-on="{ input: formId ? formValueHandler : vModelHandler }"
                    v-bind="$attrs"
                    class="fb-switcher__field"
                    :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
                    :disabled="isDisabled"
                    @focus="inFocus = true"
                    @blur="inFocus = false"
                    @keydown.enter.prevent="focusNext"
                    @mousedown="oldValue = rangeValue"
                    @click="toggleValue(oldValue)"
                    ref="element"
                >
            </div>

            <span class="fb-switcher__label" @click.self="toggleValue(rangeValue)">{{ label }}</span>

        </fb-error-wrap>

    </div>
</template>

<script>
import checkboxFieldMixin from '../js/mixins/fb-checkbox-field.js';

export default {

    name: 'fb-switcher',

    inheritAttrs: false,

    mixins: [ checkboxFieldMixin ],


    data() {
        return {
            oldValue: null
        }
    },


    computed: {

        rangeValue() {
            return Number( this.formId ? this.formValue : this.vModelChecked )
        }
    },


    methods: {

        formValueHandler($event) {
            this.oldValue = null
            let checked = +$event.target.value
            this.formValue = this.isNumeric ? checked : Boolean(checked)
            if ( this.error ) this.resetError()
        },

        vModelHandler($event) {
            this.oldValue = null
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

        toggleValue( oldValue ) {
            if ( this.isDisabled || oldValue === null ) return
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
