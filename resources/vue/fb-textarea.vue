<template>
  <div class="grid__cell" :class="[cellClass]" >

    <div class="fb-textarea" :class="{ 'fb-textarea_disabled': isDisabled, 'fb-textarea_active': inActive, 'fb-textarea_error': hasError, 'animated shake': shake}">

      <fb-error-wrap
        :open="tooltip"
        :error="error"
        @clickTooltip="clickTooltip">

        <span class="fb-textarea__label">{{ label }}</span>

        <textarea
          v-bind="$attrs"
          :class="['fb-textarea__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
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
