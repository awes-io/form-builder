<template>
  <div class="grid__cell" :class="[cellClass]" >

    <div :class="['fb-slider', { 'fb-slider_disabled': isDisabled, 'fb-slider_active': inActive, 'fb-slider_error': hasError, 'animated shake': shake }]">

      <fb-error-wrap
        :open="tooltip"
        :error="error"
        @clickTooltip="clickTooltip">
        <div class="fb-slider__wrap">
          <div class="fb-slider__wrap-left">
            <label class="fb-slider__label" :for="'#' + inputId">{{ label }}</label>
            <span class="fb-slider__value">{{ percent }} %</span>
          </div>
          <div class="fb-slider__wrap-right">
            <input v-bind="$attrs"
                    :id="inputId"
                    :class="['fb-slider__field', {'is-focusable': isFocusable}, {'in-focus': inFocus }]"
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
