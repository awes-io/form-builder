<template>
    <div class="fb__input fb__input_slug grid__cell"
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

          <div class="fb__input-wrap">
              <span class="fb__input-inner">
                  <label class="input__label" :for="'#' + inputId">{{ label }}</label>
                  <input v-bind="$attrs"
                         :id="inputId"
                         :class="['input__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
                         :data-awes="$options.name + '.' + name"
                         :maxlength="maxLength || _config.length"
                         type="text"
                         :disabled="isDisabled"
                         v-model="value"
                         @input="toggleWatcher"
                         @focus="inFocus = true"
                         @blur="slugBlur"
                         @keydown.enter.prevent="focusNext"
                         ref="element">
              </span>
              <span class="fb__input-domain">.{{ domain || _config.domain }}</span>
          </div>

        </fb-error-wrap>
      </div>
    </div>
</template>

<script>
    import fbInput from './fb-input.vue'
    import _config from '../js/config.js'

    export default {

        name: 'fb-company-slug',

        extends: fbInput,


        props: {

            domain: String,

            input: {
                type: String,
                required: true
            },

            maxLength: Number,
        },


        data() {
            return {
                watchInput: true
            }
        },


        computed: {

            fromName() {
                return this.multiblock ? `${this.multiblock}.${this.id}.${this.input}` : this.input
            },

            fromValue() {
                return this.$awesForms.getters['fieldValue'](this.formId, this.fromName);
            }
        },


        watch: {

            fromValue( val ) {
                if ( ! this.watchInput || ! val ) return
                this.value = this.noramlizeUrl(val) 
            }
        },


        methods: {

            noramlizeUrl( string ) {
                return this._toUrl(string).substr(0, this.maxlength)
            },

            toggleWatcher( $event ) {
                if ( $event.target.value === '' ) {
                    this.watchInput = true
                } else if ( this.watchInput ) {
                    this.watchInput = false
                }
            },
            
            slugBlur( $event ) {
                this.inFocus = false
                if ( ! this.watchInput ) {
                    this.value = this.noramlizeUrl( $event.target.value )
                }
            }
        },


        beforeCreate() {
            this._config = Object.assign({}, _config.companySlug, AWES._config.companySlug)
            this._toUrl = Urlify.create(this._config.ulrifyOptions)
        }
    }
</script>
