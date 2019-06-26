import { name, version } from '../../package.json'
import plugin from './plugin'
import lang from './modules/lang'
import formsModule from './store/forms'
import VueTheMask from 'vue-the-mask'
import VueShortkey from 'vue-shortkey'

const awesPlugin = {

    name, version,

    install(AWES) {
        Vue.use(VueShortkey)
        Vue.use(VueTheMask)
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
