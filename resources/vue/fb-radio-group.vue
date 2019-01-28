<template>
    <div 
        v-if="items && items.length"
        class="grid__cell"
        :class="[{'animated shake': shake }, cellClass]"
    >
        
        <fb-error-wrap
            :open="tooltip"
            :error="error"
            @clickTooltip="clickTooltip"
        >
            <span :class="['display-block', {'fc-radio': box}]">
                <label
                    v-for="(item, i) in items"
                    :key="i"
                    :class="[{
                        'fc-radio__box': box,
                        'is-checked': checkActive(item)
                    }]"
                >
                
                    <input
                        v-bind="$attrs"
                        type="radio"
                        :class="['fc-radio__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
                        :data-awes="$options.name + '.' + name"
                        :disabled="isDisabled"
                        v-model="value"
                        :value="item.value ? item.value : item.toString()"
                        @focus="$set(inFocus, i, true)"
                        @blur="$set(inFocus, i, false)"
                        @keydown.enter.prevent="focusNext"
                        ref="fields">
                
                    <slot :item="item" :checked="checkActive(item)" :focused="inFocus[i]">
                        <span class="fc-radio__text">{{ item.name ? item.name : item.toString() }}</span>
                    </slot>
                
                </label>
            </span>
        </fb-error-wrap>
    </div>
</template>

<script>
import fieldMixin from './mixins/fb-field.js';
import focusMixin from './mixins/fb-focus.js';

export default {

    name: 'fb-radio-group',

    mixins: [ fieldMixin, focusMixin ],


    props: {

        box: {
            type: Boolean,
            default: false
        },

        items: Array,
    },


    data() {
        return {
            value: null,
            inFocus: []
        }
    },


    methods: {

        checkActive( item ) {
            return item.value ? this.value === item.value : this.value === item.toString();
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
