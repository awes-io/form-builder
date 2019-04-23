<template>
    <div v-if="items && items.length"
        class="fc-radio fb-element"
        :class="{'animated shake': shake}"
    >

        <div class="fc-radio__label" v-if="label">{{ label }}</div>

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >
            <div class="fc-radio__wrap">

                <label
                    v-for="(item, i) in items"
                    :key="i"
                    :class="['fc-radio__box', {'is-checked': checkActive(item), 'fc-radio_disabled': isItemDisabled(item)}]"
                >

                    <input
                        v-bind="$attrs"
                        type="radio"
                        :class="['fc-radio__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
                        :data-awes="$options.name + '.' + name"
                        :disabled="isItemDisabled(item)"
                        :checked="checkActive(item)"
                        v-on="{ input: formId ? formValueHandler : vModelHandler }"
                        :value.prop="item.value ? item.value : item.toString()"
                        @focus="$set(inFocus, i, true)"
                        @blur="$set(inFocus, i, false)"
                        @keydown.enter.prevent="focusNext"
                        ref="fields">

                    <slot :item="item" :checked="checkActive(item)" :focused="inFocus[i]">
                        <span class="fc-radio__text">{{ item.name ? item.name : item.toString() }}</span>
                    </slot>

                </label>
            </div>
        </fb-error-wrap>
    </div>
</template>

<script>
import fieldMixin from '../js/mixins/fb-field.js';

export default {

    name: 'fb-radio-group',

    mixins: [ fieldMixin ],


    props: {

        items: Array,

        value: String,

        disabled: {
            type: [String, Boolean],
            default: false
        }
    },


    data() {
        return {
            inFocus: []
        }
    },


    computed: {

        disabledItems() {
            if ( (typeof this.disabled === 'boolean' && this.disabled) ||
                 this.disabled === '' ) {
                return this.items.map( item => item.value )
            } else if ( typeof this.disabled === 'string' ) {
                return this.disabled.split(',').map(i => i.trim())
            }
            return []
        }
    },


    methods: {

        isItemDisabled(item) {
            return this.disabledItems.indexOf(item.value) > -1
        },

        formValueHandler($event) {
            this.formValue = $event.target.value
            if ( this.error ) this.resetError()
        },

        vModelHandler($event) {
            this.$emit('input', $event.target.value)
        },

        checkActive( item ) {
            return this.getItemValue(item) == (this.formId ? this.formValue : this.value)
        },

        getItemValue( item ) {
            return item.value ? item.value : item.toString()
        },

        setFocus( payload = true ) {
            if ( typeof payload === 'number' ) {
                this.$refs.elements[payload].focus();
            } else if ( payload === true ) {
                this.$refs.elements[0].focus();
            }
        },
    },

    created() {
        for ( let index = 0; index < this.items.length; index++ ) {
            this.inFocus.push( index === 0 && this.focus ? true : false )
        }
    }
}
</script>
