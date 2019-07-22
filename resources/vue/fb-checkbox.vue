<template>
    <div :class="['fb-checkbox', 'fb-element', {'fb-checkbox_error': hasError}, {'fb-checkbox_active': isActive}, {'fb-checkbox_disabled': isDisabled}]">
        <label class="fb-checkbox__label" :data-awes="$options.name + '.' + name">
            <fb-error-wrap
                :open="showTooltip"
                :error="error"
                @clickTooltip="clickTooltip"
            >

                <input
                    type="checkbox"
                    v-bind="$attrs"
                    :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
                    :disabled="isDisabled"
                    :value="isActive"
                    :value.prop="computedValue"
                    :checked="isActive"
                    v-on="{ change: formId ? formValueHandler : vModelHandler }"
                    @focus="inFocus = true"
                    @blur="inFocus = false"
                    @keydown.enter.prevent="focusNext"
                    ref="element"
                >

                <span class="fb-checkbox__text">
                    <i class="icon icon-checkbox"></i>
                    <span>{{ label }}</span>
                </span>

            </fb-error-wrap>
        </label>
    </div>
</template>

<script>
import checkboxFieldMixin from '../js/mixins/fb-checkbox-field.js';

export default {

    name: 'fb-checkbox',

    inheritAttrs: false,

    mixins: [ checkboxFieldMixin ],


    methods: {

        formValueHandler($event) {
            if ( this.isMultiple ) {
                let _value = Array.isArray(this.formValue) && this.formValue.slice() || []
                if ( _value.includes(this.computedValue) ) {
                    let index = _value.indexOf(this.computedValue)
                    _value.splice(index, 1)
                } else {
                    _value.push( this.computedValue )
                }
                this.formValue = _value
            } else {
                let checked = $event.target.checked
                this.formValue = this.isNumeric ? Number(checked) : checked
            }

            if ( this.error ) this.resetError()
        },

        vModelHandler($event) {
            let response

            if (this.vModelArray) {

                // switch the value in array
                response = this.value.slice()
                if ($event.target.checked && !this.vModelChecked) {
                    response.push(this.computedValue)
                } else if (!$event.target.checked && this.vModelChecked) {
                    response.splice(response.findIndex(item => item === this.computedValue), 1)
                }
            } else {

                // switch single value
                response = $event.target.checked
            }

            this.$emit('input', response)
        }
    }
}
</script>
