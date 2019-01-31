<template>
    <div class="grid__cell" :class="cellClass">
        <div class="fb-editor" :class="[{'fb-editor_disabled': isDisabled}]">
            <div class="fb-editor__modes">
                <button
                    :class="['fb-editor__modes-button', {'is-active': mode === 'visual'}]"
                    type="button"
                    @click="mode = 'visual'"
                >
                    {{ $lang.FORMS_EDITOR_VISUAL }}
                </button>
                <button
                    :class="['fb-editor__modes-button', {'is-active': mode === 'code'}]"
                    type="button"
                    @click="mode = 'code'"
                >
                    {{ $lang.FORMS_EDITOR_CODE }}
                </button>
            </div>
            <div class="fb-editor__tabs">
                <div class="fb-editor__tab" :key="'visual'" v-show="mode === 'visual'">
                    <textarea class="fb-editor__tiny" :id="editorId" :disabled="isDisabled">{{ value }}</textarea>
                </div>
                <div class="fb-editor__tab" :key="'code'" v-show="mode === 'code'" >
                    <textarea class="fb-editor__codemirror" :id="codeEditorId" ref="code" :disabled="isDisabled">{{ value }}</textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import fieldMixin from './mixins/fb-field.js';
import {
    defaultOptions,
    defaultCodeOptions,
    loadCodeEditor
} from '../js/utils/codeEditors.js'

let _uid = 0,
    codeEditor

export default {

    name: 'fb-editor',

    mixins: [ fieldMixin ],

    props: {

        options: {
            type: Object,
            default: () => ({})
        }
    },


    data() {
        return {
            editorId: 'fb-editor-' + _uid,
            codeEditorId: 'fb-code-editor-' + _uid++,
            mode: 'visual',
            codeEditorInited: false,
            value: ''
        }
    },


    watch: {

        mode(mode) {
            if ( mode === 'visual' ) {
                this._saveCode()
                tinymce.get(this.editorId).setContent(this.value)
            } else {
                this._saveVisual()
                if ( ! this.codeEditorInited ) {
                    loadCodeEditor()
                        .then( this.initCodeEditor )
                        .then( this._setCodeValue )
                } else {
                    this._setCodeValue()
                }
            }
        }
    },


    methods: {

        initEditor() {
            defaultOptions.selector = '#' + this.editorId
            let options = _.get(AWES._config, 'formBuilder.fbEditor', {})
            Object.assign(options, this.options, defaultOptions)
            tinymce.init(options)
            const editor = tinymce.get(this.editorId)
            editor.on('Change', _.debounce(this.save, 1000))
            if ( typeof AWES._theme !== undefined ) {
                editor.once('Init', () => {
                    this._switchThemeAttribute({detail: AWES._theme})
                })
            }
        },

        initCodeEditor() {
            this.codeEditorInited = true
            codeEditor = CodeMirror.fromTextArea( this.$refs.code, defaultCodeOptions)
            codeEditor.on('update', _.debounce(this.save, 1000));
            return codeEditor
        },

        save() {
            this.mode === 'visual' ? this._saveVisual() : this._saveCode()
        },

        _saveVisual() {
            this.value = tinymce.get(this.editorId).save()
        },

        _saveCode() {
            if ( codeEditor ) this.value = codeEditor.doc.getValue()
        },

        _setCodeValue() {
            codeEditor.doc.setValue( this.value )
            setTimeout( () => { codeEditor.refresh() }, 1)
        },

        _switchThemeAttribute($event) {
            const doc = tinymce.get(this.editorId).getDoc()
            if ( $event.detail === 1 ) {
                doc.documentElement.setAttribute('data-dark', true)
            } else {
                doc.documentElement.removeAttribute('data-dark')
            }
        }
    },


    mounted() {
        AWES.on('form-builder:before-send', this.save)
        this.$nextTick( this.initEditor )
        if ( typeof AWES._theme !== undefined ) {
            AWES.on('theme.change', this._switchThemeAttribute)
        }
    },


    beforeDestroy() {
        AWES.off('form-builder:before-send', this.save)
        if ( typeof AWES._theme !== undefined ) {
            AWES.off('theme.change', this._switchThemeAttribute)
        }
    }
}
</script>
