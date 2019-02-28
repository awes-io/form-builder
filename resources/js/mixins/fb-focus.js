import triggerEvent from '../utils/triggerEvent.js'

export default {

    props: {

        enterSkip: {
            type: Boolean,
            default: false
        },

        focus: {
            type: Boolean,
            default: false
        }
    },


    data() {
        return {
            inFocus: this.focus
        }
    },


    computed: {

        isFocusable() {
            return !this.enterSkip && !this.disabled && this.formId
        }
    },


    methods: {

        focusNext($event) {
            try {
                const form = $event.target.closest('form');
                const focusableFields = form.querySelectorAll('.is-focusable');
                const nextIndex = Array.from(focusableFields).findIndex(el => el === $event.target) + 1;
                if (nextIndex < focusableFields.length) {
                    focusableFields[nextIndex].focus();
                } else {
                    $event.target.blur() // write data to vuex
                    const submitBtn = form.querySelector('[type="submit"]');
                    this.$nextTick(() => {
                        submitBtn.click();
                        this.initWawesEffect(submitBtn)
                    })
                }
            } catch (e) {
                console.warn('Error while setting focus');
                console.error(e);
            }
        },

        setFocus(state) {
            try {
                let useMethod = (state !== false) ? 'focus' : 'blur';
                this.$refs.element[useMethod]()
            } catch (e) {
                console.warn('Error while setting focus');
                console.error(e)
            }
        },

        initWawesEffect(el) {

            let box = { top: 0, left: 0 }

            if (typeof el.getBoundingClientRect === 'function') {
                box = el.getBoundingClientRect();
            }

            const options = {
                pageY: box.top + window.pageYOffset - document.documentElement.clientTop + el.clientHeight / 2,
                pageX: box.left + window.pageXOffset - document.documentElement.clientLeft + el.clientWidth / 2
            }

            triggerEvent('mousedown', el, options)
            setTimeout(triggerEvent, 250, 'mouseup', el)
        }
    },


    mounted() {
        this.setFocus(this.focus);
    }
}
