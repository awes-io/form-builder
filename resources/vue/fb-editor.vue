<template>
    <div class="grid__cell" :class="cellClass">
        <div class="fb-editor"
             :class="{'input_disabled': isDisabled}">
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
                    <textarea class="fb-editor__tiny" :id="editorId">{{ value }}</textarea>
                </div>
                <div class="fb-editor__tab" :key="'code'" v-show="mode === 'code'" >
                    <textarea class="fb-editor__codemirror" :id="codeEditorId" ref="code">{{ value }}</textarea>
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
            const options = Object.assign({}, this.options, defaultOptions)
            tinymce.init(options)
            tinymce.get(this.editorId).on('Change', _.debounce(this.save, 1000))
        },
        
        initCodeEditor() {
            this.codeEditorInited = true
            codeEditor = CodeMirror.fromTextArea( this.$refs.code, defaultCodeOptions)
            codeEditor.on('update', _.debounce(this.save, 1000));
            return codeEditor
        },

        save() {
            console.log('save');
            this.mode === 'visual' ? this._saveVisual() : this._saveCode()
        },

        _saveVisual() {
            this.value = tinymce.get(this.editorId).save()
        },

        _saveCode() {
            this.value = codeEditor.doc.getValue()
        },

        _setCodeValue() {
            codeEditor.doc.setValue( this.value )
            setTimeout( () => { codeEditor.refresh() }, 1)
        }
    },


    mounted() {
        AWES.on('form-builder:before-send', this.save)
        this.$nextTick( this.initEditor )
    },


    beforeDestroy() {
        AWES.off('form-builder:before-send', this.save)
    }
}
</script>
