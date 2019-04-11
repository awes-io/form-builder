import { name, version } from '../../package.json'
import plugin from './plugin'
import lang from './modules/lang'
import formsModule from './store/forms'

const awesPlugin = {

    name, version,

    modules: {
        'vue-shortkey': {
            src: 'https://unpkg.com/vue-shortkey/dist/index.js',
            deps: ['vue'],
            cb() { Vue.use(VueShortkey) }
        },
        'v-tooltip': {
            src: 'https://unpkg.com/v-tooltip/dist/v-tooltip.min.js',
            deps: ['vue'],
            cb() {
                VTooltip.default.options.popover = Object.assign(VTooltip.default.options.popover, {
                    defaultPlacement: 'right',
                    defaultAutoHide: false,
                    defaultTrigger: 'manual',
                    defaultPopperOptions: {
                        modifiers: {
                            flip: {
                                behavior: ['right', 'top']
                            }
                        }

                    }
                })
            }
        },
        'vue-the-mask': {
            src: 'https://unpkg.com/vue-the-mask@0.11.1/dist/vue-the-mask.js',
            deps: ['vue']
        }
    },

    install(AWES) {
        Vue.use(plugin)
        AWES._store.registerModule('forms', formsModule)
        AWES.lang = lang
    }
}

if (window && ('AWES' in window)) {
    AWES.use(awesPlugin)
} else {
    window.__awes_plugins_stack__ = window.__awes_plugins_stack__ || []
    window.__awes_plugins_stack__.push(awesPlugin)
}
