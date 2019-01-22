<template>
    <form
      class="form-builder"
      :class="{'modal__form': modal}"
      :action="url"
      :method="method">

      <div class="grid grid_forms">
        <slot :fields="workingState" />
      </div>

      <div v-if="! autoSubmit"
           :class="modal ? 'line-btns' : null">
        <div :class="modal ? 'line-btns__wrap' : 'line-btns'">

            <button
              class="btn btn-send waves-effect waves-button"
              :class="{ 'loading-inline': showLoader }"
              :disabled="!isEdited || isBlocked"
              :data-loading="$lang.FORMS_LOADING"
              type="submit"
              data-awes="modal_button_ok"
              v-shortkey="['ctrl', 'enter']"
              @shortkey="send"
              @click.prevent="send"
              @click.native.prevent="send">
              {{ sendText || $lang.FORMS_SEND }} <span class="g-res--tablet-lg_n">(ctrl+enter)</span> 
            </button>  <!-- v-waves.button -->
            
            <button v-if="modal || cancelbtn"
              class="btn waves-effect waves-button"
              :class="{'btn_transparent': cancelbtn}"
              type="button"
              v-shortkey="['esc']"
              @shortkey="close"
              @click.prevent="modal ? close() : $emit('cancel')">
              {{ cancelText || $lang.FORMS_CANCEL }}
            </button> <!-- v-waves.button -->
            
            <slot name="buttons-after"></slot>
        </div>
      </div>

    </form>
</template>

<script>
  let _uniqFormId = 0;

  const UNLOAD_EVENTS = [{
    type: 'beforeunload',
    handler: 'windowUnloadHandler'
  },
  {
    type: 'popstate',
    handler: 'popStateHandler'
  }];

  export default {

    name: "form-builder",


    props: {

      cancelbtn: {
        type: Boolean,
        default: false
      },

      name: {
        type: String,
        default: () => `form-builder-${ _uniqFormId++ }`
      },

      url: {
        type: String,
        required: true
      },

      sendText: String,

      cancelText: String,
      
      loadingText: String,

      default: {
        type: Object,
        default: null
      },

      method: {
        type: String,
        default: 'post',
        validator( method ) {
          return method === undefined ||
                 ['get', 'put', 'post', 'delete', 'patch'].includes( method.toLowerCase() )
        }
      },

      storeData: String,

      disabledDialog: {
        type: Boolean,
        default: false
      },

      autoSubmit: {
        type: Boolean,
        default: false
      }
    },


    inject: {
      modal: {
        from: 'modal',
        default: false
      }
    },


    provide() {
      return {
        formId: this.name,
        isModal: !!this.modal
      }
    },
    
    
    data() {
        return {
            loading: false,
            serverData: null,
            serverDataErrors: null,
            showLoader: false
        }
    },


    computed: {

      form() {
        return this.$awesForms.getters['form'](this.name)
      },

      isEdited() {
        return this.$awesForms.getters['isEdited'](this.name)
      },
      
      isBlocked() {
        return this.$awesForms.getters['isBlocked'](this.name)
      },

      workingState() {
        return this.$awesForms.getters['workingState'](this.name)
      },

      storeFormData() {
        return this.storeData ? this.$awesForms.state[this.storeData] : false;
      },

      usedFormData() {
        if ( this.storeFormData ) {
          if ( this.default ) {
            console.warn('Only VUEX STORE data will be used, despite DEFAULT data exists')
          }
          return this.storeFormData
        } else if ( this.default ) {
          return this.default
        } else {
          return false
        }
      }
    },

    watch: {

      usedFormData: {
        handler: function( fields ) {
          if ( this.form ) return // only once, to create form
          this.createForm();
          if ( fields ) {
            this.$awesForms.commit('setDefaultData', {
              id: this.name,
              fields,
            })
          }
        },
        deep: true,
        immediate: true
      },

      loading( isLoading ) {
        this.$awesForms.commit('toggleFormLoading', { id: this.name, isLoading })
      },

      serverData( data ) {
        if ( data ) {
          if ( this.storeData ) {
            this.$awesForms.commit('setData', { param: this.storeData, data: data.data });
          } else {
            this.$awesForms.commit('setDefaultData', { id: this.name, fields: data.data });
          }
          this.$awesForms.commit('resetFormEdited', this.name);
          this.serverData = null;
          this.$emit('sended', data.data);
          if ( this.modal ) this.close(this.modal.name)
        }
      },

      serverDataErrors( errors ) {
        if ( errors ) {
          this.$awesForms.commit('setErrors', { id: this.name, errors })
          this.serverDataErrors = null
          if ( !this.disabledDialog ) {
            this.addUnloadHandlers()
          }
        }
      }
    },

    methods: {

      createForm() {
        this.$awesForms.commit( 'createForm', {
          id: this.name,
          url: this.url,
          method: this.method,
          storeData: this.storeData
        })
      },

      send() {
        if ( this.loading || this.isBlocked ) return
        // invoke attached @send method if present
        if ( this.$listeners.hasOwnProperty('send') ) {
          this.$emit('send', this.workingState)
        }
        // otherwise send form with serverRequest
        else {
          this.removeUnloadHandlers()
          this.$awesForms.commit('resetErrors', this.name);
          this.loading = true;
          AWES.on('core:ajax', this.onRequestProcess )
          AWES.ajax( this.workingState, this.url, this.method )
              .then( data => { this.serverData = data })
              .catch( data => { this.serverDataErrors = data })
              .finally( () => {
                  this.loading = false;
                  this.showLoader = false;
                  AWES.off('core:ajax', this.onRequestProcess )
              })
        }
      },
      
      onRequestProcess(e) { 
        this.showLoader = e.detail
      },

      addUnloadHandlers() {
        UNLOAD_EVENTS.forEach( event => {
          window.addEventListener(event.type, this[event.handler], false)
        })
      },
      
      removeUnloadHandlers() {
        UNLOAD_EVENTS.forEach( event => {
          window.removeEventListener(event.type, this[event.handler])
        })
      },

      checkCloseAllowed() {
        if ( this.disabledDialog ) return true
        if ( this.isEdited ) {
          const answer = confirm(this.$lang.FORMS_CONFIRM)
          return answer
        } else {
          return true
        }
      },

      popStateHandler() {
        this.removeUnloadHandlers()
        if ( this.checkCloseAllowed() ) {
          if ( this.modal ) this.close()
        } else {
          const modal = this.modal ? this.modal.hash : ''
          const url = location.href + modal
          history.pushState( {modal}, document.title, url )
          this.addUnloadHandlers()
        }
      },
      
      windowUnloadHandler( $event ) {
        if ( this.disabledDialog || ! this.isEdited ) return true
        $event.returnValue = this.$lang.FORMS_CONFIRM
        return this.$lang.FORMS_CONFIRM
      },

      close() {
        if ( this.checkCloseAllowed() ) {
          this.removeUnloadHandlers()
          AWES.off(`modal::${this.modal.name}.before-close`, this.preventModalClose)
          AWES.emit(`modal::${this.modal.name}.close`)
        }
      },
      
      preventModalClose(e) {
        e.detail.preventClose()
        this.close()
      }
    },


    created() {
      this.$root.$on('forms:submit', name => {
        if ( this.name === name ) this.send()
      })
      if ( this.modal ) {
        this.__unwatchModalPrevent = this.$watch('isEdited', state => {
          AWES.on(`modal::${this.modal.name}.before-close`, this.preventModalClose)
        })
      }
    },


    mounted() {
      this.addUnloadHandlers()
      if ( this.autoSubmit ) {
        this._unwatchEdit = this.$watch('form.editCounter', this.send)
      }
    },


    beforeDestroy() {
      this.removeUnloadHandlers()
      if ( typeof this.__unwatchModalPrevent === 'function' ) this.__unwatchModalPrevent()
      this.$awesForms.commit('deleteForm', this.name)
      if ( typeof this._unwatchEdit === 'function' ) this._unwatchEdit()
      AWES.off(`modal::${this.modal.name}.before-close`, this.preventModalClose)
    }
  }
</script>
