import { normalizePath } from '../modules/helpers'

export default {

    props: {

        name: String,

        id: Number,

        disabled: {
            type: Boolean,
            default: false
        }
    },


    inject: {

        formId: {
            from: 'formId',
            default: false
        },

        isModal: {
            from: 'isModal',
            default: false
        },

        multiblock: {
            from: 'multiblock',
            default: false
        }
    },


    computed: {

        realName() {
            return this.multiblock ?
                `${this.multiblock}[${this.id}].${normalizePath(this.name)}` :
                normalizePath(this.name)
        },

        formLoading() {
            return this.$store.getters['forms/isLoading'](this.formId);
        },

        isDisabled() {
            return this.formLoading || this.disabled || this.isMultiblockDisabled;
        },

        isMultiblockDisabled() {
            return this.multiblock ?
                this.$store.getters['forms/isMultiblockDisabled'](this.formId, this.multiblock) :
                false
        }
    }
}
