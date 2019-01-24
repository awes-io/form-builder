<template>
  <v-popover
    :placement="placement"
    :open="open"
    :popover-class="['theme-error', {'tooltip_modal': isModal}]"
    class="display-block">

      <slot></slot>

      <span slot="popover"
        class="tooltip__text"
        @click="$emit('clickTooltip')"
        v-if="open">
        <span class="errors__list" v-if="!!error">
          <span v-for="(err, i) in error" :key="i">{{ err }}</span>
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
        type: Array
      }
    }
  }
</script>
