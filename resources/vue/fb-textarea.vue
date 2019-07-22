<template>
    <div class="fb-textarea fb-element" :class="{ 'fb-textarea_disabled': isDisabled, 'fb-textarea_active': isActive, 'fb-textarea_error': hasError, 'animated shake': shake}">

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >

            <label class="fb-textarea__label" :for="textareaId">{{ label }}</label>

            <textarea
                :id="textareaId"
                v-bind="$attrs"
                :class="['fb-textarea__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
                :disabled="isDisabled"
                :value="formId ? formValue : value"
                v-on="{ input: formId ? formValueHandler : vModelHandler }"
                @focus="inFocus = true"
                @blur="inFocus = false"
                ref="element"
            ></textarea>

        </fb-error-wrap>
    </div>
</template>

<script>
import textFieldMixin from '../js/mixins/fb-text-field.js';
import autosize from "autosize";

let _textareasId = 0

export default {

    name: "fb-textarea",

    inheritAttrs: false,

    mixins: [ textFieldMixin ],

    props: {

        fixsize: {
            type: Boolean,
            default: false
        }
    },


    computed: {

        textareaId() {
            return 'textarea-' + _textareasId++
        }
    },


    methods: {

        setAutoResize() {
            if ( ! this.fixsize ) {
                autosize( this.$refs.element );
                this.$watch('value', this.updateAutoResize)
            }
        },

        updateAutoResize() {
            this.$nextTick( () => {
              autosize.update(this.$refs.element)
            })
        }
    },


    mounted() {
        this.setAutoResize();
    }

}
</script>
