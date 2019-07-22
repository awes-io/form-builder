<template>
<div :class="['fb-input', 'fb-element', { 'fb-input_disabled': isDisabled, 'fb-input_active': isActive || autoFilled, 'fb-input_error': hasError, 'animated shake': shake }, $attrs.type ? 'fb-input_type-' + $attrs.type : '']">

    <fb-error-wrap
        :open="showTooltip"
        :error="error"
        @clickTooltip="clickTooltip">

        <label class="fb-input__label fb-input__label_field" :for="'#' + inputId">{{ label }}</label>

        <input v-if="mask"
            v-mask="mask"
            v-bind="$attrs"
            :id="inputId"
            :class="['fb-input__field', {'is-focusable': isFocusable}, {'in-focus': inFocus }, {'fb-input__field_password': $attrs.type === 'password'}, {'has-label': label}]"
            :data-awes="$options.name + '.' + name"
            :type="inputType"
            :disabled="isDisabled"
            :value="formId ? formValue : value"
            v-on="mergedListeners"
            @focus="inFocus = true"
            @blur="inFocus = false"
            @keydown.enter.prevent="focusNext"
            @animationstart="autoFillHack"
            ref="element"
        >
        <input v-else
            v-bind="$attrs"
            :id="inputId"
            :class="['fb-input__field', {'is-focusable': isFocusable}, {'in-focus': inFocus }, {'fb-input__field_password': $attrs.type === 'password'}, {'has-label': label}]"
            :data-awes="$options.name + '.' + name"
            :type="inputType"
            :disabled="isDisabled"
            :value="formId ? formValue : value"
            v-on="mergedListeners"
            @focus="inFocus = true"
            @blur="inFocus = false"
            @keydown.enter.prevent="focusNext"
            @animationstart="autoFillHack"
            ref="element"
        >

        <button
            v-if="$attrs.type === 'password'"
            type="button"
            tabindex="-1"
            :aria-label="$lang.SHOW_PASSWORD"
            class="fb-input__eye"
            @click.prevent="togglePassword"
        >
            <i :class="['icon', inputType === 'password' ? 'icon-eye' : 'icon-eye2']"></i>
        </button>

    </fb-error-wrap>
</div>
</template>

<script>
import textFieldMixin from '../js/mixins/fb-text-field.js';

let _inputsId = 0

export default {

    name: "fb-input",

    inheritAttrs: false,

    mixins: [ textFieldMixin ],


    props: {

        label: {
            type: String,
            default: ''
        },

        mask: String
    },


    data() {
        return {
            inputType: this.$attrs.type || 'text',
            autoFilled: false
        }
    },


    computed: {

        inputId() {
            return 'input-' + _inputsId++
        },

        mergedListeners() {
            return Object.assign({}, this.$listeners, {
                input: this.formId ? this.formValueHandler : this.vModelHandler
            })
        }
    },


    methods: {

        togglePassword() {
            this.setFocus()
            if ( this.inputType === 'password' ) {
                this.inputType = 'text'
            } else {
                this.inputType = 'password'
            }
        },

        autoFillHack( $event ) {
            switch ( $event.animationName ) {
                case 'autoFillStart' :
                    this.autoFilled = true
                    break
                case 'autoFillEnd' :
                    this.autoFilled = false
                    break
            }
        }
    }
}
</script>
