<template>
    <div class="fb__input grid__cell"
      :class="[{ 'input_active': inActive,
                 'input_error': hasError,
                 'animated shake': shake, 
                 'disabled': isDisabled },
                  cellClass]" > 
        <div :class="['input', 'input_phone', { 'input_disabled': isDisabled }]">
            <span class="input__label">Phone</span> 
            <vue-tel-input
                v-model="value"
                :disabled="isDisabled"
                @onBlur="inFocus = false"
                @onInput="checkFocus"
                ref="tel"
            ></vue-tel-input>
        </div>
    </div>
</template>

<script>
import fieldMixin from './mixins/fb-field.js';
import focusMixin from './mixins/fb-focus.js';

const ERR_COUNTER_MAX = 20
let errCounter = ERR_COUNTER_MAX

export default {

    name: 'fb-phone',

    mixins: [ fieldMixin, focusMixin ],

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


    data() {
        return {
            nativeTelInput: false,
            value: ''
        }
    },


    methods: {
        
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
