export default {

    data() {
        return {
            showTooltip: false,
            hasError: false
        }
    },


    computed: {

        shake() {
            return !this.formLoading && this.showTooltip;
        },

        error() {
            return this.$store.getters['forms/fieldError'](this.formId, this.realName)
        },

        firstErrorField() {
            return this.$store.getters['forms/firstErrorField'](this.formId)
        }
    },


    watch: {

        error: {
            handler(errors) {
                if ( this.$listeners.error && ! AWES.utils.object.isEmpty(errors) ) {
                    this.$emit('error', errors)
                    return
                }
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

        clickTooltip() {
            this.showTooltip = false;
            if (typeof this.setFocus === 'function') this.setFocus();
        },

        resetError() {
            this.showTooltip = false;
            this.$store.commit('forms/resetError', {
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

        checkFocus() {
            if (typeof this.setFocus === 'function' &&
                this.firstErrorField === this.realName) {
                setTimeout(this.setFocus, 0)
                this.$store.commit('resetFirstErrorField', this.formId)
            }
        }
    }
}
