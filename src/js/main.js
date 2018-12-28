import { plugin, updateMountedComponents } from './plugin'
import formBuilder from '../vue/form-builder.vue'
import fbInput from '../vue/fb-input.vue'
import lang from './lang.js'

let counter = 200

;(function main() {

  if ( window && ( 'AWES' in window ) ) {

    AWES.use({

      modules: {
        'vue': {
            src: 'https://unpkg.com/vue@2.5.21/dist/vue.js',
            cb() { Vue.config.ignoredElements.push('form-builder', /^fb-/) }
        },
        'lodash': 'https://unpkg.com/lodash@4.17.11/lodash.min.js',
        'vuex': {
            src: 'https://unpkg.com/vuex@2.5.0/dist/vuex.min.js',
            deps: ['vue']
        },
        'vue-shortkey': {
            src: 'https://unpkg.com/vue-shortkey@3',
            deps: ['vue'],
            cb() { Vue.use(VueShortkey) }
        },
        'v-tooltip': {
            src: 'https://unpkg.com/v-tooltip@2.0.0-rc.33/dist/v-tooltip.min.js',
            deps: ['vue']
        },
        'vue-multiselect': {
            src: ['https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.js',
                  'https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css'],
            deps: ['vue'],
            cb() { 
                Vue.component('multiselect', window.VueMultiselect.default)
            }
        }
      },

      install() {
        AWES.lang = lang
        Vue.use(plugin)
        if ( AWES._vueRoot && AWES._vueRoot._isMounted ) updateMountedComponents(AWES._vueRoot)
      }
    })

  } else if ( counter ) {

    counter--
    setTimeout(main, 300)

  } else {

    console.error('Delayed loading failed, no AWES core found')

  }
})()
