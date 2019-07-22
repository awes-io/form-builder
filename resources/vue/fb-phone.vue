<template>
    <div :class="[isReady ? 'fb-phone' : 'fb-input', 'fb-element', { 'fb-phone_disabled': isDisabled, 'fb-phone_disabled': !isReady && isDisabled, 'animated shake': shake, 'fb-phone_active': isActive, 'fb-phone_error': hasError, 'fb-input_active': !isReady && isActive }]">

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >
            <span :class="isReady ? 'fb-phone__label' : 'fb-input__label'">{{ label }}</span>
            <input
                v-if="! isReady"
                :class="['fb-input__field', {'is-focusable': isFocusable, 'in-focus': inFocus, 'has-label': label}]"
                :value="formId ? formValue : value"
                :disabled="isDisabled"
                v-on="{ input: ({ target }) => formId ? formValueHandler(target.value) : vModelHandler(target.value) }"
                @blur="inFocus = false"
                @focus="inFocus = true"
                type="tel"
            >
            <vue-tel-input
                :class="{'has-label': label}"
                :value="formId ? String(formValue || '') : value"
                v-on="{ input: formId ? formValueHandler : vModelHandler }"
                :disabled="isDisabled"
                :defaultCountry="defaultCountry"
                @onBlur="inFocus = false"
                @onInput="checkFocus"
                @ready="isReady = true"
                ref="tel"
            ></vue-tel-input>

        </fb-error-wrap>
    </div>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field.js';

const ERR_COUNTER_MAX = 20
const VueTelInputSrc = [
    'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.js',
    'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.css'
]
let errCounter = ERR_COUNTER_MAX
let unwatch

export default {

    name: 'fb-phone',

    mixins: [ fieldMixin ],

    components: {
        VueTelInput: resolve => {
            return AWES.utils.loadModule('vue-tel-input', VueTelInputSrc, () => {
                const _cmp = VueTelInput.default
                const _mounted = function() { this.$emit('ready') }
                if ( _cmp.mounted ) {
                    if ( Array.isArray(_cmp.mounted) ) {
                        _cmp.mounted.push( _mounted )
                    } else {
                        let _old = _cmp.mounted
                        _cmp.mounted = [ _old, _mounted ]
                    }
                } else {
                    _cmp.mounted = _mounted
                }
                errCounter = ERR_COUNTER_MAX
                resolve(_cmp)
            })
        }
    },


    props: {

        value: {
            type: String,
            default: ''
        },

        defaultCountry: {
            type: String,
            default: ''
        }
    },


    data() {
        return {
            nativeTelInput: false,
            isReady: false
        }
    },


    computed: {

        isActive() {
            return !!(this.inFocus || (this.value || this.formValue));
        }
    },


    methods: {

        formValueHandler(value) {

            this.formValue = value

            if ( this.error ) {
                this.resetError()
            }
        },

        vModelHandler(value) {
            this.$emit('input', value)
        },

        setFocusWatcher() {
            if ( ! this.$refs.tel ) return

            this.nativeTelInput = this.$refs.tel.$refs.input

            this.nativeTelInput.addEventListener('focus', () => {
                this.inFocus = true
            })

            this.setFocusableClass()
            this.setFocusClass()
        },

        setFocusClass() {
            this.nativeTelInput.classList[ this.inFocus ? 'add' : 'remove' ]('in-focus')
            errCounter = ERR_COUNTER_MAX
        },

        setFocusableClass() {
            this.nativeTelInput.classList[ this.isFocusable ? 'add' : 'remove' ]('is-focusable')
            errCounter = ERR_COUNTER_MAX
        },

        setFocus(state) {
            try {
                let useMethod = (state !== false) ? 'focus' : 'blur';
                this.nativeTelInput[useMethod]()
            } catch (e) {
                if ( errCounter ) {
                    errCounter--
                    setTimeout( () => { this.setFocus(state) }, 1000 )
                }
            }
        },

        checkFocus() {
            if ( ! this.inFocus ) this.setFocus()
        }
    },


    watch: {

        inFocus() {
            if ( ! this.isReady ) return
            try {
                this.setFocusClass()
            } catch(e) {
                if ( errCounter ) {
                    errCounter--
                    setTimeout( this.setFocusClass, 1000 )
                }
            }
        },

        isFocusable() {
            if ( ! this.isReady ) return
            try {
                this.setFocusableClass()
            } catch(e) {
                if ( errCounter ) {
                    errCounter--
                    setTimeout( this.setFocusableClass, 1000 )
                }
            }
        }
    },


    mounted() {
        unwatch = this.$watch('isReady', ready => {
            this.setFocusWatcher()
            unwatch()
            unwatch = null
        })
    },


    updated() {
        if ( ! this.nativeTelInput ) this.setFocusWatcher()
    },


    beforeDestroy() {
        if ( typeof unwatch === 'function' ) unwatch()
    }
}
</script>
