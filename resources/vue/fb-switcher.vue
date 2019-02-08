<template>
    <div class="grid__cell" :class="[{'grid__cell_padding': padding}, cellClass]">

        <div :class="['fb-switcher', {'fb-switcher_error': hasError, 'fb-switcher_active': value, 'fb-switcher_disabled': isDisabled}]"
            @keyup.space="toggleValue ">

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
                        v-model.number="value"
                        v-bind="$attrs"
                        class="fb-switcher__field"
                        :class="{'is-focusable': isFocusable, 'in-focus': inFocus}"
                        :disabled="isDisabled"
                        @focus="inFocus = true"
                        @blur="inFocus = false"
                        @keydown.enter.prevent="focusNext"
                        @mousedown="checkClick"
                        ref="element">
                </div>

                <span class="fb-switcher__label" @click="toggleValue">{{ label }}</span>

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
                value: 0
            }
        },


        methods: {

            checkClick($event) {
                this._clickTimestamp = new Date().getTime()
                this._value = this.value
                window.addEventListener('mouseup', this.mouseReleased, false)
            },

            mouseReleased() {
                window.removeEventListener('mouseup', this.mouseReleased, false)
                let now = new Date().getTime()
                if ( now - this._clickTimestamp < 500 &&
                    this._value === this.value ) {
                    // this is a click, queue switch theme
                    setTimeout(this.toggleValue, 0)
                }
                delete this._clickTimestamp
                delete this._value
            },

            toggleValue() {
                if ( this.isDisabled ) return
                this.value = this.value ? 0 : 1
            }
        }
    }
</script>
