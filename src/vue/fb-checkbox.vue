<template>
  <div class="grid__cell"
       :class="[{'checkbox_error': hasError},
                {'checkbox_active': inActive},
                {'grid__cell_padding': padding},
                cellClass]">

    <label :class="['checkbox', themeClass, {'checkbox_disabled': isDisabled}]" :data-awes="$options.name + '.' + name">

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
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import focusMixin from './mixins/fb-focus.js';
  import fbErrorWrap from './fb-error-wrap.vue';
  // import Hammer from 'hammerjs';

  export default {

    name: 'fb-checkbox',

    inheritAttrs: false,

    mixins: [ fieldMixin, focusMixin ],

    components: { fbErrorWrap },


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
      
      // enableSwitcher() {
      //   this.__hammer = new Hammer.Manager( this.$refs.switcher, {
      //       recognizers: [
      //           [ Hammer.Swipe, {
      //               threshold: 5,
      //               velocity: .1,
      //               direction: Hammer.DIRECTION_HORIZONTAL
      //           }]
      //       ]
      //   })
      //   this.__hammer.on('swipeleft', () => { this.value = false })
      //   this.__hammer.on('swiperight', () => { this.value = true })
      // }
    },
  
    mounted() {
      // if ( this.isSwitcher ) this.enableSwitcher()
    },
    
    beforeDestroy() {
      // if ( this.isSwitcher ) delete this.__hammer
    }
  }
</script>
