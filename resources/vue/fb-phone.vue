<template>
    <div class="grid__cell" :class="[cellClass]" >
        <div :class="['fb-phone', { 'fb-phone_disabled': isDisabled, 'animated shake': shake, 'fb-phone_active': isActive, 'fb-phone_error': hasError, }]">

            <fb-error-wrap
                :open="showTooltip"
                :error="error"
                @clickTooltip="clickTooltip"
            >
                <span class="fb-phone__label">{{ label }}</span>
                <vue-tel-input
                    :value="formId ? formValue : value"
                    v-on="{ input: formId ? formValueHandler : vModelHandler }"
                    :disabled="isDisabled"
                    @onBlur="inFocus = false"
                    @onInput="checkFocus"
                    ref="tel"
                ></vue-tel-input>

            </fb-error-wrap>
        </div>
    </div>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field.js';

const ERR_COUNTER_MAX = 20
let errCounter = ERR_COUNTER_MAX

export default {

    name: 'fb-phone',

    mixins: [ fieldMixin ],

    components: {
        VueTelInput: resolve => {
            const src = [
                'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.js',
                'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.css'
            ]
            return AWES.utils.loadModule('vue-tel-input', src, () => {
                resolve(VueTelInput.default)
            })
        }
    },


    props: {

        value: {
            type: String,
            default: ''
        }
    },


    data() {
        return {
            nativeTelInput: false,
        }
    },


    computed: {

        isActive() {
            return !!(this.inFocus || this.value);
        }
    },


    methods: {

        formValueHandler(value) {
            if ( ! this.error ) {
                this.__debounce = setTimeout(() => {
                    this.formValue = value
                }, Number(this.debounce))
            } else {
                this.formValue = value
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
        this.setFocusWatcher()
    },


    updated() {
        if ( ! this.nativeTelInput ) this.setFocusWatcher()
    }
}
</script>
