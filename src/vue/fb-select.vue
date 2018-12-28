<template>
  <div class="mselect grid__cell" :class="[{ 'mselect_active': inActive }, { 'mselect_opened': isOpened }, cellClass]">
    <span class="mselect__label">{{ label || $lang.FORMS_SELECT_LABEL }}</span>
    <multiselect
      :show-labels="false"
      :multiple="multiple"
      :placeholder="placeholderText || $lang.FORMS_SELECT_PLACEHOLDER"
      v-model="selected"
      :options="selectOptions"
      label="name"
      track-by="value"
      :hide-selected="true"
      class="input__field"
      @open="isOpened = true"
      @close="isOpened = false"/>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  // const Multiselect = window.VueMultiselect.default;

  export default {

    name: "fb-select",

    inheritAttrs: false,

    mixins: [ fieldMixin ],

    // components: { Multiselect },

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
      }
    }
  }
</script>
