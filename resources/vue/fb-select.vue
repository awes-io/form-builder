<template>
  <div class="grid__cell" :class="[cellClass]">
      <div class="fb-select" :class="[{ 'fb-select_active': inActive }, { 'fb-select_opened': isOpened }, { 'fb-select_disabled': disabled }]">
        <span class="fb-select__label">{{ label || $lang.FORMS_SELECT_LABEL }}</span>
        <multiselect
          :show-labels="false"
          :multiple="multiple"
          :hide-selected="multiple"
          :placeholder="placeholderText || defaultPlaceholder"
          :internal-search="isAjax ? false : true"
          :loading="isLoading"
          v-model="selected"
          :options="usedOptions"
          label="name"
          track-by="value"
          :disabled="isDisabled"
          class="fb-select__field"
          @open="isOpened = true"
          @close="isOpened = false"
          v-on="isAjax ? {'search-change': ajaxSearch } : null"
          ref="select"
        >
          <template slot="noOptions">{{ $lang.FORMS_SELECT_EMPTY }}</template>
        </multiselect>
      </div>
    </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';

  let _retry = 10 // times
  const AJAX_DEBOUNCE = 1000 // ms

  export default {

    name: "fb-select",

    // inheritAttrs: false,

    mixins: [ fieldMixin ],

    components: {
        Multiselect: resolve => {
            AWES.utils.loadModules({
                'vue-multiselect': {
                    src: ['https://unpkg.com/vue-multiselect@2.1.3/dist/vue-multiselect.min.js',
                          'https://unpkg.com/vue-multiselect@2.1.3/dist/vue-multiselect.min.css'],
                    deps: ['vue'],
                    cb() { resolve(window.VueMultiselect.default) }
                },
            })
        }
    },

    props: {

      label: String,

      selectOptions: {
        type: [String, Array],
        default: () => []
      },

      multiple: {
        type: Boolean,
        default: true
      },

      placeholderText: String
    },


    data() {
      return {
        selected: [],
        isOpened: false,
        isLoading: false,
        ajaxOptions: []
      }
    },


    computed: {

      value: {

        get() {
          return this.multiple ?
                  this.selected.map( item => item.value) :
                  this.selected && this.selected.value;
        },

        set( value ) {
          if ( this.multiple ) {
            this.selected = this.usedOptions.filter( item => {
              return value.includes(item.value);
            })
          } else {
            this.selected = this.usedOptions.find( item => {
              return value === item.value;
            })
          }
        }
      },

      hasValue() {
        return !! ( this.multiple ? this.value.length : this.value );
      },

      inActive() {
        return this.isOpened || this.hasValue;
      },

      isAjax() {
        return typeof this.selectOptions === 'string'
      },

      defaultPlaceholder() {
        return this.$lang[this.isAjax ? 'FORMS_SELECT_AJAX_PLACEHOLDER' : 'FORMS_SELECT_PLACEHOLDER']
      },

      usedOptions() {
        return this.isAjax ? this.ajaxOptions : this.selectOptions
      }
    },


    watch: {

      selected(newValue) {
        if (newValue) {
          this.$emit('change', newValue)
        }
      }
    },


    methods: {

      resetValue( formId ) {
        if ( this.formId !== formId ) return
        this.value = []
      },

      wrapTabEvents() {
        try {
          this.$refs.select.$el.querySelector('.multiselect__input').classList.add('is-focusable')
        } catch(e) {
          _retry--
          if (_retry) setTimeout(this.wrapTabEvents, 500)
        }
      },

      ajaxSearch(search) {
        if ( ! search ) return
        clearTimeout(this.__search)
        this.isLoading = true
        this.__search = setTimeout(() => {
          AWES.ajax({}, this.selectOptions.replace('%s', search), 'get')
            .then( res => {
              if ( res.success === true ) {
                this.ajaxOptions = res.data
              } else {
                this.ajaxOptions = []
              }
              this.isLoading = false
            })
        }, AJAX_DEBOUNCE);
      }
    },


    mounted() {
      this.$nextTick( this.wrapTabEvents )
    }
  }
</script>
