<template>
  <div class="grid__cell" :class="[cellClass]" >

    <div :class="['input', 'input_range', { 'form-builder_disabled': isDisabled, 'input_active': inActive, 'input_error': hasError, 'animated shake': shake, }]">

      <fb-error-wrap
        :open="tooltip"
        :error="error"
        @clickTooltip="clickTooltip">
        <div class="input__range-wrap">
          <div class="input__range-left">
            <label class="input__label input__label_field" :for="'#' + inputId">{{ label }}</label>
            <span class="input__range-value">{{ percent }} %</span>
          </div>
          <div class="input__range-right">
            <input v-bind="$attrs"
                    :id="inputId"
                    :class="['input__range', {'is-focusable': isFocusable}, {'in-focus': inFocus }, {'input__field_password': $attrs.type === 'password'}]"
                    :style="'--percent: ' + percent + '%'"
                    :data-awes="$options.name + '.' + name"
                    type="range"
                    :disabled="isDisabled"
                    v-model="value"
                    @focus="inFocus = true"
                    @blur="inFocus = false"
                    @keydown.enter.prevent="focusNext"
                    ref="element">
          </div>
        </div>

      </fb-error-wrap>
    </div>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import focusMixin from './mixins/fb-focus.js';
  
  let _sliderId = 0

  export default {

      name: "fb-slider",

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
        },

        percent() {
            return Math.round( Number(this.value) / Number(this.max) * 100 )
        }
      }
    }
</script>
