<template>
  <div class="grid__cell" :class="[{'grid__cell_padding': padding}, cellClass]">

    <div :class="['fb-checkbox', {'fb-checkbox_error': hasError}, {'fb-checkbox_active': inActive}, {'fb-checkbox_disabled': isDisabled}]">
      <label class="fb-checkbox__label" :data-awes="$options.name + '.' + name">
        <fb-error-wrap
          :open="tooltip"
          :error="error"
          @clickTooltip="clickTooltip">

          <input
            type="checkbox"
            v-bind="$attrs"
            :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
            :disabled="isDisabled"
            v-model="value"
            @focus="inFocus = true"
            @blur="inFocus = false"
            @keydown.enter.prevent="focusNext"
            ref="element">

          <span class="fb-checkbox__text">
            <i class="icon icon-checkbox"></i>
            <span>{{ label }}</span>
          </span>

        </fb-error-wrap>
      </label>
    </div>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import focusMixin from './mixins/fb-focus.js';

  export default {

    name: 'fb-checkbox',

    inheritAttrs: false,

    mixins: [ fieldMixin, focusMixin ],


    props: {

      label: {
        type: String,
        required: true
      },

      padding: {
        type: Boolean,
        default: true
      }
    },


    data() {
      return {
        value: false
      }
    }
  }
</script>
