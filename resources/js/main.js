import plugin from './plugin'
import lang from './lang.js'
import storeModule from './modules/store-module'
import storeShared from './store-shared'

const awesPlugin = {

    modules: {
        'vue': {
            src: 'https://unpkg.com/vue@2.5.21/dist/vue.min.js',
            cb() {
                Vue.use(plugin)
            }
        },
        'vuex': {
            src: 'https://unpkg.com/vuex@2.5.0/dist/vuex.min.js',
            deps: ['vue'],
            cb() {
                AWES._store = AWES._store || new Vuex.Store(storeShared)
                AWES._store.registerModule('forms', storeModule)
            }
        },
        'vue-shortkey': {
            src: 'https://unpkg.com/vue-shortkey@3',
            deps: ['vue'],
            cb() { Vue.use(VueShortkey) }
        },
        'v-tooltip': {
            src: 'https://unpkg.com/v-tooltip@2.0.0-rc.33/dist/v-tooltip.min.js',
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

    install() {
        AWES.lang = lang
    }
}

if (window && ('AWES' in window)) {
    AWES.use(awesPlugin)
} else {
    window.__awes_plugins_stack__ = window.__awes_plugins_stack__ || []
    window.__awes_plugins_stack__.push(awesPlugin)
}
