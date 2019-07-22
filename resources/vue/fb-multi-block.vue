<template>
    <div class="fb-multiblock fb-element" :class="[{'fb-multiblock_disabled' : this.isDisabled}]">
        <div
            :class="['fb-multiblock__block', {'fb-multiblock_has-close' : hasClose}]"
            v-for="id in blocks"
            :key="id"
        >

            <slot :id="id"></slot>

            <button
                v-if="hasClose"
                aria-label="delete"
                class="fb-multiblock__clear"
                @click.prevent="removeField(id)"
            >
                <i class="icon icon-cross"></i>
            </button>
        </div>

        <button
            class="fb-multiblock__add"
            type="button"
            @click.prevent="addField"
        >
            {{ label || $lang.FORMS_MULTIBLOCK_ADD }}
        </button>
    </div>
</template>

<script>
import baseMixin from '../js/mixins/fb-base'
import triggerEvent from '../js/utils/triggerEvent'

export default {

    name: 'fb-multi-block',

    mixins: [ baseMixin ],


    props: {

        label: String,
    },


    provide() {
        return {
            multiblock: this.realName,
            nextIndex: 0
        }
    },


    computed: {

        blocks() {
            return this.$store.getters['forms/multiblockIds'](this.formId, this.name)
        },

        hasClose() {
            return this.blocks.length > 1
        },

        errors() {
            return this.$store.getters['forms/errorsOrFalse'](this.formId)
        },

        fields() {
            return this.$options
        }
    },


    watch: {

        disabled( value ) {
            this.$store.commit('forms/toggleMultiblockState', {
                formName: this.formId,
                multiblockName: this.realName,
                status: value
            })
        }
    },


    methods: {

        addField() {
            if ( this.isDisabled ) return
            this.$store.commit('forms/addMultiblockId', {
                formName: this.formId,
                multiblockName: this.name,
                id: this.nextIndex++
            })
            this.updateTooltips()
        },

        removeField( id ) {
            if ( this.isDisabled ) return
            this.$store.commit('forms/deleteMultiblockId', {
                formName: this.formId,
                multiblockName: this.name,
                id
            })
            this.updateTooltips()
        },

        updateTooltips() {
            if ( ! this.errors ) return
            this.$nextTick( () => {
                triggerEvent('scroll', window)
            })
        },

        initMultiblock() {
            this.$store.commit('forms/createMutiblock', {
                formName: this.formId,
                multiblockName: this.realName,
                disabled: this.disabled
            });
            this.nextIndex = Math.max.apply(null, this.blocks) + 1
        },

        destroyMultiblock() {
            this.$store.commit('forms/deleteMultiblock', {
                formName: this.formId,
                multiblockName: this.realName
            });
        }
    },

    created() {
        this.initMultiblock()
    },


    destroyed() {
        this.destroyMultiblock()
    }
}
</script>
