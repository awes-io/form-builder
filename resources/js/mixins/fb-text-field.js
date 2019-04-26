import fieldMixin from './fb-field'

export default {

    mixins: [ fieldMixin ],


    props: {

        value: {
            type: String,
            default: ''
        },

        debounce: {
            type: [String, Number],
            default: 300
        }
    },


    computed: {

        isActive() {
            return !!(this.inFocus || (this.value || this.formValue));
        },
    },


    methods: {

        formValueHandler($event) {
            if ( ! this.error ) {
                clearTimeout(this.__debounce)
                this.__debounce = setTimeout(() => {
                    this.formValue = $event.target.value
                }, Number(this.debounce))
            } else {
                this.formValue = $event.target.value
                this.resetError()
            }
        },

        vModelHandler($event) {
            this.$emit('input', $event.target.value)
        },

        save() {
            clearTimeout(this.__debounce)
            if ( this.$refs.element ) {
                this.formValue = this.$refs.element.value
            }
        }
    },


    mounted() {
        if ( this.formId ) {
            AWES.on(`form-builder::${this.formId}:before-send`, this.save)
        }
    },


    beforeDestroy() {
        if ( this.formId ) {
            AWES.off(`form-builder::${this.formId}:before-send`, this.save)
        }
    },
}