<template>
  <div class="grid__cell" :class="[{'grid__cell_padding': padding}, cellClass]">

    <div :class="['checkbox', {'checkbox_error': hasError}, {'checkbox_active': inActive}, themeClass, {'form-builder_disabled': isDisabled}]">
      <label class="checkbox__label" :data-awes="$options.name + '.' + name">
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

          <span class="checkbox__text">
            <i class="icon icon-checkbox" ref="switcher"></i>
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
      },

      theme: String,
    },


    data() {
      return {
        value: false
      }
    },


    computed: {

      themeClass() {
        return this.theme ? `checkbox_${this.theme}` : null
      },
      
      isSwitcher() {
        return this.theme === 's2'
      }
    },

    methods: {
      
      enableSwitcher() {
        this.__hammer = new Hammer.Manager( this.$refs.switcher, {
            recognizers: [
                [ Hammer.Swipe, {
                    threshold: 5,
                    velocity: .1,
                    direction: Hammer.DIRECTION_HORIZONTAL
                }]
            ]
        })
        this.__hammer.on('swipeleft', () => { this.value = false })
        this.__hammer.on('swiperight', () => { this.value = true })
      }
    },
  
    mounted() {
      if ( this.isSwitcher ) this.enableSwitcher()
    },
    
    beforeDestroy() {
      if ( this.isSwitcher ) {
        this.__hammer.destroy()
        delete this.__hammer
      }
    }
  }
</script>
