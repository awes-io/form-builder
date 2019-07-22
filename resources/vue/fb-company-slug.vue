<template>
    <div :class="['fb-slug', 'fb-element', { 'fb-slug_disabled': isDisabled, 'fb-slug_active': isActive, 'fb-slug_error': hasError, 'animated shake': shake}]">
        <fb-error-wrap :open="showTooltip" :error="error" @clickTooltip="clickTooltip">
            <div class="fb-slug__group-wrap">
                <span class="fb-slug__group-field">
                    <label class="fb-slug__label" :for="'#' + inputId">{{ label }}</label>
                    <input v-bind="$attrs"
                        :id="inputId"
                        :class="['fb-slug__field', {'is-focusable': isFocusable}, {'in-focus': inFocus}]"
                        :data-awes="$options.name + '.' + name"
                        :maxlength="maxlength"
                        type="text"
                        :disabled="isDisabled"
                        :value="formId ? formValue : removeDomain(value)"
                        v-on="{ input: formId ? formValueHandler : vModelHandler }"
                        @input="toggleWatcher"
                        @focus="inFocus = true"
                        @blur="inFocus = false"
                        @keydown.enter.prevent="focusNext"
                        ref="element">
                </span>
                <span class="fb-slug__group-label">{{ dotDomain }}</span>
            </div>
        </fb-error-wrap>
    </div>
</template>

<script>
import fbInput from './fb-input.vue'
import _config from '../js/config.js'

export default {

    name: 'fb-company-slug',

    extends: fbInput,


    props: {

        domain: {
            type: String,
            default() {
                return this._config.domain
            }
        },

        input: {
            type: String,
            default: ''
        },

        maxlength: {
            type: [String, Number],
            default() {
                return this._config.maxlength
            }
        }
    },


    data() {
        return {
            watchInput: true,
        }
    },


    computed: {

        dotDomain() {
            return '.' + this.domain.replace(/^\./, '')
        },

        formValue: {

            get() {
                return this.removeDomain( this.$store.getters['forms/fieldValue'](this.formId, this.realName) )
            },

            set(value) {
                this.$store.commit('forms/setFieldValue', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value: this.addDomain( this.noramlizeUrl(value) )
                });
            }
        }
    },


    watch: {

        input: {
            handler( value ) {
                if ( this.$isServer || ! this.watchInput || ! value) return
                if ( this.formId ) {
                    if ( this._isMounted ) {
                        this.formValue = value
                    } else {
                        this.$nextTick( () => this.formValue = value )
                    }
                } else {
                    this.vModelHandler({ target: { value } })
                }
            },
            immediate: true
        }
    },


    methods: {

        vModelHandler($event) {
            this.$emit('input', this.addDomain(this.noramlizeUrl($event.target.value)) )
        },

        toggleWatcher( $event ) {
            if ( $event.target.value === '' ) {
                this.watchInput = true
            } else if ( this.watchInput ) {
                this.watchInput = false
            }
        },

        noramlizeUrl( value ) {
            return value && this.$url.urlify(value).substr(0, +this.maxlength)
        },

        addDomain( value ) {
            return value && this.removeDomain(value) + this.dotDomain
        },

        removeDomain( value ) {
            return value && value.replace(this.dotDomain, '')
        }
    },


    beforeCreate() {
        this._config = Object.assign({}, _config.companySlug, window.AWES._config.companySlug)
    }
}
</script>
