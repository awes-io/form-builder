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
            default: 500
        }
    },


    computed: {

        isActive() {
            return !!(this.inFocus || this.value);
        },
    },


    methods: {

        formValueHandler($event) {
            if ( ! this.error ) {
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
            this.formValue = this.$refs.element.value
        }
    },


    mounted() {
        AWES.on('form-builder:before-send', this.save)
    },


    beforeDestroy() {
        AWES.off('form-builder:before-send', this.save)
    },
}