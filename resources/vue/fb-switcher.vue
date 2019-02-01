<template>
    <div class="grid__cell" :class="[{'grid__cell_padding': padding}, cellClass]">

        <div :class="['fb-switcher', {'fb-switcher_error': hasError, 'fb-switcher_active': inActive, 'fb-switcher_disabled': isDisabled}]">
            <label class="fb-switcher__label" :data-awes="$options.name + '.' + name">
                <fb-error-wrap
                    :open="tooltip"
                    :error="error"
                    @clickTooltip="clickTooltip">

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="1"
                    v-bind="$attrs"
                    :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
                    :disabled="isDisabled"
                    @focus="inFocus = true"
                    @blur="inFocus = false"
                    @keydown.enter.prevent="focusNext"
                    ref="element">

                <span class="fb-switcher__text">
                    <i class="icon icon-checkbox" ref="switcher"></i>
                    <span>{{ label }}</span>
                </span>

                </fb-error-wrap>
            </label>
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
