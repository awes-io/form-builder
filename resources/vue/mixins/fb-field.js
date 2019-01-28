export default {

  props: {

    name: {
      type: String,
      required: true
    },

    id: Number,

    disabled: {
      type: Boolean,
      default: false
    },

    cell: {
      type: [String, Number],
      validator( cell ) {
        return [ '2', '3' ].includes( cell.toString() );
      }
    }
  },


  inject: {
    formId: {
      from: 'formId',
      default: false
    },
    isModal: {
      from: 'isModal',
      default: false
    },
    multiblock: {
      from: 'multiblock',
      default: false
    }
  },


  data() {
    return {
      tooltip: false,
      hasError: false
    }
  },


  computed: {

    realName() {
      return this.multiblock ? `${this.multiblock}.${this.id}.${this.name}` : this.name
    },

    computedValue() {
      return this.$awesForms.getters.fieldValue(this.formId, this.realName);
    },

    formLoading() {
      return this.$awesForms.getters.loading(this.formId);
    },

    inActive() {
      return !!(this.inFocus || this.value);
    },

    isDisabled() {
      return this.formLoading || this.disabled || this.isMultiblockDisabled;
    },

    isMultiblockDisabled() {
      return this.multiblock ?
             this.$awesForms.getters.multiblockDisabled(this.formId, this.multiblock) :
             false
    },

    cellClass() {
      return (this.cell) ? 'grid__cell_' + this.cell : '';
    },

    error() {
      return this.$awesForms.getters.fieldError(this.formId, this.realName);
    },

    firstErrorField() {
      return this.$awesForms.getters.firstErrorField(this.formId);
    },

    shake() {
      return !this.formLoading && this.tooltip;
    }
  },


  watch: {

    error: {
      handler: function( errors ) {
        if ( errors ) {
          this.tooltip = true;
          this.hasError = true;
          if ( this.$refs.element ) {
            this.$refs.element.addEventListener('input', this.resetError, false)
          }
          if ( typeof this.setFocus === 'function' ) {
            this.$nextTick( this.checkFocus )
          }
        } else {
          this.tooltip = false;
          this.hasError = false;
          this.resetInputWatcher();
        }
      },
      immediate: true
    }
  },


  methods: {

    createStoreInstance() {
      this.$awesForms.commit('setField', {
        id: this.formId,
        fieldName: this.realName,
        value: this.value,
        initial: true
      });
    },

    initField() {
      if ( this.computedValue !== undefined ) {
        this.value = this.computedValue;
      }
      this.createStoreInstance()
      this.__unwatchValue = this.$watch('value', this.valueHandler);
      if ( this.multiblock ) {
        this.__unwatchId= this.$watch('id', this.idHandler)
      }
    },

    idHandler(newVal, oldVal) {
      const oldName = `${this.multiblock}.${oldVal}.${this.name}`;
      const oldError = this.$awesForms.getters.fieldError(this.formId, oldName);
      if ( oldError ) {
        this.$awesForms.commit('renameError', {
          id: this.formId,
          oldName,
          newName: this.realName,
          message: oldError
        })
      }
    },

    valueHandler( newVal ) {
      this.$awesForms.commit('setField', {
        id: this.formId,
        fieldName: this.realName,
        value: newVal
      });
    },

    clickTooltip() {
      this.tooltip = false;
      if ( typeof this.setFocus === 'function' ) this.setFocus();
    },

    resetError() {
      this.tooltip = false;
      this.$awesForms.commit('resetError', { id: this.formId, fieldName: this.realName });
      this.resetInputWatcher();
    },

    resetInputWatcher() {
      if ( this.$refs.element ) {
        this.$refs.element.removeEventListener('input', this.resetError)
      }
    },

    resetValue( formId ) {
      if ( this.formId !== formId ) return
      this.value = undefined
    },

    checkFocus() {
      if ( this.firstErrorField  === this.realName ) {
        setTimeout( this.setFocus, 0 )
        this.$awesForms.commit('resetFirstErrorField', this.formId)
      }
    }
  },


  created() {
    this.initField();
    this.$root.$on('forms:reset', this.resetValue)
  },


  beforeDestroy() {
    if ( this.multiblock ) {
      this.resetError()
      this.$awesForms.commit('unsetRealField', { id: this.formId, fieldName: this.realName });
    }
    this.__unwatchValue();
    if ( typeof this.__unwatchId === 'function' ) this.__unwatchId()
    this.resetInputWatcher();
    this.$root.$off('forms:reset', this.resetValue)
  }
}
