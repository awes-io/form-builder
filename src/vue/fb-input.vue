<template>
  <div class="fb__input grid__cell"
      :class="[{ 'input_active': inActive || autoFilled,
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

        <input v-bind="$attrs"
               :id="inputId"
               :class="['input__field', {'is-focusable': isFocusable}, {'in-focus': inFocus }, {'input__field_password': $attrs.type === 'password'}]"
               :data-awes="$options.name + '.' + name"
               :type="inputType"
               :disabled="isDisabled"
               v-model="value"
               @focus="inFocus = true"
               @blur="inFocus = false"
               @keydown.enter.prevent="focusNext"
               @animationstart="autoFillHack"
               :spellcheck="spellcheck"
               ref="element">

        <button
          v-if="$attrs.type === 'password'"
          type="button"
          :aria-label="$lang.SHOW_PASSWORD"
          class="input__eye"
          @click.prevent="togglePassword">
          <i :class="['icon', inputType === 'password' ? 'icon-eye' : 'icon-eye2']"></i>
        </button>

      </fb-error-wrap>
    </div>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import focusMixin from './mixins/fb-focus.js';
  
  let _inputsId = 0

  export default {

      name: "fb-input",

      inheritAttrs: false,

      mixins: [ fieldMixin, focusMixin ],

      props: {
        label: {
          type: String,
          default: ''
        },
        spellcheck: {
          type: Boolean,
          default: false
        }
      },

      data() {
        return {
          value: '',
          inputType: this.$attrs.type || 'text',
          autoFilled: false
        }
      },
      
      computed: {
        
        inputId() {
          return 'input-' + _inputsId++
        }
      },

      methods: {

          togglePassword() {
              this.setFocus()
              if ( this.inputType === 'password' ) {
                  this.inputType = 'text'
              } else {
                  this.inputType = 'password'
              }
          },
          
          autoFillHack( $event ) {
            switch ( $event.animationName ) {
              case 'autoFillStart' :
                this.autoFilled = true
                break
              case 'autoFillEnd' :
                this.autoFilled = false
                break
            }
          }
      }
    }
</script>
