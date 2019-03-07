<template>
    <div class="fb-multiblock" :class="[{'fb-multiblock_disabled' : this.isDisabled}]">
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
            @click.prevent="addField"
        >
            {{ label || $lang.FORMS_MULTIBLOCK_ADD }}
        </button>
    </div>
</template>

<script>
import baseMixin from '../js/mixins/fb-base'
import triggerEvent from '../js/utils/triggerEvent'
import { compareFlatObjects } from '../js/modules/helpers'

export default {

    name: 'fb-multi-block',

    mixins: [ baseMixin ],


    props: {

        label: String,
    },


    provide() {
        return {
            multiblock: this.realName
        }
    },


    data() {
        return {
            blocks: []
        }
    },


    computed: {

        groups() {
            return AWES._store.getters['forms/multiblockGroupIds'](this.formId, this.name) || [0]
        },

        nextIndex() {
            return Math.max.apply(null, this.groups) + 1
        },

        hasClose() {
            return this.blocks.length > 1
        },

        errors() {
            return AWES._store.getters['forms/errorsOrFalse'](this.formId)
        },

        fields() {
            return this.$options
        }
    },


    watch: {

        disabled: {
            handler: function( value ) {
                AWES._store.commit('forms/toggleMultiblockState', {
                    formName: this.formId,
                    multiblockName: this.realName,
                    status: value
                })
            },
            immediate: true
        },

        groups: {
            handler(val) {
                let equal = compareFlatObjects(this.blocks, val)
                if ( ! equal ) {
                    this.blocks = val.slice()
                }
            },
            immediate: true
        }
    },


    methods: {

        addField() {
            if ( this.isDisabled ) return
            this.blocks.push( this.nextIndex )
            this.updateTooltips()
        },

        removeField( id ) {
            if ( this.isDisabled ) return
            this.blocks.splice(this.blocks.findIndex(i => i === id), 1)

            // clean up all related data
            AWES._store.commit('forms/deleteMultiblockBlock', {
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
        }
    }
}
</script>
