<template>
    <div v-if="items && items.length"
        class="fc-radio"
        :class="[{'animated shake': shake, 'fc-radio_disabled': isDisabled }]"
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
                    :class="['fc-radio__box', {'is-checked': checkActive(item)}]"
                >

                    <input
                        v-bind="$attrs"
                        type="radio"
                        :class="['fc-radio__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
                        :data-awes="$options.name + '.' + name"
                        :disabled="isDisabled"
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

        value: String
    },

    data() {
        return {
            inFocus: []
        }
    },


    methods: {

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
