import fieldMixin from './fb-field'

export default {

    mixins: [ fieldMixin ],


    props: {

        value: {
            type: String,
            default: ''
        }
    },


    computed: {

        isActive() {
            return !!(this.inFocus || (this.value || this.formValue));
        },
    },


    methods: {

        formValueHandler($event) {

            this.formValue = $event.target.value

            if ( this.error ) {
               this.resetError()
            }
        },

        vModelHandler($event) {
            this.$emit('input', $event.target.value)
        }
    }
}