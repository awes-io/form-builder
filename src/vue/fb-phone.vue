<template>
    <div class="fb__input grid__cell"
      :class="[{ 'input_active': inActive,
                 'input_error': hasError,
                 'animated shake': shake, 
                 'disabled': isDisabled },
                  cellClass]" > 
        <div :class="['input input_phone', { 'input_disabled': isDisabled }]">
            <span class="input__label">Phone</span> 
            <vue-tel-input @onInput="onInput" v-model="value.input"></vue-tel-input>
        </div>
    </div>
</template>

<script>
import fieldMixin from './mixins/fb-field.js';

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


    data() {
        return {
            value: {
                input: '',
                formatted: ''
            }
        }
    },


    methods: {

        onInput({ number, isValid, country }) {
            if ( isValid ) {
                this.value.formatted = number
            }
            // method from field mixin
            this.valueHandler(this.value)
        }
    }
}
</script>
