<template>
  <div class="grid__cell" :class="[cellClass]">
      <div class="fb-select" :class="[{ 'fb-select_active': inActive }, { 'fb-select_opened': isOpened }, { 'fb-select_disabled': disabled }]">
        <span class="fb-select__label">{{ label || $lang.FORMS_SELECT_LABEL }}</span>
        <multiselect
          :show-labels="false"
          :multiple="multiple"
          :placeholder="placeholderText || $lang.FORMS_SELECT_PLACEHOLDER"
          v-model="selected"
          :options="selectOptions"
          label="name"
          track-by="value"
          :hide-selected="true"
          :disabled="isDisabled"
          class="fb-select__field"
          @open="isOpened = true"
          @close="isOpened = false"
          ref="select"
        />
      </div>
    </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';

  let _retry = 10

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
        type: Array,
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
        isOpened: false
      }
    },


    computed: {

      value: {

        get() {
          return this.multiple ?
                  this.selected.map( item => item.value) :
                  this.selected.value;
        },

        set( value ) {
          if ( this.multiple ) {
            this.selected = this.selectOptions.filter( item => {
              return value.includes(item.value);
            })
          } else {
            this.selected = this.selectOptions.find( item => {
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
      }
    },


    mounted() {
      this.$nextTick( this.wrapTabEvents )
    }
  }
</script>
