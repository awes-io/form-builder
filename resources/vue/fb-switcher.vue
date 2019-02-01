<template>
    <div class="grid__cell" :class="[{'grid__cell_padding': padding}, cellClass]">

        <div :class="['fb-switcher', {'fb-switcher_error': hasError, 'fb-switcher_active': inActive, 'fb-switcher_disabled': isDisabled}]">
            
            <fb-error-wrap
                :open="tooltip"
                :error="error"
                @clickTooltip="clickTooltip">

                <div class="fb-switcher__field-wrap" :data-awes="$options.name + '.' + name">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="1"
                        v-bind="$attrs"
                        class="fb-switcher__field"
                        :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
                        :disabled="isDisabled"
                        @focus="inFocus = true"
                        @blur="inFocus = false"
                        @keydown.enter.prevent="focusNext"
                        ref="element">
                </div>

                <span class="fb-switcher__label">{{ label }}</span>

            </fb-error-wrap>

        </div>
    </div>
</template>

<script>
    import fieldMixin from './mixins/fb-field.js';
    import focusMixin from './mixins/fb-focus.js';

    export default {

        name: 'fb-switcher',
        inheritAttrs: false,
        mixins: [ fieldMixin, focusMixin ],
        props: {
            label: {
                type: String,
                required: true
            },
            padding: {
                type: Boolean, 
                default: true
            }
        },

        data() {
            return {
                value: false
            }
        }

    }
</script>
