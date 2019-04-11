<template>
    <div class="fb-editor fb-element" :class="[{'fb-editor_disabled': isDisabled}]">
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
                <textarea class="fb-editor__tiny" :id="editorId" :disabled="isDisabled">{{ formValue }}</textarea>
            </div>
            <div class="fb-editor__tab" :key="'code'" v-show="mode === 'code'" >
                <textarea class="fb-editor__codemirror" :id="codeEditorId" ref="code" :disabled="isDisabled">{{ formValue }}</textarea>
            </div>
        </div>
    </div>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field';
import {
    defaultOptions,
    defaultCodeOptions,
    loadCodeEditor
} from '../js/utils/codeEditors'

const SAVE_DEBOUNCE = 1000
let _uid = 0

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
            codeEditorInited: false
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
            let options = AWES.utils.object.get(AWES._config, 'formBuilder.fbEditor', {})
            if ( this.focus ) options.auto_focus = this.editorId
            Object.assign(options, this.options, defaultOptions)

            tinymce.init(options)
            const editor = tinymce.get(this.editorId)
            editor.on('Change', this._debounceSave)
            if ( typeof AWES._theme !== undefined ) {
                editor.once('Init', () => {
                    this._switchThemeAttribute({detail: AWES._theme})
                })
            }
        },

        initCodeEditor() {
            this.codeEditorInited = true
            this._codeEditor = CodeMirror.fromTextArea( this.$refs.code, defaultCodeOptions)
            this._codeEditor.on('update', this._debounceSave);
            return this._codeEditor
        },

        save() {
            this.mode === 'visual' ? this._saveVisual() : this._saveCode()
        },

        _debounceSave() {
            clearTimeout(this._debounce)
            this._debounce = setTimeout(this.save, SAVE_DEBOUNCE);
        },

        _saveVisual() {
            this.formValue = tinymce.get(this.editorId).save()
        },

        _saveCode() {
            if ( this._codeEditor ) this.formValue = this._codeEditor.doc.getValue()
        },

        _setCodeValue() {
            this._codeEditor.doc.setValue( this.formValue )
            setTimeout( () => { this._codeEditor.refresh() }, 1)
        },

        _switchThemeAttribute($event) {
            const doc = tinymce.get(this.editorId).getDoc()
            if ( $event.detail === 1 ) {
                doc.documentElement.setAttribute('data-dark', true)
            } else {
                doc.documentElement.removeAttribute('data-dark')
            }
        },

        setFocus(state) {
            try {
                if (state !== false) {
                    if ( this.mode === 'visual' ) {
                        tinymce.get(this.editorId).focus()
                    } else if ( this._codeEditor ) {
                        this._codeEditor.focus()
                    }
                }
            } catch (e) {
                console.warn('Error while setting focus');
                console.error(e)
            }
        }
    },


    mounted() {
        if ( this.formId ) {
            AWES.on(`form-builder::${this.formId}:before-send`, this.save)
        }
        this.$nextTick( this.initEditor )
        if ( typeof AWES._theme !== undefined ) {
            AWES.on('theme.change', this._switchThemeAttribute)
        }
    },


    beforeDestroy() {
        if ( this.formId ) {
            AWES.off(`form-builder::${this.formId}:before-send`, this.save)
        }
        if ( typeof AWES._theme !== undefined ) {
            AWES.off('theme.change', this._switchThemeAttribute)
        }
    }
}
</script>
