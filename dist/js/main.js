(function () {
    'use strict';

    var name$1 = "form-builder";
    var version = "1.6.6";

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //


    let _uniqFormId = 0;

    const UNLOAD_EVENTS = [
        {
            type: 'beforeunload',
            handler: 'windowUnloadHandler'
        },
    ];

    var script = {

        name: 'form-builder',

        props: {

            name: {
                type: String,
                default() {
                    return `form-builder-${ _uniqFormId++ }`
                }
            },

            url: {
                type: String,
                required: true
            },

            method: {
                type: String,
                default: 'post',
                validator( method ) {
                return method === undefined ||
                        ['get', 'put', 'post', 'delete', 'patch'].includes( method.toLowerCase() )
                }
            },

            default: Object,

            storeData: String,

            sendText: String,

            cancelText: String,

            loadingText: String,

            disabledDialog: {
                type: Boolean,
                default: false
            },

            autoSubmit: {
                type: Boolean,
                default: false
            },

            debounce: {
                type: [String, Number],
                default: 400
            }
        },


        inject: {
          modal: {
            from: 'modal',
            default: false
          }
        },


        provide() {
          return {
            formId: this.name,
            isModal: this.modal !== false
          }
        },


        computed: {

            form() {
                return this.$store.state.forms[this.name]
            },

            isLoading() {
                return this.form && this.form.isLoading
            },

            isEdited() {
                return this.form && this.form.isEdited
            },

            fields() {
                return this.$store.getters['forms/fields'](this.name)
            },

            replacedUrl() {
                let url = this.url;
                if ( this.form ) {
                    let props = url.match(/(?!{)([\w.\[\]]+)(?=})/g);
                    props && props.length && props.forEach( prop => {
                        url = url.replace('{' + prop + '}', AWES.utils.object.get(this.form.initialState, prop, ''));
                    });
                }
                return url.replace(/([^:]\/)\/+/g, '$1')
            }
        },


        methods: {

            send() {

                if ( this.isLoading || ! this.isEdited ) return

                this._returnFocus = document.activeElement;

                AWES.emit(`form-builder::${this.name}:before-send`);

                if ( this.$listeners.send ) {
                    this.$store.dispatch('forms/restoreData', {
                        formName: this.name
                    }).then( data => {
                        this.$emit('send', data);
                    });
                } else {
                    this.$store.dispatch('forms/sendForm', {
                        formName: this.name,
                        url: this.replacedUrl,
                        method: this.method
                    }).then( res => {
                        this.$emit(res.success ? 'sended' : 'error', res.data);
                        if ( this.storeData && res.success ) {
                            this.$store.$set(this.storeData, this.$get(res.data, 'data', {}));
                        }

                        if ( this._returnFocus && typeof this._returnFocus.focus === 'function' ) {
                            this._returnFocus.focus();
                            delete this._returnFocus;
                        }

                        if ( this.modal && res.success ) this.close();
                    });
                }
            },

            autoSubmitSend() {

                if ( this.isLoading ) return

                clearTimeout(this.__debounce);

                this.__debounce = setTimeout(this.send, Number(this.debounce));
            },

            addUnloadHandlers() {
                UNLOAD_EVENTS.forEach( event => {
                    window.addEventListener(event.type, this[event.handler], false);
                });
            },

            removeUnloadHandlers() {
                UNLOAD_EVENTS.forEach( event => {
                    window.removeEventListener(event.type, this[event.handler]);
                });
            },

            checkCloseAllowed() {
                if ( this.disabledDialog ) return true
                if ( this.isEdited ) {
                    const answer = confirm(this.$lang.FORMS_CONFIRM);
                    return answer
                } else {
                    return true
                }
            },

            windowUnloadHandler( $event ) {
                if ( this.disabledDialog || ! this.isEdited ) return true
                $event.returnValue = this.$lang.FORMS_CONFIRM;
                return this.$lang.FORMS_CONFIRM
            },

            close() {
                if ( this.checkCloseAllowed() ) {
                    this.removeUnloadHandlers();
                    AWES.off(`modal::${this.modal.name}:before-close`, this.preventModalClose);
                    this.modal.close();
                }
            },

            preventModalClose(e) {
                if ( ! this.checkCloseAllowed() ) {
                    e.detail.preventClose();
                }
            }
        },


        created() {

            // get default values
            let fields = this.storeData ? this.$store.state[this.storeData] : (this.default || {});

            // create storage record
            this.$store.commit('forms/createForm', {
                formName: this.name,
                fields
            });

            // set watcher for modal close method
            if ( this.modal ) {
                this.$watch('isEdited', edited => {
                    AWES[edited ? 'on': 'off'](`modal::${this.modal.name}:before-close`, this.preventModalClose);
                });
            }
        },


        mounted() {
            this.addUnloadHandlers();
            if ( this.autoSubmit ) {
                this.$watch('fields', this.autoSubmitSend, {deep: true} );
            }
        },


        beforeDestroy() {
            delete this._returnFocus;
            this.removeUnloadHandlers();
        },


        destroyed() {
            AWES.off(`modal::${this.modal.name}:before-close`, this.preventModalClose);
            this.$store.commit('forms/deleteForm', this.name);
        }
    };

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "form",
        {
          staticClass: "form-builder",
          class: { modal_form: _vm.modal },
          attrs: { action: _vm.replacedUrl, method: _vm.method },
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.send($event)
            }
          }
        },
        [
          _vm._t("default", null, null, _vm.fields),
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: !_vm.autoSubmit,
                  expression: "! autoSubmit"
                }
              ],
              staticClass: "line-btns"
            },
            [
              _c(
                "button",
                {
                  directives: [
                    {
                      name: "shortkey",
                      rawName: "v-shortkey",
                      value: {
                        ctrlEnter: ["ctrl", "enter"],
                        cmdEnter: ["meta", "enter"],
                        ctrlS: ["ctrl", "s"],
                        cmdS: ["meta", "s"]
                      },
                      expression:
                        "{ctrlEnter: ['ctrl', 'enter'], cmdEnter: ['meta', 'enter'], ctrlS: ['ctrl', 's'], cmdS: ['meta', 's']}"
                    }
                  ],
                  staticClass: "form-builder__send btn has-wave",
                  class: { "loading-inline": _vm.isLoading },
                  attrs: {
                    disabled: !_vm.isEdited || _vm.isLoading,
                    "data-loading": _vm.$lang.FORMS_LOADING,
                    type: "submit",
                    "data-awes": "modal_button_ok"
                  },
                  on: { shortkey: _vm.send }
                },
                [
                  _vm._v(" " + _vm._s(_vm.sendText || _vm.$lang.FORMS_SEND) + " "),
                  _c("span", { staticClass: "wave" })
                ]
              ),
              _vm.modal || _vm.$listeners.cancel
                ? _c(
                    "button",
                    _vm._g(
                      {
                        directives: [
                          {
                            name: "shortkey",
                            rawName: "v-shortkey",
                            value: ["esc"],
                            expression: "['esc']"
                          }
                        ],
                        staticClass:
                          "form-builder__cancel btn btn_transparent has-wave",
                        attrs: { type: "button" }
                      },
                      {
                        shortkey: _vm.close,
                        click: _vm.modal ? _vm.close : _vm.$listeners.cancel
                      }
                    ),
                    [
                      _vm._v(
                        " " + _vm._s(_vm.cancelText || _vm.$lang.FORMS_CANCEL) + " "
                      ),
                      _c("span", { staticClass: "wave" })
                    ]
                  )
                : _vm._e(),
              _vm._t("buttons-after")
            ],
            2
          )
        ],
        2
      )
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var formBuilder = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$1 = {

        name: 'error-wrap',

        inject: {

            isModal: {
                from: 'isModal',
                default: false
            }
        },

        props: {

            open: {
                type: Boolean,
                default: false
            },

            placement: {
                type: String,
                default: 'top'
            },

            error: {
                type: [String, Array]
            }
        },

        computed: {

            errorText() {
                return Array.isArray(this.error) ? this.error.join(', ') : this.error
            }
        }
    };

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "v-popover",
        {
          staticClass: "display-block",
          attrs: {
            placement: _vm.placement,
            open: _vm.open,
            "popover-class": ["theme-error", { tooltip_modal: _vm.isModal }]
          }
        },
        [
          _vm._t("default"),
          _vm.open
            ? _c(
                "span",
                {
                  staticClass: "tooltip__text",
                  attrs: { slot: "popover" },
                  on: {
                    click: function($event) {
                      return _vm.$emit("clickTooltip")
                    }
                  },
                  slot: "popover"
                },
                [
                  _c("span", { staticClass: "errors__list" }, [
                    _vm._v(" " + _vm._s(_vm.errorText) + " ")
                  ])
                ]
              )
            : _vm._e()
        ],
        2
      )
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = undefined;
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbErrorWrap = normalizeComponent_1(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        undefined,
        undefined
      );

    /**
     * Google reCaptcha form field name, reused in components
     *
     * @const {String} CAPTCHA_NAME - form field name
     */

    const CAPTCHA_NAME = 'g-recaptcha-response';


    /**
     * Restores flatted single-level object to a nested object
     *
     * @param {Object} obj - flattened object
     * @param {Object} converter - function to convert value
     *
     * @returns {Object} restored object
     *
     */

    function restoreFlattenedObject(obj, converter = null) {

        let result = {};

        for (let key in obj) {

            // get value to set, apply converter if exists
            let _value = converter ? converter(obj[key]) : obj[key];

            AWES.utils.object.set(result, key, _value);
        }

        return result
    }


    /**
     * Normalizes given object path to default value
     *
     * Example: input `arr.0.spaced value` converts to `arr[0]['spaced value']`
     *
     * @param {String} path - path to normalize
     *
     * @returns {String} normalized path
     */

    function normalizePath(path) {
        return path && path.split(/(?:\]?\.|\[(?:\'|\")?|(?:\'|\")?\])/g)
                            .filter(val => val !== '')
                            .map(key => {
                                return key.match(/^\d+$/) ?
                                        '[' + key + ']' :
                                        (key.match(/ /) ? '[\'' + key + '\']' : '.' + key )
                            })
                            .join('')
                            .replace(/^\./, '')
    }


    /**
     * Normalizes unordered indexes in array
     *
     * @param {Array} arr - array to normalize
     *
     * @returns {Array} normalized array
     */

    function _normalizeArrayIndexes(arr) {
        return arr.filter( () => true )
    }


    /**
     * Normalizes unordered indexes in arrays of given object
     *
     * @param {Object} obj - required, object with arrays to normalize
     * @param {Array} paths - required, paths to arrays
     *
     * @returns {Object} object with normalized arrays
     */

    function normalizeArrayIndexes(obj, paths) {
        const { get, set } = AWES.utils.object;
        paths.forEach( path => {
            let _arr = get(obj, path);
            set(obj, path, _normalizeArrayIndexes(_arr));
        });
        return obj
    }

    var baseMixin = {

        props: {

            name: String,

            id: Number,

            disabled: {
                type: Boolean,
                default: false
            }
        },


        inject: {

            formId: {
                from: 'formId',
                default: false
            },

            isModal: {
                from: 'isModal',
                default: false
            },

            multiblock: {
                from: 'multiblock',
                default: false
            }
        },


        computed: {

            realName() {
                return this.multiblock ?
                    `${this.multiblock}[${this.id}].${normalizePath(this.name)}` :
                    normalizePath(this.name)
            },

            formLoading() {
                return this.$store.getters['forms/isLoading'](this.formId);
            },

            isDisabled() {
                return this.formLoading || this.disabled || this.isMultiblockDisabled;
            },

            isMultiblockDisabled() {
                return this.multiblock ?
                    this.$store.getters['forms/isMultiblockDisabled'](this.formId, this.multiblock) :
                    false
            }
        }
    };

    /**
     * Fires event on element
     * @param {string} type - required
     * @param {HTMLElement} element - required
     * @param {Object} - additional objects
     *
     * @fires element#type bubbles:true, cancelable:true
     *
     */

    function triggerEvent(type, element, options) {

      function addEventOptions( event ) {
        if ( ! options || Object.keys(options).length === 0 ) return event;
        for( let option in options ) {
          event[option] = options[option];
        }
        return event
      }

      if (document.createEvent) {
        const event = new Event(type, { bubbles:true, cancelable:true });
        element.dispatchEvent( addEventOptions(event) );
      } else {
        const event = document.createEventObject();
        element.fireEvent('on' + type, addEventOptions(event) );
      }
    }

    var focusMixin = {

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
                        $event.target.blur(); // write data to vuex
                        const submitBtn = form.querySelector('[type="submit"]');
                        this.$nextTick(() => {
                            submitBtn.click();
                            this.initWawesEffect(submitBtn);
                        });
                    }
                } catch (e) {
                    console.warn('Error while setting focus');
                    console.error(e);
                }
            },

            setFocus(state) {
                try {
                    let useMethod = (state !== false) ? 'focus' : 'blur';
                    this.$refs.element[useMethod]();
                } catch (e) {
                    console.warn('Error while setting focus');
                    console.error(e);
                }
            },

            initWawesEffect(el) {

                let box = { top: 0, left: 0 };

                if (typeof el.getBoundingClientRect === 'function') {
                    box = el.getBoundingClientRect();
                }

                const options = {
                    pageY: box.top + window.pageYOffset - document.documentElement.clientTop + el.clientHeight / 2,
                    pageX: box.left + window.pageXOffset - document.documentElement.clientLeft + el.clientWidth / 2
                };

                triggerEvent('mousedown', el, options);
                setTimeout(triggerEvent, 250, 'mouseup', el);
            }
        },


        mounted() {
            this.setFocus(this.focus);
        }
    };

    var errorMixin = {

        data() {
            return {
                showTooltip: false,
                hasError: false
            }
        },


        computed: {

            shake() {
                return !this.formLoading && this.showTooltip;
            },

            error() {
                return this.$store.getters['forms/fieldError'](this.formId, this.realName)
            },

            firstErrorField() {
                return this.$store.getters['forms/firstErrorField'](this.formId)
            }
        },


        watch: {

            error: {
                handler(errors) {
                    if ( this.$listeners.error ) {
                        this.$emit('error', errors);
                        return
                    }
                    if (errors) {
                        this.showTooltip = true;
                        this.hasError = true;
                        this.checkFocus();
                    } else {
                        this.showTooltip = false;
                        this.hasError = false;
                        this.resetInputWatcher();
                    }
                },
                immediate: true
            }
        },


        methods: {

            clickTooltip() {
                this.showTooltip = false;
                if (typeof this.setFocus === 'function') this.setFocus();
            },

            resetError() {
                this.showTooltip = false;
                this.$store.commit('forms/resetError', {
                    formName: this.formId,
                    fieldName: this.realName
                });
                this.resetInputWatcher();
            },

            resetInputWatcher() {
                if (this.$refs.element) {
                    this.$refs.element.removeEventListener('input', this.resetError);
                }
            },

            checkFocus() {
                if (typeof this.setFocus === 'function' &&
                    this.firstErrorField === this.realName) {
                    setTimeout(this.setFocus, 0);
                    this.$store.commit('resetFirstErrorField', this.formId);
                }
            }
        }
    };

    var fieldMixin = {

        mixins: [ baseMixin, focusMixin, errorMixin ],

        props: {

            label: String
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
            }
        },


        methods: {

            initField() {

                if (this.formId) {

                    // create field if not exists in default data
                    if (typeof this.formValue === 'undefined') {
                        this.createStoreInstance();
                    } else {
                        this.fieldValue = this.formValue;
                    }
                }

                this.$root.$on('forms:reset', this.resetFormValue);
            },

            createStoreInstance() {
                this.$store.commit('forms/createField', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value: this.value
                });
            },

            resetFormValue(formId) {
                if (this.formId !== formId) return
                this.formValue = AWES.utils.object.get(this.$options, 'props.value.default');
            },

            destroyField() {
                this.$store.commit('forms/deleteField', {
                    formName: this.formId,
                    fieldName: this.realName
                });
                this.resetInputWatcher();
                this.$root.$off('forms:reset', this.resetFormValue);
            }
        },


        created() {
            this.initField();
        },


        destroyed() {
            this.destroyField();
        }
    };

    var textFieldMixin = {

        mixins: [ fieldMixin ],


        props: {

            value: {
                type: String,
                default: ''
            }
        },


        computed: {

            isActive() {
                return !!(this.inFocus || (this.value || this.formValue));
            },
        },


        methods: {

            formValueHandler($event) {

                this.formValue = $event.target.value;

                if ( this.error ) {
                   this.resetError();
                }
            },

            vModelHandler($event) {
                this.$emit('input', $event.target.value);
            }
        }
    };

    //

    let _inputsId = 0;

    var script$2 = {

        name: "fb-input",

        inheritAttrs: false,

        mixins: [ textFieldMixin ],


        props: {

            label: {
                type: String,
                default: ''
            },

            mask: String
        },


        data() {
            return {
                inputType: this.$attrs.type || 'text',
                autoFilled: false
            }
        },


        computed: {

            inputId() {
                return 'input-' + _inputsId++
            },

            mergedListeners() {
                return Object.assign({}, this.$listeners, {
                    input: this.formId ? this.formValueHandler : this.vModelHandler
                })
            }
        },


        methods: {

            togglePassword() {
                this.setFocus();
                if ( this.inputType === 'password' ) {
                    this.inputType = 'text';
                } else {
                    this.inputType = 'password';
                }
            },

            autoFillHack( $event ) {
                switch ( $event.animationName ) {
                    case 'autoFillStart' :
                        this.autoFilled = true;
                        break
                    case 'autoFillEnd' :
                        this.autoFilled = false;
                        break
                }
            }
        }
    };

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "fb-input",
            "fb-element",
            {
              "fb-input_disabled": _vm.isDisabled,
              "fb-input_active": _vm.isActive || _vm.autoFilled,
              "fb-input_error": _vm.hasError,
              "animated shake": _vm.shake
            },
            _vm.$attrs.type ? "fb-input_type-" + _vm.$attrs.type : ""
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "label",
                {
                  staticClass: "fb-input__label fb-input__label_field",
                  attrs: { for: "#" + _vm.inputId }
                },
                [_vm._v(_vm._s(_vm.label))]
              ),
              _vm.mask
                ? _c(
                    "input",
                    _vm._g(
                      _vm._b(
                        {
                          directives: [
                            {
                              name: "mask",
                              rawName: "v-mask",
                              value: _vm.mask,
                              expression: "mask"
                            }
                          ],
                          ref: "element",
                          class: [
                            "fb-input__field",
                            { "is-focusable": _vm.isFocusable },
                            { "in-focus": _vm.inFocus },
                            {
                              "fb-input__field_password":
                                _vm.$attrs.type === "password"
                            },
                            { "has-label": _vm.label }
                          ],
                          attrs: {
                            id: _vm.inputId,
                            "data-awes": _vm.$options.name + "." + _vm.name,
                            type: _vm.inputType,
                            disabled: _vm.isDisabled
                          },
                          domProps: {
                            value: _vm.formId ? _vm.formValue : _vm.value
                          },
                          on: {
                            focus: function($event) {
                              _vm.inFocus = true;
                            },
                            blur: function($event) {
                              _vm.inFocus = false;
                            },
                            keydown: function($event) {
                              if (
                                !$event.type.indexOf("key") &&
                                _vm._k(
                                  $event.keyCode,
                                  "enter",
                                  13,
                                  $event.key,
                                  "Enter"
                                )
                              ) {
                                return null
                              }
                              $event.preventDefault();
                              return _vm.focusNext($event)
                            },
                            animationstart: _vm.autoFillHack
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      ),
                      _vm.mergedListeners
                    )
                  )
                : _c(
                    "input",
                    _vm._g(
                      _vm._b(
                        {
                          ref: "element",
                          class: [
                            "fb-input__field",
                            { "is-focusable": _vm.isFocusable },
                            { "in-focus": _vm.inFocus },
                            {
                              "fb-input__field_password":
                                _vm.$attrs.type === "password"
                            },
                            { "has-label": _vm.label }
                          ],
                          attrs: {
                            id: _vm.inputId,
                            "data-awes": _vm.$options.name + "." + _vm.name,
                            type: _vm.inputType,
                            disabled: _vm.isDisabled
                          },
                          domProps: {
                            value: _vm.formId ? _vm.formValue : _vm.value
                          },
                          on: {
                            focus: function($event) {
                              _vm.inFocus = true;
                            },
                            blur: function($event) {
                              _vm.inFocus = false;
                            },
                            keydown: function($event) {
                              if (
                                !$event.type.indexOf("key") &&
                                _vm._k(
                                  $event.keyCode,
                                  "enter",
                                  13,
                                  $event.key,
                                  "Enter"
                                )
                              ) {
                                return null
                              }
                              $event.preventDefault();
                              return _vm.focusNext($event)
                            },
                            animationstart: _vm.autoFillHack
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      ),
                      _vm.mergedListeners
                    )
                  ),
              _vm.$attrs.type === "password"
                ? _c(
                    "button",
                    {
                      staticClass: "fb-input__eye",
                      attrs: {
                        type: "button",
                        tabindex: "-1",
                        "aria-label": _vm.$lang.SHOW_PASSWORD
                      },
                      on: {
                        click: function($event) {
                          $event.preventDefault();
                          return _vm.togglePassword($event)
                        }
                      }
                    },
                    [
                      _c("i", {
                        class: [
                          "icon",
                          _vm.inputType === "password" ? "icon-eye" : "icon-eye2"
                        ]
                      })
                    ]
                  )
                : _vm._e()
            ]
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$2 = [];
    __vue_render__$2._withStripped = true;

      /* style */
      const __vue_inject_styles__$2 = undefined;
      /* scoped */
      const __vue_scope_id__$2 = undefined;
      /* module identifier */
      const __vue_module_identifier__$2 = undefined;
      /* functional template */
      const __vue_is_functional_template__$2 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbInput = normalizeComponent_1(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        undefined,
        undefined
      );

    //

    var script$3 = {

        name: 'fb-multi-block',

        mixins: [ baseMixin ],


        props: {

            label: String,
        },


        provide() {
            return {
                multiblock: this.realName,
                nextIndex: 0
            }
        },


        computed: {

            blocks() {
                return this.$store.getters['forms/multiblockIds'](this.formId, this.name)
            },

            hasClose() {
                return this.blocks.length > 1
            },

            errors() {
                return this.$store.getters['forms/errorsOrFalse'](this.formId)
            },

            fields() {
                return this.$options
            }
        },


        watch: {

            disabled( value ) {
                this.$store.commit('forms/toggleMultiblockState', {
                    formName: this.formId,
                    multiblockName: this.realName,
                    status: value
                });
            }
        },


        methods: {

            addField() {
                if ( this.isDisabled ) return
                this.$store.commit('forms/addMultiblockId', {
                    formName: this.formId,
                    multiblockName: this.name,
                    id: this.nextIndex++
                });
                this.updateTooltips();
            },

            removeField( id ) {
                if ( this.isDisabled ) return
                this.$store.commit('forms/deleteMultiblockId', {
                    formName: this.formId,
                    multiblockName: this.name,
                    id
                });
                this.updateTooltips();
            },

            updateTooltips() {
                if ( ! this.errors ) return
                this.$nextTick( () => {
                    triggerEvent('scroll', window);
                });
            },

            initMultiblock() {
                this.$store.commit('forms/createMutiblock', {
                    formName: this.formId,
                    multiblockName: this.realName,
                    disabled: this.disabled
                });
                this.nextIndex = Math.max.apply(null, this.blocks) + 1;
            },

            destroyMultiblock() {
                this.$store.commit('forms/deleteMultiblock', {
                    formName: this.formId,
                    multiblockName: this.realName
                });
            }
        },

        created() {
            this.initMultiblock();
        },


        destroyed() {
            this.destroyMultiblock();
        }
    };

    /* script */
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-multiblock fb-element",
          class: [{ "fb-multiblock_disabled": this.isDisabled }]
        },
        [
          _vm._l(_vm.blocks, function(id) {
            return _c(
              "div",
              {
                key: id,
                class: [
                  "fb-multiblock__block",
                  { "fb-multiblock_has-close": _vm.hasClose }
                ]
              },
              [
                _vm._t("default", null, { id: id }),
                _vm.hasClose
                  ? _c(
                      "button",
                      {
                        staticClass: "fb-multiblock__clear",
                        attrs: { "aria-label": "delete" },
                        on: {
                          click: function($event) {
                            $event.preventDefault();
                            return _vm.removeField(id)
                          }
                        }
                      },
                      [_c("i", { staticClass: "icon icon-cross" })]
                    )
                  : _vm._e()
              ],
              2
            )
          }),
          _c(
            "button",
            {
              staticClass: "fb-multiblock__add",
              attrs: { type: "button" },
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.addField($event)
                }
              }
            },
            [
              _vm._v(
                " " + _vm._s(_vm.label || _vm.$lang.FORMS_MULTIBLOCK_ADD) + " "
              )
            ]
          )
        ],
        2
      )
    };
    var __vue_staticRenderFns__$3 = [];
    __vue_render__$3._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = undefined;
      /* scoped */
      const __vue_scope_id__$3 = undefined;
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbMultiBlock = normalizeComponent_1(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        undefined,
        undefined
      );

    var checkboxFieldMixin = {

        mixins: [ fieldMixin ],


        props: {

            value: {
                type: [Boolean, Number, Array],
                default: 0
            },

            defaultValue: [String, Number],

            label: {
                type: String,
                required: true
            }
        },


        data() {
            return {
                isNumeric: true
            }
        },


        computed: {

            isActive() {
                if ( this.formId ) {
                    return this.isMultiple ?
                        Array.isArray(this.formValue) && this.formValue.includes(this.computedValue) :
                        !!this.formValue
                } else {
                    return this.vModelChecked
                }
            },

            vModelArray() {
                return !this.formId && Array.isArray(this.value)
            },

            vModelChecked() {
                return this.vModelArray ? this.value.includes(this.computedValue) : this.value
            },

            computedValue() {
                return typeof this.defaultValue !== 'undefined' ? this.defaultValue : this.label.replace(/ /g, '_').toLowerCase()
            },

            isMultiple() {
                return typeof this.defaultValue !== 'undefined' && this.defaultValue !== 'on'
            }
        },


        methods: {

            createStoreInstance() {

                if ( this.isMultiple && ! Array.isArray(this.formValue) ) {
                    this.$store.commit('forms/createField', {
                        formName: this.formId,
                        fieldName: this.realName,
                        value: []
                    });
                } else {
                    this.$store.commit('forms/createField', {
                        formName: this.formId,
                        fieldName: this.realName,
                        value: this.value
                    });
                }
            },
        },


        created() {
            if (this.formId && typeof this.formValue === 'boolean') {
                this.isNumeric = false;
            }
        }
    };

    //

    var script$4 = {

        name: 'fb-checkbox',

        inheritAttrs: false,

        mixins: [ checkboxFieldMixin ],


        methods: {

            formValueHandler($event) {
                if ( this.isMultiple ) {
                    let _value = Array.isArray(this.formValue) && this.formValue.slice() || [];
                    if ( _value.includes(this.computedValue) ) {
                        let index = _value.indexOf(this.computedValue);
                        _value.splice(index, 1);
                    } else {
                        _value.push( this.computedValue );
                    }
                    this.formValue = _value;
                } else {
                    let checked = $event.target.checked;
                    this.formValue = this.isNumeric ? Number(checked) : checked;
                }

                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
                let response;

                if (this.vModelArray) {

                    // switch the value in array
                    response = this.value.slice();
                    if ($event.target.checked && !this.vModelChecked) {
                        response.push(this.computedValue);
                    } else if (!$event.target.checked && this.vModelChecked) {
                        response.splice(response.findIndex(item => item === this.computedValue), 1);
                    }
                } else {

                    // switch single value
                    response = $event.target.checked;
                }

                this.$emit('input', response);
            }
        }
    };

    /* script */
    const __vue_script__$4 = script$4;

    /* template */
    var __vue_render__$4 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "fb-checkbox",
            "fb-element",
            { "fb-checkbox_error": _vm.hasError },
            { "fb-checkbox_active": _vm.isActive },
            { "fb-checkbox_disabled": _vm.isDisabled }
          ]
        },
        [
          _c(
            "label",
            {
              staticClass: "fb-checkbox__label",
              attrs: { "data-awes": _vm.$options.name + "." + _vm.name }
            },
            [
              _c(
                "fb-error-wrap",
                {
                  attrs: { open: _vm.showTooltip, error: _vm.error },
                  on: { clickTooltip: _vm.clickTooltip }
                },
                [
                  _c(
                    "input",
                    _vm._g(
                      _vm._b(
                        {
                          ref: "element",
                          class: {
                            "is-focusable": _vm.isFocusable,
                            "in-focus": _vm.inFocus
                          },
                          attrs: { type: "checkbox", disabled: _vm.isDisabled },
                          domProps: {
                            value: _vm.isActive,
                            value: _vm.computedValue,
                            checked: _vm.isActive
                          },
                          on: {
                            focus: function($event) {
                              _vm.inFocus = true;
                            },
                            blur: function($event) {
                              _vm.inFocus = false;
                            },
                            keydown: function($event) {
                              if (
                                !$event.type.indexOf("key") &&
                                _vm._k(
                                  $event.keyCode,
                                  "enter",
                                  13,
                                  $event.key,
                                  "Enter"
                                )
                              ) {
                                return null
                              }
                              $event.preventDefault();
                              return _vm.focusNext($event)
                            }
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      ),
                      {
                        change: _vm.formId
                          ? _vm.formValueHandler
                          : _vm.vModelHandler
                      }
                    )
                  ),
                  _c("span", { staticClass: "fb-checkbox__text" }, [
                    _c("i", { staticClass: "icon icon-checkbox" }),
                    _c("span", [_vm._v(_vm._s(_vm.label))])
                  ])
                ]
              )
            ],
            1
          )
        ]
      )
    };
    var __vue_staticRenderFns__$4 = [];
    __vue_render__$4._withStripped = true;

      /* style */
      const __vue_inject_styles__$4 = undefined;
      /* scoped */
      const __vue_scope_id__$4 = undefined;
      /* module identifier */
      const __vue_module_identifier__$4 = undefined;
      /* functional template */
      const __vue_is_functional_template__$4 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbCheckbox = normalizeComponent_1(
        { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
        __vue_inject_styles__$4,
        __vue_script__$4,
        __vue_scope_id__$4,
        __vue_is_functional_template__$4,
        __vue_module_identifier__$4,
        undefined,
        undefined
      );

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var vueMultiselect_min = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(commonjsGlobal,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i});},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/",e(e.s=60)}([function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n);},function(t,e,n){var i=n(49)("wks"),r=n(30),o=n(0).Symbol,s="function"==typeof o;(t.exports=function(t){return i[t]||(i[t]=s&&o[t]||(s?o:r)("Symbol."+t))}).store=i;},function(t,e,n){var i=n(5);t.exports=function(t){if(!i(t))throw TypeError(t+" is not an object!");return t};},function(t,e,n){var i=n(0),r=n(10),o=n(8),s=n(6),u=n(11),a=function(t,e,n){var l,c,f,p,h=t&a.F,d=t&a.G,v=t&a.S,g=t&a.P,y=t&a.B,m=d?i:v?i[e]||(i[e]={}):(i[e]||{}).prototype,b=d?r:r[e]||(r[e]={}),_=b.prototype||(b.prototype={});d&&(n=e);for(l in n)c=!h&&m&&void 0!==m[l],f=(c?m:n)[l],p=y&&c?u(f,i):g&&"function"==typeof f?u(Function.call,f):f,m&&s(m,l,f,t&a.U),b[l]!=f&&o(b,l,p),g&&_[l]!=f&&(_[l]=f);};i.core=r,a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a;},function(t,e,n){t.exports=!n(7)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a});},function(t,e){t.exports=function(t){return "object"==typeof t?null!==t:"function"==typeof t};},function(t,e,n){var i=n(0),r=n(8),o=n(12),s=n(30)("src"),u=Function.toString,a=(""+u).split("toString");n(10).inspectSource=function(t){return u.call(t)},(t.exports=function(t,e,n,u){var l="function"==typeof n;l&&(o(n,"name")||r(n,"name",e)),t[e]!==n&&(l&&(o(n,s)||r(n,s,t[e]?""+t[e]:a.join(String(e)))),t===i?t[e]=n:u?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)));})(Function.prototype,"toString",function(){return "function"==typeof this&&this[s]||u.call(this)});},function(t,e){t.exports=function(t){try{return !!t()}catch(t){return !0}};},function(t,e,n){var i=n(13),r=n(25);t.exports=n(4)?function(t,e,n){return i.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t};},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)};},function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n);},function(t,e,n){var i=n(14);t.exports=function(t,e,n){if(i(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,r){return t.call(e,n,i,r)}}return function(){return t.apply(e,arguments)}};},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)};},function(t,e,n){var i=n(2),r=n(41),o=n(29),s=Object.defineProperty;e.f=n(4)?Object.defineProperty:function(t,e,n){if(i(t),e=o(e,!0),i(n),r)try{return s(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return "value"in n&&(t[e]=n.value),t};},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t};},function(t,e){t.exports={};},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t};},function(t,e,n){var i=n(7);t.exports=function(t,e){return !!t&&i(function(){e?t.call(null,function(){},1):t.call(null);})};},function(t,e,n){var i=n(23),r=n(16);t.exports=function(t){return i(r(t))};},function(t,e,n){var i=n(53),r=Math.min;t.exports=function(t){return t>0?r(i(t),9007199254740991):0};},function(t,e,n){var i=n(11),r=n(23),o=n(28),s=n(19),u=n(64);t.exports=function(t,e){var n=1==t,a=2==t,l=3==t,c=4==t,f=6==t,p=5==t||f,h=e||u;return function(e,u,d){for(var v,g,y=o(e),m=r(y),b=i(u,d,3),_=s(m.length),x=0,w=n?h(e,_):a?h(e,0):void 0;_>x;x++)if((p||x in m)&&(v=m[x],g=b(v,x,y),t))if(n)w[x]=g;else if(g)switch(t){case 3:return !0;case 5:return v;case 6:return x;case 2:w.push(v);}else if(c)return !1;return f?-1:l||c?c:w}};},function(t,e,n){var i=n(5),r=n(0).document,o=i(r)&&i(r.createElement);t.exports=function(t){return o?r.createElement(t):{}};},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",");},function(t,e,n){var i=n(9);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return "String"==i(t)?t.split(""):Object(t)};},function(t,e){t.exports=!1;},function(t,e){t.exports=function(t,e){return {enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}};},function(t,e,n){var i=n(13).f,r=n(12),o=n(1)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,o)&&i(t,o,{configurable:!0,value:e});};},function(t,e,n){var i=n(49)("keys"),r=n(30);t.exports=function(t){return i[t]||(i[t]=r(t))};},function(t,e,n){var i=n(16);t.exports=function(t){return Object(i(t))};},function(t,e,n){var i=n(5);t.exports=function(t,e){if(!i(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!i(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!i(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")};},function(t,e){var n=0,i=Math.random();t.exports=function(t){return "Symbol(".concat(void 0===t?"":t,")_",(++n+i).toString(36))};},function(t,e,n){var i=n(0),r=n(12),o=n(9),s=n(67),u=n(29),a=n(7),l=n(77).f,c=n(45).f,f=n(13).f,p=n(51).trim,h=i.Number,d=h,v=h.prototype,g="Number"==o(n(44)(v)),y="trim"in String.prototype,m=function(t){var e=u(t,!1);if("string"==typeof e&&e.length>2){e=y?e.trim():p(e,3);var n,i,r,o=e.charCodeAt(0);if(43===o||45===o){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===o){switch(e.charCodeAt(1)){case 66:case 98:i=2,r=49;break;case 79:case 111:i=8,r=55;break;default:return +e}for(var s,a=e.slice(2),l=0,c=a.length;l<c;l++)if((s=a.charCodeAt(l))<48||s>r)return NaN;return parseInt(a,i)}}return +e};if(!h(" 0o1")||!h("0b1")||h("+0x1")){h=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof h&&(g?a(function(){v.valueOf.call(n);}):"Number"!=o(n))?s(new d(m(e)),n,h):m(e)};for(var b,_=n(4)?l(d):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;_.length>x;x++)r(d,b=_[x])&&!r(h,b)&&f(h,b,c(d,b));h.prototype=v,v.constructor=h,n(6)(i,"Number",h);}},function(t,e,n){function i(t){return 0!==t&&(!(!Array.isArray(t)||0!==t.length)||!t)}function r(t){return function(){return !t.apply(void 0,arguments)}}function o(t,e){return void 0===t&&(t="undefined"),null===t&&(t="null"),!1===t&&(t="false"),-1!==t.toString().toLowerCase().indexOf(e.trim())}function s(t,e,n,i){return t.filter(function(t){return o(i(t,n),e)})}function u(t){return t.filter(function(t){return !t.$isLabel})}function a(t,e){return function(n){return n.reduce(function(n,i){return i[t]&&i[t].length?(n.push({$groupLabel:i[e],$isLabel:!0}),n.concat(i[t])):n},[])}}function l(t,e,i,r,o){return function(u){return u.map(function(u){var a;if(!u[i])return console.warn("Options passed to vue-multiselect do not contain groups, despite the config."),[];var l=s(u[i],t,e,o);return l.length?(a={},n.i(d.a)(a,r,u[r]),n.i(d.a)(a,i,l),a):[]})}}var c=n(59),f=n(54),p=(n.n(f),n(95)),h=(n.n(p),n(31)),d=(n.n(h),n(58)),v=n(91),g=(n.n(v),n(98)),y=(n.n(g),n(92)),m=(n.n(y),n(88)),b=(n.n(m),n(97)),_=(n.n(b),n(89)),x=(n.n(_),n(96)),w=(n.n(x),n(93)),S=(n.n(w),n(90)),O=(n.n(S),function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(t){return e.reduce(function(t,e){return e(t)},t)}});e.a={data:function(){return {search:"",isOpen:!1,preferredOpenDirection:"below",optimizedHeight:this.maxHeight}},props:{internalSearch:{type:Boolean,default:!0},options:{type:Array,required:!0},multiple:{type:Boolean,default:!1},value:{type:null,default:function(){return []}},trackBy:{type:String},label:{type:String},searchable:{type:Boolean,default:!0},clearOnSelect:{type:Boolean,default:!0},hideSelected:{type:Boolean,default:!1},placeholder:{type:String,default:"Select option"},allowEmpty:{type:Boolean,default:!0},resetAfter:{type:Boolean,default:!1},closeOnSelect:{type:Boolean,default:!0},customLabel:{type:Function,default:function(t,e){return i(t)?"":e?t[e]:t}},taggable:{type:Boolean,default:!1},tagPlaceholder:{type:String,default:"Press enter to create a tag"},tagPosition:{type:String,default:"top"},max:{type:[Number,Boolean],default:!1},id:{default:null},optionsLimit:{type:Number,default:1e3},groupValues:{type:String},groupLabel:{type:String},groupSelect:{type:Boolean,default:!1},blockKeys:{type:Array,default:function(){return []}},preserveSearch:{type:Boolean,default:!1},preselectFirst:{type:Boolean,default:!1}},mounted:function(){!this.multiple&&this.max&&console.warn("[Vue-Multiselect warn]: Max prop should not be used when prop Multiple equals false."),this.preselectFirst&&!this.internalValue.length&&this.options.length&&this.select(this.filteredOptions[0]);},computed:{internalValue:function(){return this.value||0===this.value?Array.isArray(this.value)?this.value:[this.value]:[]},filteredOptions:function(){var t=this.search||"",e=t.toLowerCase().trim(),n=this.options.concat();return n=this.internalSearch?this.groupValues?this.filterAndFlat(n,e,this.label):s(n,e,this.label,this.customLabel):this.groupValues?a(this.groupValues,this.groupLabel)(n):n,n=this.hideSelected?n.filter(r(this.isSelected)):n,this.taggable&&e.length&&!this.isExistingOption(e)&&("bottom"===this.tagPosition?n.push({isTag:!0,label:t}):n.unshift({isTag:!0,label:t})),n.slice(0,this.optionsLimit)},valueKeys:function(){var t=this;return this.trackBy?this.internalValue.map(function(e){return e[t.trackBy]}):this.internalValue},optionKeys:function(){var t=this;return (this.groupValues?this.flatAndStrip(this.options):this.options).map(function(e){return t.customLabel(e,t.label).toString().toLowerCase()})},currentOptionLabel:function(){return this.multiple?this.searchable?"":this.placeholder:this.internalValue.length?this.getOptionLabel(this.internalValue[0]):this.searchable?"":this.placeholder}},watch:{internalValue:function(){this.resetAfter&&this.internalValue.length&&(this.search="",this.$emit("input",this.multiple?[]:null));},search:function(){this.$emit("search-change",this.search,this.id);}},methods:{getValue:function(){return this.multiple?this.internalValue:0===this.internalValue.length?null:this.internalValue[0]},filterAndFlat:function(t,e,n){return O(l(e,n,this.groupValues,this.groupLabel,this.customLabel),a(this.groupValues,this.groupLabel))(t)},flatAndStrip:function(t){return O(a(this.groupValues,this.groupLabel),u)(t)},updateSearch:function(t){this.search=t;},isExistingOption:function(t){return !!this.options&&this.optionKeys.indexOf(t)>-1},isSelected:function(t){var e=this.trackBy?t[this.trackBy]:t;return this.valueKeys.indexOf(e)>-1},isOptionDisabled:function(t){return !!t.$isDisabled},getOptionLabel:function(t){if(i(t))return "";if(t.isTag)return t.label;if(t.$isLabel)return t.$groupLabel;var e=this.customLabel(t,this.label);return i(e)?"":e},select:function(t,e){if(t.$isLabel&&this.groupSelect)return void this.selectGroup(t);if(!(-1!==this.blockKeys.indexOf(e)||this.disabled||t.$isDisabled||t.$isLabel)&&(!this.max||!this.multiple||this.internalValue.length!==this.max)&&("Tab"!==e||this.pointerDirty)){if(t.isTag)this.$emit("tag",t.label,this.id),this.search="",this.closeOnSelect&&!this.multiple&&this.deactivate();else{if(this.isSelected(t))return void("Tab"!==e&&this.removeElement(t));this.$emit("select",t,this.id),this.multiple?this.$emit("input",this.internalValue.concat([t]),this.id):this.$emit("input",t,this.id),this.clearOnSelect&&(this.search="");}this.closeOnSelect&&this.deactivate();}},selectGroup:function(t){var e=this,n=this.options.find(function(n){return n[e.groupLabel]===t.$groupLabel});if(n)if(this.wholeGroupSelected(n)){this.$emit("remove",n[this.groupValues],this.id);var i=this.internalValue.filter(function(t){return -1===n[e.groupValues].indexOf(t)});this.$emit("input",i,this.id);}else{var r=n[this.groupValues].filter(function(t){return !(e.isOptionDisabled(t)||e.isSelected(t))});this.$emit("select",r,this.id),this.$emit("input",this.internalValue.concat(r),this.id);}},wholeGroupSelected:function(t){var e=this;return t[this.groupValues].every(function(t){return e.isSelected(t)||e.isOptionDisabled(t)})},wholeGroupDisabled:function(t){return t[this.groupValues].every(this.isOptionDisabled)},removeElement:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this.disabled&&!t.$isDisabled){if(!this.allowEmpty&&this.internalValue.length<=1)return void this.deactivate();var i="object"===n.i(c.a)(t)?this.valueKeys.indexOf(t[this.trackBy]):this.valueKeys.indexOf(t);if(this.$emit("remove",t,this.id),this.multiple){var r=this.internalValue.slice(0,i).concat(this.internalValue.slice(i+1));this.$emit("input",r,this.id);}else this.$emit("input",null,this.id);this.closeOnSelect&&e&&this.deactivate();}},removeLastElement:function(){-1===this.blockKeys.indexOf("Delete")&&0===this.search.length&&Array.isArray(this.internalValue)&&this.internalValue.length&&this.removeElement(this.internalValue[this.internalValue.length-1],!1);},activate:function(){var t=this;this.isOpen||this.disabled||(this.adjustPosition(),this.groupValues&&0===this.pointer&&this.filteredOptions.length&&(this.pointer=1),this.isOpen=!0,this.searchable?(this.preserveSearch||(this.search=""),this.$nextTick(function(){return t.$refs.search.focus()})):this.$el.focus(),this.$emit("open",this.id));},deactivate:function(){this.isOpen&&(this.isOpen=!1,this.searchable?this.$refs.search.blur():this.$el.blur(),this.preserveSearch||(this.search=""),this.$emit("close",this.getValue(),this.id));},toggle:function(){this.isOpen?this.deactivate():this.activate();},adjustPosition:function(){if("undefined"!=typeof window){var t=this.$el.getBoundingClientRect().top,e=window.innerHeight-this.$el.getBoundingClientRect().bottom;e>this.maxHeight||e>t||"below"===this.openDirection||"bottom"===this.openDirection?(this.preferredOpenDirection="below",this.optimizedHeight=Math.min(e-40,this.maxHeight)):(this.preferredOpenDirection="above",this.optimizedHeight=Math.min(t-40,this.maxHeight));}}}};},function(t,e,n){var i=n(54),r=(n.n(i),n(31));n.n(r);e.a={data:function(){return {pointer:0,pointerDirty:!1}},props:{showPointer:{type:Boolean,default:!0},optionHeight:{type:Number,default:40}},computed:{pointerPosition:function(){return this.pointer*this.optionHeight},visibleElements:function(){return this.optimizedHeight/this.optionHeight}},watch:{filteredOptions:function(){this.pointerAdjust();},isOpen:function(){this.pointerDirty=!1;}},methods:{optionHighlight:function(t,e){return {"multiselect__option--highlight":t===this.pointer&&this.showPointer,"multiselect__option--selected":this.isSelected(e)}},groupHighlight:function(t,e){var n=this;if(!this.groupSelect)return ["multiselect__option--group","multiselect__option--disabled"];var i=this.options.find(function(t){return t[n.groupLabel]===e.$groupLabel});return i&&!this.wholeGroupDisabled(i)?["multiselect__option--group",{"multiselect__option--highlight":t===this.pointer&&this.showPointer},{"multiselect__option--group-selected":this.wholeGroupSelected(i)}]:"multiselect__option--disabled"},addPointerElement:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Enter",e=t.key;this.filteredOptions.length>0&&this.select(this.filteredOptions[this.pointer],e),this.pointerReset();},pointerForward:function(){this.pointer<this.filteredOptions.length-1&&(this.pointer++,this.$refs.list.scrollTop<=this.pointerPosition-(this.visibleElements-1)*this.optionHeight&&(this.$refs.list.scrollTop=this.pointerPosition-(this.visibleElements-1)*this.optionHeight),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward()),this.pointerDirty=!0;},pointerBackward:function(){this.pointer>0?(this.pointer--,this.$refs.list.scrollTop>=this.pointerPosition&&(this.$refs.list.scrollTop=this.pointerPosition),this.filteredOptions[this.pointer]&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerBackward()):this.filteredOptions[this.pointer]&&this.filteredOptions[0].$isLabel&&!this.groupSelect&&this.pointerForward(),this.pointerDirty=!0;},pointerReset:function(){this.closeOnSelect&&(this.pointer=0,this.$refs.list&&(this.$refs.list.scrollTop=0));},pointerAdjust:function(){this.pointer>=this.filteredOptions.length-1&&(this.pointer=this.filteredOptions.length?this.filteredOptions.length-1:0),this.filteredOptions.length>0&&this.filteredOptions[this.pointer].$isLabel&&!this.groupSelect&&this.pointerForward();},pointerSet:function(t){this.pointer=t,this.pointerDirty=!0;}}};},function(t,e,n){var i=n(36),r=n(74),o=n(15),s=n(18);t.exports=n(72)(Array,"Array",function(t,e){this._t=s(t),this._i=0,this._k=e;},function(){var t=this._t,e=this._k,n=this._i++;return !t||n>=t.length?(this._t=void 0,r(1)):"keys"==e?r(0,n):"values"==e?r(0,t[n]):r(0,[n,t[n]])},"values"),o.Arguments=o.Array,i("keys"),i("values"),i("entries");},function(t,e,n){var i=n(31),r=(n.n(i),n(32)),o=n(33);e.a={name:"vue-multiselect",mixins:[r.a,o.a],props:{name:{type:String,default:""},selectLabel:{type:String,default:"Press enter to select"},selectGroupLabel:{type:String,default:"Press enter to select group"},selectedLabel:{type:String,default:"Selected"},deselectLabel:{type:String,default:"Press enter to remove"},deselectGroupLabel:{type:String,default:"Press enter to deselect group"},showLabels:{type:Boolean,default:!0},limit:{type:Number,default:99999},maxHeight:{type:Number,default:300},limitText:{type:Function,default:function(t){return "and ".concat(t," more")}},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},openDirection:{type:String,default:""},showNoOptions:{type:Boolean,default:!0},showNoResults:{type:Boolean,default:!0},tabindex:{type:Number,default:0}},computed:{isSingleLabelVisible:function(){return (this.singleValue||0===this.singleValue)&&(!this.isOpen||!this.searchable)&&!this.visibleValues.length},isPlaceholderVisible:function(){return !(this.internalValue.length||this.searchable&&this.isOpen)},visibleValues:function(){return this.multiple?this.internalValue.slice(0,this.limit):[]},singleValue:function(){return this.internalValue[0]},deselectLabelText:function(){return this.showLabels?this.deselectLabel:""},deselectGroupLabelText:function(){return this.showLabels?this.deselectGroupLabel:""},selectLabelText:function(){return this.showLabels?this.selectLabel:""},selectGroupLabelText:function(){return this.showLabels?this.selectGroupLabel:""},selectedLabelText:function(){return this.showLabels?this.selectedLabel:""},inputStyle:function(){if(this.searchable||this.multiple&&this.value&&this.value.length)return this.isOpen?{width:"100%"}:{width:"0",position:"absolute",padding:"0"}},contentStyle:function(){return this.options.length?{display:"inline-block"}:{display:"block"}},isAbove:function(){return "above"===this.openDirection||"top"===this.openDirection||"below"!==this.openDirection&&"bottom"!==this.openDirection&&"above"===this.preferredOpenDirection},showSearchInput:function(){return this.searchable&&(!this.hasSingleSelectedSlot||!this.visibleSingleValue&&0!==this.visibleSingleValue||this.isOpen)}}};},function(t,e,n){var i=n(1)("unscopables"),r=Array.prototype;void 0==r[i]&&n(8)(r,i,{}),t.exports=function(t){r[i][t]=!0;};},function(t,e,n){var i=n(18),r=n(19),o=n(85);t.exports=function(t){return function(e,n,s){var u,a=i(e),l=r(a.length),c=o(s,l);if(t&&n!=n){for(;l>c;)if((u=a[c++])!=u)return !0}else for(;l>c;c++)if((t||c in a)&&a[c]===n)return t||c||0;return !t&&-1}};},function(t,e,n){var i=n(9),r=n(1)("toStringTag"),o="Arguments"==i(function(){return arguments}()),s=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=s(e=Object(t),r))?n:o?i(e):"Object"==(u=i(e))&&"function"==typeof e.callee?"Arguments":u};},function(t,e,n){var i=n(2);t.exports=function(){var t=i(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};},function(t,e,n){var i=n(0).document;t.exports=i&&i.documentElement;},function(t,e,n){t.exports=!n(4)&&!n(7)(function(){return 7!=Object.defineProperty(n(21)("div"),"a",{get:function(){return 7}}).a});},function(t,e,n){var i=n(9);t.exports=Array.isArray||function(t){return "Array"==i(t)};},function(t,e,n){function i(t){var e,n;this.promise=new t(function(t,i){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=i;}),this.resolve=r(e),this.reject=r(n);}var r=n(14);t.exports.f=function(t){return new i(t)};},function(t,e,n){var i=n(2),r=n(76),o=n(22),s=n(27)("IE_PROTO"),u=function(){},a=function(){var t,e=n(21)("iframe"),i=o.length;for(e.style.display="none",n(40).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;i--;)delete a.prototype[o[i]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(u.prototype=i(t),n=new u,u.prototype=null,n[s]=t):n=a(),void 0===e?n:r(n,e)};},function(t,e,n){var i=n(79),r=n(25),o=n(18),s=n(29),u=n(12),a=n(41),l=Object.getOwnPropertyDescriptor;e.f=n(4)?l:function(t,e){if(t=o(t),e=s(e,!0),a)try{return l(t,e)}catch(t){}if(u(t,e))return r(!i.f.call(t,e),t[e])};},function(t,e,n){var i=n(12),r=n(18),o=n(37)(!1),s=n(27)("IE_PROTO");t.exports=function(t,e){var n,u=r(t),a=0,l=[];for(n in u)n!=s&&i(u,n)&&l.push(n);for(;e.length>a;)i(u,n=e[a++])&&(~o(l,n)||l.push(n));return l};},function(t,e,n){var i=n(46),r=n(22);t.exports=Object.keys||function(t){return i(t,r)};},function(t,e,n){var i=n(2),r=n(5),o=n(43);t.exports=function(t,e){if(i(t),r(e)&&e.constructor===t)return e;var n=o.f(t);return (0, n.resolve)(e),n.promise};},function(t,e,n){var i=n(10),r=n(0),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:i.version,mode:n(24)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"});},function(t,e,n){var i=n(2),r=n(14),o=n(1)("species");t.exports=function(t,e){var n,s=i(t).constructor;return void 0===s||void 0==(n=i(s)[o])?e:r(n)};},function(t,e,n){var i=n(3),r=n(16),o=n(7),s=n(84),u="["+s+"]",a="​",l=RegExp("^"+u+u+"*"),c=RegExp(u+u+"*$"),f=function(t,e,n){var r={},u=o(function(){return !!s[t]()||a[t]()!=a}),l=r[t]=u?e(p):s[t];n&&(r[n]=l),i(i.P+i.F*u,"String",r);},p=f.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=f;},function(t,e,n){var i,r,o,s=n(11),u=n(68),a=n(40),l=n(21),c=n(0),f=c.process,p=c.setImmediate,h=c.clearImmediate,d=c.MessageChannel,v=c.Dispatch,g=0,y={},m=function(){var t=+this;if(y.hasOwnProperty(t)){var e=y[t];delete y[t],e();}},b=function(t){m.call(t.data);};p&&h||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return y[++g]=function(){u("function"==typeof t?t:Function(t),e);},i(g),g},h=function(t){delete y[t];},"process"==n(9)(f)?i=function(t){f.nextTick(s(m,t,1));}:v&&v.now?i=function(t){v.now(s(m,t,1));}:d?(r=new d,o=r.port2,r.port1.onmessage=b,i=s(o.postMessage,o,1)):c.addEventListener&&"function"==typeof postMessage&&!c.importScripts?(i=function(t){c.postMessage(t+"","*");},c.addEventListener("message",b,!1)):i="onreadystatechange"in l("script")?function(t){a.appendChild(l("script")).onreadystatechange=function(){a.removeChild(this),m.call(t);};}:function(t){setTimeout(s(m,t,1),0);}),t.exports={set:p,clear:h};},function(t,e){var n=Math.ceil,i=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?i:n)(t)};},function(t,e,n){var i=n(3),r=n(20)(5),o=!0;"find"in[]&&Array(1).find(function(){o=!1;}),i(i.P+i.F*o,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(36)("find");},function(t,e,n){var i,r,o,s,u=n(24),a=n(0),l=n(11),c=n(38),f=n(3),p=n(5),h=n(14),d=n(61),v=n(66),g=n(50),y=n(52).set,m=n(75)(),b=n(43),_=n(80),x=n(86),w=n(48),S=a.TypeError,O=a.process,L=O&&O.versions,k=L&&L.v8||"",P=a.Promise,T="process"==c(O),V=function(){},E=r=b.f,A=!!function(){try{var t=P.resolve(1),e=(t.constructor={})[n(1)("species")]=function(t){t(V,V);};return (T||"function"==typeof PromiseRejectionEvent)&&t.then(V)instanceof e&&0!==k.indexOf("6.6")&&-1===x.indexOf("Chrome/66")}catch(t){}}(),C=function(t){var e;return !(!p(t)||"function"!=typeof(e=t.then))&&e},D=function(t,e){if(!t._n){t._n=!0;var n=t._c;m(function(){for(var i=t._v,r=1==t._s,o=0;n.length>o;)!function(e){var n,o,s,u=r?e.ok:e.fail,a=e.resolve,l=e.reject,c=e.domain;try{u?(r||(2==t._h&&$(t),t._h=1),!0===u?n=i:(c&&c.enter(),n=u(i),c&&(c.exit(),s=!0)),n===e.promise?l(S("Promise-chain cycle")):(o=C(n))?o.call(n,a,l):a(n)):l(i);}catch(t){c&&!s&&c.exit(),l(t);}}(n[o++]);t._c=[],t._n=!1,e&&!t._h&&j(t);});}},j=function(t){y.call(a,function(){var e,n,i,r=t._v,o=N(t);if(o&&(e=_(function(){T?O.emit("unhandledRejection",r,t):(n=a.onunhandledrejection)?n({promise:t,reason:r}):(i=a.console)&&i.error&&i.error("Unhandled promise rejection",r);}),t._h=T||N(t)?2:1),t._a=void 0,o&&e.e)throw e.v});},N=function(t){return 1!==t._h&&0===(t._a||t._c).length},$=function(t){y.call(a,function(){var e;T?O.emit("rejectionHandled",t):(e=a.onrejectionhandled)&&e({promise:t,reason:t._v});});},F=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),D(e,!0));},M=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=C(t))?m(function(){var i={_w:n,_d:!1};try{e.call(t,l(M,i,1),l(F,i,1));}catch(t){F.call(i,t);}}):(n._v=t,n._s=1,D(n,!1));}catch(t){F.call({_w:n,_d:!1},t);}}};A||(P=function(t){d(this,P,"Promise","_h"),h(t),i.call(this);try{t(l(M,this,1),l(F,this,1));}catch(t){F.call(this,t);}},i=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1;},i.prototype=n(81)(P.prototype,{then:function(t,e){var n=E(g(this,P));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=T?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&D(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new i;this.promise=t,this.resolve=l(M,t,1),this.reject=l(F,t,1);},b.f=E=function(t){return t===P||t===s?new o(t):r(t)}),f(f.G+f.W+f.F*!A,{Promise:P}),n(26)(P,"Promise"),n(83)("Promise"),s=n(10).Promise,f(f.S+f.F*!A,"Promise",{reject:function(t){var e=E(this);return (0, e.reject)(t),e.promise}}),f(f.S+f.F*(u||!A),"Promise",{resolve:function(t){return w(u&&this===s?P:this,t)}}),f(f.S+f.F*!(A&&n(73)(function(t){P.all(t).catch(V);})),"Promise",{all:function(t){var e=this,n=E(e),i=n.resolve,r=n.reject,o=_(function(){var n=[],o=0,s=1;v(t,!1,function(t){var u=o++,a=!1;n.push(void 0),s++,e.resolve(t).then(function(t){a||(a=!0,n[u]=t,--s||i(n));},r);}),--s||i(n);});return o.e&&r(o.v),n.promise},race:function(t){var e=this,n=E(e),i=n.reject,r=_(function(){v(t,!1,function(t){e.resolve(t).then(n.resolve,i);});});return r.e&&i(r.v),n.promise}});},function(t,e,n){var i=n(3),r=n(10),o=n(0),s=n(50),u=n(48);i(i.P+i.R,"Promise",{finally:function(t){var e=s(this,r.Promise||o.Promise),n="function"==typeof t;return this.then(n?function(n){return u(e,t()).then(function(){return n})}:t,n?function(n){return u(e,t()).then(function(){throw n})}:t)}});},function(t,e,n){function i(t){n(99);}var r=n(35),o=n(101),s=n(100),u=i,a=s(r.a,o.a,!1,u,null,null);e.a=a.exports;},function(t,e,n){function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}e.a=i;},function(t,e,n){function i(t){return (i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t){return (r="function"==typeof Symbol&&"symbol"===i(Symbol.iterator)?function(t){return i(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":i(t)})(t)}e.a=r;},function(t,e,n){Object.defineProperty(e,"__esModule",{value:!0});var i=n(34),r=(n.n(i),n(55)),o=(n.n(r),n(56)),s=(n.n(o),n(57)),u=n(32),a=n(33);n.d(e,"Multiselect",function(){return s.a}),n.d(e,"multiselectMixin",function(){return u.a}),n.d(e,"pointerMixin",function(){return a.a}),e.default=s.a;},function(t,e){t.exports=function(t,e,n,i){if(!(t instanceof e)||void 0!==i&&i in t)throw TypeError(n+": incorrect invocation!");return t};},function(t,e,n){var i=n(14),r=n(28),o=n(23),s=n(19);t.exports=function(t,e,n,u,a){i(e);var l=r(t),c=o(l),f=s(l.length),p=a?f-1:0,h=a?-1:1;if(n<2)for(;;){if(p in c){u=c[p],p+=h;break}if(p+=h,a?p<0:f<=p)throw TypeError("Reduce of empty array with no initial value")}for(;a?p>=0:f>p;p+=h)p in c&&(u=e(u,c[p],p,l));return u};},function(t,e,n){var i=n(5),r=n(42),o=n(1)("species");t.exports=function(t){var e;return r(t)&&(e=t.constructor,"function"!=typeof e||e!==Array&&!r(e.prototype)||(e=void 0),i(e)&&null===(e=e[o])&&(e=void 0)),void 0===e?Array:e};},function(t,e,n){var i=n(63);t.exports=function(t,e){return new(i(t))(e)};},function(t,e,n){var i=n(8),r=n(6),o=n(7),s=n(16),u=n(1);t.exports=function(t,e,n){var a=u(t),l=n(s,a,""[t]),c=l[0],f=l[1];o(function(){var e={};return e[a]=function(){return 7},7!=""[t](e)})&&(r(String.prototype,t,c),i(RegExp.prototype,a,2==e?function(t,e){return f.call(t,this,e)}:function(t){return f.call(t,this)}));};},function(t,e,n){var i=n(11),r=n(70),o=n(69),s=n(2),u=n(19),a=n(87),l={},c={},e=t.exports=function(t,e,n,f,p){var h,d,v,g,y=p?function(){return t}:a(t),m=i(n,f,e?2:1),b=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(o(y)){for(h=u(t.length);h>b;b++)if((g=e?m(s(d=t[b])[0],d[1]):m(t[b]))===l||g===c)return g}else for(v=y.call(t);!(d=v.next()).done;)if((g=r(v,m,d.value,e))===l||g===c)return g};e.BREAK=l,e.RETURN=c;},function(t,e,n){var i=n(5),r=n(82).set;t.exports=function(t,e,n){var o,s=e.constructor;return s!==n&&"function"==typeof s&&(o=s.prototype)!==n.prototype&&i(o)&&r&&r(t,o),t};},function(t,e){t.exports=function(t,e,n){var i=void 0===n;switch(e.length){case 0:return i?t():t.call(n);case 1:return i?t(e[0]):t.call(n,e[0]);case 2:return i?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return i?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return i?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)};},function(t,e,n){var i=n(15),r=n(1)("iterator"),o=Array.prototype;t.exports=function(t){return void 0!==t&&(i.Array===t||o[r]===t)};},function(t,e,n){var i=n(2);t.exports=function(t,e,n,r){try{return r?e(i(n)[0],n[1]):e(n)}catch(e){var o=t.return;throw void 0!==o&&i(o.call(t)),e}};},function(t,e,n){var i=n(44),r=n(25),o=n(26),s={};n(8)(s,n(1)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=i(s,{next:r(1,n)}),o(t,e+" Iterator");};},function(t,e,n){var i=n(24),r=n(3),o=n(6),s=n(8),u=n(15),a=n(71),l=n(26),c=n(78),f=n(1)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,e,n,d,v,g,y){a(n,e,d);var m,b,_,x=function(t){if(!p&&t in L)return L[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",S="values"==v,O=!1,L=t.prototype,k=L[f]||L["@@iterator"]||v&&L[v],P=k||x(v),T=v?S?x("entries"):P:void 0,V="Array"==e?L.entries||k:k;if(V&&(_=c(V.call(new t)))!==Object.prototype&&_.next&&(l(_,w,!0),i||"function"==typeof _[f]||s(_,f,h)),S&&k&&"values"!==k.name&&(O=!0,P=function(){return k.call(this)}),i&&!y||!p&&!O&&L[f]||s(L,f,P),u[e]=P,u[w]=h,v)if(m={values:S?P:x("values"),keys:g?P:x("keys"),entries:T},y)for(b in m)b in L||o(L,b,m[b]);else r(r.P+r.F*(p||O),e,m);return m};},function(t,e,n){var i=n(1)("iterator"),r=!1;try{var o=[7][i]();o.return=function(){r=!0;},Array.from(o,function(){throw 2});}catch(t){}t.exports=function(t,e){if(!e&&!r)return !1;var n=!1;try{var o=[7],s=o[i]();s.next=function(){return {done:n=!0}},o[i]=function(){return s},t(o);}catch(t){}return n};},function(t,e){t.exports=function(t,e){return {value:e,done:!!t}};},function(t,e,n){var i=n(0),r=n(52).set,o=i.MutationObserver||i.WebKitMutationObserver,s=i.process,u=i.Promise,a="process"==n(9)(s);t.exports=function(){var t,e,n,l=function(){var i,r;for(a&&(i=s.domain)&&i.exit();t;){r=t.fn,t=t.next;try{r();}catch(i){throw t?n():e=void 0,i}}e=void 0,i&&i.enter();};if(a)n=function(){s.nextTick(l);};else if(!o||i.navigator&&i.navigator.standalone)if(u&&u.resolve){var c=u.resolve(void 0);n=function(){c.then(l);};}else n=function(){r.call(i,l);};else{var f=!0,p=document.createTextNode("");new o(l).observe(p,{characterData:!0}),n=function(){p.data=f=!f;};}return function(i){var r={fn:i,next:void 0};e&&(e.next=r),t||(t=r,n()),e=r;}};},function(t,e,n){var i=n(13),r=n(2),o=n(47);t.exports=n(4)?Object.defineProperties:function(t,e){r(t);for(var n,s=o(e),u=s.length,a=0;u>a;)i.f(t,n=s[a++],e[n]);return t};},function(t,e,n){var i=n(46),r=n(22).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return i(t,r)};},function(t,e,n){var i=n(12),r=n(28),o=n(27)("IE_PROTO"),s=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),i(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null};},function(t,e){e.f={}.propertyIsEnumerable;},function(t,e){t.exports=function(t){try{return {e:!1,v:t()}}catch(t){return {e:!0,v:t}}};},function(t,e,n){var i=n(6);t.exports=function(t,e,n){for(var r in e)i(t,r,e[r],n);return t};},function(t,e,n){var i=n(5),r=n(2),o=function(t,e){if(r(t),!i(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,i){try{i=n(11)(Function.call,n(45).f(Object.prototype,"__proto__").set,2),i(t,[]),e=!(t instanceof Array);}catch(t){e=!0;}return function(t,n){return o(t,n),e?t.__proto__=n:i(t,n),t}}({},!1):void 0),check:o};},function(t,e,n){var i=n(0),r=n(13),o=n(4),s=n(1)("species");t.exports=function(t){var e=i[t];o&&e&&!e[s]&&r.f(e,s,{configurable:!0,get:function(){return this}});};},function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff";},function(t,e,n){var i=n(53),r=Math.max,o=Math.min;t.exports=function(t,e){return t=i(t),t<0?r(t+e,0):o(t,e)};},function(t,e,n){var i=n(0),r=i.navigator;t.exports=r&&r.userAgent||"";},function(t,e,n){var i=n(38),r=n(1)("iterator"),o=n(15);t.exports=n(10).getIteratorMethod=function(t){if(void 0!=t)return t[r]||t["@@iterator"]||o[i(t)]};},function(t,e,n){var i=n(3),r=n(20)(2);i(i.P+i.F*!n(17)([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}});},function(t,e,n){var i=n(3),r=n(37)(!1),o=[].indexOf,s=!!o&&1/[1].indexOf(1,-0)<0;i(i.P+i.F*(s||!n(17)(o)),"Array",{indexOf:function(t){return s?o.apply(this,arguments)||0:r(this,t,arguments[1])}});},function(t,e,n){var i=n(3);i(i.S,"Array",{isArray:n(42)});},function(t,e,n){var i=n(3),r=n(20)(1);i(i.P+i.F*!n(17)([].map,!0),"Array",{map:function(t){return r(this,t,arguments[1])}});},function(t,e,n){var i=n(3),r=n(62);i(i.P+i.F*!n(17)([].reduce,!0),"Array",{reduce:function(t){return r(this,t,arguments.length,arguments[1],!1)}});},function(t,e,n){var i=Date.prototype,r=i.toString,o=i.getTime;new Date(NaN)+""!="Invalid Date"&&n(6)(i,"toString",function(){var t=o.call(this);return t===t?r.call(this):"Invalid Date"});},function(t,e,n){n(4)&&"g"!=/./g.flags&&n(13).f(RegExp.prototype,"flags",{configurable:!0,get:n(39)});},function(t,e,n){n(65)("search",1,function(t,e,n){return [function(n){var i=t(this),r=void 0==n?void 0:n[e];return void 0!==r?r.call(n,i):new RegExp(n)[e](String(i))},n]});},function(t,e,n){n(94);var i=n(2),r=n(39),o=n(4),s=/./.toString,u=function(t){n(6)(RegExp.prototype,"toString",t,!0);};n(7)(function(){return "/a/b"!=s.call({source:"a",flags:"b"})})?u(function(){var t=i(this);return "/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?r.call(t):void 0)}):"toString"!=s.name&&u(function(){return s.call(this)});},function(t,e,n){n(51)("trim",function(t){return function(){return t(this,3)}});},function(t,e,n){for(var i=n(34),r=n(47),o=n(6),s=n(0),u=n(8),a=n(15),l=n(1),c=l("iterator"),f=l("toStringTag"),p=a.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=r(h),v=0;v<d.length;v++){var g,y=d[v],m=h[y],b=s[y],_=b&&b.prototype;if(_&&(_[c]||u(_,c,p),_[f]||u(_,f,y),a[y]=p,m))for(g in i)_[g]||o(_,g,i[g],!0);}},function(t,e){},function(t,e){t.exports=function(t,e,n,i,r,o){var s,u=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(s=t,u=t.default);var l="function"==typeof u?u.options:u;e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0),n&&(l.functional=!0),r&&(l._scopeId=r);var c;if(o?(c=function(t){t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext,t||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),i&&i.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(o);},l._ssrRegister=c):i&&(c=i),c){var f=l.functional,p=f?l.render:l.beforeCreate;f?(l._injectStyles=c,l.render=function(t,e){return c.call(e),p(t,e)}):l.beforeCreate=p?[].concat(p,c):[c];}return {esModule:s,exports:u,options:l}};},function(t,e,n){var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"multiselect",class:{"multiselect--active":t.isOpen,"multiselect--disabled":t.disabled,"multiselect--above":t.isAbove},attrs:{tabindex:t.searchable?-1:t.tabindex},on:{focus:function(e){t.activate();},blur:function(e){!t.searchable&&t.deactivate();},keydown:[function(e){return "button"in e||!t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerForward()):null},function(e){return "button"in e||!t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"])?e.target!==e.currentTarget?null:(e.preventDefault(),void t.pointerBackward()):null}],keypress:function(e){return "button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")||!t._k(e.keyCode,"tab",9,e.key,"Tab")?(e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate();}}},[t._t("caret",[n("div",{staticClass:"multiselect__select",on:{mousedown:function(e){e.preventDefault(),e.stopPropagation(),t.toggle();}}})],{toggle:t.toggle}),t._v(" "),t._t("clear",null,{search:t.search}),t._v(" "),n("div",{ref:"tags",staticClass:"multiselect__tags"},[t._t("selection",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.visibleValues.length>0,expression:"visibleValues.length > 0"}],staticClass:"multiselect__tags-wrap"},[t._l(t.visibleValues,function(e,i){return [t._t("tag",[n("span",{key:i,staticClass:"multiselect__tag"},[n("span",{domProps:{textContent:t._s(t.getOptionLabel(e))}}),t._v(" "),n("i",{staticClass:"multiselect__tag-icon",attrs:{"aria-hidden":"true",tabindex:"1"},on:{keypress:function(n){if(!("button"in n)&&t._k(n.keyCode,"enter",13,n.key,"Enter"))return null;n.preventDefault(),t.removeElement(e);},mousedown:function(n){n.preventDefault(),t.removeElement(e);}}})])],{option:e,search:t.search,remove:t.removeElement})]})],2),t._v(" "),t.internalValue&&t.internalValue.length>t.limit?[t._t("limit",[n("strong",{staticClass:"multiselect__strong",domProps:{textContent:t._s(t.limitText(t.internalValue.length-t.limit))}})])]:t._e()],{search:t.search,remove:t.removeElement,values:t.visibleValues,isOpen:t.isOpen}),t._v(" "),n("transition",{attrs:{name:"multiselect__loading"}},[t._t("loading",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.loading,expression:"loading"}],staticClass:"multiselect__spinner"})])],2),t._v(" "),t.searchable?n("input",{ref:"search",staticClass:"multiselect__input",style:t.inputStyle,attrs:{name:t.name,id:t.id,type:"text",autocomplete:"nope",placeholder:t.placeholder,disabled:t.disabled,tabindex:t.tabindex},domProps:{value:t.search},on:{input:function(e){t.updateSearch(e.target.value);},focus:function(e){e.preventDefault(),t.activate();},blur:function(e){e.preventDefault(),t.deactivate();},keyup:function(e){if(!("button"in e)&&t._k(e.keyCode,"esc",27,e.key,"Escape"))return null;t.deactivate();},keydown:[function(e){if(!("button"in e)&&t._k(e.keyCode,"down",40,e.key,["Down","ArrowDown"]))return null;e.preventDefault(),t.pointerForward();},function(e){if(!("button"in e)&&t._k(e.keyCode,"up",38,e.key,["Up","ArrowUp"]))return null;e.preventDefault(),t.pointerBackward();},function(e){if(!("button"in e)&&t._k(e.keyCode,"delete",[8,46],e.key,["Backspace","Delete"]))return null;e.stopPropagation(),t.removeLastElement();}],keypress:function(e){return "button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),e.stopPropagation(),e.target!==e.currentTarget?null:void t.addPointerElement(e)):null}}}):t._e(),t._v(" "),t.isSingleLabelVisible?n("span",{staticClass:"multiselect__single",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("singleLabel",[[t._v(t._s(t.currentOptionLabel))]],{option:t.singleValue})],2):t._e(),t._v(" "),t.isPlaceholderVisible?n("span",{staticClass:"multiselect__placeholder",on:{mousedown:function(e){return e.preventDefault(),t.toggle(e)}}},[t._t("placeholder",[t._v("\n          "+t._s(t.placeholder)+"\n        ")])],2):t._e()],2),t._v(" "),n("transition",{attrs:{name:"multiselect"}},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.isOpen,expression:"isOpen"}],ref:"list",staticClass:"multiselect__content-wrapper",style:{maxHeight:t.optimizedHeight+"px"},attrs:{tabindex:"-1"},on:{focus:t.activate,mousedown:function(t){t.preventDefault();}}},[n("ul",{staticClass:"multiselect__content",style:t.contentStyle},[t._t("beforeList"),t._v(" "),t.multiple&&t.max===t.internalValue.length?n("li",[n("span",{staticClass:"multiselect__option"},[t._t("maxElements",[t._v("Maximum of "+t._s(t.max)+" options selected. First remove a selected option to select another.")])],2)]):t._e(),t._v(" "),!t.max||t.internalValue.length<t.max?t._l(t.filteredOptions,function(e,i){return n("li",{key:i,staticClass:"multiselect__element"},[e&&(e.$isLabel||e.$isDisabled)?t._e():n("span",{staticClass:"multiselect__option",class:t.optionHighlight(i,e),attrs:{"data-select":e&&e.isTag?t.tagPlaceholder:t.selectLabelText,"data-selected":t.selectedLabelText,"data-deselect":t.deselectLabelText},on:{click:function(n){n.stopPropagation(),t.select(e);},mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.pointerSet(i);}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2),t._v(" "),e&&(e.$isLabel||e.$isDisabled)?n("span",{staticClass:"multiselect__option",class:t.groupHighlight(i,e),attrs:{"data-select":t.groupSelect&&t.selectGroupLabelText,"data-deselect":t.groupSelect&&t.deselectGroupLabelText},on:{mouseenter:function(e){if(e.target!==e.currentTarget)return null;t.groupSelect&&t.pointerSet(i);},mousedown:function(n){n.preventDefault(),t.selectGroup(e);}}},[t._t("option",[n("span",[t._v(t._s(t.getOptionLabel(e)))])],{option:e,search:t.search})],2):t._e()])}):t._e(),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoResults&&0===t.filteredOptions.length&&t.search&&!t.loading,expression:"showNoResults && (filteredOptions.length === 0 && search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noResult",[t._v("No elements found. Consider changing the search query.")],{search:t.search})],2)]),t._v(" "),n("li",{directives:[{name:"show",rawName:"v-show",value:t.showNoOptions&&0===t.options.length&&!t.search&&!t.loading,expression:"showNoOptions && (options.length === 0 && !search && !loading)"}]},[n("span",{staticClass:"multiselect__option"},[t._t("noOptions",[t._v("List is empty.")])],2)]),t._v(" "),t._t("afterList")],2)])])],2)},r=[],o={render:i,staticRenderFns:r};e.a=o;}])});
    });

    var Multiselect = unwrapExports(vueMultiselect_min);
    var vueMultiselect_min_1 = vueMultiselect_min.VueMultiselect;

    //

    let _retry = 20; // times
    const AJAX_DEBOUNCE = 1000; // ms

    var script$5 = {

        name: "fb-select",

        // inheritAttrs: false,

        mixins: [ fieldMixin ],

        components: {
            Multiselect
        },

        props: {

            value: {},

            selectOptions: {
                type: Array,
                default: () => []
            },

            url: String,

            optionsName: {
                type: String,
                default: 'name'
            },

            optionsValue: {
                type: String,
                default: 'value'
            },

            multiple: {
                type: Boolean,
                default: true
            },

            taggable: {
                type: Boolean,
                default: false
            },

            debounce: {
                type: [String, Number],
                default: AJAX_DEBOUNCE
            },

            autoFetch: {
                type: [String, Boolean],
                default: false
            },

            placeholderText: String
        },


        data() {
            return {
                isOpened: false,
                isLoading: false,
                ajaxOptions: [],
                addedOptions: []
            }
        },


        computed: {

            computedValue() {
                return this.formId ? this.formValue : this.value
            },

            hasValue() {
                return !! ( this.multiple ?
                            this.computedValue && this.computedValue.length :
                            this.computedValue )
            },

            isActive() {
                return this.isOpened || this.hasValue;
            },

            isAjax() {
                return typeof this.url !== 'undefined'
            },

            defaultPlaceholder() {
                return this.$lang[this.isAjax ? 'FORMS_SELECT_AJAX_PLACEHOLDER' : 'FORMS_SELECT_PLACEHOLDER']
            },

            allOptions() {
                return Array.prototype.concat(this.addedOptions, this.selectOptions, this.ajaxOptions).map( item => {
                    if ( ['string', 'number'].includes( typeof item ) ) {
                        let _opt = {};
                        _opt[this.optionsName] = _opt[this.optionsValue] = item;
                        return _opt
                    } else {
                        return item
                    }
                })
            },

            usedOptions() {
                return this.allOptions.filter( (item, i, arr) => {
                    if ( ! item ) return false
                    let index = arr.findIndex( _item => {
                        return _item[this.optionsName] === item[this.optionsName] &&
                               _item[this.optionsValue] === item[this.optionsValue]
                    });
                    return index === i
                })
            }
        },


        methods: {

            formValueHandler(selected) {
                if ( ! selected ) return
                this.formValue = Array.isArray(selected) ?
                                 selected.map(item => item[this.optionsValue]) :
                                 selected[this.optionsValue];
                if ( this.error ) this.resetError();
            },

            vModelHandler(selected) {
                if ( ! selected ) return
                this.$emit('input', selected);
            },

            convertValue(value) {
                if ( this.multiple ) {
                    return Array.isArray(value) ?
                        this.usedOptions.filter( item => {
                            return value.includes(item[this.optionsValue]);
                        }) :
                        this.usedOptions.filter( item => {
                            return value === item[this.optionsValue];
                        })
                } else {
                    return this.usedOptions.find( item => {
                        return (Array.isArray(value) ? value[0] : value) === item[this.optionsValue];
                    })
                }
            },

            resetFormValue( formId ) {
                if ( this.formId !== formId ) return
                this.formValue = this.multiple ? [] : undefined;
            },

            setFocus(state) {
                try {
                    let useMethod = (state !== false) ? 'focus' : 'blur';
                    this.$refs.select.$el[useMethod]();
                } catch (e) {
                    _retry--;
                    if (_retry) setTimeout(this.setFocus, 1000, state);
                }
            },

            addOption(usersOption) {

                // add new option
                let _opt = {};
                _opt[this.optionsName] = _opt[this.optionsValue] = usersOption;
                this.addedOptions.push(_opt);

                // select new option
                let selected;
                if (this.multiple) {
                    selected = [_opt].concat(this.$refs.select.value);
                } else {
                    selected = _opt;
                }

                if ( this.formId ) {
                    this.formValueHandler(selected);
                } else {
                    this.vModelHandler(selected);
                }
            },

            wrapTabEvents() {
                try {
                    this.$refs.select.$el.querySelector('.multiselect__input').classList.add('is-focusable');
                } catch(e) {
                    _retry--;
                    if (_retry) setTimeout(this.wrapTabEvents, 500);
                }
            },

            bindSearch() {
                try {
                    if ( this.isAjax ) {

                        // bind search
                        this.$refs.select.$on('search-change', this.ajaxSearch);
                        this.$refs.select.$once('hook:destroyed', () => {
                            this.$refs.select.$off('search-change', this.ajaxSearch);
                        });

                        // fetch data
                        if ( this.autoFetch.toString() !== 'false' ) {
                            let serach = typeof this.autoFetch === 'string' ? this.autoFetch : '';
                            this.ajaxSearch( serach, true );
                        }
                    }
                } catch(e) {
                    if (_retry) setTimeout(this.bindSearch, 500);
                }
            },

            ajaxSearch(search, force) {
                if ( ! (search || force) ) return
                clearTimeout(this.__search);
                this.isLoading = true;
                this.__search = setTimeout(() => {
                    AWES.ajax({}, this.url.replace('%s', search), 'get')
                        .then( res => {
                            let data = [];
                            if ( res.success === true ) {
                                if ( Array.isArray(res.data) ) {
                                    data = res.data;
                                } else if ( res.data && Array.isArray(res.data.data) ) {
                                    data = res.data.data;
                                }
                            }
                            this.ajaxOptions = data;
                            this.isLoading = false;
                        });
                }, Number(this.debounce) );
            }
        },


        created() {
            if ( this.formId && this.formValue ) {
                // noramlize initial value
                let _values = Array.isArray(this.formValue) ? this.formValue : [this.formValue],
                    _normalized = [],
                    _added = [];

                _values.forEach( (item, i) => {
                    if ( typeof item === 'object' ) {
                        _added.push(Object.assign({}, item));
                        _normalized.push(item[this.optionsValue]);
                    } else {
                        _normalized.push(item);
                        let _idx = this.usedOptions.findIndex(i => i[this.optionsValue] === item);
                        if ( _idx === -1) {
                            let _opt = {};
                            _opt[this.optionsName] = _opt[this.optionsValue] = item;
                            _added.push(_opt);
                        }
                    }
                });
                this.addedOptions = _added;
                this.formValue = _normalized;
            }
        },


        mounted() {
            this.$nextTick( this.wrapTabEvents );
            this.$nextTick( this.bindSearch );
        }
    };

    /* script */
    const __vue_script__$5 = script$5;

    /* template */
    var __vue_render__$5 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-select fb-element",
          class: [
            { "fb-select_active": _vm.isActive },
            { "fb-select_opened": _vm.isOpened },
            { "fb-select_disabled": _vm.disabled }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c("span", { staticClass: "fb-select__label" }, [
                _vm._v(_vm._s(_vm.label || _vm.$lang.FORMS_SELECT_LABEL))
              ]),
              _c(
                "multiselect",
                _vm._g(
                  {
                    ref: "select",
                    staticClass: "fb-select__field",
                    attrs: {
                      taggable: _vm.taggable,
                      "show-labels": false,
                      multiple: _vm.multiple,
                      "hide-selected": _vm.multiple,
                      placeholder: _vm.placeholderText || _vm.defaultPlaceholder,
                      "tag-placeholder": _vm.$lang.FORMS_SELECT_ADD_TAG,
                      "internal-search": _vm.isAjax ? false : true,
                      loading: _vm.isLoading,
                      value: _vm.formId
                        ? _vm.convertValue(_vm.formValue)
                        : _vm.value,
                      options: _vm.usedOptions,
                      label: _vm.optionsName,
                      "track-by": _vm.optionsValue,
                      disabled: _vm.isDisabled
                    },
                    on: {
                      open: function($event) {
                        _vm.isOpened = true;
                      },
                      close: function($event) {
                        _vm.isOpened = false;
                      },
                      tag: _vm.addOption
                    }
                  },
                  {
                    input: _vm.formId ? _vm.formValueHandler : _vm.vModelHandler
                  }
                ),
                [
                  _c("template", { slot: "noOptions" }, [
                    _vm._v(_vm._s(_vm.$lang.FORMS_SELECT_EMPTY))
                  ])
                ],
                2
              )
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$5 = [];
    __vue_render__$5._withStripped = true;

      /* style */
      const __vue_inject_styles__$5 = undefined;
      /* scoped */
      const __vue_scope_id__$5 = undefined;
      /* module identifier */
      const __vue_module_identifier__$5 = undefined;
      /* functional template */
      const __vue_is_functional_template__$5 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbSelect = normalizeComponent_1(
        { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
        __vue_inject_styles__$5,
        __vue_script__$5,
        __vue_scope_id__$5,
        __vue_is_functional_template__$5,
        __vue_module_identifier__$5,
        undefined,
        undefined
      );

    var autosize = createCommonjsModule(function (module, exports) {
    /*!
    	autosize 4.0.2
    	license: MIT
    	http://www.jacklmoore.com/autosize
    */
    (function (global, factory) {
    	{
    		factory(module, exports);
    	}
    })(commonjsGlobal, function (module, exports) {

    	var map = typeof Map === "function" ? new Map() : function () {
    		var keys = [];
    		var values = [];

    		return {
    			has: function has(key) {
    				return keys.indexOf(key) > -1;
    			},
    			get: function get(key) {
    				return values[keys.indexOf(key)];
    			},
    			set: function set(key, value) {
    				if (keys.indexOf(key) === -1) {
    					keys.push(key);
    					values.push(value);
    				}
    			},
    			delete: function _delete(key) {
    				var index = keys.indexOf(key);
    				if (index > -1) {
    					keys.splice(index, 1);
    					values.splice(index, 1);
    				}
    			}
    		};
    	}();

    	var createEvent = function createEvent(name) {
    		return new Event(name, { bubbles: true });
    	};
    	try {
    		new Event('test');
    	} catch (e) {
    		// IE does not support `new Event()`
    		createEvent = function createEvent(name) {
    			var evt = document.createEvent('Event');
    			evt.initEvent(name, true, false);
    			return evt;
    		};
    	}

    	function assign(ta) {
    		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || map.has(ta)) return;

    		var heightOffset = null;
    		var clientWidth = null;
    		var cachedHeight = null;

    		function init() {
    			var style = window.getComputedStyle(ta, null);

    			if (style.resize === 'vertical') {
    				ta.style.resize = 'none';
    			} else if (style.resize === 'both') {
    				ta.style.resize = 'horizontal';
    			}

    			if (style.boxSizing === 'content-box') {
    				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
    			} else {
    				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
    			}
    			// Fix when a textarea is not on document body and heightOffset is Not a Number
    			if (isNaN(heightOffset)) {
    				heightOffset = 0;
    			}

    			update();
    		}

    		function changeOverflow(value) {
    			{
    				// Chrome/Safari-specific fix:
    				// When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
    				// made available by removing the scrollbar. The following forces the necessary text reflow.
    				var width = ta.style.width;
    				ta.style.width = '0px';
    				// Force reflow:
    				/* jshint ignore:start */
    				ta.offsetWidth;
    				/* jshint ignore:end */
    				ta.style.width = width;
    			}

    			ta.style.overflowY = value;
    		}

    		function getParentOverflows(el) {
    			var arr = [];

    			while (el && el.parentNode && el.parentNode instanceof Element) {
    				if (el.parentNode.scrollTop) {
    					arr.push({
    						node: el.parentNode,
    						scrollTop: el.parentNode.scrollTop
    					});
    				}
    				el = el.parentNode;
    			}

    			return arr;
    		}

    		function resize() {
    			if (ta.scrollHeight === 0) {
    				// If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
    				return;
    			}

    			var overflows = getParentOverflows(ta);
    			var docTop = document.documentElement && document.documentElement.scrollTop; // Needed for Mobile IE (ticket #240)

    			ta.style.height = '';
    			ta.style.height = ta.scrollHeight + heightOffset + 'px';

    			// used to check if an update is actually necessary on window.resize
    			clientWidth = ta.clientWidth;

    			// prevents scroll-position jumping
    			overflows.forEach(function (el) {
    				el.node.scrollTop = el.scrollTop;
    			});

    			if (docTop) {
    				document.documentElement.scrollTop = docTop;
    			}
    		}

    		function update() {
    			resize();

    			var styleHeight = Math.round(parseFloat(ta.style.height));
    			var computed = window.getComputedStyle(ta, null);

    			// Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
    			var actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(computed.height)) : ta.offsetHeight;

    			// The actual height not matching the style height (set via the resize method) indicates that 
    			// the max-height has been exceeded, in which case the overflow should be allowed.
    			if (actualHeight < styleHeight) {
    				if (computed.overflowY === 'hidden') {
    					changeOverflow('scroll');
    					resize();
    					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
    				}
    			} else {
    				// Normally keep overflow set to hidden, to avoid flash of scrollbar as the textarea expands.
    				if (computed.overflowY !== 'hidden') {
    					changeOverflow('hidden');
    					resize();
    					actualHeight = computed.boxSizing === 'content-box' ? Math.round(parseFloat(window.getComputedStyle(ta, null).height)) : ta.offsetHeight;
    				}
    			}

    			if (cachedHeight !== actualHeight) {
    				cachedHeight = actualHeight;
    				var evt = createEvent('autosize:resized');
    				try {
    					ta.dispatchEvent(evt);
    				} catch (err) {
    					// Firefox will throw an error on dispatchEvent for a detached element
    					// https://bugzilla.mozilla.org/show_bug.cgi?id=889376
    				}
    			}
    		}

    		var pageResize = function pageResize() {
    			if (ta.clientWidth !== clientWidth) {
    				update();
    			}
    		};

    		var destroy = function (style) {
    			window.removeEventListener('resize', pageResize, false);
    			ta.removeEventListener('input', update, false);
    			ta.removeEventListener('keyup', update, false);
    			ta.removeEventListener('autosize:destroy', destroy, false);
    			ta.removeEventListener('autosize:update', update, false);

    			Object.keys(style).forEach(function (key) {
    				ta.style[key] = style[key];
    			});

    			map.delete(ta);
    		}.bind(ta, {
    			height: ta.style.height,
    			resize: ta.style.resize,
    			overflowY: ta.style.overflowY,
    			overflowX: ta.style.overflowX,
    			wordWrap: ta.style.wordWrap
    		});

    		ta.addEventListener('autosize:destroy', destroy, false);

    		// IE9 does not fire onpropertychange or oninput for deletions,
    		// so binding to onkeyup to catch most of those events.
    		// There is no way that I know of to detect something like 'cut' in IE9.
    		if ('onpropertychange' in ta && 'oninput' in ta) {
    			ta.addEventListener('keyup', update, false);
    		}

    		window.addEventListener('resize', pageResize, false);
    		ta.addEventListener('input', update, false);
    		ta.addEventListener('autosize:update', update, false);
    		ta.style.overflowX = 'hidden';
    		ta.style.wordWrap = 'break-word';

    		map.set(ta, {
    			destroy: destroy,
    			update: update
    		});

    		init();
    	}

    	function destroy(ta) {
    		var methods = map.get(ta);
    		if (methods) {
    			methods.destroy();
    		}
    	}

    	function update(ta) {
    		var methods = map.get(ta);
    		if (methods) {
    			methods.update();
    		}
    	}

    	var autosize = null;

    	// Do nothing in Node.js environment and IE8 (or lower)
    	if (typeof window === 'undefined' || typeof window.getComputedStyle !== 'function') {
    		autosize = function autosize(el) {
    			return el;
    		};
    		autosize.destroy = function (el) {
    			return el;
    		};
    		autosize.update = function (el) {
    			return el;
    		};
    	} else {
    		autosize = function autosize(el, options) {
    			if (el) {
    				Array.prototype.forEach.call(el.length ? el : [el], function (x) {
    					return assign(x, options);
    				});
    			}
    			return el;
    		};
    		autosize.destroy = function (el) {
    			if (el) {
    				Array.prototype.forEach.call(el.length ? el : [el], destroy);
    			}
    			return el;
    		};
    		autosize.update = function (el) {
    			if (el) {
    				Array.prototype.forEach.call(el.length ? el : [el], update);
    			}
    			return el;
    		};
    	}

    	exports.default = autosize;
    	module.exports = exports['default'];
    });
    });

    //

    let _textareasId = 0;

    var script$6 = {

        name: "fb-textarea",

        inheritAttrs: false,

        mixins: [ textFieldMixin ],

        props: {

            fixsize: {
                type: Boolean,
                default: false
            }
        },


        computed: {

            textareaId() {
                return 'textarea-' + _textareasId++
            }
        },


        methods: {

            setAutoResize() {
                if ( ! this.fixsize ) {
                    autosize( this.$refs.element );
                    this.$watch('value', this.updateAutoResize);
                }
            },

            updateAutoResize() {
                this.$nextTick( () => {
                  autosize.update(this.$refs.element);
                });
            }
        },


        mounted() {
            this.setAutoResize();
        }

    };

    /* script */
    const __vue_script__$6 = script$6;

    /* template */
    var __vue_render__$6 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-textarea fb-element",
          class: {
            "fb-textarea_disabled": _vm.isDisabled,
            "fb-textarea_active": _vm.isActive,
            "fb-textarea_error": _vm.hasError,
            "animated shake": _vm.shake
          }
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "label",
                {
                  staticClass: "fb-textarea__label",
                  attrs: { for: _vm.textareaId }
                },
                [_vm._v(_vm._s(_vm.label))]
              ),
              _c(
                "textarea",
                _vm._g(
                  _vm._b(
                    {
                      ref: "element",
                      class: [
                        "fb-textarea__field",
                        { "is-focusable": _vm.isFocusable },
                        { "in-focus": _vm.inFocus }
                      ],
                      attrs: { id: _vm.textareaId, disabled: _vm.isDisabled },
                      domProps: { value: _vm.formId ? _vm.formValue : _vm.value },
                      on: {
                        focus: function($event) {
                          _vm.inFocus = true;
                        },
                        blur: function($event) {
                          _vm.inFocus = false;
                        }
                      }
                    },
                    "textarea",
                    _vm.$attrs,
                    false
                  ),
                  { input: _vm.formId ? _vm.formValueHandler : _vm.vModelHandler }
                )
              )
            ]
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$6 = [];
    __vue_render__$6._withStripped = true;

      /* style */
      const __vue_inject_styles__$6 = undefined;
      /* scoped */
      const __vue_scope_id__$6 = undefined;
      /* module identifier */
      const __vue_module_identifier__$6 = undefined;
      /* functional template */
      const __vue_is_functional_template__$6 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbTextarea = normalizeComponent_1(
        { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
        __vue_inject_styles__$6,
        __vue_script__$6,
        __vue_scope_id__$6,
        __vue_is_functional_template__$6,
        __vue_module_identifier__$6,
        undefined,
        undefined
      );

    //

    var script$7 = {

        name: "fb-code",

        mixins: [fieldMixin],

        props: {

            length: {
                type: Number,
                default: 6
            }
        },


        data() {
            return {
                inputValue: [],
                inFocus: []
            }
        },


        computed: {

            value: {
                get() {
                    return this.inputValue.join('');
                },
                set(val) {
                    val = val.trim().replace(/\D/g, '').substr(0, this.length);
                    this.inputValue = val.split('');
                }
            },

            // hasCaptchaError() {
            //     return this.$store.getters['forms/hasCaptchaError'](this.formId)
            // }
        },


        watch: {

            error(errors) {
                if (errors && errors.length) {
                    this.value = '';
                    this.$refs.fields.forEach(field => {
                        field.addEventListener('input', this.resetError, false);
                    });
                    this.$nextTick(() => {
                        this.setFocus();
                    });
                } else {
                    this.$refs.fields.forEach(field => {
                        field.removeEventListener('input', this.resetError);
                    });
                }
            },

            // hasCaptchaError(hasError) {
            //     if (!hasError) {
            //         this.autoSubmitForm(this.value)
            //     }
            // },

            value(val) {
                if (val.length === this.length) {
                    this.formValue = val;
                }
            },

            formValue(val) {
                if ( val !== this.value ) {
                    this.value = val;
                    this.setFocus(val.length);
                }
            }
        },


        methods: {

            setFocus(index = 0) {
                if (typeof index === 'boolean' && index === true) {
                    this.$refs.fields[0].focus();
                    return
                } else if (typeof index !== 'number') return

                if (index >= this.length) {
                    index = this.length - 1;
                }
                const inputElement = this.$refs.fields[index];
                setTimeout(() => {
                    inputElement.focus();
                    inputElement.setSelectionRange(0, inputElement.value.length);
                }, 10);
            },

            onInput($event, index) {
                const parsed = $event.target.value.replace(/\D/g, '');
                $event.target.value = parsed; // immedate update to prevent blinking
                this.$set(this.inputValue, index, parsed);
                if (!this.isEmpty(index) && !(index === this.length - 1)) {
                    this.setFocus(index + 1);
                }
            },

            onBackspace($event, index) {
                this.setFocus(index - 1);
            },

            onLeft($event, index) {
                this.setFocus(index - 1);
            },

            onRight($event, index) {
                this.setFocus(index + 1);
            },

            onPaste($event) {
                if (this.error && this.error.length) this.resetError();
                this.value = $event.clipboardData.getData('text');
            },

            isEmpty(index) {
                return this.inputValue[index] === '' ||
                    typeof this.inputValue[index] === typeof undefined
            }
        },

        created() {
            for (let index = 0; index < this.length; index++) {
                this.inFocus.push(index === 0 && this.focus ? true : false);
                this.inputValue.push('');
            }
        },

        beforeDestroy() {
            this.$refs.fields.forEach(field => {
                field.removeEventListener('input', this.resetError);
            });
        }
    };

    /* script */
    const __vue_script__$7 = script$7;

    /* template */
    var __vue_render__$7 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "fb-keycode",
            "fb-element",
            { "animated shake": _vm.shake },
            { "fb-keycode_disabled": _vm.isDisabled }
          ]
        },
        [
          _c(
            "div",
            { staticClass: "fb-keycode__block" },
            [
              _c(
                "fb-error-wrap",
                {
                  attrs: { open: _vm.showTooltip, error: _vm.error },
                  on: { clickTooltip: _vm.clickTooltip }
                },
                [
                  _c(
                    "div",
                    { staticClass: "fb-keycode__wrap", attrs: { id: "keywrap" } },
                    _vm._l(_vm.length, function(i) {
                      return _c(
                        "div",
                        { key: i, staticClass: "fb-keycode__field-wrap" },
                        [
                          _c("input", {
                            ref: "fields",
                            refInFor: true,
                            class: [
                              "fb-keycode__field",
                              {
                                "is-focusable": _vm.isFocusable,
                                "in-focus": _vm.inFocus[i - 1]
                              }
                            ],
                            attrs: {
                              type: "tel",
                              inputmode: "numeric",
                              pattern: "[0-9]*",
                              maxlength: "1",
                              autocomplete: "off",
                              disabled: _vm.isDisabled
                            },
                            domProps: { value: _vm.inputValue[i - 1] },
                            on: {
                              focus: function($event) {
                                _vm.inFocus[i - 1] = true;
                              },
                              blur: function($event) {
                                _vm.inFocus[i - 1] = false;
                              },
                              keydown: [
                                function($event) {
                                  if (
                                    !$event.type.indexOf("key") &&
                                    _vm._k(
                                      $event.keyCode,
                                      "enter",
                                      13,
                                      $event.key,
                                      "Enter"
                                    )
                                  ) {
                                    return null
                                  }
                                  $event.preventDefault();
                                  return _vm.focusNext($event)
                                },
                                function($event) {
                                  if (
                                    !$event.type.indexOf("key") &&
                                    _vm._k(
                                      $event.keyCode,
                                      "backspace",
                                      undefined,
                                      $event.key,
                                      undefined
                                    )
                                  ) {
                                    return null
                                  }
                                  i > 1 ? _vm.onBackspace($event, i - 1) : null;
                                },
                                function($event) {
                                  if (
                                    !$event.type.indexOf("key") &&
                                    _vm._k($event.keyCode, "left", 37, $event.key, [
                                      "Left",
                                      "ArrowLeft"
                                    ])
                                  ) {
                                    return null
                                  }
                                  if ("button" in $event && $event.button !== 0) {
                                    return null
                                  }
                                  i > 1 ? _vm.onLeft($event, i - 1) : null;
                                },
                                function($event) {
                                  if (
                                    !$event.type.indexOf("key") &&
                                    _vm._k(
                                      $event.keyCode,
                                      "right",
                                      39,
                                      $event.key,
                                      ["Right", "ArrowRight"]
                                    )
                                  ) {
                                    return null
                                  }
                                  if ("button" in $event && $event.button !== 2) {
                                    return null
                                  }
                                  i < _vm.length ? _vm.onRight($event, i - 1) : null;
                                }
                              ],
                              input: function($event) {
                                return _vm.onInput($event, i - 1)
                              },
                              paste: function($event) {
                                $event.preventDefault();
                                return _vm.onPaste($event)
                              }
                            }
                          })
                        ]
                      )
                    }),
                    0
                  )
                ]
              )
            ],
            1
          )
        ]
      )
    };
    var __vue_staticRenderFns__$7 = [];
    __vue_render__$7._withStripped = true;

      /* style */
      const __vue_inject_styles__$7 = undefined;
      /* scoped */
      const __vue_scope_id__$7 = undefined;
      /* module identifier */
      const __vue_module_identifier__$7 = undefined;
      /* functional template */
      const __vue_is_functional_template__$7 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbCode = normalizeComponent_1(
        { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
        __vue_inject_styles__$7,
        __vue_script__$7,
        __vue_scope_id__$7,
        __vue_is_functional_template__$7,
        __vue_module_identifier__$7,
        undefined,
        undefined
      );

    var _config = {
        companySlug: {
            domain: 'awescrm.de',
            maxlength: 32,
            ulrifyOptions: {
                spaces: '-',
                toLower: true,
                trim: true,
                addEToUmlauts: true,
                nonPrintable: '',
                failureOutput: ''
            }
        }
    };

    //

    var script$8 = {

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
                            this.formValue = value;
                        } else {
                            this.$nextTick( () => this.formValue = value );
                        }
                    } else {
                        this.vModelHandler({ target: { value } });
                    }
                },
                immediate: true
            }
        },


        methods: {

            vModelHandler($event) {
                this.$emit('input', this.addDomain(this.noramlizeUrl($event.target.value)) );
            },

            toggleWatcher( $event ) {
                if ( $event.target.value === '' ) {
                    this.watchInput = true;
                } else if ( this.watchInput ) {
                    this.watchInput = false;
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
            this._config = Object.assign({}, _config.companySlug, window.AWES._config.companySlug);
        }
    };

    /* script */
    const __vue_script__$8 = script$8;

    /* template */
    var __vue_render__$8 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "fb-slug",
            "fb-element",
            {
              "fb-slug_disabled": _vm.isDisabled,
              "fb-slug_active": _vm.isActive,
              "fb-slug_error": _vm.hasError,
              "animated shake": _vm.shake
            }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c("div", { staticClass: "fb-slug__group-wrap" }, [
                _c("span", { staticClass: "fb-slug__group-field" }, [
                  _c(
                    "label",
                    {
                      staticClass: "fb-slug__label",
                      attrs: { for: "#" + _vm.inputId }
                    },
                    [_vm._v(_vm._s(_vm.label))]
                  ),
                  _c(
                    "input",
                    _vm._g(
                      _vm._b(
                        {
                          ref: "element",
                          class: [
                            "fb-slug__field",
                            { "is-focusable": _vm.isFocusable },
                            { "in-focus": _vm.inFocus }
                          ],
                          attrs: {
                            id: _vm.inputId,
                            "data-awes": _vm.$options.name + "." + _vm.name,
                            maxlength: _vm.maxlength,
                            type: "text",
                            disabled: _vm.isDisabled
                          },
                          domProps: {
                            value: _vm.formId
                              ? _vm.formValue
                              : _vm.removeDomain(_vm.value)
                          },
                          on: {
                            input: _vm.toggleWatcher,
                            focus: function($event) {
                              _vm.inFocus = true;
                            },
                            blur: function($event) {
                              _vm.inFocus = false;
                            },
                            keydown: function($event) {
                              if (
                                !$event.type.indexOf("key") &&
                                _vm._k(
                                  $event.keyCode,
                                  "enter",
                                  13,
                                  $event.key,
                                  "Enter"
                                )
                              ) {
                                return null
                              }
                              $event.preventDefault();
                              return _vm.focusNext($event)
                            }
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      ),
                      {
                        input: _vm.formId ? _vm.formValueHandler : _vm.vModelHandler
                      }
                    )
                  )
                ]),
                _c("span", { staticClass: "fb-slug__group-label" }, [
                  _vm._v(_vm._s(_vm.dotDomain))
                ])
              ])
            ]
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$8 = [];
    __vue_render__$8._withStripped = true;

      /* style */
      const __vue_inject_styles__$8 = undefined;
      /* scoped */
      const __vue_scope_id__$8 = undefined;
      /* module identifier */
      const __vue_module_identifier__$8 = undefined;
      /* functional template */
      const __vue_is_functional_template__$8 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbCompanySlug = normalizeComponent_1(
        { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
        __vue_inject_styles__$8,
        __vue_script__$8,
        __vue_scope_id__$8,
        __vue_is_functional_template__$8,
        __vue_module_identifier__$8,
        undefined,
        undefined
      );

    //

    var script$9 = {

        name: "fb-auto-captcha",

        mixins: [ baseMixin ],

        components: {
            vueRecaptcha: resolve => {
                return AWES.utils.loadModule(
                  'vue-recaptcha',
                  'https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.min.js',
                  () => { resolve( window.VueRecaptcha ); }
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
                    this.$refs.recaptcha.reset();
                });
            },

            theme() {
                if ( this.isShow ) {
                    this.reset = true;
                    this.$nextTick( () => { this.reset = false; });
                }
            }
        },


        methods: {

            onVerify( response ) {
                this.formValue = response;
                this.resetError();
            },

            onExpired() {
                this.formValue = null;
            },

            checkTheme({ detail }) {
                this.theme = detail ? 'dark' : 'light';
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
                            const el = document.createElement('script');
                            el.setAttribute('id', 'g-captcha-script');
                            el.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit');
                            document.head.appendChild(el);
                        }
                        break
                    case 'remove':
                        document.getElementById('g-captcha-script').remove();
                        break
                }
            }
        },


        created() {
            if ( ! this.$isServer ) {
                this.manageCaptchaScript('add');
                AWES.on('theme.change', this.checkTheme);
            }
        },

        beforeDestroy() {
            this.manageCaptchaScript('remove');
            AWES.off('theme.change', this.checkTheme);
        }
    };

    /* script */
    const __vue_script__$9 = script$9;

    /* template */
    var __vue_render__$9 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.isShow && !_vm.reset
        ? _c(
            "div",
            [
              _c(
                "fb-error-wrap",
                {
                  attrs: { open: _vm.showTooltip, error: _vm.error },
                  on: {
                    clickTooltip: function($event) {
                      _vm.showTooltip = false;
                    }
                  }
                },
                [
                  _c(
                    "vue-recaptcha",
                    _vm._g(
                      {
                        ref: "recaptcha",
                        staticClass: "re-captcha",
                        attrs: { sitekey: _vm.sitekey, theme: _vm.theme }
                      },
                      {
                        verify: _vm.formId ? _vm.onVerify : null,
                        expired: _vm.formId ? _vm.onExpired : null
                      }
                    )
                  )
                ],
                1
              )
            ],
            1
          )
        : _vm._e()
    };
    var __vue_staticRenderFns__$9 = [];
    __vue_render__$9._withStripped = true;

      /* style */
      const __vue_inject_styles__$9 = undefined;
      /* scoped */
      const __vue_scope_id__$9 = undefined;
      /* module identifier */
      const __vue_module_identifier__$9 = undefined;
      /* functional template */
      const __vue_is_functional_template__$9 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbAutoCaptcha = normalizeComponent_1(
        { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
        __vue_inject_styles__$9,
        __vue_script__$9,
        __vue_scope_id__$9,
        __vue_is_functional_template__$9,
        __vue_module_identifier__$9,
        undefined,
        undefined
      );

    //

    var script$a = {

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
                this.formValue = $event.target.value;
                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
                this.$emit('input', $event.target.value);
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
                this.inFocus.push( index === 0 && this.focus ? true : false );
            }
        }
    };

    /* script */
    const __vue_script__$a = script$a;

    /* template */
    var __vue_render__$a = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _vm.items && _vm.items.length
        ? _c(
            "div",
            {
              staticClass: "fc-radio fb-element",
              class: { "animated shake": _vm.shake }
            },
            [
              _vm.label
                ? _c("div", { staticClass: "fc-radio__label" }, [
                    _vm._v(_vm._s(_vm.label))
                  ])
                : _vm._e(),
              _c(
                "fb-error-wrap",
                {
                  attrs: { open: _vm.showTooltip, error: _vm.error },
                  on: { clickTooltip: _vm.clickTooltip }
                },
                [
                  _c(
                    "div",
                    { staticClass: "fc-radio__wrap" },
                    _vm._l(_vm.items, function(item, i) {
                      return _c(
                        "label",
                        {
                          key: i,
                          class: [
                            "fc-radio__box",
                            {
                              "is-checked": _vm.checkActive(item),
                              "fc-radio_disabled": _vm.isItemDisabled(item)
                            }
                          ]
                        },
                        [
                          _c(
                            "input",
                            _vm._g(
                              _vm._b(
                                {
                                  ref: "fields",
                                  refInFor: true,
                                  class: [
                                    "fc-radio__field",
                                    { "is-focusable": _vm.isFocusable },
                                    { "in-focus": _vm.inFocus }
                                  ],
                                  attrs: {
                                    type: "radio",
                                    "data-awes": _vm.$options.name + "." + _vm.name,
                                    disabled: _vm.isItemDisabled(item)
                                  },
                                  domProps: {
                                    checked: _vm.checkActive(item),
                                    value: item.value ? item.value : item.toString()
                                  },
                                  on: {
                                    focus: function($event) {
                                      return _vm.$set(_vm.inFocus, i, true)
                                    },
                                    blur: function($event) {
                                      return _vm.$set(_vm.inFocus, i, false)
                                    },
                                    keydown: function($event) {
                                      if (
                                        !$event.type.indexOf("key") &&
                                        _vm._k(
                                          $event.keyCode,
                                          "enter",
                                          13,
                                          $event.key,
                                          "Enter"
                                        )
                                      ) {
                                        return null
                                      }
                                      $event.preventDefault();
                                      return _vm.focusNext($event)
                                    }
                                  }
                                },
                                "input",
                                _vm.$attrs,
                                false
                              ),
                              {
                                input: _vm.formId
                                  ? _vm.formValueHandler
                                  : _vm.vModelHandler
                              }
                            )
                          ),
                          _vm._t(
                            "default",
                            [
                              _c("span", { staticClass: "fc-radio__text" }, [
                                _vm._v(
                                  _vm._s(item.name ? item.name : item.toString())
                                )
                              ])
                            ],
                            {
                              item: item,
                              checked: _vm.checkActive(item),
                              focused: _vm.inFocus[i]
                            }
                          )
                        ],
                        2
                      )
                    }),
                    0
                  )
                ]
              )
            ],
            1
          )
        : _vm._e()
    };
    var __vue_staticRenderFns__$a = [];
    __vue_render__$a._withStripped = true;

      /* style */
      const __vue_inject_styles__$a = undefined;
      /* scoped */
      const __vue_scope_id__$a = undefined;
      /* module identifier */
      const __vue_module_identifier__$a = undefined;
      /* functional template */
      const __vue_is_functional_template__$a = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbRadioGroup = normalizeComponent_1(
        { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
        __vue_inject_styles__$a,
        __vue_script__$a,
        __vue_scope_id__$a,
        __vue_is_functional_template__$a,
        __vue_module_identifier__$a,
        undefined,
        undefined
      );

    //

    let _sliderId = 0;

    var script$b = {

        name: "fb-slider",

        inheritAttrs: false,

        mixins: [ fieldMixin ],


        props: {

            min: {
                type: [Number,String],
                default: 0
            },

            max: {
                type: [Number,String],
                default: 100
            },

            value: {
                type: [Number, String],
                default: 0
            }
        },


        computed: {

            inputId() {
                return 'slider-' + _sliderId++
            },

            percent() {
                return Math.round( Number(this.formId ? this.formValue : this.value) || 0 / Number(this.max) * 100 )
            }
        },


        methods: {

            formValueHandler($event) {
                this.formValue = Number($event.target.value);
                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
                this.$emit('input', Number($event.target.value));
            },


            toggleListener(on) {
                let method = (on ? 'add' : 'remove') + 'EventListener';
                let handler = this.formId ? this.formValueHandler : this.vModelHandler;
                let event = window.MSInputMethodContext ? 'change' : 'input';
                this.$refs.element[method](event, handler);
            }
        },


        mounted() {
            this.$nextTick(() => this.toggleListener(true));
        },


        beforeDestroy() {
            this.toggleListener(false);
        }
    };

    /* script */
    const __vue_script__$b = script$b;

    /* template */
    var __vue_render__$b = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "fb-slider",
            "fb-element",
            {
              "fb-slider_disabled": _vm.isDisabled,
              "fb-slider_error": _vm.hasError,
              "animated shake": _vm.shake
            }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c("div", { staticClass: "fb-slider__wrap" }, [
                _c("div", { staticClass: "fb-slider__wrap-left" }, [
                  _c(
                    "label",
                    {
                      staticClass: "fb-slider__label",
                      attrs: { for: "#" + _vm.inputId }
                    },
                    [_vm._v(_vm._s(_vm.label))]
                  ),
                  _c("span", { staticClass: "fb-slider__value" }, [
                    _vm._v(_vm._s(_vm.percent) + " %")
                  ])
                ]),
                _c("div", { staticClass: "fb-slider__wrap-right" }, [
                  _c(
                    "input",
                    _vm._b(
                      {
                        ref: "element",
                        class: [
                          "fb-slider__field",
                          { "is-focusable": _vm.isFocusable },
                          { "in-focus": _vm.inFocus }
                        ],
                        style: "--percent: " + _vm.percent + "%",
                        attrs: {
                          id: _vm.inputId,
                          "data-awes": _vm.$options.name + "." + _vm.name,
                          type: "range",
                          disabled: _vm.isDisabled
                        },
                        domProps: {
                          value: (_vm.formId ? _vm.formValue : _vm.value) || 0
                        },
                        on: {
                          focus: function($event) {
                            _vm.inFocus = true;
                          },
                          blur: function($event) {
                            _vm.inFocus = false;
                          },
                          keydown: function($event) {
                            if (
                              !$event.type.indexOf("key") &&
                              _vm._k(
                                $event.keyCode,
                                "enter",
                                13,
                                $event.key,
                                "Enter"
                              )
                            ) {
                              return null
                            }
                            $event.preventDefault();
                            return _vm.focusNext($event)
                          }
                        }
                      },
                      "input",
                      _vm.$attrs,
                      false
                    )
                  )
                ])
              ])
            ]
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$b = [];
    __vue_render__$b._withStripped = true;

      /* style */
      const __vue_inject_styles__$b = undefined;
      /* scoped */
      const __vue_scope_id__$b = undefined;
      /* module identifier */
      const __vue_module_identifier__$b = undefined;
      /* functional template */
      const __vue_is_functional_template__$b = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbSlider = normalizeComponent_1(
        { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
        __vue_inject_styles__$b,
        __vue_script__$b,
        __vue_scope_id__$b,
        __vue_is_functional_template__$b,
        __vue_module_identifier__$b,
        undefined,
        undefined
      );

    //

    const ERR_COUNTER_MAX = 20;
    const VueTelInputSrc = [
        'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.js',
        'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.css'
    ];
    let errCounter = ERR_COUNTER_MAX;
    let unwatch;

    var script$c = {

        name: 'fb-phone',

        mixins: [ fieldMixin ],

        components: {
            VueTelInput: resolve => {
                return AWES.utils.loadModule('vue-tel-input', VueTelInputSrc, () => {
                    const _cmp = VueTelInput.default;
                    const _mounted = function() { this.$emit('ready'); };
                    if ( _cmp.mounted ) {
                        if ( Array.isArray(_cmp.mounted) ) {
                            _cmp.mounted.push( _mounted );
                        } else {
                            let _old = _cmp.mounted;
                            _cmp.mounted = [ _old, _mounted ];
                        }
                    } else {
                        _cmp.mounted = _mounted;
                    }
                    errCounter = ERR_COUNTER_MAX;
                    resolve(_cmp);
                })
            }
        },


        props: {

            value: {
                type: String,
                default: ''
            },

            defaultCountry: {
                type: String,
                default: ''
            }
        },


        data() {
            return {
                nativeTelInput: false,
                isReady: false
            }
        },


        computed: {

            isActive() {
                return !!(this.inFocus || (this.value || this.formValue));
            }
        },


        methods: {

            formValueHandler(value) {

                this.formValue = value;

                if ( this.error ) {
                    this.resetError();
                }
            },

            vModelHandler(value) {
                this.$emit('input', value);
            },

            setFocusWatcher() {
                if ( ! this.$refs.tel ) return

                this.nativeTelInput = this.$refs.tel.$refs.input;

                this.nativeTelInput.addEventListener('focus', () => {
                    this.inFocus = true;
                });

                this.setFocusableClass();
                this.setFocusClass();
            },

            setFocusClass() {
                this.nativeTelInput.classList[ this.inFocus ? 'add' : 'remove' ]('in-focus');
                errCounter = ERR_COUNTER_MAX;
            },

            setFocusableClass() {
                this.nativeTelInput.classList[ this.isFocusable ? 'add' : 'remove' ]('is-focusable');
                errCounter = ERR_COUNTER_MAX;
            },

            setFocus(state) {
                try {
                    let useMethod = (state !== false) ? 'focus' : 'blur';
                    this.nativeTelInput[useMethod]();
                } catch (e) {
                    if ( errCounter ) {
                        errCounter--;
                        setTimeout( () => { this.setFocus(state); }, 1000 );
                    }
                }
            },

            checkFocus() {
                if ( ! this.inFocus ) this.setFocus();
            }
        },


        watch: {

            inFocus() {
                if ( ! this.isReady ) return
                try {
                    this.setFocusClass();
                } catch(e) {
                    if ( errCounter ) {
                        errCounter--;
                        setTimeout( this.setFocusClass, 1000 );
                    }
                }
            },

            isFocusable() {
                if ( ! this.isReady ) return
                try {
                    this.setFocusableClass();
                } catch(e) {
                    if ( errCounter ) {
                        errCounter--;
                        setTimeout( this.setFocusableClass, 1000 );
                    }
                }
            }
        },


        mounted() {
            unwatch = this.$watch('isReady', ready => {
                this.setFocusWatcher();
                unwatch();
                unwatch = null;
            });
        },


        updated() {
            if ( ! this.nativeTelInput ) this.setFocusWatcher();
        },


        beforeDestroy() {
            if ( typeof unwatch === 'function' ) unwatch();
        }
    };

    /* script */
    const __vue_script__$c = script$c;

    /* template */
    var __vue_render__$c = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            _vm.isReady ? "fb-phone" : "fb-input",
            "fb-element",
            {
              "fb-phone_disabled": _vm.isDisabled,
              "fb-phone_disabled": !_vm.isReady && _vm.isDisabled,
              "animated shake": _vm.shake,
              "fb-phone_active": _vm.isActive,
              "fb-phone_error": _vm.hasError,
              "fb-input_active": !_vm.isReady && _vm.isActive
            }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "span",
                { class: _vm.isReady ? "fb-phone__label" : "fb-input__label" },
                [_vm._v(_vm._s(_vm.label))]
              ),
              !_vm.isReady
                ? _c(
                    "input",
                    _vm._g(
                      {
                        class: [
                          "fb-input__field",
                          {
                            "is-focusable": _vm.isFocusable,
                            "in-focus": _vm.inFocus,
                            "has-label": _vm.label
                          }
                        ],
                        attrs: { disabled: _vm.isDisabled, type: "tel" },
                        domProps: { value: _vm.formId ? _vm.formValue : _vm.value },
                        on: {
                          blur: function($event) {
                            _vm.inFocus = false;
                          },
                          focus: function($event) {
                            _vm.inFocus = true;
                          }
                        }
                      },
                      {
                        input: function(ref) {
                          var target = ref.target;

                          return _vm.formId
                            ? _vm.formValueHandler(target.value)
                            : _vm.vModelHandler(target.value)
                        }
                      }
                    )
                  )
                : _vm._e(),
              _c(
                "vue-tel-input",
                _vm._g(
                  {
                    ref: "tel",
                    class: { "has-label": _vm.label },
                    attrs: {
                      value: _vm.formId ? String(_vm.formValue || "") : _vm.value,
                      disabled: _vm.isDisabled,
                      defaultCountry: _vm.defaultCountry
                    },
                    on: {
                      onBlur: function($event) {
                        _vm.inFocus = false;
                      },
                      onInput: _vm.checkFocus,
                      ready: function($event) {
                        _vm.isReady = true;
                      }
                    }
                  },
                  { input: _vm.formId ? _vm.formValueHandler : _vm.vModelHandler }
                )
              )
            ],
            1
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$c = [];
    __vue_render__$c._withStripped = true;

      /* style */
      const __vue_inject_styles__$c = undefined;
      /* scoped */
      const __vue_scope_id__$c = undefined;
      /* module identifier */
      const __vue_module_identifier__$c = undefined;
      /* functional template */
      const __vue_is_functional_template__$c = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbPhone = normalizeComponent_1(
        { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
        __vue_inject_styles__$c,
        __vue_script__$c,
        __vue_scope_id__$c,
        __vue_is_functional_template__$c,
        __vue_module_identifier__$c,
        undefined,
        undefined
      );

    //

    var script$d = {

        name: 'fb-uploader',

        mixins: [ fieldMixin ],


        props: {

            url: {
                type: String,
                required: true
            },

            format: {
                type: [String, Array],
            },

            size: [String, Number], // Mb
            validator(value) {
                return +value == value
            }
        },


        data() {
            return {
                filesProgress: {}
            }
        },


        filters: {

            timestampToDate(val) {
                let date = new Date(val);
                return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear() + 1}`
            },

            bytesToMb(val) {
                let mb = val / 1024 / 1024;
                return ( mb < 1 ? mb.toFixed(3) : mb.toFixed(1) ) + 'Mb'
            }
        },


        computed: {

            uploaderOptions() {
                return {
                    target: this.url,
                    testChunks: false
                }
            },

            formatArray() {
                return this.format && Array.isArray(this.format) ?
                       this.format :
                       this.format.split(',').map( extension => extension.trim() )
            },

            formatString() {
                return this.format && Array.isArray(this.format) ?
                       this.format.concat(', ') :
                       this.format
            },

            maxSizeBytes() {
                return this.size * 1024 * 1024
            }
        },


        methods: {

            checkFile(file) {
                if ( this.format && ! this._extensionMatch(file) ) {
                    file.ignored = true;
                    this.showError(this.$lang.FORMS_UPLOADER_EXTENSION_ERROR.replace('%s', file.name));
                }
                if ( this.size && file.size > this.maxSizeBytes ) {
                    file.ignored = true;
                    this.showError(this.$lang.FORMS_UPLOADER_SIZE_ERROR.replace('%s', file.name));
                }
            },

            showError(message) {
                AWES.notify({
                    status: 'error',
                    message
                });
            },

            setProgress(file) {
                this.$set(this.filesProgress, file.uniqueIdentifier, file.progress());
            },

            getExtension(fileName) {
                return fileName.split('.').pop()
            },

            getName(fileName) {
                let name = fileName.split('.');
                name.pop();
                return name.join('.')
            },

            _extensionMatch(file) {
                let extension = this.getExtension(file.name);
                return this.formatArray.includes(extension)
            },

            toggleFormBlock(status) {
                this.$store.commit('setLoading', {
                    formName: this.formId,
                    status
                });
                if ( ! status ) this.$forceUpdate();
            },

            addFileNameToForm(rootFile, file, message, chunk) {
                delete this.filesProgress[file.uniqueIdentifier];
                try {
                    let response = JSON.parse(message);
                    let fileName = AWES.utils.object.get(response, 'meta.path', file.relativePath);
                    Array.isArray(this.formValue) ? this.formValue.push(fileName) : this.formValue = [fileName];
                } catch(e) {
                    console.log(e);
                }
            },

            removeFile(file, index) {
                if ( file.isComplete() ) {
                    this.formValue.splice(index, 1);
                }
                file.cancel();
                delete this.filesProgress[file.uniqueIdentifier];
            },

            setFocus(state) {
                this.__retries = this.__retries || 20;
                try {
                    let useMethod = (state !== false) ? 'focus' : 'blur';
                    this.$refs.uploaderBtn.$el[useMethod]();
                    this.__retries = 20;
                } catch(e) {
                    this.__retries -= 1;
                    if (this.__retries) {
                        setTimeout(() => this.setFocus(state), 1000);
                    }
                }
            }
        }
    };

    /* script */
    const __vue_script__$d = script$d;

    /* template */
    var __vue_render__$d = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "uploader",
        {
          staticClass: "fb-uploader fb-element",
          class: { "fb-uploader_disabled": _vm.isDisabled },
          attrs: { options: _vm.uploaderOptions },
          on: {
            "file-added": _vm.checkFile,
            "file-progress": _vm.setProgress,
            "file-success": _vm.addFileNameToForm,
            "upload-start": function($event) {
              return _vm.toggleFormBlock(true)
            },
            complete: function($event) {
              return _vm.toggleFormBlock(false)
            }
          }
        },
        [
          _c("uploader-unsupport"),
          _c("uploader-drop", [
            _c(
              "p",
              { staticClass: "fb-uploader__message" },
              [
                _vm._v(" " + _vm._s(_vm.$lang.FORMS_UPLOAD_DROP) + " "),
                _c("span", { staticClass: "fb-uploader__fakebtn" }, [
                  _vm._v(_vm._s(_vm.$lang.FORMS_UPLOAD_ADD))
                ]),
                _c(
                  "uploader-btn",
                  {
                    ref: "uploaderBtn",
                    staticClass: "fb-uploader__btn",
                    attrs: { tabindex: "1" }
                  },
                  [_c("span", [_vm._v(_vm._s(_vm.$lang.FORMS_UPLOAD_ADD))])]
                )
              ],
              1
            ),
            _vm.format || _vm.size
              ? _c("p", [
                  _vm.format
                    ? _c("i", { staticClass: "fb-uploader__formats" }, [
                        _vm._v(
                          " " +
                            _vm._s(_vm.$lang.FORMS_UPLOAD_FORMAT) +
                            " " +
                            _vm._s(_vm.formatString) +
                            ". "
                        )
                      ])
                    : _vm._e(),
                  _vm.size
                    ? _c("i", { staticClass: "fb-uploader__size" }, [
                        _vm._v(
                          " " +
                            _vm._s(_vm.$lang.FORMS_UPLOAD_SIZE) +
                            " " +
                            _vm._s(_vm.size) +
                            "Mb "
                        )
                      ])
                    : _vm._e()
                ])
              : _vm._e()
          ]),
          _c("uploader-list", {
            scopedSlots: _vm._u(
              [
                {
                  key: "default",
                  fn: function(props) {
                    return [
                      _vm._t(
                        "list",
                        [
                          props.fileList.length
                            ? _c("div", { staticClass: "fb-uploader__cwrap" }, [
                                _c("table", { staticClass: "fb-uploader__list" }, [
                                  _c(
                                    "tbody",
                                    [
                                      _vm._l(props.fileList, function(file, i) {
                                        return [
                                          _c("tr", { key: file.id }, [
                                            _c(
                                              "td",
                                              {
                                                staticClass:
                                                  "fb-uploader__list-number"
                                              },
                                              [_vm._v(_vm._s(i + 1))]
                                            ),
                                            _c(
                                              "td",
                                              {
                                                staticClass:
                                                  "fb-uploader__list-name"
                                              },
                                              [
                                                _c(
                                                  "span",
                                                  {
                                                    staticClass:
                                                      "fb-uploader__list-ftitle"
                                                  },
                                                  [
                                                    _vm._v(
                                                      _vm._s(_vm.getName(file.name))
                                                    )
                                                  ]
                                                )
                                              ]
                                            ),
                                            _c(
                                              "td",
                                              {
                                                staticClass:
                                                  "fb-uploader__list-type"
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm.getExtension(file.name)
                                                  )
                                                )
                                              ]
                                            ),
                                            _c(
                                              "td",
                                              {
                                                staticClass:
                                                  "fb-uploader__list-size"
                                              },
                                              [
                                                _vm._v(
                                                  _vm._s(
                                                    _vm._f("bytesToMb")(file.size)
                                                  )
                                                )
                                              ]
                                            ),
                                            _c(
                                              "td",
                                              {
                                                staticClass:
                                                  "fb-uploader__list-date"
                                              },
                                              [
                                                file.isComplete()
                                                  ? [
                                                      _vm._v(
                                                        " " +
                                                          _vm._s(
                                                            _vm._f(
                                                              "timestampToDate"
                                                            )(
                                                              file._lastProgressCallback
                                                            )
                                                          ) +
                                                          " "
                                                      )
                                                    ]
                                                  : _vm._e()
                                              ],
                                              2
                                            ),
                                            _c(
                                              "td",
                                              {
                                                staticClass:
                                                  "fb-uploader__list-delete"
                                              },
                                              [
                                                _c(
                                                  "button",
                                                  {
                                                    staticClass:
                                                      "fb-uploader__delete",
                                                    attrs: {
                                                      title:
                                                        _vm.$lang
                                                          .FORMS_UPLOAD_DELETE,
                                                      "aria-label":
                                                        _vm.$lang
                                                          .FORMS_UPLOAD_DELETE
                                                    },
                                                    on: {
                                                      click: function($event) {
                                                        $event.preventDefault();
                                                        return _vm.removeFile(
                                                          file,
                                                          i
                                                        )
                                                      }
                                                    }
                                                  },
                                                  [_vm._v("×")]
                                                )
                                              ]
                                            )
                                          ]),
                                          !file.isComplete()
                                            ? _c(
                                                "tr",
                                                {
                                                  key: file.id + "loader",
                                                  staticClass:
                                                    "fb-uploader__list-pgwrap"
                                                },
                                                [
                                                  _c(
                                                    "td",
                                                    {
                                                      staticClass:
                                                        "fb-uploader__list-progress",
                                                      attrs: { colspan: "6" }
                                                    },
                                                    [
                                                      _c("progress", {
                                                        staticClass:
                                                          "fb-uploader__progress",
                                                        attrs: { max: "1" },
                                                        domProps: {
                                                          value:
                                                            _vm.filesProgress[
                                                              file.uniqueIdentifier
                                                            ]
                                                        }
                                                      })
                                                    ]
                                                  )
                                                ]
                                              )
                                            : _vm._e()
                                        ]
                                      })
                                    ],
                                    2
                                  )
                                ])
                              ])
                            : _vm._e()
                        ],
                        { fileList: props.fileList, removeFile: _vm.removeFile }
                      )
                    ]
                  }
                }
              ],
              null,
              true
            )
          })
        ],
        1
      )
    };
    var __vue_staticRenderFns__$d = [];
    __vue_render__$d._withStripped = true;

      /* style */
      const __vue_inject_styles__$d = undefined;
      /* scoped */
      const __vue_scope_id__$d = undefined;
      /* module identifier */
      const __vue_module_identifier__$d = undefined;
      /* functional template */
      const __vue_is_functional_template__$d = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbUploader = normalizeComponent_1(
        { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
        __vue_inject_styles__$d,
        __vue_script__$d,
        __vue_scope_id__$d,
        __vue_is_functional_template__$d,
        __vue_module_identifier__$d,
        undefined,
        undefined
      );

    /**
     * Load Tiny MCE modules
     *
     * @returns Promise
     */

    function loadEditor() {
        return AWES.utils.loadModules({
            'tiny-mce': 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.2/tinymce.min.js',
            'tiny-mce-plugins': {
                deps: ['tiny-mce'],
                src: [
                    'https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.2/plugins/lists/plugin.min.js'
                ],
            }
        })
    }


    /**
     * Tiny MCE config
     * https://www.tiny.cloud/docs/configure/integration-and-setup/
     */
    const defaultOptions = {
        branding: false,
        statusbar: false,
        menubar: false,
        fontsize_formats: '10px 12px 14px 16px 18px 24px 36px',
        plugins: 'lists',
        toolbar: [
            'fontselect fontsizeselect bold italic underline numlist bullist'
        ],
        setup: function () {
            this.on('ExecCommand', function(e) {
                // fix font blinking
                if ( e.command === 'FontName' ) {
                    e.target.getDoc().body.style.fontFamily = e.value;
                }
            });
        },
        init_instance_callback: function() {
            // set default font
            this.execCommand('FontName', false, 'Arial');
        }
    };


    /**
     * Load CodeMirror modules
     *
     * @returns Promise
     */

    function loadCodeEditor() {
        return AWES.utils.loadModules({
            'codemirror': {
            src: [
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/codemirror.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/codemirror.css'
            ]
            },
            'codemirror-plugins': {
                deps: ['codemirror'],
                src: [
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/mode/xml/xml.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/fold/xml-fold.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/matchbrackets.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/closebrackets.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/matchtags.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/addon/edit/closetag.min.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.43.0/mode/htmlmixed/htmlmixed.min.js'
                ]
            }
        })
    }


    /**
     * Codemirror config
     * https://codemirror.net/doc/manual.html
     */
    const defaultCodeOptions = {
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        autoCloseTags: true,
        matchTags: true,
        mode: "htmlmixed"
    };

    //

    const SAVE_DEBOUNCE = 1000;
    let _uid = 0;

    var script$e = {

        name: 'fb-editor',

        mixins: [ fieldMixin ],

        props: {

            options: {
                type: Object,
                default: () => ({})
            }
        },


        data() {
            return {
                editorId: 'fb-editor-' + _uid,
                codeEditorId: 'fb-code-editor-' + _uid++,
                mode: 'visual',
                codeEditorInited: false
            }
        },


        watch: {

            mode(mode) {
                if ( mode === 'visual' ) {
                    this._saveCode();
                    tinymce.get(this.editorId).setContent(this.value);
                } else {
                    this._saveVisual();
                    if ( ! this.codeEditorInited ) {
                        loadCodeEditor()
                            .then( this.initCodeEditor )
                            .then( this._setCodeValue );
                    } else {
                        this._setCodeValue();
                    }
                }
            }
        },


        methods: {

            initEditor() {
                defaultOptions.selector = '#' + this.editorId;
                let options = AWES.utils.object.get(AWES._config, 'formBuilder.fbEditor', {});
                if ( this.focus ) options.auto_focus = this.editorId;
                Object.assign(options, this.options, defaultOptions);

                tinymce.init(options);
                const editor = tinymce.get(this.editorId);
                editor.on('Change', this._debounceSave);
                if ( typeof AWES._theme !== undefined ) {
                    editor.once('Init', () => {
                        this._switchThemeAttribute({detail: AWES._theme});
                    });
                }
            },

            initCodeEditor() {
                this.codeEditorInited = true;
                this._codeEditor = CodeMirror.fromTextArea( this.$refs.code, defaultCodeOptions);
                this._codeEditor.on('update', this._debounceSave);
                return this._codeEditor
            },

            save() {
                this.mode === 'visual' ? this._saveVisual() : this._saveCode();
            },

            _debounceSave() {
                clearTimeout(this._debounce);
                this._debounce = setTimeout(this.save, SAVE_DEBOUNCE);
            },

            _saveVisual() {
                this.formValue = tinymce.get(this.editorId).save();
            },

            _saveCode() {
                if ( this._codeEditor ) this.formValue = this._codeEditor.doc.getValue();
            },

            _setCodeValue() {
                this._codeEditor.doc.setValue( this.formValue );
                setTimeout( () => { this._codeEditor.refresh(); }, 1);
            },

            _switchThemeAttribute($event) {
                const doc = tinymce.get(this.editorId).getDoc();
                if ( $event.detail === 1 ) {
                    doc.documentElement.setAttribute('data-dark', true);
                } else {
                    doc.documentElement.removeAttribute('data-dark');
                }
            },

            setFocus(state) {
                try {
                    if (state !== false) {
                        if ( this.mode === 'visual' ) {
                            tinymce.get(this.editorId).focus();
                        } else if ( this._codeEditor ) {
                            this._codeEditor.focus();
                        }
                    }
                } catch (e) {
                    console.warn('Error while setting focus');
                    console.error(e);
                }
            }
        },


        mounted() {
            if ( this.formId ) {
                AWES.on(`form-builder::${this.formId}:before-send`, this.save);
            }
            this.$nextTick( this.initEditor );
            if ( typeof AWES._theme !== undefined ) {
                AWES.on('theme.change', this._switchThemeAttribute);
            }
        },


        beforeDestroy() {
            if ( this.formId ) {
                AWES.off(`form-builder::${this.formId}:before-send`, this.save);
            }
            if ( typeof AWES._theme !== undefined ) {
                AWES.off('theme.change', this._switchThemeAttribute);
            }
        }
    };

    /* script */
    const __vue_script__$e = script$e;

    /* template */
    var __vue_render__$e = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-editor fb-element",
          class: [{ "fb-editor_disabled": _vm.isDisabled }]
        },
        [
          _c("div", { staticClass: "fb-editor__modes" }, [
            _c(
              "button",
              {
                class: [
                  "fb-editor__modes-button",
                  { "is-active": _vm.mode === "visual" }
                ],
                attrs: { type: "button" },
                on: {
                  click: function($event) {
                    _vm.mode = "visual";
                  }
                }
              },
              [_vm._v(" " + _vm._s(_vm.$lang.FORMS_EDITOR_VISUAL) + " ")]
            ),
            _c(
              "button",
              {
                class: [
                  "fb-editor__modes-button",
                  { "is-active": _vm.mode === "code" }
                ],
                attrs: { type: "button" },
                on: {
                  click: function($event) {
                    _vm.mode = "code";
                  }
                }
              },
              [_vm._v(" " + _vm._s(_vm.$lang.FORMS_EDITOR_CODE) + " ")]
            )
          ]),
          _c("div", { staticClass: "fb-editor__tabs" }, [
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.mode === "visual",
                    expression: "mode === 'visual'"
                  }
                ],
                key: "visual",
                staticClass: "fb-editor__tab"
              },
              [
                _c(
                  "textarea",
                  {
                    staticClass: "fb-editor__tiny",
                    attrs: { id: _vm.editorId, disabled: _vm.isDisabled }
                  },
                  [_vm._v(_vm._s(_vm.formValue))]
                )
              ]
            ),
            _c(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: _vm.mode === "code",
                    expression: "mode === 'code'"
                  }
                ],
                key: "code",
                staticClass: "fb-editor__tab"
              },
              [
                _c(
                  "textarea",
                  {
                    ref: "code",
                    staticClass: "fb-editor__codemirror",
                    attrs: { id: _vm.codeEditorId, disabled: _vm.isDisabled }
                  },
                  [_vm._v(_vm._s(_vm.formValue))]
                )
              ]
            )
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$e = [];
    __vue_render__$e._withStripped = true;

      /* style */
      const __vue_inject_styles__$e = undefined;
      /* scoped */
      const __vue_scope_id__$e = undefined;
      /* module identifier */
      const __vue_module_identifier__$e = undefined;
      /* functional template */
      const __vue_is_functional_template__$e = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbEditor = normalizeComponent_1(
        { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
        __vue_inject_styles__$e,
        __vue_script__$e,
        __vue_scope_id__$e,
        __vue_is_functional_template__$e,
        __vue_module_identifier__$e,
        undefined,
        undefined
      );

    //

    var script$f = {

        name: 'fb-switcher',

        inheritAttrs: false,

        mixins: [ checkboxFieldMixin ],


        data() {
            return {
                oldValue: null
            }
        },


        computed: {

            rangeValue() {
                return Number( this.formId ? this.formValue : this.vModelChecked )
            }
        },


        methods: {

            formValueHandler($event) {
                this.oldValue = null;
                let checked = +$event.target.value;
                this.formValue = this.isNumeric ? checked : Boolean(checked);
                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
                this.oldValue = null;
                let response;

                if (this.vModelArray) {

                    // switch the value in array
                    response = this.value.slice();
                    if ($event.target.value && !this.vModelChecked) {
                        response.push(this.computedValue);
                    } else if (!$event.target.checked && this.vModelChecked) {
                        response.splice(response.findIndex(item => item === this.computedValue), 1);
                    }
                } else {

                    // switch single value
                    response = Boolean($event.target.value);
                }

                this.$emit('input', response);
            },

            toggleValue( oldValue ) {
                if ( this.isDisabled || oldValue === null ) return
                let _event = { target: {value: oldValue ? 0 : 1} };
                if ( this.formId ) {
                    this.formValueHandler(_event);
                } else {
                    this.vModelHandler(_event);
                }
            }
        }
    };

    /* script */
    const __vue_script__$f = script$f;

    /* template */
    var __vue_render__$f = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          class: [
            "fb-switcher",
            "fb-element",
            {
              "fb-switcher_error": _vm.hasError,
              "fb-switcher_active": _vm.isActive,
              "fb-switcher_disabled": _vm.isDisabled
            }
          ],
          on: {
            keyup: function($event) {
              if (
                !$event.type.indexOf("key") &&
                _vm._k($event.keyCode, "space", 32, $event.key, [" ", "Spacebar"])
              ) {
                return null
              }
              return _vm.toggleValue(_vm.rangeValue)
            }
          }
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "div",
                {
                  staticClass: "fb-switcher__field-wrap",
                  attrs: { "data-awes": _vm.$options.name + "." + _vm.name }
                },
                [
                  _c(
                    "input",
                    _vm._g(
                      _vm._b(
                        {
                          ref: "element",
                          staticClass: "fb-switcher__field",
                          class: {
                            "is-focusable": _vm.isFocusable,
                            "in-focus": _vm.inFocus
                          },
                          attrs: {
                            type: "range",
                            min: "0",
                            max: "1",
                            step: "1",
                            disabled: _vm.isDisabled
                          },
                          domProps: { value: _vm.rangeValue },
                          on: {
                            focus: function($event) {
                              _vm.inFocus = true;
                            },
                            blur: function($event) {
                              _vm.inFocus = false;
                            },
                            keydown: function($event) {
                              if (
                                !$event.type.indexOf("key") &&
                                _vm._k(
                                  $event.keyCode,
                                  "enter",
                                  13,
                                  $event.key,
                                  "Enter"
                                )
                              ) {
                                return null
                              }
                              $event.preventDefault();
                              return _vm.focusNext($event)
                            },
                            mousedown: function($event) {
                              _vm.oldValue = _vm.rangeValue;
                            },
                            click: function($event) {
                              return _vm.toggleValue(_vm.oldValue)
                            }
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      ),
                      {
                        input: _vm.formId ? _vm.formValueHandler : _vm.vModelHandler
                      }
                    )
                  )
                ]
              ),
              _c(
                "span",
                {
                  staticClass: "fb-switcher__label",
                  on: {
                    click: function($event) {
                      if ($event.target !== $event.currentTarget) {
                        return null
                      }
                      return _vm.toggleValue(_vm.rangeValue)
                    }
                  }
                },
                [_vm._v(_vm._s(_vm.label))]
              )
            ]
          )
        ],
        1
      )
    };
    var __vue_staticRenderFns__$f = [];
    __vue_render__$f._withStripped = true;

      /* style */
      const __vue_inject_styles__$f = undefined;
      /* scoped */
      const __vue_scope_id__$f = undefined;
      /* module identifier */
      const __vue_module_identifier__$f = undefined;
      /* functional template */
      const __vue_is_functional_template__$f = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbSwitcher = normalizeComponent_1(
        { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
        __vue_inject_styles__$f,
        __vue_script__$f,
        __vue_scope_id__$f,
        __vue_is_functional_template__$f,
        __vue_module_identifier__$f,
        undefined,
        undefined
      );

    /**
     * @file A generic set of mutation-free date functions.
     */

    /**
     * now returns the current date without any time values
     *
     * @returns {Date}
     */
    function now() {
      var dt = new Date();
      dt.setHours(0, 0, 0, 0);
      return dt;
    }

    /**
     * dateEq compares two dates
     *
     * @param {Date} date1 the first date
     * @param {Date} date2 the second date
     * @returns {boolean}
     */
    function datesEq(date1, date2) {
      return (date1 && date1.toDateString()) === (date2 && date2.toDateString());
    }

    /**
     * shiftDay shifts the specified date by n days
     *
     * @param {Date} dt
     * @param {number} n
     * @returns {Date}
     */
    function shiftDay(dt, n) {
      dt = new Date(dt);
      dt.setDate(dt.getDate() + n);
      return dt;
    }

    /**
     * shiftMonth shifts the specified date by a specified number of months
     *
     * @param {Date} dt
     * @param {number} n
     * @param {boolean} wrap optional, if true, does not change year
     *                       value, defaults to false
     * @returns {Date}
     */
    function shiftMonth(dt, n, wrap) {
      dt = new Date(dt);

      var dayOfMonth = dt.getDate();
      var month = dt.getMonth() + n;

      dt.setDate(1);
      dt.setMonth(wrap ? (12 + month) % 12 : month);
      dt.setDate(dayOfMonth);

      // If dayOfMonth = 31, but the target month only has 30 or 29 or whatever...
      // head back to the max of the target month
      if (dt.getDate() < dayOfMonth) {
        dt.setDate(0);
      }

      return dt;
    }

    /**
     * shiftYear shifts the specified date by n years
     *
     * @param {Date} dt
     * @param {number} n
     * @returns {Date}
     */
    function shiftYear(dt, n) {
      dt = new Date(dt);
      dt.setFullYear(dt.getFullYear() + n);
      return dt;
    }

    /**
     * setYear changes the specified date to the specified year
     *
     * @param {Date} dt
     * @param {number} year
     */
    function setYear(dt, year) {
      dt = new Date(dt);
      dt.setFullYear(year);
      return dt;
    }

    /**
     * setMonth changes the specified date to the specified month
     *
     * @param {Date} dt
     * @param {number} month
     */
    function setMonth(dt, month) {
      return shiftMonth(dt, month - dt.getMonth());
    }

    /**
     * dateOrParse creates a function which, given a date or string, returns a date
     *
     * @param {function} parse the function used to parse strings
     * @returns {function}
     */
    function dateOrParse(parse) {
      return function (dt) {
        return dropTime(typeof dt === 'string' ? parse(dt) : dt);
      };
    }

    /**
     * constrainDate returns dt or min/max depending on whether dt is out of bounds (inclusive)
     *
     * @export
     * @param {Date} dt
     * @param {Date} min
     * @param {Date} max
     * @returns {Date}
     */
    function constrainDate(dt, min, max) {
      return (dt < min) ? min :
             (dt > max) ? max :
             dt;
    }

    function dropTime(dt) {
      dt = new Date(dt);
      dt.setHours(0, 0, 0, 0);
      return dt;
    }

    /**
     * @file Utility functions for function manipulation.
     */

    /**
     * bufferFn buffers calls to fn so they only happen every ms milliseconds
     *
     * @param {number} ms number of milliseconds
     * @param {function} fn the function to be buffered
     * @returns {function}
     */
    function bufferFn(ms, fn) {
      var timeout = undefined;
      return function () {
        clearTimeout(timeout);
        timeout = setTimeout(fn, ms);
      };
    }

    /**
     * noop is a function which does nothing at all.
     */
    function noop() { }

    /**
     * copy properties from object o2 to object o1.
     *
     * @params {Object} o1
     * @params {Object} o2
     * @returns {Object}
     */
    function cp() {
      var args = arguments;
      var o1 = args[0];
      for (var i = 1; i < args.length; ++i) {
        var o2 = args[i] || {};
        for (var key in o2) {
          o1[key] = o2[key];
        }
      }
      return o1;
    }

    /**
     * @file Responsible for sanitizing and creating date picker options.
     */

    var english = {
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      today: 'Today',
      clear: 'Clear',
      close: 'Close',
    };

    /**
     * DatePickerOptions constructs a new date picker options object, overriding
     * default values with any values specified in opts.
     *
     * @param {DatePickerOptions} opts
     * @returns {DatePickerOptions}
     */
    function DatePickerOptions(opts) {
      opts = opts || {};
      opts = cp(defaults(), opts);
      var parse = dateOrParse(opts.parse);
      opts.lang = cp(english, opts.lang);
      opts.parse = parse;
      opts.inRange = makeInRangeFn(opts);
      opts.min = parse(opts.min || shiftYear(now(), -100));
      opts.max = parse(opts.max || shiftYear(now(), 100));
      opts.hilightedDate = opts.parse(opts.hilightedDate);

      return opts;
    }

    function defaults() {
      return {
        lang: english,

        // Possible values: dp-modal, dp-below, dp-permanent
        mode: 'dp-modal',

        // The date to hilight initially if the date picker has no
        // initial value.
        hilightedDate: now(),

        format: function (dt) {
          return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
        },

        parse: function (str) {
          var date = new Date(str);
          return isNaN(date) ? now() : date;
        },

        dateClass: function () { },

        inRange: function () {
          return true;
        },

        appendTo: document.body,
      };
    }

    function makeInRangeFn(opts) {
      var inRange = opts.inRange; // Cache this version, and return a variant

      return function (dt, dp) {
        return inRange(dt, dp) && opts.min <= dt && opts.max >= dt;
      };
    }

    /**
     * @file Helper functions for dealing with dom elements.
     */

    var Key = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      enter: 13,
      esc: 27,
    };

    /**
     * on attaches an event handler to the specified element, and returns an
     * off function which can be used to remove the handler.
     *
     * @param {string} evt the name of the event to handle
     * @param {HTMLElement} el the element to attach to
     * @param {function} handler the event handler
     * @returns {function} the off function
     */
    function on(evt, el, handler) {
      el.addEventListener(evt, handler, true);

      return function () {
        el.removeEventListener(evt, handler, true);
      };
    }

    var CustomEvent$1 = shimCustomEvent();

    function shimCustomEvent() {
      var CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function (event, params) {
          params = params || {bubbles: false, cancelable: false, detail: undefined};
          var evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };

        CustomEvent.prototype = window.Event.prototype;
      }

      return CustomEvent;
    }

    /**
     * @file Manages the calendar / day-picker view.
     */

    var dayPicker = {
      onKeyDown: keyDown,
      onClick: {
        'dp-day': selectDay,
        'dp-next': gotoNextMonth,
        'dp-prev': gotoPrevMonth,
        'dp-today': selectToday,
        'dp-clear': clear,
        'dp-close': close,
        'dp-cal-month': showMonthPicker,
        'dp-cal-year': showYearPicker,
      },
      render: render
    };

    /**
     * view renders the calendar (day picker) as an HTML string.
     *
     * @param {DatePickerContext} context the date picker being rendered
     * @returns {string}
     */
    function render(dp) {
      var opts = dp.opts;
      var lang = opts.lang;
      var state = dp.state;
      var dayNames = lang.days;
      var dayOffset = opts.dayOffset || 0;
      var selectedDate = state.selectedDate;
      var hilightedDate = state.hilightedDate;
      var hilightedMonth = hilightedDate.getMonth();
      var today = now().getTime();

      return (
        '<div class="dp-cal">' +
          '<header class="dp-cal-header">' +
            '<button tabindex="-1" type="button" class="dp-prev">Prev</button>' +
            '<button tabindex="-1" type="button" class="dp-cal-month">' +
              lang.months[hilightedMonth] +
            '</button>' +
            '<button tabindex="-1" type="button" class="dp-cal-year">' +
              hilightedDate.getFullYear() +
            '</button>' +
            '<button tabindex="-1" type="button" class="dp-next">Next</button>' +
          '</header>' +
          '<div class="dp-days">' +
            dayNames.map(function (name, i) {
              return (
                '<span class="dp-col-header">' + dayNames[(i + dayOffset) % dayNames.length] + '</span>'
              );
            }).join('') +
            mapDays(hilightedDate, dayOffset, function (date) {
              var isNotInMonth = date.getMonth() !== hilightedMonth;
              var isDisabled = !opts.inRange(date);
              var isToday = date.getTime() === today;
              var className = 'dp-day';
              className += (isNotInMonth ? ' dp-edge-day' : '');
              className += (datesEq(date, hilightedDate) ? ' dp-current' : '');
              className += (datesEq(date, selectedDate) ? ' dp-selected' : '');
              className += (isDisabled ? ' dp-day-disabled' : '');
              className += (isToday ? ' dp-day-today' : '');
              className += ' ' + opts.dateClass(date, dp);

              return (
                '<button tabindex="-1" type="button" class="' + className + '" data-date="' + date.getTime() + '">' +
                  date.getDate() +
                '</button>'
              );
            }) +
          '</div>' +
          '<footer class="dp-cal-footer">' +
            '<button tabindex="-1" type="button" class="dp-today">' + lang.today + '</button>' +
            '<button tabindex="-1" type="button" class="dp-clear">' + lang.clear + '</button>' +
            '<button tabindex="-1" type="button" class="dp-close">' + lang.close + '</button>' +
          '</footer>' +
        '</div>'
      );
    }

    /**
     * keyDown handles the key down event for the day-picker
     *
     * @param {Event} e
     * @param {DatePickerContext} dp
     */
    function keyDown(e, dp) {
      var key = e.keyCode;
      var shiftBy =
        (key === Key.left) ? -1 :
        (key === Key.right) ? 1 :
        (key === Key.up) ? -7 :
        (key === Key.down) ? 7 :
        0;

      if (key === Key.esc) {
        dp.close();
      } else if (shiftBy) {
        e.preventDefault();
        dp.setState({
          hilightedDate: shiftDay(dp.state.hilightedDate, shiftBy)
        });
      }
    }

    function selectToday(e, dp) {
      dp.setState({
        selectedDate: now(),
      });
    }

    function clear(e, dp) {
      dp.setState({
        selectedDate: null,
      });
    }

    function close(e, dp) {
      dp.close();
    }

    function showMonthPicker(e, dp) {
      dp.setState({
        view: 'month'
      });
    }

    function showYearPicker(e, dp) {
      dp.setState({
        view: 'year'
      });
    }

    function gotoNextMonth(e, dp) {
      var hilightedDate = dp.state.hilightedDate;
      dp.setState({
        hilightedDate: shiftMonth(hilightedDate, 1)
      });
    }

    function gotoPrevMonth(e, dp) {
      var hilightedDate = dp.state.hilightedDate;
      dp.setState({
        hilightedDate: shiftMonth(hilightedDate, -1)
      });
    }

    function selectDay(e, dp) {
      dp.setState({
        selectedDate: new Date(parseInt(e.target.getAttribute('data-date'))),
      });
    }

    function mapDays(currentDate, dayOffset, fn) {
      var result = '';
      var iter = new Date(currentDate);
      iter.setDate(1);
      iter.setDate(1 - iter.getDay() + dayOffset);

      // If we are showing monday as the 1st of the week,
      // and the monday is the 2nd of the month, the sunday won't
      // show, so we need to shift backwards
      if (dayOffset && iter.getDate() === dayOffset + 1) {
        iter.setDate(dayOffset - 6);
      }

      // We are going to have 6 weeks always displayed to keep a consistent
      // calendar size
      for (var day = 0; day < (6 * 7); ++day) {
        result += fn(iter);
        iter.setDate(iter.getDate() + 1);
      }

      return result;
    }

    /**
     * @file Manages the month-picker view.
     */

    var monthPicker = {
      onKeyDown: keyDown$1,
      onClick: {
        'dp-month': onChooseMonth
      },
      render: render$1
    };

    function onChooseMonth(e, dp) {
      dp.setState({
        hilightedDate: setMonth(dp.state.hilightedDate, parseInt(e.target.getAttribute('data-month'))),
        view: 'day',
      });
    }

    /**
     * render renders the month picker as an HTML string
     *
     * @param {DatePickerContext} dp the date picker context
     * @returns {string}
     */
    function render$1(dp) {
      var opts = dp.opts;
      var lang = opts.lang;
      var months = lang.months;
      var currentDate = dp.state.hilightedDate;
      var currentMonth = currentDate.getMonth();

      return (
        '<div class="dp-months">' +
          months.map(function (month, i) {
            var className = 'dp-month';
            className += (currentMonth === i ? ' dp-current' : '');

            return (
              '<button tabindex="-1" type="button" class="' + className + '" data-month="' + i + '">' +
                month +
              '</button>'
            );
          }).join('') +
        '</div>'
      );
    }

    /**
     * keyDown handles keydown events that occur in the month picker
     *
     * @param {Event} e
    * @param {DatePickerContext} dp
     */
    function keyDown$1(e, dp) {
      var key = e.keyCode;
      var shiftBy =
        (key === Key.left) ? -1 :
        (key === Key.right) ? 1 :
        (key === Key.up) ? -3 :
        (key === Key.down) ? 3 :
        0;

      if (key === Key.esc) {
        dp.setState({
          view: 'day',
        });
      } else if (shiftBy) {
        e.preventDefault();
        dp.setState({
          hilightedDate: shiftMonth(dp.state.hilightedDate, shiftBy, true)
        });
      }
    }

    /**
     * @file Manages the year-picker view.
     */

    var yearPicker = {
      render: render$2,
      onKeyDown: keyDown$2,
      onClick: {
        'dp-year': onChooseYear
      },
    };

    /**
     * view renders the year picker as an HTML string.
     *
     * @param {DatePickerContext} dp the date picker context
     * @returns {string}
     */
    function render$2(dp) {
      var state = dp.state;
      var currentYear = state.hilightedDate.getFullYear();
      var selectedYear = state.selectedDate.getFullYear();

      return (
        '<div class="dp-years">' +
          mapYears(dp, function (year) {
            var className = 'dp-year';
            className += (year === currentYear ? ' dp-current' : '');
            className += (year === selectedYear ? ' dp-selected' : '');

            return (
              '<button tabindex="-1" type="button" class="' + className + '" data-year="' + year + '">' +
                year +
              '</button>'
            );
          }) +
        '</div>'
      );
    }

    function onChooseYear(e, dp) {
      dp.setState({
        hilightedDate: setYear(dp.state.hilightedDate, parseInt(e.target.getAttribute('data-year'))),
        view: 'day',
      });
    }

    function keyDown$2(e, dp) {
      var key = e.keyCode;
      var opts = dp.opts;
      var shiftBy =
        (key === Key.left || key === Key.up) ? 1 :
        (key === Key.right || key === Key.down) ? -1 :
        0;

      if (key === Key.esc) {
        dp.setState({
          view: 'day',
        });
      } else if (shiftBy) {
        e.preventDefault();
        var shiftedYear = shiftYear(dp.state.hilightedDate, shiftBy);

        dp.setState({
          hilightedDate: constrainDate(shiftedYear, opts.min, opts.max),
        });
      }
    }

    function mapYears(dp, fn) {
      var result = '';
      var max = dp.opts.max.getFullYear();

      for (var i = max; i >= dp.opts.min.getFullYear(); --i) {
        result += fn(i);
      }

      return result;
    }

    /**
     * @file Defines the base date picker behavior, overridden by various modes.
     */

    var views = {
      day: dayPicker,
      year: yearPicker,
      month: monthPicker
    };

    function BaseMode(input, emit, opts) {
      var detatchInputEvents; // A function that detaches all events from the input
      var closing = false; // A hack to prevent calendar from re-opening when closing.
      var selectedDate; // The currently selected date
      var dp = {
        // The root DOM element for the date picker, initialized on first open.
        el: undefined,
        opts: opts,
        shouldFocusOnBlur: true,
        shouldFocusOnRender: true,
        state: initialState(),
        adjustPosition: noop,
        containerHTML: '<div class="dp"></div>',

        attachToDom: function () {
          opts.appendTo.appendChild(dp.el);
        },

        updateInput: function (selectedDate) {
          var e = new CustomEvent$1('change', {bubbles: true});
          e.simulated = true;
          input.value = selectedDate ? opts.format(selectedDate) : '';
          input.dispatchEvent(e);
        },

        computeSelectedDate: function () {
          return opts.parse(input.value);
        },

        currentView: function() {
          return views[dp.state.view];
        },

        open: function () {
          if (closing) {
            return;
          }

          if (!dp.el) {
            dp.el = createContainerElement(opts, dp.containerHTML);
            attachContainerEvents(dp);
          }

          selectedDate = constrainDate(dp.computeSelectedDate(), opts.min, opts.max);
          dp.state.hilightedDate = selectedDate || opts.hilightedDate;
          dp.state.view = 'day';

          dp.attachToDom();
          dp.render();

          emit('open');
        },

        isVisible: function () {
          return !!dp.el && !!dp.el.parentNode;
        },

        hasFocus: function () {
          var focused = document.activeElement;
          return dp.el &&
            dp.el.contains(focused) &&
            focused.className.indexOf('dp-focuser') < 0;
        },

        shouldHide: function () {
          return dp.isVisible();
        },

        close: function (becauseOfBlur) {
          var el = dp.el;

          if (!dp.isVisible()) {
            return;
          }

          if (el) {
            var parent = el.parentNode;
            parent && parent.removeChild(el);
          }

          closing = true;

          if (becauseOfBlur && dp.shouldFocusOnBlur) {
            focusInput(input);
          }

          // When we close, the input often gains refocus, which
          // can then launch the date picker again, so we buffer
          // a bit and don't show the date picker within N ms of closing
          setTimeout(function() {
            closing = false;
          }, 100);

          emit('close');
        },

        destroy: function () {
          dp.close();
          detatchInputEvents();
        },

        render: function () {
          if (!dp.el) {
            return;
          }

          var hadFocus = dp.hasFocus();
          var html = dp.currentView().render(dp);
          html && (dp.el.firstChild.innerHTML = html);

          dp.adjustPosition();

          if (hadFocus || dp.shouldFocusOnRender) {
            focusCurrent(dp);
          }
        },

        // Conceptually similar to setState in React, updates
        // the view state and re-renders.
        setState: function (state) {
          for (var key in state) {
            dp.state[key] = state[key];
          }

          emit('statechange');
          dp.render();
        },
      };

      detatchInputEvents = attachInputEvents(input, dp);

      // Builds the initial view state
      // selectedDate is a special case and causes changes to hilightedDate
      // hilightedDate is set on open, so remains undefined initially
      // view is the current view (day, month, year)
      function initialState() {
        return {
          get selectedDate() {
            return selectedDate;
          },
          set selectedDate(dt) {
            if (dt && !opts.inRange(dt)) {
              return;
            }

            if (dt) {
              selectedDate = new Date(dt);
              dp.state.hilightedDate = selectedDate;
            } else {
              selectedDate = dt;
            }

            dp.updateInput(selectedDate);
            emit('select');
            dp.close();
          },
          view: 'day',
        };
      }

      return dp;
    }

    function createContainerElement(opts, containerHTML) {
      var el = document.createElement('div');

      el.className = opts.mode;
      el.innerHTML = containerHTML;

      return el;
    }

    function attachInputEvents(input, dp) {
      var bufferShow = bufferFn(5, function () {
        if (dp.shouldHide()) {
          dp.close();
        } else {
          dp.open();
        }
      });

      var off = [
        on('blur', input, bufferFn(150, function () {
          if (!dp.hasFocus()) {
            dp.close(true);
          }
        })),

        on('mousedown', input, function () {
          if (input === document.activeElement) {
            bufferShow();
          }
        }),

        on('focus', input, bufferShow),

        on('input', input, function (e) {
          var date = dp.opts.parse(e.target.value);
          isNaN(date) || dp.setState({
            hilightedDate: date
          });
        }),
      ];

      // Unregister all events that were registered above.
      return function() {
        off.forEach(function (f) {
          f();
        });
      };
    }

    function focusCurrent(dp) {
      var current = dp.el.querySelector('.dp-current');
      return current && current.focus();
    }

    function attachContainerEvents(dp) {
      var el = dp.el;
      var calEl = el.querySelector('.dp');

      // Hack to get iOS to show active CSS states
      el.ontouchstart = noop;

      function onClick(e) {
        e.target.className.split(' ').forEach(function(evt) {
          var handler = dp.currentView().onClick[evt];
          handler && handler(e, dp);
        });
      }

      // The calender fires a blur event *every* time we redraw
      // this means we need to buffer the blur event to see if
      // it still has no focus after redrawing, and only then
      // do we return focus to the input. A possible other approach
      // would be to set context.redrawing = true on redraw and
      // set it to false in the blur event.
      on('blur', calEl, bufferFn(150, function () {
        if (!dp.hasFocus()) {
          dp.close(true);
        }
      }));

      on('keydown', el, function (e) {
        if (e.keyCode === Key.enter) {
          onClick(e);
        } else {
          dp.currentView().onKeyDown(e, dp);
        }
      });

      // If the user clicks in non-focusable space, but
      // still within the date picker, we don't want to
      // hide, so we need to hack some things...
      on('mousedown', calEl, function (e) {
        e.target.focus && e.target.focus(); // IE hack
        if (document.activeElement !== e.target) {
          e.preventDefault();
          focusCurrent(dp);
        }
      });

      on('click', el, onClick);
    }

    function focusInput(input) {
      // When the modal closes, we need to focus the original input so the
      // user can continue tabbing from where they left off.
      input.focus();

      // iOS zonks out if we don't blur the input, so...
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        input.blur();
      }
    }

    /**
     * @file Defines the modal date picker behavior.
     */

    function ModalMode(input, emit, opts) {
      var dp = BaseMode(input, emit, opts);

      // In modal mode, users really shouldn't be able to type in
      // the input, as all input is done via the calendar.
      input.readonly = true;

      // In modal mode, we need to know when the user has tabbed
      // off the end of the calendar, and set focus to the original
      // input. To do this, we add a special element to the DOM.
      // When the user tabs off the bottom of the calendar, they
      // will tab onto this element.
      dp.containerHTML += '<a href="#" class="dp-focuser">.</a>';

      return dp;
    }

    /**
     * @file Defines the dropdown date picker behavior.
     */

    function DropdownMode(input, emit, opts) {
      var dp = BaseMode(input, emit, opts);

      dp.shouldFocusOnBlur = false;

      Object.defineProperty(dp, 'shouldFocusOnRender', {
        get: function() {
          return input !== document.activeElement;
        }
      });

      dp.adjustPosition = function () {
        autoPosition(input, dp);
      };

      return dp;
    }

    function autoPosition(input, dp) {
      var inputPos = input.getBoundingClientRect();
      var win = window;

      adjustCalY(dp, inputPos, win);
      adjustCalX(dp, inputPos, win);

      dp.el.style.visibility = '';
    }

    function adjustCalX(dp, inputPos, win) {
      var cal = dp.el;
      var scrollLeft = win.pageXOffset;
      var inputLeft = inputPos.left + scrollLeft;
      var maxRight = win.innerWidth + scrollLeft;
      var offsetWidth = cal.offsetWidth;
      var calRight = inputLeft + offsetWidth;
      var shiftedLeft = maxRight - offsetWidth;
      var left = calRight > maxRight && shiftedLeft > 0 ? shiftedLeft : inputLeft;

      cal.style.left = left + 'px';
    }

    function adjustCalY(dp, inputPos, win) {
      var cal = dp.el;
      var scrollTop = win.pageYOffset;
      var inputTop = scrollTop + inputPos.top;
      var calHeight = cal.offsetHeight;
      var belowTop = inputTop + inputPos.height + 8;
      var aboveTop = inputTop - calHeight - 8;
      var isAbove = (aboveTop > 0 && belowTop + calHeight > scrollTop + win.innerHeight);
      var top = isAbove ? aboveTop : belowTop;

      if (cal.classList) {
        cal.classList.toggle('dp-is-above', isAbove);
        cal.classList.toggle('dp-is-below', !isAbove);
      }
      cal.style.top = top + 'px';
    }

    /**
     * @file Defines the permanent date picker behavior.
     */

    function PermanentMode(root, emit, opts) {
      var dp = BaseMode(root, emit, opts);

      dp.close = noop;
      dp.updateInput = noop;
      dp.shouldFocusOnRender = opts.shouldFocusOnRender;

      dp.computeSelectedDate = function () {
        return opts.hilightedDate;
      };

      dp.attachToDom = function () {
        root.appendChild(dp.el);
      };

      dp.open();

      return dp;
    }

    /**
     * @file Defines the various date picker modes (modal, dropdown, permanent)
     */

    function Mode(input, emit, opts) {
      input = input && input.tagName ? input : document.querySelector(input);

      if (opts.mode === 'dp-modal') {
        return ModalMode(input, emit, opts);
      }

      if (opts.mode === 'dp-below') {
        return DropdownMode(input, emit, opts);
      }

      if (opts.mode === 'dp-permanent') {
        return PermanentMode(input, emit, opts);
      }
    }

    /**
     * @file Defines simple event emitter behavior.
     */

    /**
     * Emitter constructs a new emitter object which has on/off methods.
     *
     * @returns {EventEmitter}
     */
    function Emitter() {
      var handlers = {};

      function onOne(name, handler) {
        (handlers[name] = (handlers[name] || [])).push(handler);
      }

      function onMany(fns) {
        for (var name in fns) {
          onOne(name, fns[name]);
        }
      }

      return {
        on: function (name, handler) {
          if (handler) {
            onOne(name, handler);
          } else {
            onMany(name);
          }

          return this;
        },

        emit: function (name, arg) {
          (handlers[name] || []).forEach(function (handler) {
            handler(name, arg);
          });
        },

        off: function (name, handler) {
          if (!name) {
            handlers = {};
          } else if (!handler) {
            handlers[name] = [];
          } else {
            handlers[name] = (handlers[name] || []).filter(function (h) {
              return h !== handler;
            });
          }

          return this;
        }
      };
    }

    /**
     * @file The root date picker file, defines public exports for the library.
     */

    /**
    * The date picker language configuration
    * @typedef {Object} LangOptions
    * @property {Array.<string>} [days] - Days of the week
    * @property {Array.<string>} [months] - Months of the year
    * @property {string} today - The label for the 'today' button
    * @property {string} close - The label for the 'close' button
    * @property {string} clear - The label for the 'clear' button
    */

    /**
    * The configuration options for a date picker.
    *
    * @typedef {Object} DatePickerOptions
    * @property {LangOptions} [lang] - Configures the label text, defaults to English
    * @property {('dp-modal'|'dp-below'|'dp-permanent')} [mode] - The date picker mode, defaults to 'dp-modal'
    * @property {(string|Date)} [hilightedDate] - The date to hilight if no date is selected
    * @property {function(string|Date):Date} [parse] - Parses a date, the complement of the "format" function
    * @property {function(Date):string} [format] - Formats a date for displaying to user
    * @property {function(Date):string} [dateClass] - Associates a custom CSS class with a date
    * @property {function(Date):boolean} [inRange] - Indicates whether or not a date is selectable
    * @property {(string|Date)} [min] - The minimum selectable date (inclusive, default 100 years ago)
    * @property {(string|Date)} [max] - The maximum selectable date (inclusive, default 100 years from now)
    */

    /**
    * The state values for the date picker
    *
    * @typedef {Object} DatePickerState
    * @property {string} view - The current view 'day' | 'month' | 'year'
    * @property {Date} selectedDate - The date which has been selected by the user
    * @property {Date} hilightedDate - The date which is currently hilighted / active
    */

    /**
    * An instance of TinyDatePicker
    *
    * @typedef {Object} DatePicker
    * @property {DatePickerState} state - The values currently displayed.
    * @property {function} on - Adds an event handler
    * @property {function} off - Removes an event handler
    * @property {function} setState - Changes the current state of the date picker
    * @property {function} open - Opens the date picker
    * @property {function} close - Closes the date picker
    * @property {function} destroy - Destroys the date picker (removing all handlers from the input, too)
    */

    /**
     * TinyDatePicker constructs a new date picker for the specified input
     *
     * @param {HTMLElement | string} input The input or CSS selector associated with the datepicker
     * @param {DatePickerOptions} opts The options for initializing the date picker
     * @returns {DatePicker}
     */
    function TinyDatePicker(input, opts) {
      var emitter = Emitter();
      var options = DatePickerOptions(opts);
      var mode = Mode(input, emit, options);
      var me = {
        get state() {
          return mode.state;
        },
        on: emitter.on,
        off: emitter.off,
        setState: mode.setState,
        open: mode.open,
        close: mode.close,
        destroy: mode.destroy,
      };

      function emit(evt) {
        emitter.emit(evt, me);
      }

      return me;
    }

    // A date range picker built on top of TinyDatePicker;

    var TinyDatePicker$1 = TinyDatePicker;

    /**
    * The state values for the date range picker
    *
    * @typedef {Object} DateRangeState
    * @property {Date} start - The start date (can be null)
    * @property {Date} end - The end date (can be null)
    */

    /**
    * An instance of TinyDatePicker
    *
    * @typedef {Object} DateRangePickerInst
    * @property {DateRangeState} state - The start / end dates
    * @property {function} on - Adds an event handler
    * @property {function} off - Removes an event handler
    * @property {function} setState - Changes the current state of the date picker
    */

    /**
     * TinyDatePicker constructs a new date picker for the specified input
     *
     * @param {HTMLElement} input The input associated with the datepicker
     * @returns {DateRangePickerInst}
     */
    function DateRangePicker(container, opts) {
      opts = opts || {};
      var emitter = Emitter();
      var root = renderInto(container);
      var hoverDate;
      var state = {
        start: undefined,
        end: undefined,
      };
      var start = TinyDatePicker(root.querySelector('.dr-cal-start'), cp({}, opts.startOpts, {
        mode: 'dp-permanent',
        dateClass: dateClass,
      }));
      var end = TinyDatePicker(root.querySelector('.dr-cal-end'), cp({}, opts.endOpts, {
        mode: 'dp-permanent',
        hilightedDate: shiftMonth(start.state.hilightedDate, 1),
        dateClass: dateClass,
      }));
      var handlers = {
        'statechange': onStateChange,
        'select': dateSelected,
      };
      var me = {
        state: state,
        setState: setState,
        on: emitter.on,
        off: emitter.off,
      };

      start.on(handlers);
      end.on(handlers);

      function onStateChange(_, dp) {
        var d1 = start.state.hilightedDate;
        var d2 = end.state.hilightedDate;
        var diff = diffMonths(d1, d2);

        if (diff === 1) {
          return;
        }

        if (dp === start) {
          end.setState({
            hilightedDate: shiftMonth(dp.state.hilightedDate, 1),
          });
        } else {
          start.setState({
            hilightedDate: shiftMonth(dp.state.hilightedDate, -1),
          });
        }
      }

      function dateSelected(_, dp) {
        var dt = dp.state.selectedDate;

        if (!state.start || state.end) {
          setState({
            start: dt,
            end: undefined,
          });
        } else {
          setState({
            start: dt > state.start ? state.start : dt,
            end: dt > state.start ? dt : state.start,
          });
        }
      }
      function setState(newState) {
        for (var key in newState) {
          state[key] = newState[key];
        }

        emitter.emit('statechange', me);
        rerender();
      }

      function rerender() {
        start.setState({});
        end.setState({});
      }

      // Hack to avoid a situation where iOS requires double-clicking to select
      if (!/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        root.addEventListener('mouseover', function mouseOverDate(e) {
          if (e.target.classList.contains('dp-day')) {
            var dt = new Date(parseInt(e.target.dataset.date));
            var changed = !datesEq(dt, hoverDate);
      
            if (changed) {
              hoverDate = dt;
              rerender();
            }
          }
        });
      }

      function dateClass(dt) {
        var rangeClass = (state.end || hoverDate) &&
                         state.start &&
                         inRange(dt, state.end || hoverDate, state.start);
        var selectedClass = datesEq(dt, state.start) || datesEq(dt, state.end);

        return (rangeClass ? 'dr-in-range ' : '') +
               (selectedClass ? 'dr-selected ' : '');
      }

      return me;
    }

    function renderInto(container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }

      container.innerHTML = '<div class="dr-cals">' +
        '<div class="dr-cal-start"></div>' +
        '<div class="dr-cal-end"></div>' +
        '</div>';

      return container.querySelector('.dr-cals');
    }

    function toMonths(dt) {
      return (dt.getYear() * 12) + dt.getMonth();
    }

    function diffMonths(d1, d2) {
      return toMonths(d2) - toMonths(d1);
    }

    function inRange(dt, start, end) {
      return (dt < end && dt >= start) || (dt <= start && dt > end);
    }

    function stringToTimeArray( timeStr ) {
        return timeStr.split(':').map(Number)
    }

    function timeArrayToString( timeArray ) {
        return timeArray.map( num => String(num || 0) ).map( str => str.padStart(2, '0') ).join(':')
    }

    function timeArrayToMinutes( timeArray ) {
        return timeArray[0] * 60 + timeArray[1]
    }

    var dateMixin = {

        props: {

            min: {
                type: [String, Number, Object]
            },

            max: {
                type: [String, Number, Object]
            },

            yearRange: {
                type: Number,
                default: 4
            },

            dayOffset: {
                type: Number,
                default: 1
            },

            format: {
                type: String,
                default: 'MM/DD/YYYY'
            },

            disabled: {
                type: [Boolean, Array],
                default: false
            },

            lang: Object
        },


        data() {
            return {
                picker: null,
                isOpened: false
            }
        },


        computed: {

            isDisabledArray() {
                return Array.isArray(this.disabled)
            },

            disabledDates() {
                return this.isDisabledArray ?
                    this.disabled.map( str => new Date(str).setHours(0,0,0,0) ) :
                    []
            }
        },


        methods: {

            _getPickerOptions() {
                let offset = this.yearRange * 31536000000;
                let now = new Date().getTime();

                let min = this.min && this.$dayjs(this.min).toDate();
                let max = this.max && this.$dayjs(this.max).toDate();

                min = min && min.getTime() ? min : new Date(now - offset);
                max = max && max.getTime() ? max : new Date(now + offset);

                return {
                    min,
                    max,
                    dayOffset: this.dayOffset,
                    lang: Object.assign({}, this.$lang.FORMS_DATEPICKER, this.lang),
                    dateClass: currentDate => {
                        // check disabled
                        if ( this.disabled !== false && this.isDisabledArray ) {
                            return this.disabledDates.includes( currentDate.getTime() ) ? 'dp-day-disabled' : ''
                        } else if ( this.disabled ) {
                            return 'dp-day-disabled'
                        } else {
                            return ''
                        }
                    },
                }
            },

            showPicker() {
                this.isOpened = true;
            },

            hidePicker() {
                this.isOpened = false;
            },

            _focusoutHandler($event) {

                clearTimeout(this.__showPicker);

                this.__showPicker = setTimeout(() => {
                    if ( !this.$el.contains(document.activeElement) ) {
                        this.hidePicker();
                    }
                }, 10);
            }
        }
    };

    //

    var script$g = {

        name: 'TimeRange',


        props: {

            value: String,

            min: {
                type: String,
                default: '00:00' // 24h format
            },

            max: String,

            step: {
                type: [String, Number],
                default: 30 // minutes
            },

            disabled: {
                type: [Boolean, Array],
                default: false
            }
        },


        computed: {

            endTimeMinutes() {
                return this.max && timeArrayToMinutes(stringToTimeArray(this.max))
            },

            timeIntervals() {
                let intervals = [];
                let current = stringToTimeArray(this.min);

                while ( current[0] < 24 && this._inRange(current) ) {
                    intervals.push( timeArrayToString(current) );
                    current = this._nextPeriod( current );
                }

                return intervals
            }
        },


        methods: {

            _nextPeriod( prevTimeArray ) {
                let [hours, minutes] = prevTimeArray;

                minutes = minutes + Number(this.step);

                if ( minutes >= 60 ) {
                    let _hours = Math.floor( minutes / 60 );
                    minutes = minutes - _hours * 60;
                    hours = hours + _hours;
                }

                return [hours, minutes]
            },

            _inRange( timeArray ) {
                if ( ! this.endTimeMinutes ) {
                    return true
                }
                return timeArrayToMinutes(timeArray) <= this.endTimeMinutes
            },

            _isDisabled( timeStr ) {
                return Array.isArray(this.disabled) ? this.disabled.indexOf(timeStr) > -1 : this.disabled
            }
        }
    };

    /* script */
    const __vue_script__$g = script$g;

    /* template */
    var __vue_render__$g = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "time-range" }, [
        _c(
          "ul",
          { staticClass: "time-range__intervals" },
          _vm._l(_vm.timeIntervals, function(interval) {
            return _c(
              "li",
              { key: interval, staticClass: "time-range__interval" },
              [
                _c(
                  "button",
                  {
                    staticClass: "time-range__button",
                    class: {
                      "is-current": _vm.value === interval,
                      "is-disabled": _vm._isDisabled(interval)
                    },
                    attrs: { type: "button", disabled: _vm._isDisabled(interval) },
                    on: {
                      click: function($event) {
                        _vm._isDisabled(interval)
                          ? null
                          : _vm.$emit("input", interval);
                      }
                    }
                  },
                  [_vm._v(" " + _vm._s(interval) + " ")]
                )
              ]
            )
          }),
          0
        )
      ])
    };
    var __vue_staticRenderFns__$g = [];
    __vue_render__$g._withStripped = true;

      /* style */
      const __vue_inject_styles__$g = undefined;
      /* scoped */
      const __vue_scope_id__$g = undefined;
      /* module identifier */
      const __vue_module_identifier__$g = undefined;
      /* functional template */
      const __vue_is_functional_template__$g = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var TimeRange = normalizeComponent_1(
        { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
        __vue_inject_styles__$g,
        __vue_script__$g,
        __vue_scope_id__$g,
        __vue_is_functional_template__$g,
        __vue_module_identifier__$g,
        undefined,
        undefined
      );

    //

    var script$h = {

        name: 'fb-date',

        mixins: [ fieldMixin, dateMixin ],


        props: {

            value: String,

            timeRange: {
                type: [Boolean, Object],
                default: true
            },

            format: {
                type: String,
                default() {
                    let props = this.$options.propsData;
                    if ( props.timeRange === false ) {
                        return 'MM/DD/YYYY'
                    }
                    return 'MM/DD/YYYY HH:mm'
                }
            }
        },


        data() {
            return {
                inputError: undefined
            }
        },


        components: {
            TimeRange
        },


        computed: {

            date: {

                get() {
                    return this.formId ? this.formValue : this.value
                },

                set(value) {
                    value = this.$dayjs(value);
                    value = value.isValid() ? value.format(!this.hasTime && 'YYYY-MM-DD') : '';
                    if ( this.formId ) {
                        this.formValue = value;
                    } else {
                        this.$emit('input', value);
                    }
                }
            },

            time: {

                get() {
                    let current = this.parse(this.date);
                    return timeArrayToString([current.getHours(), current.getMinutes()])
                },

                set(time) {
                    let date = this._addTime( this.parseOrNow(this.date), time );
                    this.date = date;
                }
            },

            dateFormatted() {
                return this.date && this.$dayjs(this.date).format(this.format) || ''
            },

            hasTime() {
                return !! this.timeRange
            },

            timeRangeOptions() {
                return AWES.utils.object.isObject( this.timeRange ) ? this.timeRange : {}
            },

            isDisabled() {
                return this.formLoading || this.isMultiblockDisabled || ! Array.isArray(this.disabled) && this.disabled
            },

            error() {
                return this.inputError
            }
        },


        methods: {


            init() {
                const OPTIONS = this._getPickerOptions();
                OPTIONS.mode = 'dp-permanent';
                this.picker = new TinyDatePicker$1(this.$refs.picker, OPTIONS);

                this.$watch('date', {
                    handler() {
                        let selectedDate = this.parse(this.date);
                        selectedDate.setHours(0,0,0,0);
                        this.picker.setState({ selectedDate });
                    },
                    immediate: true
                });
                
                this.picker.on('select', this._setDate);
            },

            parse(input) {
                return this.$dayjs(input).toDate()
            },

            parseOrNow(input) {
                let _parsed = this.$dayjs(input);
                return _parsed.isValid() ? _parsed.toDate() : new Date()
            },

            _addTime(date, timeString) {
                let timeArray = stringToTimeArray(timeString);
                date = this.parse(date);
                date.setHours(...timeArray);
                return date
            },

            _setDate($event, { state }) {
                if ( !! this.timeRange ) {
                    let date = this._addTime(state.selectedDate, this.time);
                    this.date = date;
                } else {
                    this.date = state.selectedDate;
                    this.hidePicker();
                }
            },

            _calendarClickHandler($event) {
                let target = $event.target;
                if ( target.className === 'dp-close' ) {
                    this.hidePicker();
                }
            }
        },


        mounted() {
            this.$nextTick(this.init);
        }
    };

    /* script */
    const __vue_script__$h = script$h;

    /* template */
    var __vue_render__$h = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-date fb-element",
          on: { focusout: _vm._focusoutHandler }
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "label",
                {
                  staticClass: "fb-input fb-date__fb-input",
                  class: {
                    "fb-input_disabled": _vm.isDisabled,
                    "fb-input_active": _vm.dateFormatted,
                    "fb-input_error": _vm.hasError,
                    "animated shake": _vm.shake
                  }
                },
                [
                  _c(
                    "span",
                    { staticClass: "fb-input__label fb-input__label_field" },
                    [_vm._v(" " + _vm._s(_vm.label) + " ")]
                  ),
                  _c("input", {
                    ref: "element",
                    staticClass: "fb-input__field",
                    class: {
                      "is-focusable": _vm.isFocusable,
                      "in-focus": _vm.inFocus,
                      "has-label": _vm.label
                    },
                    attrs: { disabled: _vm.isDisabled, readonly: "" },
                    domProps: { value: _vm.dateFormatted },
                    on: { focus: _vm.showPicker, blur: _vm._focusoutHandler }
                  })
                ]
              )
            ]
          ),
          _c(
            "div",
            {
              staticClass: "fb-date__picker",
              class: { "has-time": _vm.hasTime, "is-opened": _vm.isOpened }
            },
            [
              _c("div", {
                ref: "picker",
                staticClass: "dp-wrapper",
                on: { click: _vm._calendarClickHandler }
              }),
              _vm.hasTime
                ? _c(
                    "time-range",
                    _vm._b(
                      {
                        staticClass: "fb-date__time-range",
                        model: {
                          value: _vm.time,
                          callback: function($$v) {
                            _vm.time = $$v;
                          },
                          expression: "time"
                        }
                      },
                      "time-range",
                      _vm.timeRangeOptions,
                      false
                    )
                  )
                : _vm._e()
            ],
            1
          ),
          _c("fb-input", {
            attrs: { name: _vm.realName, type: "hidden" },
            on: {
              error: function(err) {
                return (_vm.inputError = err)
              }
            }
          })
        ],
        1
      )
    };
    var __vue_staticRenderFns__$h = [];
    __vue_render__$h._withStripped = true;

      /* style */
      const __vue_inject_styles__$h = undefined;
      /* scoped */
      const __vue_scope_id__$h = undefined;
      /* module identifier */
      const __vue_module_identifier__$h = undefined;
      /* functional template */
      const __vue_is_functional_template__$h = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbDate = normalizeComponent_1(
        { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
        __vue_inject_styles__$h,
        __vue_script__$h,
        __vue_scope_id__$h,
        __vue_is_functional_template__$h,
        __vue_module_identifier__$h,
        undefined,
        undefined
      );

    //

    var script$i = {

        name: 'fb-date-range',

        mixins: [ baseMixin, dateMixin, errorMixin ],


        props: {

            labelStart: String,

            labelEnd: String,

            valueStart: String,

            valueEnd: String
        },


        data() {
            return {
                startError: null,
                endError: null
            }
        },


        computed: {

            startName() {
                return this.realName + '_start'
            },

            endName() {
                return this.realName + '_end'
            },

            startDate: {

                get() {
                    let value = this.formId ?
                        this.$store.getters['forms/fieldValue'](this.formId, this.startName) :
                        this.valueStart;
                    return value && this.$dayjs(value).toDate() || ''
                },

                set(value) {
                    let isoValue = value && value.toISOString();
                    if ( this.formId ) {
                        this._setField( this.startName, isoValue );
                    } else {
                        this.$emit('input', { start: value, end: this.valueEnd });
                    }
                }
            },

            startDateFormatted() {
                return this.startDate && this.$dayjs(this.startDate).format(this.format) || ''
            },

            endDate: {

                get() {
                    let value = this.formId ?
                        this.$store.getters['forms/fieldValue'](this.formId, this.endName) :
                        this.valueEnd;
                    return value && this.$dayjs(value).toDate() || ''
                },

                set(value) {
                    let isoValue = value && value.toISOString();
                    if ( this.formId ) {
                        this._setField( this.endName, isoValue );
                    } else {
                        this.$emit('input', { start: this.valueStart, end: value });
                    }
                }
            },

            endDateFormatted() {
                return this.endDate && this.$dayjs(this.endDate).format(this.format) || ''
            },

            error() {
                return [this.startError, this.endError]
            }
        },


        methods: {

            init() {
                const OPTIONS = this._getPickerOptions();
                this.picker = new DateRangePicker(this.$refs.picker, { startOpts: OPTIONS, endOpts: OPTIONS });
                this.picker.setState({ start: this.startDate, end: this.endDate });

                this.$watch('startDate', start => {
                    this.picker.setState({ start, end: this.endDate });
                });

                this.$watch('endDate', end => {
                    this.picker.setState({ start: this.startDate, end });
                });

                this.picker.on('statechange', this._setDates);
            },

            _setDates($event, { state }) {
                this.startDate = state.start;
                this.endDate = state.end;
                if ( state.end ) {
                    this.hidePicker();
                }
            },

            _setField( fieldName, value ) {
                this.$store.commit('forms/setFieldValue', {
                    formName: this.formId,
                    fieldName,
                    value
                });
            },

            setFocus(state) {
                try {
                    let useMethod = (state !== false) ? 'focus' : 'blur';
                    this.$refs.element[useMethod]();
                } catch (e) {
                    console.warn('Error while setting focus');
                    console.error(e);
                }
            }
        },


        mounted() {
            this.init();
        }
    };

    /* script */
    const __vue_script__$i = script$i;

    /* template */
    var __vue_render__$i = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-date is-range fb-element",
          on: { focusout: _vm._focusoutHandler }
        },
        [
          _c(
            "label",
            {
              staticClass: "fb-input fb-date__fb-input",
              class: {
                "fb-input_disabled": _vm.isDisabled,
                "fb-input_active": _vm.startDateFormatted,
                "fb-input_error": _vm.hasError && _vm.error[0],
                "animated shake": _vm.shake && _vm.error[0]
              }
            },
            [
              _c("fb-error-wrap", {
                attrs: {
                  open: _vm.showTooltip && !!_vm.error[0],
                  error: _vm.error[0]
                },
                on: { clickTooltip: _vm.clickTooltip }
              }),
              _c("span", { staticClass: "fb-input__label fb-input__label_field" }, [
                _vm._v(
                  " " +
                    _vm._s(
                      _vm.labelStart || _vm.$lang.FORMS_DATERANGE_START_LABEL
                    ) +
                    " "
                )
              ]),
              _c("input", {
                ref: "element",
                staticClass: "fb-input__field has-label",
                attrs: { disabled: _vm.isDisabled, readonly: "" },
                domProps: { value: _vm.startDateFormatted },
                on: { focus: _vm.showPicker, blur: _vm._focusoutHandler }
              })
            ],
            1
          ),
          _c(
            "label",
            {
              staticClass: "fb-input fb-date__fb-input",
              class: {
                "fb-input_disabled": _vm.isDisabled,
                "fb-input_active": _vm.endDateFormatted,
                "fb-input_error": _vm.hasError && _vm.error[1],
                "animated shake": _vm.shake && _vm.error[1]
              }
            },
            [
              _c("fb-error-wrap", {
                attrs: {
                  open: _vm.showTooltip && !!_vm.error[1],
                  error: _vm.error[1]
                },
                on: { clickTooltip: _vm.clickTooltip }
              }),
              _c("span", { staticClass: "fb-input__label fb-input__label_field" }, [
                _vm._v(
                  " " +
                    _vm._s(_vm.labelEnd || _vm.$lang.FORMS_DATERANGE_END_LABEL) +
                    " "
                )
              ]),
              _c("input", {
                staticClass: "fb-input__field has-label",
                attrs: { disabled: _vm.isDisabled, readonly: "" },
                domProps: { value: _vm.endDateFormatted },
                on: { focus: _vm.showPicker, blur: _vm._focusoutHandler }
              })
            ],
            1
          ),
          _c("div", {
            ref: "picker",
            staticClass: "fb-date__picker",
            class: { "is-opened": _vm.isOpened }
          }),
          _c("fb-input", {
            attrs: { name: _vm.startName, value: _vm.valueStart, type: "hidden" },
            on: {
              error: function(err) {
                return (_vm.startError = err)
              }
            }
          }),
          _c("fb-input", {
            attrs: { name: _vm.endName, value: _vm.valueEnd, type: "hidden" },
            on: {
              error: function(err) {
                return (_vm.endError = err)
              }
            }
          })
        ],
        1
      )
    };
    var __vue_staticRenderFns__$i = [];
    __vue_render__$i._withStripped = true;

      /* style */
      const __vue_inject_styles__$i = undefined;
      /* scoped */
      const __vue_scope_id__$i = undefined;
      /* module identifier */
      const __vue_module_identifier__$i = undefined;
      /* functional template */
      const __vue_is_functional_template__$i = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbDateRange = normalizeComponent_1(
        { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
        __vue_inject_styles__$i,
        __vue_script__$i,
        __vue_scope_id__$i,
        __vue_is_functional_template__$i,
        __vue_module_identifier__$i,
        undefined,
        undefined
      );

    const weekdaysNames = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];


    /**
     * Creates an array of 42 days to display a calendar
     * 
     * @param  {number} month            from `0` to `11` - month to render, required
     * @param  {number} year             in `XXXX` format - year to render, required
     * @param  {number} [firstDay = 0]   from 0 to 6, e.g. `0 === Sunday`, `1 === Monday`, ...
     *                                   default `0`
     * 
     * @return {Array<Date>}             Array of Date objects of given month and year
     *                                   with edge days to fullfill 6 x 7 square table
     */
    function getCalendarDays(month, year, firstDay = 0) {
      
        const result = [];

        let day = new Date(`${month + 1} 1 ${year}`);

        // Modify first day if not correct
        if (day.getDay() !== firstDay) {
            day.setDate(firstDay - day.getDay() + 1);
        }

        // 6 weeks always displayed to keep size
        for (let i = 0; i < (6 * 7); ++i) {
            result.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }

        return result;
    }

    /**
     * Detects if the given value is an object
     *
     * @param {*} val - a variable to check
     *
     */

    function isObject(val) {
        return val != null && typeof val === 'object'
    }


    /**
     * Creates an array by splitting given path to object's value
     *
     * @param {String} path - Path to value in object
     *
     * @returns {Array} Array of levels to object
     *
     * @example
     * // returns ['some', 'nested', '0', 'value']
     * pathToArr('some.nested[0].value')
     * pathToArr('some.nested.0.value')
     *
     */

    function pathToArr(path) {
        return path.split(/(?:\]?\.|\[['"]?|['"]?\])/g).filter(part => part !== '')
    }


    /**
     * Get a value by given path
     *
     * @param {Object} obj - object to search
     * @param {String} path - path to level
     * @param {*} defaultValue - default value if nothig found
     *
     * @returns {*} value of given path in object
     */

    function get(obj, path, defaultValue) {

        if ( ! isObject(obj) ) {
            console.warn('get supports only objects, ', obj, ' given');
            return defaultValue
        }

        // create a path array of levels from a key
        path = pathToArr(path);

        let current = obj, value;

        while (path.length && current) {
            let key = path.shift();
            if (path.length) {
                current = current[key];
            } else {
                value = current[key];
            }
        }

        return typeof value !== 'undefined' ? value : defaultValue
    }

    var i18nMixin = {

        props: {

            lang: Object
        },

        computed: {

            '$lang': function() {
                return { ...this.lang, ...get(this.$options, '_config.lang', {}) }
            }
        }
    };

    //

    var script$j = {

        name: 'ui-calendar',


        mixins: [ i18nMixin ],


        _config: {
            lang: {
                weekdays: weekdaysNames
            }
        },


        props: {
        
            month: {
                type: Number,
                default() {
                    return new Date().getMonth()
                }
            },
            
            year: {
                type: Number,
                default() {
                    return new Date().getFullYear()
                }
            },
             
            firstDay: {
                type: Number,
                default: 0,
                validator(dayNum) {
                    return dayNum > -1 && dayNum < 7
                }
            },
            
            value: [Array, Date, String, Number]
        },


        computed: {
        
            days() {
                return getCalendarDays(this.month, this.year, this.firstDay)
                    .map( date => {
                        let timestamp = date.getTime();
                        return {
                            date,
                            timestamp,
                            isSelected: this.selected.includes(timestamp),
                            isEdge: date.getMonth() !== +this.month
                        }
                    })
            },

            weekdays() {
                return this.days.slice(0,7)
                    .map( ({ date }) => this.$lang.weekdays[date.getDay()] )
            },

            selected() {
                return Array.isArray(this.value) ? 
                    this.value.map( this._toTimeStamp ) :
                    [ this._toDayTimeStamp(this.value) ]
            }
        },


        methods: {

            _toDayTimeStamp(input) {
                return new Date(input).setHours(0,0,0,0)
            }
        }
    };

    /* script */
    const __vue_script__$j = script$j;

    /* template */
    var __vue_render__$j = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "ui-calendar" }, [
        _c(
          "div",
          { staticClass: "ui-calendar__weekdays" },
          [
            _vm._l(_vm.weekdays, function(weekday) {
              return [
                _vm._t(
                  "weekday",
                  [
                    _c(
                      "span",
                      { key: weekday, staticClass: "ui-calendar__weekday" },
                      [_vm._v(" " + _vm._s(weekday) + " ")]
                    )
                  ],
                  { weekday: weekday }
                )
              ]
            })
          ],
          2
        ),
        _c(
          "div",
          { staticClass: "ui-calendar__days" },
          [
            _vm._l(this.days, function(ref) {
              var date = ref.date;
              var timestamp = ref.timestamp;
              var isSelected = ref.isSelected;
              var isEdge = ref.isEdge;
              return [
                _vm._t(
                  "day",
                  [
                    _c(
                      "button",
                      {
                        key: timestamp,
                        staticClass: "ui-calendar__day",
                        class: {
                          "is-selected": isSelected,
                          "is-edge": isEdge
                        },
                        on: {
                          click: function($event) {
                            !isEdge &&
                              _vm.$emit("input", {
                                date: date,
                                timestamp: timestamp,
                                isSelected: isSelected
                              });
                          }
                        }
                      },
                      [_vm._v(" " + _vm._s(date.getDate()) + " ")]
                    )
                  ],
                  null,
                  {
                    date: date,
                    timestamp: timestamp,
                    isSelected: isSelected,
                    isEdge: isEdge
                  }
                )
              ]
            })
          ],
          2
        )
      ])
    };
    var __vue_staticRenderFns__$j = [];
    __vue_render__$j._withStripped = true;

      /* style */
      const __vue_inject_styles__$j = undefined;
      /* scoped */
      const __vue_scope_id__$j = undefined;
      /* module identifier */
      const __vue_module_identifier__$j = undefined;
      /* functional template */
      const __vue_is_functional_template__$j = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var uiCalendar = normalizeComponent_1(
        { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
        __vue_inject_styles__$j,
        __vue_script__$j,
        __vue_scope_id__$j,
        __vue_is_functional_template__$j,
        __vue_module_identifier__$j,
        undefined,
        undefined
      );

    //

    var script$k = {

        name: 'fb-reservation',


        mixins: [ baseMixin, errorMixin ],


        components: { uiCalendar },


        props: {

            url: {
                type: String,
                required: true
            },

            firstDay: {
                type: Number,
                default: 1
            }
        },


        data() {
            return {
                timeZone: null,
                isLoading: false,
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                today: new Date().setHours(0,0,0,0),
                date: null,
                time: null,
                showTime: false,
                is24hFormat: true,
                days: [],
                inputError: undefined
            }
        },


        computed: {

            selected: {

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

            monthName() {
                return this.$lang.FORMS_DATEPICKER.months[this.month]
            },

            dateInfo() {
                if ( this.date ) {

                    let day = this.date.getDate();
                    let year = this.date.getFullYear();
                    let month = this.date.getMonth();
                    let weekDay = this.date.getDay();

                    return {
                        weekdayName: this.$lang.FORMS_DATEPICKER.daysFull[weekDay],
                        monthName: this.$lang.FORMS_DATEPICKER.months[month],
                        day,
                        year,
                        datetime: this._formatDatestring( this.date )
                    }
                } else {
                    return {} // stub
                }
            },

            availableDays() {

                let _days = {};

                this.days.forEach( day => {

                    if ( day.status !== 'available' ) return

                    let _date = this._parseDatestring(day.date);

                    _days[ _date.getTime() ] = day.spots;
                });

                return _days
            },

            availableTime() {

                if ( this.date ) {
                    return this.$get(this.availableDays, `${this.date.getTime()}`, [])
                        .map( ({ start_time, status }) => {

                            let _date = this.$dayjs(start_time);

                            return {
                                format24h: _date.format('HH:mm'),
                                format12h: _date.format('hh:mm A'),
                                start_time,
                                status
                            }
                        })
                }

                return null
            },

            prevButtonDisabled() {
                let _today = new Date(this.today);
                return this.year === _today.getFullYear() &&
                    this.month === _today.getMonth()
            }
        },


        methods: {

            fetchData() {
                AWES.on('core:ajax', this._showLoader);

                let range_start = this.$dayjs(new Date(this.year, this.month)).set('date', 1);
                let range_end = range_start.add(1, 'month');
                range_start = this._formatDatestring(range_start);
                range_end = this._formatDatestring(range_end);

                AWES.ajax({timezone: this.timeZone, range_start, range_end}, this.url, 'GET')
                    .then( ({ data }) => {
                        this.days = this.$get(data, 'data.days', []);
                        this.today = this._parseDatestring( this.$get(data, 'data.today') ).getTime();
                        this.is24hFormat = this.$get(data, 'data.format') === '24h';
                    })
                    .finally(() => {
                        this.isLoading = false;
                        AWES.off('core:ajax', this._showLoader);
                    });
            },

            _showLoader($event) {
                let { url, active } = $event.detail;
                if ( this.url === url ) {
                    this.isLoading = active;
                }
            },

            _parseDatestring(str) {
                return this.$dayjs(str, 'YYYY-MM-DD').toDate()
            },

            _formatDatestring(date) {
                return this.$dayjs(date).format('YYYY-MM-DD')
            },

            _setDate($event) {
                const calendarDate = new Date(+$event.target.getAttribute('data-date'));
                this.date = calendarDate;
                this.time = null;
                this.selected = undefined;
                this.showTime = true;
            },

            _setTime($event) {
                const time = $event.target.getAttribute('data-time');
                if ( ! time ) return
                this.time = time;
                const [hours, minutes] = time.split(':');
                let date = new Date(this.date);
                this.selected = this.$dayjs(date.setHours(hours, minutes, 0, 0)).format('YYYY-MM-DDTHH:mm:ssZ');
            },

            setMonth(month) {
                switch (month) {
                    case -1:
                        this.month = 11;
                        this.year -= 1;
                        break
                    case 12:
                        this.month = 0;
                        this.year += 1;
                        break
                    default:
                        this.month = month;
                }
                this.fetchData();
            },

            _handleError(err) {
                if ( ! AWES.utils.object.isEmpty(err) ) {
                    this.inputError = err;
                }
            },

            clickTooltip() {
                this.showTooltip = false;
                this.inputError = undefined;
            },
        },


        beforeMount() {
            if ( window.Intl ) {
                this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
        },


        mounted() {
            this.$nextTick(() => {
                if ( this.selected ) {
                    let selected = this.$dayjs(this.selected);
                    this.date = new Date( selected.toDate().setHours(0,0,0,0) );
                    this.time = selected.format('HH:mm');
                }
                this.fetchData();
            });
        }
    };

    /* script */
    const __vue_script__$k = script$k;

    /* template */
    var __vue_render__$k = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "fb-reservation fb-element",
          class: { "has-error": _vm.hasError },
          attrs: { tabindex: "0" }
        },
        [
          _c("fb-error-wrap", {
            staticClass: "fb-reservation__error",
            attrs: { open: _vm.showTooltip, error: _vm.error },
            on: { clickTooltip: _vm.clickTooltip }
          }),
          _vm._t("title"),
          _c(
            "div",
            {
              staticClass: "fb-reservation__calendar",
              class: { "is-visible": !_vm.showTime }
            },
            [
              _c("div", { staticClass: "ui-calendar__header" }, [
                _c(
                  "time",
                  {
                    staticClass: "ui-calendar__caption",
                    attrs: { datetime: _vm.year + "-" + (_vm.month + 1) }
                  },
                  [
                    _vm._v(
                      " " + _vm._s(_vm.monthName) + " " + _vm._s(_vm.year) + " "
                    )
                  ]
                ),
                _c(
                  "button",
                  {
                    staticClass: "ui-calendar__button is-prev",
                    attrs: { disabled: _vm.prevButtonDisabled, type: "button" },
                    on: {
                      click: function($event) {
                        return _vm.setMonth(_vm.month - 1)
                      }
                    }
                  },
                  [_vm._v(" previouse month ")]
                ),
                _c(
                  "button",
                  {
                    staticClass: "ui-calendar__button is-next",
                    attrs: { type: "button" },
                    on: {
                      click: function($event) {
                        return _vm.setMonth(_vm.month + 1)
                      }
                    }
                  },
                  [_vm._v(" next month ")]
                )
              ]),
              _c(
                "ui-calendar",
                _vm._b(
                  {
                    staticClass: "fb-reservation__ui-calendar",
                    attrs: {
                      value: _vm.date,
                      lang: { weekdays: _vm.$lang.FORMS_DATEPICKER.days }
                    },
                    scopedSlots: _vm._u([
                      {
                        key: "day",
                        fn: function(ref) {
                          var calendarDate = ref.date;
                          var timestamp = ref.timestamp;
                          var isSelected = ref.isSelected;
                          var isEdge = ref.isEdge;
                          return _c(
                            "button",
                            _vm._g(
                              {
                                staticClass: "ui-calendar__day",
                                class: {
                                  "is-edge": isEdge,
                                  "is-selected": isSelected,
                                  "is-today": timestamp === _vm.today,
                                  "is-disabled": !_vm.availableDays[timestamp]
                                },
                                attrs: {
                                  disabled: !_vm.availableDays[timestamp],
                                  type: "button",
                                  "data-date": isEdge ? null : timestamp
                                }
                              },
                              isEdge || !_vm.availableDays[timestamp]
                                ? {}
                                : { click: _vm._setDate }
                            ),
                            [_vm._v(" " + _vm._s(calendarDate.getDate()) + " ")]
                          )
                        }
                      }
                    ])
                  },
                  "ui-calendar",
                  { month: _vm.month, year: _vm.year, firstDay: _vm.firstDay },
                  false
                )
              )
            ],
            1
          ),
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: !!_vm.date,
                  expression: "!! date"
                }
              ],
              staticClass: "fb-reservation__time",
              class: { "is-visible": _vm.showTime }
            },
            [
              _c("div", { staticClass: "ui-calendar__header" }, [
                _c(
                  "button",
                  {
                    staticClass:
                      "ui-calendar__button is-prev fb-reservation__hide-time",
                    attrs: { type: "button" },
                    on: {
                      click: function($event) {
                        _vm.showTime = false;
                      }
                    }
                  },
                  [_vm._v(" show datepicker ")]
                ),
                _c(
                  "time",
                  {
                    staticClass: "ui-calendar__caption",
                    attrs: { datetime: _vm.dateInfo.datetime }
                  },
                  [
                    _vm._t(
                      "time-header",
                      [
                        _vm._v(
                          " " +
                            _vm._s(_vm.dateInfo.weekdayName) +
                            ", " +
                            _vm._s(_vm.dateInfo.monthName) +
                            " " +
                            _vm._s(_vm.dateInfo.day) +
                            " "
                        ),
                        _c(
                          "span",
                          { staticClass: "fb-reservation__caption-year" },
                          [_vm._v(_vm._s(_vm.dateInfo.year))]
                        )
                      ],
                      null,
                      _vm.dateInfo
                    )
                  ],
                  2
                )
              ]),
              _c("div", { staticClass: "ui-calendar__time-range" }, [
                _vm.availableTime
                  ? _c(
                      "ul",
                      { on: { click: _vm._setTime } },
                      _vm._l(_vm.availableTime, function(ref) {
                        var time_start = ref.time_start;
                        var status = ref.status;
                        var format24h = ref.format24h;
                        var format12h = ref.format12h;
                        return _c("li", { key: time_start }, [
                          _c(
                            "button",
                            {
                              staticClass: "ui-calendar__button",
                              class: [
                                {
                                  "is-selected": _vm.time === format24h,
                                  "is-disabled": status !== "available"
                                },
                                "is-" + status
                              ],
                              attrs: {
                                type: "button",
                                disabled: status !== "available",
                                "data-time": format24h
                              }
                            },
                            [
                              _vm._v(
                                " " +
                                  _vm._s(_vm.is24hFormat ? format24h : format12h) +
                                  " "
                              )
                            ]
                          )
                        ])
                      }),
                      0
                    )
                  : _vm._e()
              ])
            ]
          ),
          _c("fb-input", {
            attrs: { name: _vm.realName, type: "hidden" },
            on: { error: _vm._handleError }
          }),
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isLoading,
                  expression: "isLoading"
                }
              ],
              staticClass: "fb-reservation__loading"
            },
            [_vm._t("loading", [_vm._v(" Loading... ")])],
            2
          )
        ],
        2
      )
    };
    var __vue_staticRenderFns__$k = [];
    __vue_render__$k._withStripped = true;

      /* style */
      const __vue_inject_styles__$k = undefined;
      /* scoped */
      const __vue_scope_id__$k = undefined;
      /* module identifier */
      const __vue_module_identifier__$k = undefined;
      /* functional template */
      const __vue_is_functional_template__$k = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var FbReservation = normalizeComponent_1(
        { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
        __vue_inject_styles__$k,
        __vue_script__$k,
        __vue_scope_id__$k,
        __vue_is_functional_template__$k,
        __vue_module_identifier__$k,
        undefined,
        undefined
      );

    //

    var script$l = {

        name: 'fb-reservation-dropdown',


        extends: FbReservation,


        mixins: [ focusMixin, dateMixin ],


        props: {

            format: {
                type: String,
                default: 'MM/DD/YYYY HH:mm'
            },

            label: String
        },


        data() {
            return {
                inputError: undefined
            }
        },


        computed: {

            dateFormatted() {
                return this.selected && this.$dayjs(this.selected).format(this.format) || ''
            }
        },


        watch: {

            selected(newValue, oldValue) {

                if ( newValue /*&& ! oldValue*/ ) {
                    this.hidePicker();
                }
            },

            isOpened(isOpened) {
                if ( isOpened ) {
                    this._setClickWatcher();
                } else {
                    this._unsetClickWatcher();
                }
            }
        },


        methods: {

            _setClickWatcher() {
                setTimeout( () => {
                    document.addEventListener('click', this._offClickHandler, true);
                }, 10);
            },

            _unsetClickWatcher() {
                document.removeEventListener('click', this._offClickHandler, true);
            },

            _offClickHandler($event) {
                if ( $event.target !== this.$el && ! this.$el.contains($event.target) ) {
                    this.hidePicker();
                }
            }
        },


        beforeDestroy() {
            this._unsetClickWatcher();
        }
    };

    /* script */
    const __vue_script__$l = script$l;

    /* template */
    var __vue_render__$l = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "fb-date fb-element" },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.showTooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "label",
                {
                  staticClass: "fb-input fb-date__fb-input",
                  class: {
                    "fb-input_disabled": _vm.isDisabled,
                    "fb-input_active": _vm.dateFormatted,
                    "fb-input_error": _vm.hasError,
                    "animated shake": _vm.shake
                  }
                },
                [
                  _c(
                    "span",
                    { staticClass: "fb-input__label fb-input__label_field" },
                    [_vm._v(" " + _vm._s(_vm.label) + " ")]
                  ),
                  _c("input", {
                    ref: "element",
                    staticClass: "fb-input__field",
                    class: {
                      "is-focusable": _vm.isFocusable,
                      "in-focus": _vm.inFocus,
                      "has-label": _vm.label
                    },
                    attrs: { disabled: _vm.isDisabled, readonly: "" },
                    domProps: { value: _vm.dateFormatted },
                    on: { focus: _vm.showPicker }
                  })
                ]
              )
            ]
          ),
          _c(
            "div",
            {
              staticClass: "fb-date__picker is-reservation",
              class: { "is-opened": _vm.isOpened }
            },
            [
              _c("div", { staticClass: "fb-reservation" }, [
                _c(
                  "div",
                  {
                    staticClass: "fb-reservation__calendar",
                    class: { "is-visible": !_vm.showTime }
                  },
                  [
                    _c("div", { staticClass: "ui-calendar__header" }, [
                      _c(
                        "time",
                        {
                          staticClass: "ui-calendar__caption",
                          attrs: { datetime: _vm.year + "-" + (_vm.month + 1) }
                        },
                        [
                          _vm._v(
                            " " +
                              _vm._s(_vm.monthName) +
                              " " +
                              _vm._s(_vm.year) +
                              " "
                          )
                        ]
                      ),
                      _c(
                        "button",
                        {
                          staticClass: "ui-calendar__button is-prev",
                          attrs: {
                            disabled: _vm.prevButtonDisabled,
                            type: "button"
                          },
                          on: {
                            click: function($event) {
                              return _vm.setMonth(_vm.month - 1)
                            }
                          }
                        },
                        [_vm._v(" previouse month ")]
                      ),
                      _c(
                        "button",
                        {
                          staticClass: "ui-calendar__button is-next",
                          attrs: { type: "button" },
                          on: {
                            click: function($event) {
                              return _vm.setMonth(_vm.month + 1)
                            }
                          }
                        },
                        [_vm._v(" next month ")]
                      )
                    ]),
                    _c(
                      "ui-calendar",
                      _vm._b(
                        {
                          staticClass: "fb-reservation__ui-calendar",
                          attrs: {
                            value: _vm.date,
                            lang: { weekdays: _vm.$lang.FORMS_DATEPICKER.days }
                          },
                          scopedSlots: _vm._u([
                            {
                              key: "day",
                              fn: function(ref) {
                                var calendarDate = ref.date;
                                var timestamp = ref.timestamp;
                                var isSelected = ref.isSelected;
                                var isEdge = ref.isEdge;
                                return _c(
                                  "button",
                                  _vm._g(
                                    {
                                      staticClass: "ui-calendar__day",
                                      class: {
                                        "is-edge": isEdge,
                                        "is-selected": isSelected,
                                        "is-today": timestamp === _vm.today,
                                        "is-disabled": !_vm.availableDays[timestamp]
                                      },
                                      attrs: {
                                        disabled: !_vm.availableDays[timestamp],
                                        type: "button",
                                        "data-date": isEdge ? null : timestamp
                                      }
                                    },
                                    isEdge || !_vm.availableDays[timestamp]
                                      ? {}
                                      : { click: _vm._setDate }
                                  ),
                                  [
                                    _vm._v(
                                      " " + _vm._s(calendarDate.getDate()) + " "
                                    )
                                  ]
                                )
                              }
                            }
                          ])
                        },
                        "ui-calendar",
                        {
                          month: _vm.month,
                          year: _vm.year,
                          firstDay: _vm.firstDay
                        },
                        false
                      )
                    )
                  ],
                  1
                ),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: !!_vm.date,
                        expression: "!! date"
                      }
                    ],
                    staticClass: "fb-reservation__time",
                    class: { "is-visible": _vm.showTime }
                  },
                  [
                    _c("div", { staticClass: "ui-calendar__header" }, [
                      _c(
                        "button",
                        {
                          staticClass:
                            "ui-calendar__button is-prev fb-reservation__hide-time",
                          attrs: { type: "button" },
                          on: {
                            click: function($event) {
                              _vm.showTime = false;
                            }
                          }
                        },
                        [_vm._v(" show datepicker ")]
                      ),
                      _c(
                        "time",
                        {
                          staticClass: "ui-calendar__caption",
                          attrs: { datetime: _vm.dateInfo.datetime }
                        },
                        [
                          _vm._t(
                            "time-header",
                            [
                              _vm._v(
                                " " +
                                  _vm._s(_vm.dateInfo.weekdayName) +
                                  ", " +
                                  _vm._s(_vm.dateInfo.monthName) +
                                  " " +
                                  _vm._s(_vm.dateInfo.day) +
                                  " "
                              ),
                              _c(
                                "span",
                                { staticClass: "fb-reservation__caption-year" },
                                [_vm._v(_vm._s(_vm.dateInfo.year))]
                              )
                            ],
                            null,
                            _vm.dateInfo
                          )
                        ],
                        2
                      )
                    ]),
                    _c("div", { staticClass: "ui-calendar__time-range" }, [
                      _vm.availableTime
                        ? _c(
                            "ul",
                            { on: { click: _vm._setTime } },
                            _vm._l(_vm.availableTime, function(ref) {
                              var time_start = ref.time_start;
                              var status = ref.status;
                              var format24h = ref.format24h;
                              var format12h = ref.format12h;
                              return _c("li", { key: time_start }, [
                                _c(
                                  "button",
                                  {
                                    staticClass: "ui-calendar__button",
                                    class: [
                                      {
                                        "is-selected": _vm.time === format24h,
                                        "is-disabled": status !== "available"
                                      },
                                      "is-" + status
                                    ],
                                    attrs: {
                                      type: "button",
                                      disabled: status !== "available",
                                      "data-time": format24h
                                    }
                                  },
                                  [
                                    _vm._v(
                                      " " +
                                        _vm._s(
                                          _vm.is24hFormat ? format24h : format12h
                                        ) +
                                        " "
                                    )
                                  ]
                                )
                              ])
                            }),
                            0
                          )
                        : _vm._e()
                    ])
                  ]
                ),
                _c(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: _vm.isLoading,
                        expression: "isLoading"
                      }
                    ],
                    staticClass: "fb-reservation__loading"
                  },
                  [_vm._t("loading", [_vm._v(" Loading... ")])],
                  2
                )
              ])
            ]
          ),
          _c("fb-input", {
            attrs: { name: _vm.realName, type: "hidden" },
            on: {
              error: function(err) {
                return (_vm.inputError = err)
              }
            }
          })
        ],
        1
      )
    };
    var __vue_staticRenderFns__$l = [];
    __vue_render__$l._withStripped = true;

      /* style */
      const __vue_inject_styles__$l = undefined;
      /* scoped */
      const __vue_scope_id__$l = undefined;
      /* module identifier */
      const __vue_module_identifier__$l = undefined;
      /* functional template */
      const __vue_is_functional_template__$l = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbReservationDropdown = normalizeComponent_1(
        { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
        __vue_inject_styles__$l,
        __vue_script__$l,
        __vue_scope_id__$l,
        __vue_is_functional_template__$l,
        __vue_module_identifier__$l,
        undefined,
        undefined
      );

    // importing components

    function install(Vue) {

        if ( this.installed ) return
        this.installed = true;

        Vue.component('form-builder', formBuilder);
        Vue.component('fb-error-wrap', fbErrorWrap);
        Vue.component('fb-switcher', fbSwitcher);
        Vue.component('fb-input', fbInput);
        Vue.component('fb-multi-block', fbMultiBlock);
        Vue.component('fb-checkbox', fbCheckbox);
        Vue.component('fb-select', fbSelect);
        Vue.component('fb-textarea', fbTextarea);
        Vue.component('fb-code', fbCode);
        Vue.component('fb-company-slug', fbCompanySlug);
        Vue.component('fb-auto-captcha', fbAutoCaptcha);
        Vue.component('fb-radio-group', fbRadioGroup);
        Vue.component('fb-slider', fbSlider);
        Vue.component('fb-phone', fbPhone);
        Vue.component('fb-uploader', resolve => {
            AWES.utils.loadModule(
                'vue-simple-uploader',
                'https://unpkg.com/vue-simple-uploader@0.5.6/dist/vue-uploader.js',
                () => { resolve(fbUploader); }
            );
        });
        Vue.component('fb-editor', resolve => {
            loadEditor().then( () => { resolve(fbEditor); });
        });
        Vue.component('fb-date', fbDate);
        Vue.component('fb-date-range', fbDateRange);
        Vue.component('fb-reservation', FbReservation);
        Vue.component('fb-reservation-dropdown', fbReservationDropdown);
    }

    var plugin = {

        installed: false,

        install
    };

    var lang = {
        FORMS_SEND: 'Send',
        FORMS_CANCEL: 'Cancel',
        FORMS_LOADING: 'Loading...',
        FORMS_CONFIRM: 'Are you shure? All not submitted data will be erased...',
        FORMS_MULTIBLOCK_ADD: '+ add',
        FORMS_SELECT_LABEL: 'Select a value',
        FORMS_SELECT_PLACEHOLDER: 'Pick a value',
        FORMS_SELECT_AJAX_PLACEHOLDER: 'Start typing...',
        FORMS_SELECT_EMPTY: 'Nothing found',
        FORMS_SELECT_ADD_TAG: 'Add new value',
        FORMS_UPLOAD_DROP: 'Drag and drop file or',
        FORMS_UPLOAD_ADD: 'Add file',
        FORMS_UPLOAD_FORMAT: 'File formats only',
        FORMS_UPLOAD_SIZE: 'Size of files no more then',
        FORMS_UPLOAD_REMOVE: 'Remove file',
        FORMS_UPLOADER_EXTENSION_ERROR: 'File %s has wrong extension',
        FORMS_UPLOADER_SIZE_ERROR: 'File %s is too big',
        FORMS_EDITOR_VISUAL: 'Visual',
        FORMS_EDITOR_CODE: 'Code',
        FORMS_DATERANGE_START_LABEL: 'Start date',
        FORMS_DATERANGE_END_LABEL: 'End date',
        FORMS_DATEPICKER: {
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            daysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thirsday', 'Friday', 'Saturday'],
            months: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
            today: 'Today',
            clear: 'Clear',
            close: 'Close'
        } 
    };

    function checkEdited(form) {
        if ( ! form.isEdited ) {
            Vue.set(form, 'isEdited', true);
        }
    }

    const state = () => ({});

    const getters = {

        form: state => name => {
            return state[name]
        },

        fields: (state, getters) => name => {
            let fields = {};
            const form = getters.form(name);
            if ( form ) {
                fields = form.fields;
            }
            return fields
        },

        multiblockIds: (state, getters) => (formName, multiblockName) => {
            let multiblockIds = [0];
            const form = getters.form(formName);
            if (form) {
                multiblockIds = form.multiblocks[multiblockName].ids;
            }
            return multiblockIds
        },

        errorsOrFalse: (state, getters) => name => {
            const form = getters.form(name);
            let errors = form && form.errors || {};
            return AWES.utils.object.isEmpty(errors) ? false : errors
        },

        hasCaptchaError: (state, getters) => name => {
            const errors = getters.form(name);
            return !!errors[CAPTCHA_NAME]
        },

        isLoading: (state, getters) => name => {
            const form = getters.form(name);
            return form && form.isLoading
        },

        isMultiblockDisabled: (state, getters) => (formName, multiblockName) => {
            const form = getters.form(name);
            return form && !form.multiblocksDisabled[multiblockName]
        },

        fieldValue: (state, getters) => (formName, fieldName) => {
            const form = getters.form(formName);
            return form && form.fields[fieldName]
        },

        fieldError: (state, getters) => (formName, fieldName) => {
            const form = getters.form(formName);
            return form && form.errors[fieldName]
        },

        firstErrorField: state => formName => {
            return state[formName] && state[formName].firstErrorField
        }
    };

    const mutations = {

        createForm(state, {formName, fields}) {
            Vue.set(state, formName, {
                initialState: fields,
                fields: {},
                errors: {},
                multiblocks: {},
                // selectValues: {},
                isLoading: false,
                isEdited: false,
                firstErrorField: null
            });
        },

        setLoading(state, {formName, status}) {
            Vue.set(state[formName], 'isLoading', status);
        },

        deleteForm(state, formName) {
            Vue.delete(state, formName);
        },

        setFormErrors(state, {formName, errors}) {
            const form = state[formName];
            Vue.set(form, 'firstErrorField', Object.keys(errors)[0]);
            let _errors = {};
            for (let error in errors) {
                let _value = errors[error];
                _errors[normalizePath(error)] = _value;
            }
            Vue.set(form, 'errors', _errors);
        },

        createField(state, { formName, fieldName, value }) {
            const form = state[formName];
            value = AWES.utils.object.get(form.initialState, fieldName, value);
            Vue.set(form.fields, fieldName, value);
        },

        setFieldValue(state, { formName, fieldName, value }) {
            const form = state[formName];
            Vue.set(form.fields, fieldName, value);
            checkEdited(form);
        },

        deleteField(state, { formName, fieldName }) {
            const form = state[formName];
            Vue.delete(form.fields, fieldName);
            Vue.delete(form.errors, fieldName);
        },

        resetError(state, { formName, fieldName }) {
            Vue.delete(state[formName].errors, fieldName);
        },

        resetErrors(state, formName) {
            Vue.set(state[formName], 'errors', {});
        },

        resetFirstErrorField(state, formName) {
            Vue.set(state[formName], 'firstErrorField', null);
        },

        createMutiblock(state, { formName, multiblockName, disabled }) {
            const form = state[formName];
            const { get, isEmpty } = AWES.utils.object;
            let blocks = get(form.initialState, multiblockName);
            blocks = isEmpty(blocks) ? [{}] : blocks;
            let ids = Object.keys(blocks).map(id => Number(id));
            Vue.set(form.multiblocks, multiblockName, {
                disabled,
                ids
            });
        },

        deleteMutiblock(state, { formName, multiblockName }) {
            Vue.delete(state[formName].multiblocks, multiblockName);
        },

        toggleMultiblockState(state, { formName, multiblockName, status }) {
            Vue.set(state[formName].multiblocks[multiblockName], 'disabled', status);
        },

        addMultiblockId(state, { formName, multiblockName, id }) {
            const form = state[formName];
            form.multiblocks[multiblockName].ids.push(id);
            checkEdited(form);
        },

        deleteMultiblockId(state, { formName, multiblockName, id }) {
            const form = state[formName];
            let ids = form.multiblocks[multiblockName].ids;
            let index = ids.findIndex( _id => _id === id );
            ids.splice(index, 1);
            checkEdited(form);
        },

        // setSelectValue(state, { formName, selectName, value }) {
        //     const form = state[formName]
        //     if ( value !== null ) {
        //         Vue.set(form.selectValues, selectName, value)
        //     } else {
        //         Vue.delete(form.selectValues, selectName)
        //     }
        // }
    };

    const actions = {

        restoreData({ state }, { formName }) {
            const form = state[formName];

            // restore data object
            const data = restoreFlattenedObject(form.fields);

            // convert data and normalize arrays if multiblocks exist
            const multiblockNames = Object.keys(form.multiblocks);
            if (multiblockNames.length) {
                normalizeArrayIndexes(data, multiblockNames);
                for (let multiblockName of multiblockNames) {
                    let ids = Object.keys(AWES.utils.object.get(data, multiblockName, [{}])).map(id => Number(id));
                    Vue.set(form.multiblocks[multiblockName], 'ids', ids);
                }
            }

            return data
        },

        sendForm({ state, commit, dispatch }, {formName, url, method}) {

            return new Promise( resolve => {

                let _res;
                const form = state[formName];

                commit('resetErrors', formName);

                commit('setLoading', {formName, status:true});

                dispatch('restoreData', { formName })
                    .then( data => {
                        // send request
                        return AWES.ajax(data, url, method)
                    })
                    .then( res => {
                        _res = res;

                        if ( res.success ) {
                            // reset initial state
                            let data = res.data.data || {};
                            Vue.set(form, 'initialState', data);
                            let _data = {};
                            for (let field in form.fields) {
                                _data[field] = AWES.utils.object.get(data, field);
                            }
                            Vue.set(form, 'fields', _data);
                            Vue.set(form, 'isEdited', false);
                        } else if (res.data) {
                            commit('setFormErrors', {formName, errors: res.data});
                        }
                    })
                    .finally( () => {
                        commit('setLoading', { formName, status: false });
                        resolve( _res );
                    });
            })
        }
    };

    var formsModule = {
        state,
        getters,
        mutations,
        actions,
        namespaced: true
    };

    var vueTheMask = createCommonjsModule(function (module, exports) {
    (function(e,t){module.exports=t();})(commonjsGlobal,function(){return function(e){function t(r){if(n[r])return n[r].exports;var a=n[r]={i:r,l:!1,exports:{}};return e[r].call(a.exports,a,a.exports,t),a.l=!0,a.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r});},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p=".",t(t.s=10)}([function(e,t){e.exports={"#":{pattern:/\d/},X:{pattern:/[0-9a-zA-Z]/},S:{pattern:/[a-zA-Z]/},A:{pattern:/[a-zA-Z]/,transform:function(e){return e.toLocaleUpperCase()}},a:{pattern:/[a-zA-Z]/,transform:function(e){return e.toLocaleLowerCase()}},"!":{escape:!0}};},function(e,t,n){function r(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!0),t}var a=n(2),o=n(0),i=n.n(o);t.a=function(e,t){var o=t.value;if((Array.isArray(o)||"string"==typeof o)&&(o={mask:o,tokens:i.a}),"INPUT"!==e.tagName.toLocaleUpperCase()){var u=e.getElementsByTagName("input");if(1!==u.length)throw new Error("v-mask directive requires 1 input, found "+u.length);e=u[0];}e.oninput=function(t){if(t.isTrusted){var i=e.selectionEnd,u=e.value[i-1];for(e.value=n.i(a.a)(e.value,o.mask,!0,o.tokens);i<e.value.length&&e.value.charAt(i-1)!==u;)i++;e===document.activeElement&&(e.setSelectionRange(i,i),setTimeout(function(){e.setSelectionRange(i,i);},0)),e.dispatchEvent(r("input"));}};var s=n.i(a.a)(e.value,o.mask,!0,o.tokens);s!==e.value&&(e.value=s,e.dispatchEvent(r("input")));};},function(e,t,n){var r=n(6),a=n(5);t.a=function(e,t){var o=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i=arguments[3];return Array.isArray(t)?n.i(a.a)(r.a,t,i)(e,t,o,i):n.i(r.a)(e,t,o,i)};},function(e,t,n){function r(e){e.component(s.a.name,s.a),e.directive("mask",i.a);}Object.defineProperty(t,"__esModule",{value:!0});var a=n(0),o=n.n(a),i=n(1),u=n(7),s=n.n(u);n.d(t,"TheMask",function(){return s.a}),n.d(t,"mask",function(){return i.a}),n.d(t,"tokens",function(){return o.a}),n.d(t,"version",function(){return c});var c="0.11.1";t.default=r,"undefined"!=typeof window&&window.Vue&&window.Vue.use(r);},function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(1),a=n(0),o=n.n(a),i=n(2);t.default={name:"TheMask",props:{value:[String,Number],mask:{type:[String,Array],required:!0},masked:{type:Boolean,default:!1},tokens:{type:Object,default:function(){return o.a}}},directives:{mask:r.a},data:function(){return {lastValue:null,display:this.value}},watch:{value:function(e){e!==this.lastValue&&(this.display=e);},masked:function(){this.refresh(this.display);}},computed:{config:function(){return {mask:this.mask,tokens:this.tokens,masked:this.masked}}},methods:{onInput:function(e){e.isTrusted||this.refresh(e.target.value);},refresh:function(e){this.display=e;var e=n.i(i.a)(e,this.mask,this.masked,this.tokens);e!==this.lastValue&&(this.lastValue=e,this.$emit("input",e));}}};},function(e,t,n){function r(e,t,n){return t=t.sort(function(e,t){return e.length-t.length}),function(r,a){for(var o=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],i=0;i<t.length;){var u=t[i];i++;var s=t[i];if(!(s&&e(r,s,!0,n).length>u.length))return e(r,u,o,n)}return ""}}t.a=r;},function(e,t,n){function r(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=arguments[3];e=e||"",t=t||"";for(var a=0,o=0,i="";a<t.length&&o<e.length;){var u=t[a],s=r[u],c=e[o];s&&!s.escape?(s.pattern.test(c)&&(i+=s.transform?s.transform(c):c,a++),o++):(s&&s.escape&&(a++,u=t[a]),n&&(i+=u),c===u&&o++,a++);}for(var f="";a<t.length&&n;){var u=t[a];if(r[u]){f="";break}f+=u,a++;}return i+f}t.a=r;},function(e,t,n){var r=n(8)(n(4),n(9),null,null);e.exports=r.exports;},function(e,t){e.exports=function(e,t,n,r){var a,o=e=e||{},i=typeof e.default;"object"!==i&&"function"!==i||(a=e,o=e.default);var u="function"==typeof o?o.options:o;if(t&&(u.render=t.render,u.staticRenderFns=t.staticRenderFns),n&&(u._scopeId=n),r){var s=u.computed||(u.computed={});Object.keys(r).forEach(function(e){var t=r[e];s[e]=function(){return t};});}return {esModule:a,exports:o,options:u}};},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;return (e._self._c||t)("input",{directives:[{name:"mask",rawName:"v-mask",value:e.config,expression:"config"}],attrs:{type:"text"},domProps:{value:e.display},on:{input:e.onInput}})},staticRenderFns:[]};},function(e,t,n){e.exports=n(3);}])});
    });

    var VueTheMask = unwrapExports(vueTheMask);
    var vueTheMask_1 = vueTheMask.VueTheMask;

    var dist = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}("undefined"!=typeof self?self:commonjsGlobal,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:r});},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="../dist/",t(t.s=0)}([function(e,t,n){(function(r){function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var c;n(2),n(3);var u={},i={},a=[],l=[],s=!1,f=function(e){return e="string"==typeof e?JSON.parse(e.replace(/\'/gi,'"')):e,e instanceof Array?{"":e}:e},p=function(e,t,n,r){var o=!0===n.modifiers.push,c=!0===n.modifiers.avoid,u=!0==!n.modifiers.focus,i=!0===n.modifiers.once;c?(a=a.filter(function(e){return !e===t}),a.push(t)):v({b:e,push:o,once:i,focus:u,el:r.elm});},y=function(e,t){for(var n in e){var r=u.encodeKey(e[n]),o=i[r].el.indexOf(t);i[r].el.length>1&&o>-1?i[r].el.splice(o,1):delete i[r];}};u.install=function(e,t){l=[].concat(o(t&&t.prevent?t.prevent:[])),e.directive("shortkey",{bind:function(e,t,n){var r=f(t.value);p(r,e,t,n);},update:function(e,t,n){var r=f(t.oldValue);y(r,e);var o=f(t.value);p(o,e,t,n);},unbind:function(e,t){var n=f(t.value);y(n,e);}});},u.decodeKey=function(e){return d(e)},u.encodeKey=function(e){var t={};t.shiftKey=e.includes("shift"),t.ctrlKey=e.includes("ctrl"),t.metaKey=e.includes("meta"),t.altKey=e.includes("alt");var n=d(t);return n+=e.filter(function(e){return !["shift","ctrl","meta","alt"].includes(e)}).join("")};var d=function(e){var t="";return ("Shift"===e.key||e.shiftKey)&&(t+="shift"),("Control"===e.key||e.ctrlKey)&&(t+="ctrl"),("Meta"===e.key||e.metaKey)&&(t+="meta"),("Alt"===e.key||e.altKey)&&(t+="alt"),"ArrowUp"===e.key&&(t+="arrowup"),"ArrowLeft"===e.key&&(t+="arrowleft"),"ArrowRight"===e.key&&(t+="arrowright"),"ArrowDown"===e.key&&(t+="arrowdown"),"AltGraph"===e.key&&(t+="altgraph"),"Escape"===e.key&&(t+="esc"),"Enter"===e.key&&(t+="enter"),"Tab"===e.key&&(t+="tab")," "===e.key&&(t+="space"),"PageUp"===e.key&&(t+="pageup"),"PageDown"===e.key&&(t+="pagedown"),"Home"===e.key&&(t+="home"),"End"===e.key&&(t+="end"),"Delete"===e.key&&(t+="del"),"Backspace"===e.key&&(t+="backspace"),"Insert"===e.key&&(t+="insert"),"NumLock"===e.key&&(t+="numlock"),"CapsLock"===e.key&&(t+="capslock"),"Pause"===e.key&&(t+="pause"),"ContextMenu"===e.key&&(t+="contextmenu"),"ScrollLock"===e.key&&(t+="scrolllock"),"BrowserHome"===e.key&&(t+="browserhome"),"MediaSelect"===e.key&&(t+="mediaselect"),(e.key&&" "!==e.key&&1===e.key.length||/F\d{1,2}|\//g.test(e.key))&&(t+=e.key.toLowerCase()),t},h=function(e){var t=new CustomEvent("shortkey",{bubbles:!1});i[e].key&&(t.srcKey=i[e].key);var n=i[e].el;n[n.length-1].dispatchEvent(t);};u.keyDown=function(e){(!i[e].once&&!i[e].push||i[e].push&&!s)&&h(e);},r&&Object({NODE_ENV:"production"})&&function(){document.addEventListener("keydown",function(e){var t=u.decodeKey(e);if(m(t))if(e.preventDefault(),e.stopPropagation(),i[t].focus)u.keyDown(t),s=!0;else if(!s){var n=i[t].el;n[n.length-1].focus(),s=!0;}},!0),document.addEventListener("keyup",function(e){var t=u.decodeKey(e);m(t)&&(e.preventDefault(),e.stopPropagation(),(i[t].once||i[t].push)&&h(t)),s=!1;},!0);}();var v=function(e){var t=e.b,n=e.push,r=e.once,o=e.focus,c=e.el;for(var a in t){var l=u.encodeKey(t[a]),s=i[l]&&i[l].el?i[l].el:[];s.push(c),i[l]={push:n,once:r,focus:o,key:a,el:s};}},m=function(e){var t=!!a.find(function(e){return e===document.activeElement}),n=!!l.find(function(e){return document.activeElement&&document.activeElement.matches(e)});return !!i[e]&&!(t||n)};void 0!==e&&e.exports?e.exports=u:void 0!==(c=function(){return u}.call(t,n,t,e))&&(e.exports=c);}).call(t,n(1));},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(e){if(s===setTimeout)return setTimeout(e,0);if((s===n||!s)&&setTimeout)return s=setTimeout,setTimeout(e,0);try{return s(e,0)}catch(t){try{return s.call(null,e,0)}catch(t){return s.call(this,e,0)}}}function c(e){if(f===clearTimeout)return clearTimeout(e);if((f===r||!f)&&clearTimeout)return f=clearTimeout,clearTimeout(e);try{return f(e)}catch(t){try{return f.call(null,e)}catch(t){return f.call(this,e)}}}function u(){h&&y&&(h=!1,y.length?d=y.concat(d):v=-1,d.length&&i());}function i(){if(!h){var e=o(u);h=!0;for(var t=d.length;t;){for(y=d,d=[];++v<t;)y&&y[v].run();v=-1,t=d.length;}y=null,h=!1,c(e);}}function a(e,t){this.fun=e,this.array=t;}function l(){}var s,f,p=e.exports={};!function(){try{s="function"==typeof setTimeout?setTimeout:n;}catch(e){s=n;}try{f="function"==typeof clearTimeout?clearTimeout:r;}catch(e){f=r;}}();var y,d=[],h=!1,v=-1;p.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];d.push(new a(e,t)),1!==d.length||h||o(i);},a.prototype.run=function(){this.fun.apply(null,this.array);},p.title="browser",p.browser=!0,p.env={},p.argv=[],p.version="",p.versions={},p.on=l,p.addListener=l,p.once=l,p.off=l,p.removeListener=l,p.removeAllListeners=l,p.emit=l,p.prependListener=l,p.prependOnceListener=l,p.listeners=function(e){return []},p.binding=function(e){throw new Error("process.binding is not supported")},p.cwd=function(){return "/"},p.chdir=function(e){throw new Error("process.chdir is not supported")},p.umask=function(){return 0};},function(e,t){Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector);},function(e,t){!function(){if("undefined"!=typeof window)try{var e=new window.CustomEvent("test",{cancelable:!0});if(e.preventDefault(),!0!==e.defaultPrevented)throw new Error("Could not prevent default")}catch(e){var t=function(e,t){var n,r;return t=t||{},t.bubbles=!!t.bubbles,t.cancelable=!!t.cancelable,n=document.createEvent("CustomEvent"),n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),r=n.preventDefault,n.preventDefault=function(){r.call(this);try{Object.defineProperty(this,"defaultPrevented",{get:function(){return !0}});}catch(e){this.defaultPrevented=!0;}},n};t.prototype=window.Event.prototype,window.CustomEvent=t;}}();}])});

    });

    var VueShortkey = unwrapExports(dist);
    var dist_1 = dist.VueShortkey;

    const awesPlugin = {

        name: name$1, version,

        install(AWES) {
            Vue.use(VueShortkey);
            Vue.use(VueTheMask);
            Vue.use(plugin);
            AWES._store.registerModule('forms', formsModule);
            AWES.lang = lang;
        }
    };

    if (window && ('AWES' in window)) {
        AWES.use(awesPlugin);
    } else {
        window.__awes_plugins_stack__ = window.__awes_plugins_stack__ || [];
        window.__awes_plugins_stack__.push(awesPlugin);
    }

}());
