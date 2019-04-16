<template>
    <div class="fb-select fb-element" :class="[{ 'fb-select_active': isActive }, { 'fb-select_opened': isOpened }, { 'fb-select_disabled': disabled }]">

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >
            <span class="fb-select__label">{{ label || $lang.FORMS_SELECT_LABEL }}</span>
            <multiselect
                :taggable="taggable"
                :show-labels="false"
                :multiple="multiple"
                :hide-selected="multiple"
                :placeholder="placeholderText || defaultPlaceholder"
                :tag-placeholder="$lang.FORMS_SELECT_ADD_TAG"
                :internal-search="isAjax ? false : true"
                :loading="isLoading"
                :value="formId ? convertValue(formValue) : value"
                :options="usedOptions"
                :label="optionsName"
                :track-by="optionsValue"
                :disabled="isDisabled"
                class="fb-select__field"
                @open="isOpened = true"
                @close="isOpened = false"
                @tag="addOption"
                v-on="{
                    'input': formId ? formValueHandler : vModelHandler
                }"
                ref="select"
            >
                <template slot="noOptions">{{ $lang.FORMS_SELECT_EMPTY }}</template>
            </multiselect>
        </fb-error-wrap>
    </div>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field.js';

let _retry = 20 // times
const AJAX_DEBOUNCE = 1000 // ms

export default {

    name: "fb-select",

    // inheritAttrs: false,

    mixins: [ fieldMixin ],

    components: {
        Multiselect: resolve => {
            AWES.utils.loadModules({
                'vue-multiselect': {
                    src: ['https://unpkg.com/vue-multiselect@2.1.3/dist/vue-multiselect.min.js',
                          'https://unpkg.com/vue-multiselect@2.1.3/dist/vue-multiselect.min.css'],
                    deps: ['vue'],
                    cb() { resolve(window.VueMultiselect.default) }
                },
            })
        }
    },

    props: {

        value: {},

        selectOptions: {
            type: [String, Array],
            default: () => []
        },

        optionsName: {
            type: String,
            default: 'name'
        },

        optionsValue: {
            type: String,
            default: 'value'
        },

        multiple: {
            type: Boolean,
            default: true
        },

        taggable: {
            type: Boolean,
            default: false
        },

        debounce: {
            type: [String, Number],
            default: AJAX_DEBOUNCE
        },

        autoFetch: {
            type: [String, Boolean],
            default: false
        },

        placeholderText: String
    },


    data() {
        return {
            isOpened: false,
            isLoading: false,
            ajaxOptions: [],
            addedOptions: []
        }
    },


    computed: {

        computedValue() {
            return this.formId ? this.formValue : this.value
        },

        hasValue() {
            return !! ( this.multiple ?
                        this.computedValue && this.computedValue.length :
                        this.computedValue )
        },

        isActive() {
            return this.isOpened || this.hasValue;
        },

        isAjax() {
            return typeof this.selectOptions === 'string'
        },

        defaultPlaceholder() {
            return this.$lang[this.isAjax ? 'FORMS_SELECT_AJAX_PLACEHOLDER' : 'FORMS_SELECT_PLACEHOLDER']
        },

        usedOptions() {
            return this.addedOptions.concat(this.isAjax ? this.ajaxOptions : this.selectOptions)
        }
    },


    methods: {

        formValueHandler(selected) {
            if ( ! selected ) return
            this.formValue = this.multiple ?
                             selected.map( item => item[this.optionsValue]) :
                             selected[this.optionsValue];
            if ( this.error ) this.resetError()
        },

        vModelHandler(selected) {
            if ( ! selected ) return
            this.$emit('input', selected)
        },

        convertValue(value) {
            if ( this.multiple ) {
                return Array.isArray(value) ?
                    this.usedOptions.filter( item => {
                        return value.includes(item[this.optionsValue]);
                    }) :
                    value
            } else {
                return this.usedOptions.find( item => {
                    return value === item[this.optionsValue];
                })
            }
        },

        resetFormValue( formId ) {
            if ( this.formId !== formId ) return
            this.formValue = this.multiple ? [] : undefined
        },

        setFocus(state) {
            try {
                let useMethod = (state !== false) ? 'focus' : 'blur';
                this.$refs.select.$el[useMethod]()
            } catch (e) {
                _retry--
                if (_retry) setTimeout(this.setFocus, 1000, state)
            }
        },

        addOption(usersOption) {

            // create option
            let opt = {}
            opt[this.optionsName] = usersOption
            opt[this.optionsValue] = usersOption

            // add new option
            this.addedOptions.push(opt)

            // select new option
            let selected
            if (this.multiple) {
                selected = [opt].concat(this.$refs.select.value)
            } else {
                selected = opt
            }

            if ( this.formId ) {
                this.formValueHandler(selected)
            } else {
                this.vModelHandler(selected)
            }
        },

        wrapTabEvents() {
            try {
                this.$refs.select.$el.querySelector('.multiselect__input').classList.add('is-focusable')
            } catch(e) {
                _retry--
                if (_retry) setTimeout(this.wrapTabEvents, 500)
            }
        },

        bindSearch() {
            try {
                if ( this.isAjax ) {

                    // bind search
                    this.$refs.select.$on('search-change', this.ajaxSearch)

                    // fetch data
                    if ( this.autoFetch.toString() !== 'false' ) {
                        let serach = typeof this.autoFetch === 'string' ? this.autoFetch : ''
                        this.ajaxSearch( serach, true )
                    }
                }
            } catch(e) {
                if (_retry) setTimeout(this.bindSearch, 500)
            }
        },

        ajaxSearch(search, force) {
            if ( ! (search || force) ) return
            clearTimeout(this.__search)
            this.isLoading = true
            this.__search = setTimeout(() => {
                AWES.ajax({}, this.selectOptions.replace('%s', search), 'get')
                    .then( res => {
                        let data = []
                        if ( res.success === true ) {
                            if ( Array.isArray(res.data) ) {
                                data = res.data
                            } else if ( res.data && Array.isArray(res.data.data) ) {
                                data = res.data.data
                            }
                        }
                        this.ajaxOptions = data
                        this.isLoading = false
                    })
            }, Number(this.debounce) );
        }
    },


    mounted() {
        this.$nextTick( this.wrapTabEvents )
        this.$nextTick( this.bindSearch )
    },


    beforeDestroy() {
        if ( this.isAjax ) {
            this.$refs.select.$off('search-change', this.ajaxSearch)
        }
    }
}
</script>
