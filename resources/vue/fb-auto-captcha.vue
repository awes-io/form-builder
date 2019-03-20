<template>
    <div v-if="isShow && !reset">

        <fb-error-wrap
            :open="showTooltip"
            :error="error"
            @clickTooltip="showTooltip = false;"
        >

            <vue-recaptcha
                class="re-captcha"
                ref="recaptcha"
                :sitekey="sitekey"
                :theme="theme"
                v-on="{
                    verify: formId ? onVerify: null,
                    expired: formId ? onExpired : null
                }"
            />

        </fb-error-wrap>
    </div>
</template>

<script>
import baseMixin from '../js/mixins/fb-base';
import { CAPTCHA_NAME } from '../js/modules/helpers'

export default {

    name: "fb-auto-captcha",

    mixins: [ baseMixin ],

    components: {
        vueRecaptcha: resolve => {
            return AWES.utils.loadModule(
              'vue-recaptcha',
              'https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.min.js',
              () => { resolve( window.VueRecaptcha ) }
            )
        }
    },


    props: {

        show: {
            type: Boolean,
            default: false
        }
    },


    data() {
        return {
            sitekey: AWES._config.reCaptchaSiteKey,
            serverError: false,
            showTooltip: false,
            reset: false,
            theme: AWES._themeDark ? 'dark' : 'light'
        }
    },


    computed: {

        formValue: {

            get() {
                return this.$store.getters['forms/fieldValue'](this.formId, this.realName)
            },

            set(value) {
                this.$store.commit('forms/setFieldValue', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value
                });
            }
        },

        error() {
            return this.$store.getters['forms/fieldError'](this.formId, this.realName)
        },

        realName() {
            return CAPTCHA_NAME
        },

        isShow() {
            return (this.show || this.serverError );
        }
    },


    watch: {

        error( errors ) {
            if ( Array.isArray(errors) && errors.length || errors ) {
                this.serverError = true;
            }
        },

        formLoading( isLoading ) {
            if ( ! isLoading && this.isShow ) this.$nextTick( () => {
                this.$refs.recaptcha.reset()
            })
        },

        theme() {
            if ( this.isShow ) {
                this.reset = true
                this.$nextTick( () => { this.reset = false })
            }
        }
    },


    methods: {

        onVerify( response ) {
            this.formValue = response;
            this.resetError()
        },

        onExpired() {
            this.formValue = null
        },

        checkTheme({ detail }) {
            this.theme = detail ? 'dark' : 'light'
        },

        resetError() {
            this.showTooltip = false;
            this.$store.commit('forms/resetError', {
                formName: this.formId,
                fieldName: this.realName
            });
        },

        manageCaptchaScript(action) {
            switch (action) {
                case 'add':
                    if ( ! document.getElementById('g-captcha-script') ) {
                        const el = document.createElement('script')
                        el.setAttribute('id', 'g-captcha-script')
                        el.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit')
                        document.head.appendChild(el)
                    }
                    break
                case 'remove':
                    document.getElementById('g-captcha-script').remove()
                    break
            }
        }
    },


    created() {
        if ( ! this.$isServer ) {
            this.manageCaptchaScript('add')
            AWES.on('theme.change', this.checkTheme)
        }
    },

    beforeDestroy() {
        this.manageCaptchaScript('remove')
        AWES.off('theme.change', this.checkTheme)
    }
}
</script>
