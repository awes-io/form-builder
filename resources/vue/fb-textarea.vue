<template>
  <div class="grid__cell" :class="[cellClass]" >

    <div class="input input_textarea" :class="{ 'form-builder_disabled': isDisabled, 'input_active': inActive, 'input_error': hasError, 'animated shake': shake}">

      <fb-error-wrap
        :open="tooltip"
        :error="error"
        @clickTooltip="clickTooltip">

        <span class="input__label">{{ label }}</span>

        <textarea
          v-bind="$attrs"
          :class="['input__textarea', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
          :disabled="isDisabled"
          v-model="value"
          @focus="inFocus = true"
          @blur="inFocus = false"
          ref="element"></textarea>

      </fb-error-wrap>
    </div>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import focusMixin from './mixins/fb-focus.js';
  import autosize from "autosize";

  let unwatcher;

  export default {

    name: "fb-textarea",

    inheritAttrs: false,

    mixins: [ fieldMixin, focusMixin ],


    props: {

      label: {
        type: String,
        default: ''
      },

      fixsize: {
        type: Boolean,
        default: false
      }
    },


    data() {
      return {
        value: '',
      }
    },


    methods: {

      setAutoResize() {
        if ( ! this.fixsize ) {
          autosize( this.$refs.element );
          unwatcher = this.$watch('value', this.updateAutoResize)
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
    },

    beforeDestroy() {
      if ( typeof unwatcher === 'function' ) unwatcher()
    }

  }
</script>
