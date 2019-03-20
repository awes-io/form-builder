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
                    :value.prop="computedValue"
                    :checked="formId ? formValue : vModelChecked"
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
            let checked = $event.target.checked
            this.formValue = this.isNumeric ? Number(checked) : checked
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
