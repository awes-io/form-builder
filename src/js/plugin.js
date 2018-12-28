// import store module
import storeModule from './store-module'

// importing components
import formBuilder from '../vue/form-builder.vue'
import fbInput from '../vue/fb-input.vue'
import fbMultiBlock from '../vue/fb-multi-block.vue'
import fbCheckbox from '../vue/fb-checkbox.vue'
import fbSelect from '../vue/fb-select.vue'
import fbTextarea from '../vue/fb-textarea.vue'

export function install(Vue) {

    try {
        Vue.prototype.$awesForms = new Vuex.Store(storeModule)
    } catch (e) {
        console.log('Error creating store :', e);
    }

    Vue.component('form-builder', formBuilder)
    Vue.component('fb-input', fbInput)
    Vue.component('fb-multi-block', fbMultiBlock)
    Vue.component('fb-checkbox', fbCheckbox)
    Vue.component('fb-select', fbSelect)
    Vue.component('fb-textarea', fbTextarea)
}

export const plugin = {
    install
}

export function updateMountedComponents(VueInstance) {

    VueInstance.$options.components = Object.assign( VueInstance.$options.components, {
        formBuilder,
        fbInput,
        fbMultiBlock,
        fbCheckbox,
        fbSelect,
        fbTextarea
    })
}
