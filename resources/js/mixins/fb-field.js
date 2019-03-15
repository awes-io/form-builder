import baseMixin from './fb-base'
import focusMixin from './fb-focus';

export default {

    mixins: [ baseMixin, focusMixin ],

    props: {

        label: String
    },


    data() {
        return {
            showTooltip: false,
            hasError: false
        }
    },


    computed: {

        formValue: {

            get() {
                return AWES._store.getters['forms/fieldValue'](this.formId, this.realName)
            },

            set(value) {
                AWES._store.commit('forms/setFieldValue', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value
                });
            }
        },

        shake() {
            return !this.formLoading && this.showTooltip;
        },

        error() {
            return AWES._store.getters['forms/fieldError'](this.formId, this.realName)
        },

        firstErrorField() {
            return AWES._store.getters['forms/firstErrorField'](this.formId)
        }
    },


    watch: {

        error: {
            handler(errors) {
                if (errors) {
                    this.showTooltip = true;
                    this.hasError = true;
                    this.checkFocus()
                } else {
                    this.showTooltip = false;
                    this.hasError = false;
                    this.resetInputWatcher();
                }
            },
            immediate: true
        }
    },


    methods: {

        initField() {

            if (this.formId) {

                // create field if not exists in default data
                if (typeof this.formValue === 'undefined') {
                    this.createStoreInstance()
                } else {
                    this.fieldValue = this.formValue
                }
            }

            this.$root.$on('forms:reset', this.resetFormValue)
        },

        createStoreInstance() {
            AWES._store.commit('forms/createField', {
                formName: this.formId,
                fieldName: this.realName,
                value: this.value
            });
        },

        clickTooltip() {
            this.showTooltip = false;
            if (typeof this.setFocus === 'function') this.setFocus();
        },

        resetError() {
            this.showTooltip = false;
            AWES._store.commit('forms/resetError', {
                formName: this.formId,
                fieldName: this.realName
            });
            this.resetInputWatcher();
        },

        resetInputWatcher() {
            if (this.$refs.element) {
                this.$refs.element.removeEventListener('input', this.resetError)
            }
        },

        resetFormValue(formId) {
            if (this.formId !== formId) return
            this.formValue = AWES.utils.object.get(this.$options, 'props.value.default')
        },

        checkFocus() {
            if (typeof this.setFocus === 'function' &&
                this.firstErrorField === this.realName) {
                setTimeout(this.setFocus, 0)
                AWES._store.commit('resetFirstErrorField', this.formId)
            }
        },

        destroyField() {
            AWES._store.commit('forms/deleteField', {
                formName: this.formId,
                fieldName: this.realName
            });
            this.resetInputWatcher();
            this.$root.$off('forms:reset', this.resetFormValue)
        }
    },


    created() {
        this.initField()
    },


    destroyed() {
        this.destroyField()
    }
}
