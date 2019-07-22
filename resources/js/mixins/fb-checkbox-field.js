import fieldMixin from './fb-field'

export default {

    mixins: [ fieldMixin ],


    props: {

        value: {
            type: [Boolean, Number, Array],
            default: 0
        },

        defaultValue: [String, Number],

        label: {
            type: String,
            required: true
        }
    },


    data() {
        return {
            isNumeric: true
        }
    },


    computed: {

        isActive() {
            if ( this.formId ) {
                return this.isMultiple ?
                    Array.isArray(this.formValue) && this.formValue.includes(this.computedValue) :
                    !!this.formValue
            } else {
                return this.vModelChecked
            }
        },

        vModelArray() {
            return !this.formId && Array.isArray(this.value)
        },

        vModelChecked() {
            return this.vModelArray ? this.value.includes(this.computedValue) : this.value
        },

        computedValue() {
            return typeof this.defaultValue !== 'undefined' ? this.defaultValue : this.label.replace(/ /g, '_').toLowerCase()
        },

        isMultiple() {
            return typeof this.defaultValue !== 'undefined' && this.defaultValue !== 'on'
        }
    },


    methods: {

        createStoreInstance() {

            if ( this.isMultiple && ! Array.isArray(this.formValue) ) {
                this.$store.commit('forms/createField', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value: []
                });
            } else {
                this.$store.commit('forms/createField', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value: this.value
                });
            }
        },
    },


    created() {
        if (this.formId && typeof this.formValue === 'boolean') {
            this.isNumeric = false
        }
    }
}