<template>
  <div
    v-if="isShow && !reset"
    :class="['grid__cell', cellClass]">

    <fb-error-wrap
      :open="tooltip"
      :error="error"
      @clickTooltip="clickTooltip">

      <vue-recaptcha
        class="re-captcha"
        ref="recaptcha"
        :sitekey="sitekey"
        :theme="theme"
        @verify="onVerify"
        @expired="value = null"
      />

    </fb-error-wrap>
  </div>
</template>

<script>
  import fieldMixin from './mixins/fb-field.js';

  export default {

    name: "fb-auto-captcha",

    mixins: [ fieldMixin ],


    props: {

      show: {
        type: Boolean,
        default: false
      },

      name: {
        default: 'g-recaptcha-response'
      }
    },


    data() {
      return {
        value: null,
        sitekey: AWES_CONFIG.reCaptchaSiteKey,
        serverError: false,
        reset: false
      }
    },


    computed: {

      realName() {
        return  'g-recaptcha-response'
      },

      isShow() {
        return (this.show || this.serverError );
      },

      theme() {
        try {
          let theme = this.$store.state.theme
          return theme && theme.theme_dark === 1 ? 'dark' : 'light'
        } catch (e) {
          return 'light'
        }
      }
    },


    watch: {

      error( errors ) {
        if ( errors && errors.length ) {
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
        this.value = response;
        this.resetError()
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
      if ( ! this.$isServer ) this.manageCaptchaScript('add')
    },

    beforeDestroy() {
      this.manageCaptchaScript('remove')
    }
  }
</script>
