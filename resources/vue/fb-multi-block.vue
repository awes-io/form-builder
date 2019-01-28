<template>
  <div :class="['grid__wrap multi-bl', {'multi-bl_disabled' : this.isDisabled}]">
    <div
      :class="['grid__wrap', {'multi-bl__has-close' : hasClose}]"
      v-for="( item, id ) in value"
      :key="`slot-${uniqIds[id]}`"
    >

      <slot :id="id"></slot>

      <button
        v-if="hasClose"
        aria-label="delete"
        class="multi-bl__clear"
        @click.prevent="removeField(id)">
        <i class="icon icon-cross"></i>
      </button>
    </div>

    <button
      class="multi-bl__add"
      @click.prevent="addField">
      {{ label || $lang.FORMS_MULTIBLOCK_ADD }}
    </button>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';
  import triggerEvent from '../js/utils/triggerEvent.js';

  let _uniqId = 0

  export default {

    name: 'fb-multi-block',

    mixins: [ fieldMixin ],


    props: {

      label: String,
    },


    provide() {
      return {
        multiblock: this.multiblock ? this.realName : this.name
      }
    },


    data() {
      return {
        value: [{}],
        uniqIds: []
      }
    },


    computed: {

      hasClose() {
        return this.value.length > 1
      },
      
      errors() {
        return this.$awesForms.getters.formErrorsOrFalse(this.formId)
      }
    },


    watch: {

      disabled: {
        handler: function( value ) {
          this.$awesForms.commit('toggleMultiblockState', {
            id: this.formId,
            multiblock: this.realName,
            value
          })
        },
        immediate: true
      }
    },


    methods: {

      initField() {
        if ( this.computedValue !== undefined &&
             this.computedValue.length ) {
          this.value = this.computedValue;
          for ( let i in this.computedValue ) this.uniqIds.push( _uniqId++ )
        } else {
          this.uniqIds.push( _uniqId++ )
        }
        this.createStoreInstance();
        this.__unwatchValue = this.$watch('value', this.valueHandler)
      },

      addField() {
        if ( this.isDisabled ) return
        this.value.push({})
        this.uniqIds.push( _uniqId++ )
        this.updateTooltips()
      },

      removeField( id ) {
        if ( this.isDisabled ) return
        this.$delete(this.value, id)
        this.uniqIds.splice(id, 1)
        this.updateTooltips()
      },

      resetValue() {
        this.value = [{}]
      },

      updateTooltips() {
        if ( ! this.errors ) return
        this.$nextTick( () => {
          triggerEvent('scroll', window)
        })
      }
    }
  }
</script>