<template>
    <div :class="['fb-slider', 'fb-element', { 'fb-slider_disabled': isDisabled, 'fb-slider_error': hasError, 'animated shake': shake }]"> <!-- 'fb-slider_active': isActive -->

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >
            <div class="fb-slider__wrap">
                <div class="fb-slider__wrap-left">
                    <label class="fb-slider__label" :for="'#' + inputId">{{ label }}</label>
                    <span class="fb-slider__value">{{ percent }} %</span>
                </div>
                <div class="fb-slider__wrap-right">
                    <input
                        v-bind="$attrs"
                        :id="inputId"
                        :class="['fb-slider__field', {'is-focusable': isFocusable}, {'in-focus': inFocus }]"
                        :style="'--percent: ' + percent + '%'"
                        :data-awes="$options.name + '.' + name"
                        type="range"
                        :disabled="isDisabled"
                        :value="(formId ? formValue : value ) || 0"
                        @focus="inFocus = true"
                        @blur="inFocus = false"
                        @keydown.enter.prevent="focusNext"
                        ref="element"
                    >
                </div>
            </div>
        </fb-error-wrap>
    </div>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field.js';

let _sliderId = 0

export default {

    name: "fb-slider",

    inheritAttrs: false,

    mixins: [ fieldMixin ],


    props: {

        min: {
            type: [Number,String],
            default: 0
        },

        max: {
            type: [Number,String],
            default: 100
        },

        value: {
            type: [Number, String],
            default: 0
        }
    },


    computed: {

        inputId() {
            return 'slider-' + _sliderId++
        },

        percent() {
            return Math.round( Number(this.formId ? this.formValue : this.value) || 0 / Number(this.max) * 100 )
        }
    },


    methods: {

        formValueHandler($event) {
            this.formValue = Number($event.target.value)
            if ( this.error ) this.resetError()
        },

        vModelHandler($event) {
            this.$emit('input', Number($event.target.value))
        },


        toggleListener(on) {
            let method = (on ? 'add' : 'remove') + 'EventListener'
            let handler = this.formId ? this.formValueHandler : this.vModelHandler
            let event = window.MSInputMethodContext ? 'change' : 'input'
            this.$refs.element[method](event, handler)
        }
    },


    mounted() {
        this.$nextTick(() => this.toggleListener(true))
    },


    beforeDestroy() {
        this.toggleListener(false)
    }
}
</script>
