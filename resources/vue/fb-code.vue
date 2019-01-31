<template>
<div :class="['keycode', {'animated shake': shake}, { 'form-builder_disabled': isDisabled }]">
    <div class="keycode__block">

        <fb-error-wrap :open="tooltip" :error="error" @clickTooltip="clickTooltip">
            <div class="keycode__wrap" id="keywrap">
                <div class="keycode__ffield" v-for="i in length" :key="i">
                    <input type="tel"
                        inputmode="numeric"
                        pattern="[0-9]*"
                        maxlength="1"
                        :value="inputValue[i-1]"
                        :class="['keycode__field', {'is-focusable': isFocusable, 'in-focus': inFocus[i-1]}]"
                        :disabled="isDisabled"
                        @focus="inFocus[i-1] = true"
                        @blur="inFocus[i-1] = false"
                        @keydown.enter.prevent="focusNext"
                        @keydown.backspace="i > 1 ? onBackspace($event, i-1) : null"
                        @keydown.left="i > 1 ? onLeft($event, i-1) : null"
                        @keydown.right="i < length ? onRight($event, i-1) : null"
                        @input="onInput($event, i-1)"
                        @paste.prevent="onPaste"
                        ref="fields">
                </div>
            </div>

        </fb-error-wrap>
    </div>
</div>
</template>

<script>
import fieldMixin from './mixins/fb-field.js';
import focusMixin from './mixins/fb-focus.js';

export default {

    name: "fb-code",

    mixins: [fieldMixin, focusMixin],

    props: {

        length: {
            type: Number,
            default: 6
        },

        autoSubmit: {
            type: Boolean,
            default: true
        }
    },


    data() {
        return {
            inputValue: [],
            inFocus: []
        }
    },


    computed: {

        value: {
            get() {
                return this.inputValue.join('');
            },
            set(val) {
                val = val.trim().replace(/\D/g, '').substr(0, this.length);
                this.inputValue = val.split('')
            }
        },

        hasCaptchaError() {
            return this.$awesForms.getters['hasCaptchaError'](this.formId)
        }
    },


    watch: {

        error(errors) {
            if (errors && errors.length) {
                this.value = ''
                this.$refs.fields.forEach(field => {
                    field.addEventListener('input', this.resetError, false)
                })
                this.$nextTick(() => {
                    this.setFocus()
                })
            } else {
                this.$refs.fields.forEach(field => {
                    field.removeEventListener('input', this.resetError)
                })
            }
        },

        hasCaptchaError(hasError) {
            if (!hasError) {
                this.autoSubmitForm(this.value)
            }
        }
    },


    methods: {

        setFocus(index = 0) {
            if (typeof index === 'boolean' && index === true) {
                this.$refs.fields[0].focus();
                return
            } else if (typeof index !== 'number') return

            if (index >= this.length) {
                index = this.length - 1
            }
            const inputElement = this.$refs.fields[index]
            setTimeout(() => {
                inputElement.focus()
                inputElement.setSelectionRange(0, inputElement.value.length)
            }, 10)
        },

        onInput($event, index) {
            const parsed = $event.target.value.replace(/\D/g, '')
            $event.target.value = parsed; // immedate update to prevent blinking
            this.$set(this.inputValue, index, parsed);
            if (!this.isEmpty(index) && !(index === this.length - 1)) {
                this.setFocus(index + 1)
            }
        },

        onBackspace($event, index) {
            this.setFocus(index - 1)
        },

        onLeft($event, index) {
            this.setFocus(index - 1)
        },

        onRight($event, index) {
            this.setFocus(index + 1)
        },

        onPaste($event) {
            if (this.error && this.error.length) this.resetError()
            this.value = $event.clipboardData.getData('text');
        },

        isEmpty(index) {
            return this.inputValue[index] === '' ||
                typeof this.inputValue[index] === typeof undefined
        },

        autoSubmitForm(value) {
            if (this.hasCaptchaError) return
            if (value.length === this.length) {
                this.$root.$emit('forms:submit', this.formId)
            }
        }
    },

    created() {
        for (let index = 0; index < this.length; index++) {
            this.inFocus.push(index === 0 && this.focus ? true : false)
            this.inputValue.push('')
        }

        if (this.autoSubmit) {
            this.__unwatchFormSubmit = this.$watch('value', this.autoSubmitForm)
        }
    },

    beforeDestroy() {
        this.$refs.fields.forEach(field => {
            field.removeEventListener('input', this.resetError)
        })
        if (this.__unwatchFormSubmit) this.__unwatchFormSubmit()
    }
}
</script>
