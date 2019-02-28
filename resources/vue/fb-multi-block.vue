<template>
    <div class="grid__wrap">
        <div class="fb-multiblock" :class="[{'fb-multiblock_disabled' : this.isDisabled}]">
            <div
                :class="['grid__wrap', {'fb-multiblock_has-close' : hasClose}]"
                v-for="id in uniqIds"
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

            <div class="grid__wrap">
                <button
                    class="fb-multiblock__add"
                    @click.prevent="addField"
                >
                    {{ label || $lang.FORMS_MULTIBLOCK_ADD }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import baseMixin from '../js/mixins/fb-base.js';
import triggerEvent from '../js/utils/triggerEvent.js';

let _uniqId = 0

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
            uniqIds: []
        }
    },


    computed: {

        groups() {
            return AWES._store.getters['forms/multiblockGroupIds'](this.formId, this.name) || []
        },

        hasClose() {
            return this.uniqIds.length > 1
        },

        errors() {
            return AWES._store.getters['forms/errorsOrFalse'](this.formId)
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
        }
    },


    methods: {

        initMultiblock() {
            let numItems = this.groups.length
            if ( numItems ) {
                this.uniqIds = this.groups.slice()
                _uniqId = this.groups[numItems - 1] + 1
            } else {
                this.uniqIds.push( _uniqId++ )
            }
        },

        addField() {
            if ( this.isDisabled ) return
            this.uniqIds.push( _uniqId++ )
            this.updateTooltips()
        },

        removeField( id ) {
            if ( this.isDisabled ) return
            this.uniqIds.splice(this.uniqIds.findIndex(i => i === id), 1)

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
    },


    created() {
        this.initMultiblock()
    }
}
</script>
