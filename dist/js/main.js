(function () {
    'use strict';

    /**
     * Google reCaptcha form field name, reused in components
     *
     * @const {String} CAPTCHA_NAME - form field name
     */

    const CAPTCHA_NAME = 'g-recaptcha-response';


    /**
     * Detects if the given value is an object litheral
     *
     * @param {*} val - a variable to check
     *
     */

    function _isPlainObject(val) {
        return val != null && typeof val == 'object'
    }


    /**
     * Internal function to flatten a nested object
     *
     * @param {Object} obj - the object to flatten
     * @param {Object} root - the root object, **for internal recursive calls**
     * @param {String} rootName - parent key, **for internal recursive calls**
     * @param {Boolean} isArray - if the given key type is Array, **for internal recursive calls**
     *
     * @returns {Object} flattened object
     *
     */

    function _flattenObject(obj, root, rootName, converter = null) {

        let isArray = Array.isArray(obj);

        // TODO: improve build system to remove comments in production mode
        /*
        if ( isArray && ! rootName ) {
            throw new Error('Root name must be provided to flatten an array with `_flattenObject` function')
        }
        */

        for (let key in obj) {

            // current key value
            let val = obj[key];

            // check for blank space to wrap in [' brackets ']
            let _hasSpace = / /.test(key);


            // build the key name
            let _key = key;

            if (_hasSpace) {
                _key = '\[\'' + key + '\'\]';
            } else if (isArray) {
                _key = '\[' + key + '\]';
            } else if (rootName) {
                _key = '.' + key;
            }


            if ( Array.isArray(val) || _isPlainObject(val) ) {

                // recursive call for arrays and objects
                _flattenObject(val, root, rootName + _key, converter);

            } else {

                // get value to set, apply converter if exists
                let _value = converter ? converter(val) : val;

                // assignin the value
                root[rootName + _key] = _value;
            }
        }

        return root
    }


    /**
     * Flattens a nested object to single-level form
     *
     * @param {Object} obj - the object to flatten
     * @param {Object} converter - function to convert value
     *
     * @returns {Object} flattened object
     *
     */

    function flattenObject(obj, converter = null) {

        return _flattenObject(obj, {}, '', converter)
    }


    /**
     * Sets value in object by given path array
     *
     * @param {Object} obj - flattened object
     * @param {Array} path - path levels
     * @param {*} value - value to set
     *
     */

    function _set(obj, path, value) {

        // create a path array of levels from a flattened key
        let _path = _pathToArray(path);

        // set current object level
        let current = obj;


        do {

            // get next key and replace quots in keys with spaces
            let _key = _path.shift();

            // check if its a middle or last key
            if ( _path.length ) {

                // skip if a structure with such key exists
                if ( ! current[_key] ) {

                    // creaate an array if next key is numeric or an object otherwise
                    let nextStructure = isNaN(_path[0]) ? {} : [];
                    current[_key] = nextStructure;
                }

                // go a level deeper for next iteration
                current = current[_key];

            } else {

                // if this is a last key, set it`s value
                current[_key] = value;
            }
        } while (_path.length)
    }


    /**
     *
     * @param {String} path - path to valiable in object
     *
     * @returns {Array} array of levels to object
     */

    function _pathToArray(path) {
        return path.replace(/\'?\]$/, '').split(/(?:\]?\.|\[\'?|\'?\])/g)
    }


    /**
     * Get a value by given path
     *
     * @param {Object} obj - object to search
     * @param {String} path - path to level
     * @param {*} value - default value if nothig found
     *
     * @returns {*} value of given path in object
     */

    function _get(obj, path, value) {
        path = _pathToArray(path);
        let current = obj;
        while ( path.length && current ) {
            let key = path.shift();
            if ( path.length ) {
                current = current[key];
            } else {
                value = current[key];
            }
        }
        return value
    }


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

            _set(result, key, _value);
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
     * Check for empty object and arrays
     *
     * @param {Object|Array} obj - object to check
     *
     * @returns {Boolean} is empty or not
     */

    function isEmpty(obj) {
        return Array.isArray(obj) ? !obj.length : !Object.keys(obj).length
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
        paths.forEach( path => {
            let _arr = _get(obj, path);
            _set(obj, path, _normalizeArrayIndexes(_arr));
        });
        return obj
    }


    /**
     *
     * @param {Object} obj1 - object to compare
     * @param {Object} obj2 - object to compare
     * @param {Function} converter - vunction to convert value
     *
     * @returns {Boolean} true if objects are equal, false otherwise
     */

    function compareFlatObjects(obj1, obj2, converter = null) {

        let _keys1 = Object.keys(obj1);
        let _keys2 = Object.keys(obj2);

        // fast compare by length
        if ( _keys1.length !== _keys2.length ) {
            return false
        }


        // long compare by keys
        let equal = true;

        for ( let i = 0; i < _keys1.length; i++ ) {
            let _key1 = _keys1[i];
            let _key2 = _keys2[i];

            if (_key1 !== _key2) {
                equal = false;
                break
            }

            let _val1 = converter ? converter(obj1[_key1]) : obj1[_key1];
            let _val2 = converter ? converter(obj2[_key1]) : obj2[_key1];
            if ( _val1 !== _val2 ) {
                equal = false;
                break
            }
        }

        return equal
    }

    //

    let _uniqFormId = 0;

    const UNLOAD_EVENTS = [
        {
            type: 'beforeunload',
            handler: 'windowUnloadHandler'
        },
        {
            type: 'popstate',
            handler: 'popStateHandler'
        }
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
            isModal: !!this.modal
          }
        },


        computed: {

            form() {
                return AWES._store.state.forms[this.name]
            },

            isLoading() {
                return this.form && this.form.isLoading
            },

            isEdited() {
                return this.form && this.form.isEdited
            },

            fields() {
                return AWES._store.getters['forms/fields'](this.name)
            }
        },


        methods: {

            send() {

                if ( this.isLoading || ! this.isEdited ) return

                AWES.emit('form-builder:before-send');

                if ( this.$listeners.send ) {
                    AWES._store.dispatch('forms/restoreData', {
                        formName: this.name
                    }).then( data => {
                        this.$emit('send', data);
                    });
                } else {
                    AWES._store.dispatch('forms/sendForm', {
                        formName: this.name,
                        url: this.url,
                        method: this.method
                    }).then( res => {
                        this.$emit(res.success ? 'sended' : 'error', res.data);
                    });
                }
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

            popStateHandler() {
                this.removeUnloadHandlers();
                if ( this.checkCloseAllowed() ) {
                    if ( this.modal ) this.close();
                } else {
                    const modal = this.modal ? this.modal.hash : '';
                    const url = location.href + modal;
                    history.pushState( {modal}, document.title, url );
                    this.addUnloadHandlers();
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
                    AWES.off(`modal::${this.modal.name}.before-close`, this.preventModalClose);
                    AWES.emit(`modal::${this.modal.name}.close`);
                }
            },

            preventModalClose(e) {
                e.detail.preventClose();
                this.close();
            }
        },


        created() {

            // get default values
            let fields = this.storeData ? AWES._store[this.storeData] : (this.default || {});

            // create storage record
            AWES._store.commit('forms/createForm', {
                formName: this.name,
                fields
            });

            // set watcher for modal close method
            if ( this.modal ) {
                this.$watch('isEdited', edited => {
                    AWES[edited ? 'on': 'off'](`modal::${this.modal.name}.before-close`, this.preventModalClose);
                });
            }
        },


        mounted() {
            this.addUnloadHandlers();
            if ( this.autoSubmit ) {
                this.$watch('fields', this.send );
            }
        },


        beforeDestroy() {
            this.removeUnloadHandlers();
        },


        destroyed() {
            AWES.off(`modal::${this.modal.name}.before-close`, this.preventModalClose);
            AWES._store.commit('forms/deleteForm', this.name);
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
          attrs: { action: _vm.url, method: _vm.method },
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.send($event)
            }
          }
        },
        [
          _c(
            "div",
            { staticClass: "grid grid_forms" },
            [_vm._t("default", null, { fields: _vm.fields })],
            2
          ),
          !_vm.autoSubmit
            ? _c("div", { class: _vm.modal ? "line-btns" : null }, [
                _c(
                  "div",
                  { class: _vm.modal ? "line-btns__wrap" : "line-btns" },
                  [
                    _c(
                      "button",
                      {
                        directives: [
                          {
                            name: "shortkey",
                            rawName: "v-shortkey",
                            value: ["ctrl", "enter"],
                            expression: "['ctrl', 'enter']"
                          }
                        ],
                        staticClass: "btn btn-send waves-effect waves-button",
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
                        _vm._v(
                          " " + _vm._s(_vm.sendText || _vm.$lang.FORMS_SEND) + " "
                        )
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
                              staticClass: "btn waves-effect waves-button",
                              class: { btn_transparent: _vm.$listeners.cancel },
                              attrs: { type: "button" }
                            },
                            {
                              shortkey: _vm.close,
                              click: _vm.modal ? _vm.close : _vm.$listeners.cancel
                            }
                          ),
                          [
                            _vm._v(
                              " " +
                                _vm._s(_vm.cancelText || _vm.$lang.FORMS_CANCEL) +
                                " "
                            )
                          ]
                        )
                      : _vm._e(),
                    _vm._t("buttons-after")
                  ],
                  2
                )
              ])
            : _vm._e()
        ]
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

    var baseMixin = {

        props: {

            name: String,

            id: Number,

            disabled: {
                type: Boolean,
                default: false
            },

            cell: [String, Number]
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
                return AWES._store.getters['forms/isLoading'](this.formId);
            },

            isDisabled() {
                return this.formLoading || this.disabled || this.isMultiblockDisabled;
            },

            isMultiblockDisabled() {
                return this.multiblock ?
                    AWES._store.getters['forms/isMultiblockDisabled'](this.formId, this.multiblock) :
                    false
            },

            cellClass() {
                return this.cell ? 'grid__cell_' + this.cell : '';
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

    var fieldMixin = {

        mixins: [ baseMixin, focusMixin ],

        props: {

            label: String
        },


        data() {
            return {
                showTooltip: false,
                hasError: false
            }
        },


        computed: {

            formValue: {

                get() {
                    return AWES._store.getters['forms/fieldValue'](this.formId, this.realName)
                },

                set(value) {
                    AWES._store.commit('forms/setFieldValue', {
                        formName: this.formId,
                        fieldName: this.realName,
                        value
                    });
                }
            },

            shake() {
                return !this.formLoading && this.showTooltip;
            },

            error() {
                return AWES._store.getters['forms/fieldError'](this.formId, this.realName)
            },

            firstErrorField() {
                return AWES._store.getters['forms/firstErrorField'](this.formId)
            }
        },


        watch: {

            error: {
                handler(errors) {
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
                AWES._store.commit('forms/createField', {
                    formName: this.formId,
                    fieldName: this.realName,
                    value: this.value
                });
            },

            clickTooltip() {
                this.showTooltip = false;
                if (typeof this.setFocus === 'function') this.setFocus();
            },

            resetError() {
                this.showTooltip = false;
                AWES._store.commit('forms/resetError', {
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

            resetFormValue(formId) {
                if (this.formId !== formId) return
                this.formValue = _get(this.$options, 'props.value.default');
            },

            checkFocus() {
                if (typeof this.setFocus === 'function' &&
                    this.firstErrorField === this.realName) {
                    setTimeout(this.setFocus, 0);
                    AWES._store.commit('resetFirstErrorField', this.formId);
                }
            },

            destroyField() {
                AWES._store.commit('forms/deleteField', {
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
            },

            debounce: {
                type: [String, Number],
                default: 500
            }
        },


        computed: {

            isActive() {
                return !!(this.inFocus || this.value);
            },
        },


        methods: {

            formValueHandler($event) {
                if ( ! this.error ) {
                    clearTimeout(this.__debounce);
                    this.__debounce = setTimeout(() => {
                        this.formValue = $event.target.value;
                    }, Number(this.debounce));
                } else {
                    this.formValue = $event.target.value;
                    this.resetError();
                }
            },

            vModelHandler($event) {
                this.$emit('input', $event.target.value);
            },

            save() {
                clearTimeout(this.__debounce);
                this.formValue = this.$refs.element.value;
            }
        },


        mounted() {
            AWES.on('form-builder:before-send', this.save);
        },


        beforeDestroy() {
            AWES.off('form-builder:before-send', this.save);
        },
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
      return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
        _c(
          "div",
          {
            class: [
              "fb-input",
              {
                "fb-input_disabled": _vm.isDisabled,
                "fb-input_active": _vm.isActive || _vm.autoFilled,
                "fb-input_error": _vm.hasError,
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
                _c(
                  "label",
                  {
                    staticClass: "fb-input__label fb-input__label_field",
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
                          "fb-input__field",
                          { "is-focusable": _vm.isFocusable },
                          { "in-focus": _vm.inFocus },
                          {
                            "fb-input__field_password":
                              _vm.$attrs.type === "password"
                          }
                        ],
                        attrs: {
                          id: _vm.inputId,
                          "data-awes": _vm.$options.name + "." + _vm.name,
                          type: _vm.inputType,
                          disabled: _vm.isDisabled
                        },
                        domProps: { value: _vm.formId ? _vm.formValue : _vm.value },
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
                    { input: _vm.formId ? _vm.formValueHandler : _vm.vModelHandler }
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
      ])
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
                multiblock: this.realName
            }
        },


        data() {
            return {
                blocks: []
            }
        },


        computed: {

            groups() {
                return AWES._store.getters['forms/multiblockGroupIds'](this.formId, this.name) || [0]
            },

            nextIndex() {
                return Math.max.apply(null, this.groups) + 1
            },

            hasClose() {
                return this.blocks.length > 1
            },

            errors() {
                return AWES._store.getters['forms/errorsOrFalse'](this.formId)
            },

            fields() {
                return this.$options
            }
        },


        watch: {

            disabled: {
                handler: function( value ) {
                    AWES._store.commit('forms/toggleMultiblockState', {
                        formName: this.formId,
                        multiblockName: this.realName,
                        status: value
                    });
                },
                immediate: true
            },

            groups: {
                handler(val) {
                    let equal = compareFlatObjects(this.blocks, val);
                    if ( ! equal ) {
                        this.blocks = val.slice();
                    }
                },
                immediate: true
            }
        },


        methods: {

            addField() {
                if ( this.isDisabled ) return
                this.blocks.push( this.nextIndex );
                this.updateTooltips();
            },

            removeField( id ) {
                if ( this.isDisabled ) return
                this.blocks.splice(this.blocks.findIndex(i => i === id), 1);

                // clean up all related data
                AWES._store.commit('forms/deleteMultiblockBlock', {
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
            }
        }
    };

    /* script */
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "grid__wrap" }, [
        _c(
          "div",
          {
            staticClass: "fb-multiblock",
            class: [{ "fb-multiblock_disabled": this.isDisabled }]
          },
          [
            _vm._l(_vm.blocks, function(id) {
              return _c(
                "div",
                {
                  key: id,
                  class: ["grid__wrap", { "fb-multiblock_has-close": _vm.hasClose }]
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
            _c("div", { staticClass: "grid__wrap" }, [
              _c(
                "button",
                {
                  staticClass: "fb-multiblock__add",
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
            ])
          ],
          2
        )
      ])
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

            padding: {
                type: Boolean,
                default: true
            },

            value: {
                type: [Boolean, Number, Array],
                default: 0
            },

            defaultValue: String,

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
                return !!(this.inFocus || (this.formId ? this.formValue : this.vModelChecked))
            },

            vModelArray() {
                return !this.formId && Array.isArray(this.value)
            },

            vModelChecked() {
                return this.vModelArray ? this.value.includes(this.computedValue) : this.value
            },

            computedValue() {
                return this.defaultValue || this.label.replace(/ /g, '_').toLowerCase()
            }
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
                let checked = $event.target.checked;
                this.formValue = this.isNumeric ? Number(checked) : checked;
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
          staticClass: "grid__cell",
          class: [{ grid__cell_padding: _vm.padding }, _vm.cellClass]
        },
        [
          _c(
            "div",
            {
              class: [
                "fb-checkbox",
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
                                value: _vm.computedValue,
                                checked: _vm.formId
                                  ? _vm.formValue
                                  : _vm.vModelChecked
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

    //

    let _retry = 10; // times
    const AJAX_DEBOUNCE = 1000; // ms

    var script$5 = {

        name: "fb-select",

        // inheritAttrs: false,

        mixins: [ fieldMixin ],

        components: {
            Multiselect: resolve => {
                AWES.utils.loadModules({
                    'vue-multiselect': {
                        src: ['https://unpkg.com/vue-multiselect@2.1.3/dist/vue-multiselect.min.js',
                              'https://unpkg.com/vue-multiselect@2.1.3/dist/vue-multiselect.min.css'],
                        deps: ['vue'],
                        cb() { resolve(window.VueMultiselect.default); }
                    },
                });
            }
        },

        props: {

            value: {},

            selectOptions: {
                type: [String, Array],
                default: () => []
            },

            multiple: {
                type: Boolean,
                default: true
            },

            placeholderText: String
        },


        data() {
            return {
                isOpened: false,
                isLoading: false,
                ajaxOptions: []
            }
        },


        computed: {

            computedValue() {
                return this.formId ? this.selectValue : this.value
            },

            hasValue() {
                return !! ( this.multiple ? this.computedValue.length : this.computedValue );
            },

            isActive() {
                return this.isOpened || this.hasValue;
            },

            isAjax() {
                return typeof this.selectOptions === 'string'
            },

            defaultPlaceholder() {
                return this.$lang[this.isAjax ? 'FORMS_SELECT_AJAX_PLACEHOLDER' : 'FORMS_SELECT_PLACEHOLDER']
            },

            usedOptions() {
                return this.isAjax ? this.ajaxOptions : this.selectOptions
            }
        },


        methods: {

            formValueHandler(selected) {
                this.formValue = this.multiple ?
                                 selected.map( item => item.value) :
                                 selected.value;
                if ( this.error ) this.resetError();
            },

            vModelHandler(selected) {
                this.$emit('input', selected);
            },

            convertValue(value) {
                if ( this.multiple ) {
                    return Array.isArray(value) ?
                        this.usedOptions.filter( item => {
                            return value.includes(item.value);
                        }) :
                        value
                } else {
                    return this.usedOptions.find( item => {
                        return value === item.value;
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

            wrapTabEvents() {
                try {
                    this.$refs.select.$el.querySelector('.multiselect__input').classList.add('is-focusable');
                } catch(e) {
                    _retry--;
                    if (_retry) setTimeout(this.wrapTabEvents, 500);
                }
            },

            ajaxSearch(search) {
                if ( ! search ) return
                clearTimeout(this.__search);
                this.isLoading = true;
                this.__search = setTimeout(() => {
                    AWES.ajax({}, this.selectOptions.replace('%s', search), 'get')
                        .then( res => {
                            if ( res.success === true ) {
                                this.ajaxOptions = res.data;
                            } else {
                                this.ajaxOptions = [];
                            }
                            this.isLoading = false;
                        });
                }, AJAX_DEBOUNCE);
            }
        },


        mounted() {
            this.$nextTick( this.wrapTabEvents );
        }
    };

    /* script */
    const __vue_script__$5 = script$5;

    /* template */
    var __vue_render__$5 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
        _c(
          "div",
          {
            staticClass: "fb-select",
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
                        "show-labels": false,
                        multiple: _vm.multiple,
                        "hide-selected": _vm.multiple,
                        placeholder: _vm.placeholderText || _vm.defaultPlaceholder,
                        "internal-search": _vm.isAjax ? false : true,
                        loading: _vm.isLoading,
                        value: _vm.formId
                          ? _vm.convertValue(_vm.formValue)
                          : _vm.value,
                        options: _vm.usedOptions,
                        label: "name",
                        "track-by": "value",
                        disabled: _vm.isDisabled
                      },
                      on: {
                        open: function($event) {
                          _vm.isOpened = true;
                        },
                        close: function($event) {
                          _vm.isOpened = false;
                        }
                      }
                    },
                    {
                      "search-change": _vm.isAjax ? _vm.ajaxSearch : false,
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
      ])
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

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

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
      return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
        _c(
          "div",
          {
            staticClass: "fb-textarea",
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
      ])
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
            },

            // autoSubmit: {
            //     type: Boolean,
            //     default: true
            // }
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

            hasCaptchaError() {
                return AWES._store.getters['forms/hasCaptchaError'](this.formId)
            }
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

            hasCaptchaError(hasError) {
                if (!hasError) {
                    this.autoSubmitForm(this.value);
                }
            },

            value(val) {
                if (val.length === this.length) {
                    this.formValue = val;
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

            debounce: {
                type: [String, Number],
                default: 0
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
                    return this.removeDomain( AWES._store.getters['forms/fieldValue'](this.formId, this.realName) )
                },

                set(value) {
                    AWES._store.commit('forms/setFieldValue', {
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
                return value && this.$toUrl(value).substr(0, +this.maxlength)
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
            this.$toUrl = Urlify.create(this._config.ulrifyOptions);
        }
    };

    /* script */
    const __vue_script__$8 = script$8;

    /* template */
    var __vue_render__$8 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
        _c(
          "div",
          {
            class: [
              "fb-slug",
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
                          input: _vm.formId
                            ? _vm.formValueHandler
                            : _vm.vModelHandler
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
      ])
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
                    return AWES._store.getters['forms/fieldValue'](this.formId, this.realName)
                },

                set(value) {
                    AWES._store.commit('forms/setFieldValue', {
                        formName: this.formId,
                        fieldName: this.realName,
                        value
                    });
                }
            },

            error() {
                return AWES._store.getters['forms/fieldError'](this.formId, this.realName)
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
                AWES._store.commit('forms/resetError', {
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
            { class: ["grid__cell", _vm.cellClass] },
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

            value: String
        },

        data() {
            return {
                inFocus: []
            }
        },


        methods: {

            formValueHandler($event) {
                this.formValue = $event.target.value;
                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
                this.$emit('input', $event.target.value);
            },

            checkActive( item ) {
                return this.getItemValue(item) === (this.formId ? this.formValue : this.value)
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
        ? _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
            _c(
              "div",
              {
                staticClass: "fc-radio",
                class: [
                  {
                    "animated shake": _vm.shake,
                    "fc-radio_disabled": _vm.isDisabled
                  }
                ]
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
                              { "is-checked": _vm.checkActive(item) }
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
                                      "data-awes":
                                        _vm.$options.name + "." + _vm.name,
                                      disabled: _vm.isDisabled
                                    },
                                    domProps: {
                                      checked: _vm.checkActive(item),
                                      value: item.value
                                        ? item.value
                                        : item.toString()
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
          ])
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
                return Math.round( Number(this.formId ? this.formValue : this.value) / Number(this.max) * 100 )
            }
        },


        methods: {

            formValueHandler($event) {
                this.formValue = Number($event.target.value);
                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
                this.$emit('input', Number($event.target.value));
            }
        }
    };

    /* script */
    const __vue_script__$b = script$b;

    /* template */
    var __vue_render__$b = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
        _c(
          "div",
          {
            class: [
              "fb-slider",
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
                      _vm._g(
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
                    )
                  ])
                ])
              ]
            )
          ],
          1
        )
      ])
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
    let errCounter = ERR_COUNTER_MAX;

    var script$c = {

        name: 'fb-phone',

        mixins: [ fieldMixin ],

        components: {
            VueTelInput: resolve => {
                const src = [
                    'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.js',
                    'https://unpkg.com/vue-tel-input@2.0.13/dist/vue-tel-input.css'
                ];
                return AWES.utils.loadModule('vue-tel-input', src, () => {
                    resolve(VueTelInput.default);
                })
            }
        },


        props: {

            value: {
                type: String,
                default: ''
            }
        },


        data() {
            return {
                nativeTelInput: false,
            }
        },


        computed: {

            isActive() {
                return !!(this.inFocus || this.value);
            }
        },


        methods: {

            formValueHandler(value) {
                if ( ! this.error ) {
                    clearTimeout(this.__debounce);
                    this.__debounce = setTimeout(() => {
                        this.formValue = value;
                    }, Number(this.debounce));
                } else {
                    this.formValue = value;
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
            this.setFocusWatcher();
        },


        updated() {
            if ( ! this.nativeTelInput ) this.setFocusWatcher();
        }
    };

    /* script */
    const __vue_script__$c = script$c;

    /* template */
    var __vue_render__$c = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
        _c(
          "div",
          {
            class: [
              "fb-phone",
              {
                "fb-phone_disabled": _vm.isDisabled,
                "animated shake": _vm.shake,
                "fb-phone_active": _vm.isActive,
                "fb-phone_error": _vm.hasError
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
                _c("span", { staticClass: "fb-phone__label" }, [
                  _vm._v(_vm._s(_vm.label))
                ]),
                _c(
                  "vue-tel-input",
                  _vm._g(
                    {
                      ref: "tel",
                      attrs: {
                        value: _vm.formId ? _vm.formValue : _vm.value,
                        disabled: _vm.isDisabled
                      },
                      on: {
                        onBlur: function($event) {
                          _vm.inFocus = false;
                        },
                        onInput: _vm.checkFocus
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
      ])
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
                AWES._store.commit('setLoading', {
                    formName: this.formId,
                    status
                });
                if ( ! status ) this.$forceUpdate();
            },

            addFileNameToForm(rootFile, file, message, chunk) {
                delete this.filesProgress[file.uniqueIdentifier];
                try {
                    let response = JSON.parse(message);
                    let fileName = _get(response, 'meta.path', file.relativePath);
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
        "div",
        { staticClass: "grid__cell" },
        [
          _c(
            "uploader",
            {
              staticClass: "fb-uploader",
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
                    _c("uploader-btn", { staticClass: "fb-uploader__btn" }, [
                      _c("span", [_vm._v(_vm._s(_vm.$lang.FORMS_UPLOAD_ADD))])
                    ])
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
                                    _c(
                                      "table",
                                      { staticClass: "fb-uploader__list" },
                                      [
                                        _c(
                                          "tbody",
                                          [
                                            _vm._l(props.fileList, function(
                                              file,
                                              i
                                            ) {
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
                                                            _vm._s(
                                                              _vm.getName(file.name)
                                                            )
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
                                                          _vm.getExtension(
                                                            file.name
                                                          )
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
                                                          _vm._f("bytesToMb")(
                                                            file.size
                                                          )
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
                                                            click: function(
                                                              $event
                                                            ) {
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
                                                                    file
                                                                      .uniqueIdentifier
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
                                      ]
                                    )
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
                let options = _get(AWES._config, 'formBuilder.fbEditor', {});
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
            AWES.on('form-builder:before-send', this.save);
            this.$nextTick( this.initEditor );
            if ( typeof AWES._theme !== undefined ) {
                AWES.on('theme.change', this._switchThemeAttribute);
            }
        },


        beforeDestroy() {
            AWES.off('form-builder:before-send', this.save);
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
      return _c("div", { staticClass: "grid__cell", class: _vm.cellClass }, [
        _c(
          "div",
          {
            staticClass: "fb-editor",
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
      ])
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
    //
    //
    //
    //
    //

    var script$f = {
        name: 'fb-group'
    };

    /* script */
    const __vue_script__$f = script$f;

    /* template */
    var __vue_render__$f = function(_h, _vm) {
      var _c = _vm._c;
      return _c("div", { staticClass: "grid__cell-group" }, [_vm._t("default")], 2)
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
      const __vue_is_functional_template__$f = true;
      /* style inject */
      
      /* style inject SSR */
      

      
      var fbGroup = normalizeComponent_1(
        { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
        __vue_inject_styles__$f,
        __vue_script__$f,
        __vue_scope_id__$f,
        __vue_is_functional_template__$f,
        __vue_module_identifier__$f,
        undefined,
        undefined
      );

    //

    var script$g = {

        name: 'fb-switcher',

        inheritAttrs: false,

        mixins: [ checkboxFieldMixin ],


        computed: {

            rangeValue() {
                return Number( this.formId ? this.formValue : this.vModelChecked )
            }
        },


        methods: {

            formValueHandler($event) {
                let checked = +$event.target.value;
                this.formValue = this.isNumeric ? checked : Boolean(checked);
                if ( this.error ) this.resetError();
            },

            vModelHandler($event) {
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

            checkClick(currentValue) {
                this._clickTimestamp = new Date().getTime();
                this._value = currentValue;
                window.addEventListener('mouseup', this.mouseReleased, false);
            },

            mouseReleased() {
                window.removeEventListener('mouseup', this.mouseReleased, false);
                let now = new Date().getTime();

                if ( now - this._clickTimestamp < 500 &&
                    this._value === this.rangeValue) {
                    // this is a click, queue switch theme
                    setTimeout(this.toggleValue, 0, this._value);
                }
                delete this._clickTimestamp;
                delete this._value;
            },

            toggleValue( oldValue ) {
                if ( this.isDisabled ) return
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
    const __vue_script__$g = script$g;

    /* template */
    var __vue_render__$g = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "grid__cell",
          class: [{ grid__cell_padding: _vm.padding }, _vm.cellClass]
        },
        [
          _c(
            "div",
            {
              class: [
                "fb-switcher",
                {
                  "fb-switcher_error": _vm.hasError,
                  "fb-switcher_active": _vm.value,
                  "fb-switcher_disabled": _vm.isDisabled
                }
              ],
              on: {
                keyup: function($event) {
                  if (
                    !$event.type.indexOf("key") &&
                    _vm._k($event.keyCode, "space", 32, $event.key, [
                      " ",
                      "Spacebar"
                    ])
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
                                  return _vm.checkClick(_vm.rangeValue)
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
                      )
                    ]
                  ),
                  _c(
                    "span",
                    {
                      staticClass: "fb-switcher__label",
                      on: { click: _vm.toggleValue }
                    },
                    [_vm._v(_vm._s(_vm.label))]
                  )
                ]
              )
            ],
            1
          )
        ]
      )
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
      

      
      var fbSwitcher = normalizeComponent_1(
        { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
        __vue_inject_styles__$g,
        __vue_script__$g,
        __vue_scope_id__$g,
        __vue_is_functional_template__$g,
        __vue_module_identifier__$g,
        undefined,
        undefined
      );

    // importing components

    function install(Vue) {

        if ( this.installed ) return
        this.installed = true;

        Vue.component('form-builder', formBuilder);
        Vue.component('fb-group', fbGroup);
        Vue.component('fb-error-wrap', fbErrorWrap);
        Vue.component('fb-switcher', fbSwitcher);
        Vue.component('fb-input', fbInput);
        Vue.component('fb-multi-block', fbMultiBlock);
        Vue.component('fb-checkbox', fbCheckbox);
        Vue.component('fb-select', fbSelect);
        Vue.component('fb-textarea', fbTextarea);
        Vue.component('fb-code', fbCode);
        Vue.component('fb-company-slug', resolve => {
            AWES.utils.loadModule(
                'urlify',
                'https://unpkg.com/urlify@0.3.6/dist/urlify.js',
                () => { resolve(fbCompanySlug); }
            );
        });
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
        FORMS_UPLOAD_DROP: 'Drag and drop file or',
        FORMS_UPLOAD_ADD: 'Add file',
        FORMS_UPLOAD_FORMAT: 'File formats only',
        FORMS_UPLOAD_SIZE: 'Size of files no more then',
        FORMS_UPLOAD_REMOVE: 'Remove file',
        FORMS_UPLOADER_EXTENSION_ERROR: 'File %s has wrong extension',
        FORMS_UPLOADER_SIZE_ERROR: 'File %s is too big',
        FORMS_EDITOR_VISUAL: 'Visual',
        FORMS_EDITOR_CODE: 'Code'
    };

    const flattenFileds = fields => flattenObject(fields, val => ({ value: val }));
    const restoreFields = fields => restoreFlattenedObject(fields, val => val.value);
    const checkEdited = form => {
        if ( ! form.watchEdit ) return
        let equal = compareFlatObjects(form.initialState, form.fields, val => val.value);
        Vue.set(form, 'isEdited', !equal);
    };

    const state = () => ({});

    const getters = {

        form: state => name => {
            return state[name]
        },

        fields: (state, getters) => name => {
            let fields = {};
            const form = getters.form(name);
            if ( form ) {
                Object.keys(form.fields).forEach(field => fields[field] = form.fields[field].value);
            }
            return fields
        },

        errorsOrFalse: (state, getters) => name => {
            let errors = {};
            const form = getters.form(name);
            if (form) {
                Object.keys(form.fields).forEach(field => {
                    let error = form.fields[field].error;
                    if (error) errors[field] = error;
                });
            }
            return isEmpty(errors) ? false : errors
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

        field: (state, getters) => (formName, fieldName) => {
            const form = getters.form(formName);
            return form && form.fields[fieldName]
        },

        fieldValue: (state, getters) => (formName, fieldName) => {
            const field = getters.field(formName, fieldName);
            return field && field.value
        },

        fieldError: (state, getters) => (formName, fieldName) => {
            const field = getters.field(formName, fieldName);
            return field && field.error
        },

        multiblockGroupIds: (state, getters) => (formName, multiblockName) => {
            const form = getters.form(formName);
            const groupRegExp = new RegExp('^' + multiblockName + '\\[(\\d)\\]');
            const groupIds = [];
            form && Object.keys(form.fields).forEach( fieldName => {
                let found = fieldName.match(groupRegExp);
                let id = found && +found[1];
                if (id !== null && !groupIds.includes(id)) {
                    groupIds.push(id);
                }
            });
            return groupIds
        },

        firstErrorField: state => formName => {
            return state[formName] && state[formName].firstErrorField
        }
    };

    const mutations = {

        createForm(state, {formName, fields}) {
            Vue.set(state, formName, {
                initialState: flattenFileds(fields), // no shallow copys
                fields: flattenFileds(fields),
                watchEdit: ! isEmpty(fields),
                multiblocksDisabled: {},
                isLoading: false,
                isEdited: isEmpty(fields),
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
            for ( let fieldName in errors ) {
                let _fieldName = normalizePath(fieldName);
                Vue.set(form.fields[_fieldName], 'error', errors[fieldName]);
            }
        },

        createField(state, { formName, fieldName, value }) {
            const form = state[formName];
            Vue.set(form.fields, fieldName, { value });
            checkEdited(form);
        },

        setFieldValue(state, { formName, fieldName, value }) {
            const form = state[formName];
            Vue.set(form.fields[fieldName], 'value', value);
            checkEdited(form);
        },

        deleteField(state, { formName, fieldName }) {
            const form = state[formName];
            Vue.delete(form.fields, fieldName);
            checkEdited(form);
        },

        resetError(state, { formName, fieldName }) {
            Vue.delete(state[formName].fields[fieldName], 'error');
        },

        resetFirstErrorField(state, formName) {
            Vue.set(state[formName], 'firstErrorField', null);
        },

        toggleMultiblockState(state, { formName, multiblockName, status }) {
            Vue.set(state[formName].multiblocksDisabled, multiblockName, status);
        },

        /**
         * Cleanup related data if it exists, but not used in multiblock, because of rendering empty spaces
         */
        deleteMultiblockBlock: (state, { formName, multiblockName, id }) => {
            const blockRegExp = new RegExp('^' + multiblockName + `\\[${id}\\]`);
            Object.keys(state[formName].fields).filter( field => {
                let found = field.match(blockRegExp);
                return found && found[0]
            }).map( fieldName => {
                Vue.delete(state[formName].fields, fieldName);
            });
        }
    };

    const actions = {

        restoreData({ state }, { formName }) {
            const form = state[formName];

            // restore data object
            const data = restoreFields(form.fields);

            // convert data and normalize arrays if multiblocks exist
            const multiblockNames = Object.keys(form.multiblocksDisabled);
            if (multiblockNames.length) {
                normalizeArrayIndexes(data, multiblockNames);
            }

            // reset errors and set normalized multiblock indexes
            Vue.set(form, 'fields', flattenFileds(data));

            return data
        },

        sendForm({ state, commit, dispatch }, {formName, url, method}) {

            return new Promise( resolve => {

                let _res;
                const form = state[formName];

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
                            Vue.set(form, 'initialState', flattenFileds(res.data.data));
                            Vue.set(form, 'fields', flattenFileds(res.data.data));
                            if ( form.watchEdit ) Vue.set(form, 'isEdited', false);
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

    var storeShared = {

        state: {},

        mutations: {

            setData: (state, { param, data }) => {
                Vue.set(state, param, data);
            }
        }
    };

    const awesPlugin = {

        modules: {
            'vue': {
                src: 'https://unpkg.com/vue@2.5.21/dist/vue.min.js',
                cb() {
                    Vue.use(plugin);
                }
            },
            'vuex': {
                src: 'https://unpkg.com/vuex@2.5.0/dist/vuex.min.js',
                deps: ['vue'],
                cb() {
                    AWES._store = AWES._store || new Vuex.Store(storeShared);
                    AWES._store.registerModule('forms', formsModule);
                }
            },
            'vue-shortkey': {
                src: 'https://unpkg.com/vue-shortkey@3',
                deps: ['vue'],
                cb() { Vue.use(VueShortkey); }
            },
            'v-tooltip': {
                src: 'https://unpkg.com/v-tooltip@2.0.0-rc.33/dist/v-tooltip.min.js',
                deps: ['vue'],
                cb() {
                    VTooltip.default.options.popover = Object.assign(VTooltip.default.options.popover, {
                        defaultPlacement: 'right',
                        defaultAutoHide: false,
                        defaultTrigger: 'manual',
                        defaultPopperOptions: {
                            modifiers: {
                                flip: {
                                    behavior: ['right', 'top']
                                }
                            }

                        }
                    });
                }
            },
            'vue-the-mask': {
                src: 'https://unpkg.com/vue-the-mask@0.11.1/dist/vue-the-mask.js',
                deps: ['vue']
            }
        },

        install() {
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
