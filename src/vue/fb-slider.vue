<template>
  <div class="fb__input grid__cell"
      :class="[{ 'input_active': inActive,
                 'input_error': hasError,
                 'animated shake': shake,
                 'disabled': isDisabled },
                cellClass]" >

    <div :class="['input', { 'input_disabled': isDisabled }]">

      <fb-error-wrap
        :open="tooltip"
        :error="error"
        @clickTooltip="clickTooltip">

        <label class="input__label input__label_field" :for="'#' + inputId">{{ label }}</label>

        <span class="input__range-value">{{ value }} / {{ max }}</span>

        <!-- <span class="input__range-fake">
            <span class="input__range-fake-track"
                  :style="{left: `${(value/max*100).toFixed(1)}%`}"></span> -->
            <input v-bind="$attrs"
                   :id="inputId"
                   :class="['input__range', {'is-focusable': isFocusable}, {'in-focus': inFocus }, {'input__field_password': $attrs.type === 'password'}]"
                   :data-awes="$options.name + '.' + name"
                   type="range"
                   :disabled="isDisabled"
                   v-model="value"
                   @focus="inFocus = true"
                   @blur="inFocus = false"
                   @keydown.enter.prevent="focusNext"
                   ref="element">
        <!-- </span> -->

      </fb-error-wrap>
    </div>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import focusMixin from './mixins/fb-focus.js';
  
  let _sliderId = 0

  export default {

      name: "fb-input",

      inheritAttrs: false,

      mixins: [ fieldMixin, focusMixin ],

      props: {
        label: {
          type: String,
          default: ''
        },
        min: {
          type: [Number,String],
          default: 0
        },
        max: {
          type: [Number,String],
          default: 100
        }
      },

      data() {
        return {
          value: 0,
          inputType: this.$attrs.type || 'text',
          autoFilled: false
        }
      },

      computed: {
        
        inputId() {
          return 'slider-' + _sliderId++
        }
      }
    }
</script>
