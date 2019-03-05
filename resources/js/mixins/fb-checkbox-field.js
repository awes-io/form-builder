import fieldMixin from './fb-field'

export default {

    mixins: [ fieldMixin ],


    props: {

        padding: {
            type: Boolean,
            default: true
        },

        value: {
            type: [Boolean, Number, Array],
            default: 0
        },

        defaultValue: String,

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
            return !!(this.inFocus || (this.formId ? this.formValue : this.vModelChecked))
        },

        vModelArray() {
            return !this.formId && Array.isArray(this.value)
        },

        vModelChecked() {
            return this.vModelArray ? this.value.includes(this.computedValue) : this.value
        },

        computedValue() {
            return this.defaultValue || this.label.replace(/ /g, '_').toLowerCase()
        }
    },


    created() {
        if (this.formId && typeof this.formValue === 'boolean') {
            this.isNumeric = false
        }
    }
}