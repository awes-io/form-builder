<template>
    <v-popover
        :placement="placement"
        :open="open"
        :popover-class="['theme-error', {'tooltip_modal': isModal}]"
        class="display-block"
    >

        <slot></slot>

        <span slot="popover"
            class="tooltip__text"
            @click="$emit('clickTooltip')"
            v-if="open"
        >
            <span class="errors__list">
                {{ errorText }}
            </span>
        </span>

    </v-popover>
</template>

<script>
export default {

    name: 'error-wrap',

    inject: {

        isModal: {
            from: 'isModal',
            default: false
        }
    },

    props: {

        open: {
            type: Boolean,
            default: false
        },

        placement: {
            type: String,
            default: 'top'
        },

        error: {
            type: [String, Array]
        }
    },

    computed: {

        errorText() {
            return Array.isArray(this.error) ? this.error.join(', ') : this.error
        }
    }
}
</script>
