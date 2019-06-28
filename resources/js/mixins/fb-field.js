import baseMixin from './fb-base'
import focusMixin from './fb-focus';
import errorMixin from './fb-error'

export default {

    mixins: [ baseMixin, focusMixin, errorMixin ],

    props: {

        label: String
    },


    computed: {

        formValue: {

            get() {
                return this.$store.getters['forms/fieldValue'](this.formId, this.realName)
            },

            set(value) {
                this.$store.commit('forms/setFieldValue', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value
                });
            }
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
            this.$store.commit('forms/createField', {
                formName: this.formId,
                fieldName: this.realName,
                value: this.value
            });
        },

        resetFormValue(formId) {
            if (this.formId !== formId) return
            this.formValue = AWES.utils.object.get(this.$options, 'props.value.default')
        },

        destroyField() {
            this.$store.commit('forms/deleteField', {
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
