<template>
    <form
        class="form-builder"
        :class="{'modal_form': modal}"
        :action="replacedUrl"
        :method="method"
        @submit.prevent="send"
    >

        <slot v-bind="fields"></slot>

        <div v-if="! autoSubmit"
            :class="modal ? 'line-btns' : null">
            <div :class="modal ? 'line-btns__wrap' : 'line-btns'">

                <button
                    class="btn btn-send waves-effect waves-button"
                    :class="{ 'loading-inline': isLoading }"
                    :disabled="!isEdited || isLoading"
                    :data-loading="$lang.FORMS_LOADING"
                    type="submit"
                    data-awes="modal_button_ok"
                    v-shortkey="['ctrl', 'enter']"
                    @shortkey="send"
                >
                    {{ sendText || $lang.FORMS_SEND }}
                </button><!-- v-waves.button -->

                <button v-if="modal || $listeners.cancel"
                    class="btn waves-effect waves-button"
                    :class="{'btn_transparent': $listeners.cancel}"
                    type="button"
                    v-shortkey="['esc']"
                    v-on="{
                        shortkey: close,
                        click: modal ? close : $listeners.cancel
                    }"
                >
                    {{ cancelText || $lang.FORMS_CANCEL }}
                </button><!-- v-waves.button -->

                <slot name="buttons-after"></slot>
            </div>
        </div>
    </form>
</template>

<script>
import {
    _get
} from '../js/modules/helpers'

let _uniqFormId = 0;

const UNLOAD_EVENTS = [
    {
        type: 'beforeunload',
        handler: 'windowUnloadHandler'
    },
    {
        type: 'popstate',
        handler: 'popStateHandler'
    }
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


    computed: {

        form() {
            return AWES._store.state.forms[this.name]
        },

        isLoading() {
            return this.form && this.form.isLoading
        },

        isEdited() {
            return this.form && this.form.isEdited
        },

        fields() {
            return AWES._store.getters['forms/fields'](this.name)
        },

        replacedUrl() {
            let url = this.url
            if ( this.form ) {
                let props = url.match(/(?!{)([\w.\[\]]+)(?=})/g)
                props && props.length && props.forEach( prop => {
                    url = url.replace('{' + prop + '}', _get(this.form.initialState, prop, ''))
                })
            }
            return url.replace(/(\/\/+)/g, '/')
        }
    },


    methods: {

        send() {

            if ( this.isLoading || ! this.isEdited ) return

            AWES.emit('form-builder:before-send')

            if ( this.$listeners.send ) {
                AWES._store.dispatch('forms/restoreData', {
                    formName: this.name
                }).then( data => {
                    this.$emit('send', data)
                })
            } else {
                AWES._store.dispatch('forms/sendForm', {
                    formName: this.name,
                    url: this.replacedUrl,
                    method: this.method
                }).then( res => {
                    this.$emit(res.success ? 'sended' : 'error', res.data)
                })
            }
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

        // get default values
        let fields = this.storeData ? AWES._store[this.storeData] : (this.default || {})

        // create storage record
        AWES._store.commit('forms/createForm', {
            formName: this.name,
            fields
        })

        // set watcher for modal close method
        if ( this.modal ) {
            this.$watch('isEdited', edited => {
                AWES[edited ? 'on': 'off'](`modal::${this.modal.name}.before-close`, this.preventModalClose)
            })
        }
    },


    mounted() {
        this.addUnloadHandlers()
        if ( this.autoSubmit ) {
            this.$watch('fields', this.send )
        }
    },


    beforeDestroy() {
        this.removeUnloadHandlers()
    },


    destroyed() {
        AWES.off(`modal::${this.modal.name}.before-close`, this.preventModalClose)
        AWES._store.commit('forms/deleteForm', this.name)
    }
}
</script>