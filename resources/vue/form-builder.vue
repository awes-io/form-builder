<template>
    <form
        class="form-builder"
        :class="{'modal_form': modal}"
        :action="replacedUrl"
        :method="method"
        @submit.prevent="send"
    >

        <slot v-bind="fields"></slot>

        <div v-show="! autoSubmit" class="line-btns">
            <!-- :class="modal ? 'line-btns' : null">
            <div :class="modal ? 'line-btns__wrap' : 'line-btns'"> -->

                <button
                    class="form-builder__send btn has-wave"
                    :class="{ 'loading-inline': isLoading }"
                    :disabled="!isEdited || isLoading"
                    :data-loading="$lang.FORMS_LOADING"
                    type="submit"
                    data-awes="modal_button_ok"
                    v-shortkey="{ctrlEnter: ['ctrl', 'enter'], cmdEnter: ['meta', 'enter'], ctrlS: ['ctrl', 's'], cmdS: ['meta', 's']}"
                    @shortkey="send"
                >
                    {{ sendText || $lang.FORMS_SEND }}
                    <span class="wave"></span>
                </button>

                <button v-if="modal || $listeners.cancel"
                    class="form-builder__cancel btn btn_transparent has-wave"
                    type="button"
                    v-shortkey="['esc']"
                    v-on="{
                        shortkey: close,
                        click: modal ? close : $listeners.cancel
                    }"
                >
                    {{ cancelText || $lang.FORMS_CANCEL }}
                    <span class="wave"></span>
                </button>

                <slot name="buttons-after"></slot>
            <!-- </div> -->
        </div>
    </form>
</template>

<script>

let _uniqFormId = 0;

const UNLOAD_EVENTS = [
    {
        type: 'beforeunload',
        handler: 'windowUnloadHandler'
    },
];

export default {

    name: 'form-builder',

    props: {

        name: {
            type: String,
            default() {
                return `form-builder-${ _uniqFormId++ }`
            }
        },

        url: {
            type: String,
            required: true
        },

        method: {
            type: String,
            default: 'post',
            validator( method ) {
            return method === undefined ||
                    ['get', 'put', 'post', 'delete', 'patch'].includes( method.toLowerCase() )
            }
        },

        default: Object,

        storeData: String,

        sendText: String,

        cancelText: String,

        loadingText: String,

        disabledDialog: {
            type: Boolean,
            default: false
        },

        autoSubmit: {
            type: Boolean,
            default: false
        },

        debounce: {
            type: [String, Number],
            default: 400
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
        isModal: this.modal !== false
      }
    },


    computed: {

        form() {
            return this.$store.state.forms[this.name]
        },

        isLoading() {
            return this.form && this.form.isLoading
        },

        isEdited() {
            return this.form && this.form.isEdited
        },

        fields() {
            return this.$store.getters['forms/fields'](this.name)
        },

        replacedUrl() {
            let url = this.url
            if ( this.form ) {
                let props = url.match(/(?!{)([\w.\[\]]+)(?=})/g)
                props && props.length && props.forEach( prop => {
                    url = url.replace('{' + prop + '}', AWES.utils.object.get(this.form.initialState, prop, ''))
                })
            }
            return url.replace(/([^:]\/)\/+/g, '$1')
        }
    },


    methods: {

        send() {

            if ( this.isLoading || ! this.isEdited ) return

            this._returnFocus = document.activeElement

            AWES.emit(`form-builder::${this.name}:before-send`)

            if ( this.$listeners.send ) {
                this.$store.dispatch('forms/restoreData', {
                    formName: this.name
                }).then( data => {
                    this.$emit('send', data)
                })
            } else {
                this.$store.dispatch('forms/sendForm', {
                    formName: this.name,
                    url: this.replacedUrl,
                    method: this.method
                }).then( res => {
                    this.$emit(res.success ? 'sended' : 'error', res.data)
                    if ( this.storeData && res.success ) {
                        this.$store.$set(this.storeData, this.$get(res.data, 'data', {}))
                    }

                    if ( this._returnFocus && typeof this._returnFocus.focus === 'function' ) {
                        this._returnFocus.focus()
                        delete this._returnFocus
                    }

                    if ( this.modal && res.success ) this.close()
                })
            }
        },

        autoSubmitSend() {

            if ( this.isLoading ) return

            clearTimeout(this.__debounce)

            this.__debounce = setTimeout(this.send, Number(this.debounce))
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

        windowUnloadHandler( $event ) {
            if ( this.disabledDialog || ! this.isEdited ) return true
            $event.returnValue = this.$lang.FORMS_CONFIRM
            return this.$lang.FORMS_CONFIRM
        },

        close() {
            if ( this.checkCloseAllowed() ) {
                this.removeUnloadHandlers()
                AWES.off(`modal::${this.modal.name}:before-close`, this.preventModalClose)
                this.modal.close()
            }
        },

        preventModalClose(e) {
            if ( ! this.checkCloseAllowed() ) {
                e.detail.preventClose()
            }
        }
    },


    created() {

        // get default values
        let fields = this.storeData ? this.$store.state[this.storeData] : (this.default || {})

        // create storage record
        this.$store.commit('forms/createForm', {
            formName: this.name,
            fields
        })

        // set watcher for modal close method
        if ( this.modal ) {
            this.$watch('isEdited', edited => {
                AWES[edited ? 'on': 'off'](`modal::${this.modal.name}:before-close`, this.preventModalClose)
            })
        }
    },


    mounted() {
        this.addUnloadHandlers()
        if ( this.autoSubmit ) {
            this.$watch('fields', this.autoSubmitSend, {deep: true} )
        }
    },


    beforeDestroy() {
        delete this._returnFocus
        this.removeUnloadHandlers()
    },


    destroyed() {
        AWES.off(`modal::${this.modal.name}:before-close`, this.preventModalClose)
        this.$store.commit('forms/deleteForm', this.name)
    }
}
</script>