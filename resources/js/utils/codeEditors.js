/**
 * Load Tiny MCE modules
 *
 * @returns Promise
 */

export function loadEditor() {
    return AWES.utils.loadModules({
        'tiny-mce': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.2/tinymce.min.js',
        'tiny-mce-plugins': {
            deps: ['tiny-mce'],
            src: [
                'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.2/plugins/lists/plugin.min.js'
            ],
        }
    })
}


/**
 * Tiny MCE config
 * https://www.tiny.cloud/docs/configure/integration-and-setup/
 */
export const defaultOptions = {
    branding: false,
    statusbar: false,
    menubar: false,
    fontsize_formats: '10px 12px 14px 16px 18px 24px 36px',
    plugins: 'lists',
    toolbar: [
        'fontselect fontsizeselect bold italic underline numlist bullist'
    ],
    setup: function () {
        this.on('ExecCommand', function(e) {
            // fix font blinking
            if ( e.command === 'FontName' ) {
                e.target.getDoc().body.style.fontFamily = e.value
            }
        })
    },
    init_instance_callback: function() {
        // set default font
        this.execCommand('FontName', false, 'Arial')
    }
}


/**
 * Load CodeMirror modules
 *
 * @returns Promise
 */

export function loadCodeEditor() {
    return AWES.utils.loadModules({
        'codemirror': {
        src: [
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/codemirror.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/codemirror.css'
        ]
        },
        'codemirror-plugins': {
            deps: ['codemirror'],
            src: [
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/mode/xml/xml.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/fold/xml-fold.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/matchbrackets.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/closebrackets.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/matchtags.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/closetag.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/mode/htmlmixed/htmlmixed.min.js'
            ]
        }
    })
}


/**
 * Codemirror config
 * https://codemirror.net/doc/manual.html
 */
export const defaultCodeOptions = {
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    autoCloseTags: true,
    matchTags: true,
    mode: "htmlmixed"
}
