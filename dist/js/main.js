(function () {
  'use strict';

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

  const UNLOAD_EVENTS = [{
    type: 'beforeunload',
    handler: 'windowUnloadHandler'
  },
  {
    type: 'popstate',
    handler: 'popStateHandler'
  }];

  var script = {

    name: "form-builder",

    props: {

      cancelbtn: {
        type: Boolean,
        default: false
      },

      name: {
        type: String,
        default: () => `form-builder-${ _uniqFormId++ }`
      },

      url: {
        type: String,
        required: true
      },

      sendText: String,

      cancelText: String,
      
      loadingText: String,

      default: {
        type: Object,
        default: null
      },

      method: {
        type: String,
        default: 'post',
        validator( method ) {
          return method === undefined ||
                ['get', 'put', 'post', 'delete', 'patch'].includes( method.toLowerCase() )
        }
      },

      storeData: String,

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
    
    
    data() {
        return {
            loading: false,
            serverData: null,
            serverDataErrors: null,
            showLoader: false
        }
    },


    computed: {

      form() {
        return this.$awesForms.getters['form'](this.name)
      },

      isEdited() {
        return this.$awesForms.getters['isEdited'](this.name)
      },
      
      isBlocked() {
        return this.$awesForms.getters['isBlocked'](this.name)
      },

      workingState() {
        return this.$awesForms.getters['workingState'](this.name)
      },

      storeFormData() {
        return this.storeData ? this.$awesForms.state[this.storeData] : false;
      },

      usedFormData() {
        if ( this.storeFormData ) {
          if ( this.default ) {
            console.warn('Only VUEX STORE data will be used, despite DEFAULT data exists');
          }
          return this.storeFormData
        } else if ( this.default ) {
          return this.default
        } else {
          return false
        }
      }
    },

    watch: {

      usedFormData: {
        handler: function( fields ) {
          if ( this.form ) return // only once, to create form
          this.createForm();
          if ( fields ) {
            this.$awesForms.commit('setDefaultData', {
              id: this.name,
              fields,
            });
          }
        },
        deep: true,
        immediate: true
      },

      loading( isLoading ) {
        this.$awesForms.commit('toggleFormLoading', { id: this.name, isLoading });
      },

      serverData( data ) {
        if ( data ) {
          if ( this.storeData ) {
            this.$awesForms.commit('setData', { param: this.storeData, data: data.data });
          } else {
            this.$awesForms.commit('setDefaultData', { id: this.name, fields: data.data });
          }
          this.$awesForms.commit('resetFormEdited', this.name);
          this.serverData = null;
          this.$emit('sended', data.data);
          if ( this.modal ) this.close(this.modal.name);
        }
      },

      serverDataErrors( errors ) {
        if ( errors ) {
          this.$awesForms.commit('setErrors', { id: this.name, errors });
          this.serverDataErrors = null;
          if ( !this.disabledDialog ) {
            this.addUnloadHandlers();
          }
        }
      }
    },

    methods: {

      createForm() {
        this.$awesForms.commit( 'createForm', {
          id: this.name,
          url: this.url,
          method: this.method,
          storeData: this.storeData
        });
      },

      send() {
        AWES.emit('form-builder:before-send');
        if ( this.loading || this.isBlocked ) return
        // invoke attached @send method if present
        if ( this.$listeners.hasOwnProperty('send') ) {
          this.$emit('send', this.workingState);
        }
        // otherwise send form with serverRequest
        else {
          this.removeUnloadHandlers();
          this.$awesForms.commit('resetErrors', this.name);
          this.loading = true;
          AWES.on('core:ajax', this.onRequestProcess );
          AWES.ajax( this.workingState, this.url, this.method )
              .then( res => { 
                  if ( res.success && res.data ) {
                    this.serverData = res.data;
                  }
                  if ( ! res.success && res.data ) {
                    this.serverDataErrors = res.data;
                  }
              })
              .finally( () => {
                  this.loading = false;
                  this.showLoader = false;
                  AWES.off('core:ajax', this.onRequestProcess );
              });
        }
      },
      
      onRequestProcess(e) { 
        this.showLoader = e.detail;
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
      this.$root.$on('forms:submit', name => {
        if ( this.name === name ) this.send();
      });
      if ( this.modal ) {
        this.__unwatchModalPrevent = this.$watch('isEdited', state => {
          AWES.on(`modal::${this.modal.name}.before-close`, this.preventModalClose);
        });
      }
    },


    mounted() {
      this.addUnloadHandlers();
      if ( this.autoSubmit ) {
        this._unwatchEdit = this.$watch('form.editCounter', this.send);
      }
    },


    beforeDestroy() {
      this.removeUnloadHandlers();
      if ( typeof this.__unwatchModalPrevent === 'function' ) this.__unwatchModalPrevent();
      this.$awesForms.commit('deleteForm', this.name);
      if ( typeof this._unwatchEdit === 'function' ) this._unwatchEdit();
      AWES.off(`modal::${this.modal.name}.before-close`, this.preventModalClose);
    }
  };

  function normalizeComponent(compiledTemplate, injectStyle, defaultExport, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, isShadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof isShadowMode === 'function') {
          createInjectorSSR = createInjector;
          createInjector = isShadowMode;
          isShadowMode = false;
      }
      // Vue.extend constructor export interop
      const options = typeof defaultExport === 'function' ? defaultExport.options : defaultExport;
      // render functions
      if (compiledTemplate && compiledTemplate.render) {
          options.render = compiledTemplate.render;
          options.staticRenderFns = compiledTemplate.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      let hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (injectStyle) {
                  injectStyle.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (injectStyle) {
          hook = isShadowMode
              ? function () {
                  injectStyle.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
              }
              : function (context) {
                  injectStyle.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              const originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              const existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return defaultExport;
  }

  /* script */
  const __vue_script__ = script;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script.__file = "E:\\form-builder\\resources\\vue\\form-builder.vue";

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
        attrs: { action: _vm.url, method: _vm.method }
      },
      [
        _c(
          "div",
          { staticClass: "grid grid_forms" },
          [_vm._t("default", null, { fields: _vm.workingState })],
          2
        ),
        _vm._v(" "),
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
                      class: { "loading-inline": _vm.showLoader },
                      attrs: {
                        disabled: !_vm.isEdited || _vm.isBlocked,
                        "data-loading": _vm.$lang.FORMS_LOADING,
                        type: "submit",
                        "data-awes": "modal_button_ok"
                      },
                      on: {
                        shortkey: _vm.send,
                        click: function($event) {
                          $event.preventDefault();
                          return _vm.send($event)
                        }
                      },
                      nativeOn: {
                        click: function($event) {
                          $event.preventDefault();
                          return _vm.send($event)
                        }
                      }
                    },
                    [
                      _vm._v(
                        "\n          " +
                          _vm._s(_vm.sendText || _vm.$lang.FORMS_SEND) +
                          " "
                      ),
                      _c("span", { staticClass: "g-res--tablet-lg_n" }, [
                        _vm._v("(ctrl+enter)")
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _vm.modal || _vm.cancelbtn
                    ? _c(
                        "button",
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
                          class: { btn_transparent: _vm.cancelbtn },
                          attrs: { type: "button" },
                          on: {
                            shortkey: _vm.close,
                            click: function($event) {
                              $event.preventDefault();
                              _vm.modal ? _vm.close() : _vm.$emit("cancel");
                            }
                          }
                        },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(_vm.cancelText || _vm.$lang.FORMS_CANCEL) +
                              "\n        "
                          )
                        ]
                      )
                    : _vm._e(),
                  _vm._v(" "),
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
    

    
    var formBuilder = normalizeComponent(
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
        type: Array
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$1.__file = "E:\\form-builder\\resources\\vue\\fb-error-wrap.vue";

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
        _vm._v(" "),
        _vm.open
          ? _c(
              "span",
              {
                staticClass: "tooltip__text",
                attrs: { slot: "popover" },
                on: {
                  click: function($event) {
                    _vm.$emit("clickTooltip");
                  }
                },
                slot: "popover"
              },
              [
                !!_vm.error
                  ? _c(
                      "span",
                      { staticClass: "errors__list" },
                      _vm._l(_vm.error, function(err, i) {
                        return _c("span", { key: i }, [_vm._v(_vm._s(err))])
                      }),
                      0
                    )
                  : _vm._e()
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
    

    
    var fbErrorWrap = normalizeComponent(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      undefined,
      undefined
    );

  var fieldMixin = {

    props: {

      name: {
        type: String,
        required: true
      },

      id: Number,

      disabled: {
        type: Boolean,
        default: false
      },

      cell: {
        type: [String, Number],
        validator( cell ) {
          return [ '2', '3' ].includes( cell.toString() );
        }
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


    data() {
      return {
        tooltip: false,
        hasError: false
      }
    },


    computed: {

      realName() {
        return this.multiblock ? `${this.multiblock}.${this.id}.${this.name}` : this.name
      },

      computedValue() {
        return this.$awesForms.getters.fieldValue(this.formId, this.realName);
      },

      formLoading() {
        return this.$awesForms.getters.loading(this.formId);
      },

      inActive() {
        return !!(this.inFocus || this.value);
      },

      isDisabled() {
        return this.formLoading || this.disabled || this.isMultiblockDisabled;
      },

      isMultiblockDisabled() {
        return this.multiblock ?
               this.$awesForms.getters.multiblockDisabled(this.formId, this.multiblock) :
               false
      },

      cellClass() {
        return (this.cell) ? 'grid__cell_' + this.cell : '';
      },

      error() {
        return this.$awesForms.getters.fieldError(this.formId, this.realName);
      },

      firstErrorField() {
        return this.$awesForms.getters.firstErrorField(this.formId);
      },

      shake() {
        return !this.formLoading && this.tooltip;
      }
    },


    watch: {

      error: {
        handler: function( errors ) {
          if ( errors ) {
            this.tooltip = true;
            this.hasError = true;
            if ( this.$refs.element ) {
              this.$refs.element.addEventListener('input', this.resetError, false);
            }
            if ( typeof this.setFocus === 'function' ) {
              this.$nextTick( this.checkFocus );
            }
          } else {
            this.tooltip = false;
            this.hasError = false;
            this.resetInputWatcher();
          }
        },
        immediate: true
      }
    },


    methods: {

      createStoreInstance() {
        this.$awesForms.commit('setField', {
          id: this.formId,
          fieldName: this.realName,
          value: this.value,
          initial: true
        });
      },

      initField() {
        if ( this.computedValue !== undefined ) {
          this.value = this.computedValue;
        }
        this.createStoreInstance();
        this.__unwatchValue = this.$watch('value', this.valueHandler);
        if ( this.multiblock ) {
          this.__unwatchId= this.$watch('id', this.idHandler);
        }
      },

      idHandler(newVal, oldVal) {
        const oldName = `${this.multiblock}.${oldVal}.${this.name}`;
        const oldError = this.$awesForms.getters.fieldError(this.formId, oldName);
        if ( oldError ) {
          this.$awesForms.commit('renameError', {
            id: this.formId,
            oldName,
            newName: this.realName,
            message: oldError
          });
        }
      },

      valueHandler( newVal ) {
        this.$awesForms.commit('setField', {
          id: this.formId,
          fieldName: this.realName,
          value: newVal
        });
      },

      clickTooltip() {
        this.tooltip = false;
        if ( typeof this.setFocus === 'function' ) this.setFocus();
      },

      resetError() {
        this.tooltip = false;
        this.$awesForms.commit('resetError', { id: this.formId, fieldName: this.realName });
        this.resetInputWatcher();
      },

      resetInputWatcher() {
        if ( this.$refs.element ) {
          this.$refs.element.removeEventListener('input', this.resetError);
        }
      },

      resetValue( formId ) {
        if ( this.formId !== formId ) return
        this.value = undefined;
      },

      checkFocus() {
        if ( this.firstErrorField  === this.realName ) {
          setTimeout( this.setFocus, 0 );
          this.$awesForms.commit('resetFirstErrorField', this.formId);
        }
      }
    },


    created() {
      this.initField();
      this.$root.$on('forms:reset', this.resetValue);
    },


    beforeDestroy() {
      if ( this.multiblock ) {
        this.resetError();
        this.$awesForms.commit('unsetRealField', { id: this.formId, fieldName: this.realName });
      }
      this.__unwatchValue();
      if ( typeof this.__unwatchId === 'function' ) this.__unwatchId();
      this.resetInputWatcher();
      this.$root.$off('forms:reset', this.resetValue);
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
        return ! this.enterSkip && ! this.disabled && this.formId
      }
    },


    methods: {

      focusNext( $event ) {
        try {
          const form = $event.target.closest('form');
          const focusableFields = form.querySelectorAll('.is-focusable');
          const nextIndex = Array.from(focusableFields).findIndex( el => el === $event.target ) + 1;
          if ( nextIndex < focusableFields.length ) {
            focusableFields[nextIndex].focus();
          } else {
            $event.target.blur(); // write data to vuex
            const submitBtn = form.querySelector('[type="submit"]');
            this.$nextTick( () => {
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

      initWawesEffect( el ) {

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

  //

  let _inputsId = 0;

  var script$2 = {

      name: "fb-input",

      inheritAttrs: false,

      mixins: [ fieldMixin, focusMixin ],

      props: {
        label: {
          type: String,
          default: ''
        },
        spellcheck: {
          type: Boolean,
          default: false
        },
        mask: String
      },

      data() {
        return {
          value: '',
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
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$2.__file = "E:\\form-builder\\resources\\vue\\fb-input.vue";

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
            "input",
            {
              "form-builder_disabled": _vm.isDisabled,
              input_active: _vm.inActive || _vm.autoFilled,
              input_error: _vm.hasError,
              "animated shake": _vm.shake
            }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.tooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c(
                "label",
                {
                  staticClass: "input__label input__label_field",
                  attrs: { for: "#" + _vm.inputId }
                },
                [_vm._v(_vm._s(_vm.label))]
              ),
              _vm._v(" "),
              _vm.inputType === "checkbox" && _vm.mask
                ? _c(
                    "input",
                    _vm._b(
                      {
                        directives: [
                          {
                            name: "mask",
                            rawName: "v-mask",
                            value: _vm.mask,
                            expression: "mask"
                          },
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.value,
                            expression: "value"
                          }
                        ],
                        ref: "element",
                        class: [
                          "input__field",
                          { "is-focusable": _vm.isFocusable },
                          { "in-focus": _vm.inFocus },
                          {
                            input__field_password: _vm.$attrs.type === "password"
                          }
                        ],
                        attrs: {
                          id: _vm.inputId,
                          "data-awes": _vm.$options.name + "." + _vm.name,
                          disabled: _vm.isDisabled,
                          spellcheck: _vm.spellcheck,
                          type: "checkbox"
                        },
                        domProps: {
                          checked: Array.isArray(_vm.value)
                            ? _vm._i(_vm.value, null) > -1
                            : _vm.value
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
                              !("button" in $event) &&
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
                          animationstart: _vm.autoFillHack,
                          change: function($event) {
                            var $$a = _vm.value,
                              $$el = $event.target,
                              $$c = $$el.checked ? true : false;
                            if (Array.isArray($$a)) {
                              var $$v = null,
                                $$i = _vm._i($$a, $$v);
                              if ($$el.checked) {
                                $$i < 0 && (_vm.value = $$a.concat([$$v]));
                              } else {
                                $$i > -1 &&
                                  (_vm.value = $$a
                                    .slice(0, $$i)
                                    .concat($$a.slice($$i + 1)));
                              }
                            } else {
                              _vm.value = $$c;
                            }
                          }
                        }
                      },
                      "input",
                      _vm.$attrs,
                      false
                    )
                  )
                : _vm.inputType === "radio" && _vm.mask
                  ? _c(
                      "input",
                      _vm._b(
                        {
                          directives: [
                            {
                              name: "mask",
                              rawName: "v-mask",
                              value: _vm.mask,
                              expression: "mask"
                            },
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.value,
                              expression: "value"
                            }
                          ],
                          ref: "element",
                          class: [
                            "input__field",
                            { "is-focusable": _vm.isFocusable },
                            { "in-focus": _vm.inFocus },
                            {
                              input__field_password:
                                _vm.$attrs.type === "password"
                            }
                          ],
                          attrs: {
                            id: _vm.inputId,
                            "data-awes": _vm.$options.name + "." + _vm.name,
                            disabled: _vm.isDisabled,
                            spellcheck: _vm.spellcheck,
                            type: "radio"
                          },
                          domProps: { checked: _vm._q(_vm.value, null) },
                          on: {
                            focus: function($event) {
                              _vm.inFocus = true;
                            },
                            blur: function($event) {
                              _vm.inFocus = false;
                            },
                            keydown: function($event) {
                              if (
                                !("button" in $event) &&
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
                            animationstart: _vm.autoFillHack,
                            change: function($event) {
                              _vm.value = null;
                            }
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      )
                    )
                  : _vm.mask
                    ? _c(
                        "input",
                        _vm._b(
                          {
                            directives: [
                              {
                                name: "mask",
                                rawName: "v-mask",
                                value: _vm.mask,
                                expression: "mask"
                              },
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.value,
                                expression: "value"
                              }
                            ],
                            ref: "element",
                            class: [
                              "input__field",
                              { "is-focusable": _vm.isFocusable },
                              { "in-focus": _vm.inFocus },
                              {
                                input__field_password:
                                  _vm.$attrs.type === "password"
                              }
                            ],
                            attrs: {
                              id: _vm.inputId,
                              "data-awes": _vm.$options.name + "." + _vm.name,
                              disabled: _vm.isDisabled,
                              spellcheck: _vm.spellcheck,
                              type: _vm.inputType
                            },
                            domProps: { value: _vm.value },
                            on: {
                              focus: function($event) {
                                _vm.inFocus = true;
                              },
                              blur: function($event) {
                                _vm.inFocus = false;
                              },
                              keydown: function($event) {
                                if (
                                  !("button" in $event) &&
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
                              animationstart: _vm.autoFillHack,
                              input: function($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.value = $event.target.value;
                              }
                            }
                          },
                          "input",
                          _vm.$attrs,
                          false
                        )
                      )
                    : _vm.inputType === "checkbox"
                      ? _c(
                          "input",
                          _vm._b(
                            {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.value,
                                  expression: "value"
                                }
                              ],
                              ref: "element",
                              class: [
                                "input__field",
                                { "is-focusable": _vm.isFocusable },
                                { "in-focus": _vm.inFocus },
                                {
                                  input__field_password:
                                    _vm.$attrs.type === "password"
                                }
                              ],
                              attrs: {
                                id: _vm.inputId,
                                "data-awes": _vm.$options.name + "." + _vm.name,
                                disabled: _vm.isDisabled,
                                spellcheck: _vm.spellcheck,
                                type: "checkbox"
                              },
                              domProps: {
                                checked: Array.isArray(_vm.value)
                                  ? _vm._i(_vm.value, null) > -1
                                  : _vm.value
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
                                    !("button" in $event) &&
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
                                animationstart: _vm.autoFillHack,
                                change: function($event) {
                                  var $$a = _vm.value,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false;
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v);
                                    if ($$el.checked) {
                                      $$i < 0 && (_vm.value = $$a.concat([$$v]));
                                    } else {
                                      $$i > -1 &&
                                        (_vm.value = $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1)));
                                    }
                                  } else {
                                    _vm.value = $$c;
                                  }
                                }
                              }
                            },
                            "input",
                            _vm.$attrs,
                            false
                          )
                        )
                      : _vm.inputType === "radio"
                        ? _c(
                            "input",
                            _vm._b(
                              {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.value,
                                    expression: "value"
                                  }
                                ],
                                ref: "element",
                                class: [
                                  "input__field",
                                  { "is-focusable": _vm.isFocusable },
                                  { "in-focus": _vm.inFocus },
                                  {
                                    input__field_password:
                                      _vm.$attrs.type === "password"
                                  }
                                ],
                                attrs: {
                                  id: _vm.inputId,
                                  "data-awes": _vm.$options.name + "." + _vm.name,
                                  disabled: _vm.isDisabled,
                                  spellcheck: _vm.spellcheck,
                                  type: "radio"
                                },
                                domProps: { checked: _vm._q(_vm.value, null) },
                                on: {
                                  focus: function($event) {
                                    _vm.inFocus = true;
                                  },
                                  blur: function($event) {
                                    _vm.inFocus = false;
                                  },
                                  keydown: function($event) {
                                    if (
                                      !("button" in $event) &&
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
                                  animationstart: _vm.autoFillHack,
                                  change: function($event) {
                                    _vm.value = null;
                                  }
                                }
                              },
                              "input",
                              _vm.$attrs,
                              false
                            )
                          )
                        : _c(
                            "input",
                            _vm._b(
                              {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.value,
                                    expression: "value"
                                  }
                                ],
                                ref: "element",
                                class: [
                                  "input__field",
                                  { "is-focusable": _vm.isFocusable },
                                  { "in-focus": _vm.inFocus },
                                  {
                                    input__field_password:
                                      _vm.$attrs.type === "password"
                                  }
                                ],
                                attrs: {
                                  id: _vm.inputId,
                                  "data-awes": _vm.$options.name + "." + _vm.name,
                                  disabled: _vm.isDisabled,
                                  spellcheck: _vm.spellcheck,
                                  type: _vm.inputType
                                },
                                domProps: { value: _vm.value },
                                on: {
                                  focus: function($event) {
                                    _vm.inFocus = true;
                                  },
                                  blur: function($event) {
                                    _vm.inFocus = false;
                                  },
                                  keydown: function($event) {
                                    if (
                                      !("button" in $event) &&
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
                                  animationstart: _vm.autoFillHack,
                                  input: function($event) {
                                    if ($event.target.composing) {
                                      return
                                    }
                                    _vm.value = $event.target.value;
                                  }
                                }
                              },
                              "input",
                              _vm.$attrs,
                              false
                            )
                          ),
              _vm._v(" "),
              _vm.$attrs.type === "password"
                ? _c(
                    "button",
                    {
                      staticClass: "input__eye",
                      attrs: {
                        type: "button",
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
    

    
    var fbInput = normalizeComponent(
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

  let _uniqId = 0;

  var script$3 = {

    name: 'fb-multi-block',

    mixins: [ fieldMixin ],


    props: {

      label: String,
    },


    provide() {
      return {
        multiblock: this.multiblock ? this.realName : this.name
      }
    },


    data() {
      return {
        value: [{}],
        uniqIds: []
      }
    },


    computed: {

      hasClose() {
        return this.value.length > 1
      },
      
      errors() {
        return this.$awesForms.getters.formErrorsOrFalse(this.formId)
      }
    },


    watch: {

      disabled: {
        handler: function( value ) {
          this.$awesForms.commit('toggleMultiblockState', {
            id: this.formId,
            multiblock: this.realName,
            value
          });
        },
        immediate: true
      }
    },


    methods: {

      initField() {
        if ( this.computedValue !== undefined &&
             this.computedValue.length ) {
          this.value = this.computedValue;
          for ( let i in this.computedValue ) this.uniqIds.push( _uniqId++ );
        } else {
          this.uniqIds.push( _uniqId++ );
        }
        this.createStoreInstance();
        this.__unwatchValue = this.$watch('value', this.valueHandler);
      },

      addField() {
        if ( this.isDisabled ) return
        this.value.push({});
        this.uniqIds.push( _uniqId++ );
        this.updateTooltips();
      },

      removeField( id ) {
        if ( this.isDisabled ) return
        this.$delete(this.value, id);
        this.uniqIds.splice(id, 1);
        this.updateTooltips();
      },

      resetValue() {
        this.value = [{}];
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
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$3.__file = "E:\\form-builder\\resources\\vue\\fb-multi-block.vue";

  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "grid__wrap" }, [
      _c(
        "div",
        {
          staticClass: "multi-bl",
          class: [{ "form-builder_disabled": this.isDisabled }]
        },
        [
          _vm._l(_vm.value, function(item, id) {
            return _c(
              "div",
              {
                key: "slot-" + _vm.uniqIds[id],
                class: ["grid__wrap", { "multi-bl_has-close": _vm.hasClose }]
              },
              [
                _vm._t("default", null, { id: id }),
                _vm._v(" "),
                _vm.hasClose
                  ? _c(
                      "button",
                      {
                        staticClass: "multi-bl__clear",
                        attrs: { "aria-label": "delete" },
                        on: {
                          click: function($event) {
                            $event.preventDefault();
                            _vm.removeField(id);
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
          _vm._v(" "),
          _c("div", { staticClass: "grid__wrap" }, [
            _c(
              "button",
              {
                staticClass: "multi-bl__add",
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.addField($event)
                  }
                }
              },
              [
                _vm._v(
                  "\n        " +
                    _vm._s(_vm.label || _vm.$lang.FORMS_MULTIBLOCK_ADD) +
                    "\n      "
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
    

    
    var fbMultiBlock = normalizeComponent(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  //

  var script$4 = {

    name: 'fb-checkbox',

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
      },

      theme: String,
    },


    data() {
      return {
        value: false
      }
    },


    computed: {

      themeClass() {
        return this.theme ? `checkbox_${this.theme}` : null
      },
      
      isSwitcher() {
        return this.theme === 's2'
      }
    },

    methods: {
      
      enableSwitcher() {
        this.__hammer = new Hammer.Manager( this.$refs.switcher, {
            recognizers: [
                [ Hammer.Swipe, {
                    threshold: 5,
                    velocity: .1,
                    direction: Hammer.DIRECTION_HORIZONTAL
                }]
            ]
        });
        this.__hammer.on('swipeleft', () => { this.value = false; });
        this.__hammer.on('swiperight', () => { this.value = true; });
      }
    },

    mounted() {
      if ( this.isSwitcher ) this.enableSwitcher();
    },
    
    beforeDestroy() {
      if ( this.isSwitcher ) {
        this.__hammer.destroy();
        delete this.__hammer;
      }
    }
  };

  /* script */
  const __vue_script__$4 = script$4;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$4.__file = "E:\\form-builder\\resources\\vue\\fb-checkbox.vue";

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
              "checkbox",
              { checkbox_error: _vm.hasError },
              { checkbox_active: _vm.inActive },
              _vm.themeClass,
              { "form-builder_disabled": _vm.isDisabled }
            ]
          },
          [
            _c(
              "label",
              {
                staticClass: "checkbox__label",
                attrs: { "data-awes": _vm.$options.name + "." + _vm.name }
              },
              [
                _c(
                  "fb-error-wrap",
                  {
                    attrs: { open: _vm.tooltip, error: _vm.error },
                    on: { clickTooltip: _vm.clickTooltip }
                  },
                  [
                    _c(
                      "input",
                      _vm._b(
                        {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.value,
                              expression: "value"
                            }
                          ],
                          ref: "element",
                          class: {
                            "is-focusable": _vm.isFocusable,
                            "in-focus": _vm.inFocus
                          },
                          attrs: { type: "checkbox", disabled: _vm.isDisabled },
                          domProps: {
                            checked: Array.isArray(_vm.value)
                              ? _vm._i(_vm.value, null) > -1
                              : _vm.value
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
                                !("button" in $event) &&
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
                            change: function($event) {
                              var $$a = _vm.value,
                                $$el = $event.target,
                                $$c = $$el.checked ? true : false;
                              if (Array.isArray($$a)) {
                                var $$v = null,
                                  $$i = _vm._i($$a, $$v);
                                if ($$el.checked) {
                                  $$i < 0 && (_vm.value = $$a.concat([$$v]));
                                } else {
                                  $$i > -1 &&
                                    (_vm.value = $$a
                                      .slice(0, $$i)
                                      .concat($$a.slice($$i + 1)));
                                }
                              } else {
                                _vm.value = $$c;
                              }
                            }
                          }
                        },
                        "input",
                        _vm.$attrs,
                        false
                      )
                    ),
                    _vm._v(" "),
                    _c("span", { staticClass: "checkbox__text" }, [
                      _c("i", {
                        ref: "switcher",
                        staticClass: "icon icon-checkbox"
                      }),
                      _vm._v(" "),
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
    

    
    var fbCheckbox = normalizeComponent(
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

  var script$5 = {

    name: "fb-select",

    // inheritAttrs: false,

    mixins: [ fieldMixin ],

    components: { 
        Multiselect: resolve => {
            AWES.utils.loadModules({
                'vue-multiselect': {
                    src: ['https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.js',
                          'https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css'],
                    deps: ['vue'],
                    cb() { resolve(window.VueMultiselect.default); }
                },
            });
        }
    },

    props: {

      label: String,

      selectOptions: {
        type: Array,
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
        selected: [],
        isOpened: false
      }
    },


    computed: {

      value: {

        get() {
          return this.multiple ?
                  this.selected.map( item => item.value) :
                  this.selected.value;
        },

        set( value ) {
          if ( this.multiple ) {
            this.selected = this.selectOptions.filter( item => {
              return value.includes(item.value);
            });
          } else {
            this.selected = this.selectOptions.find( item => {
              return value === item.value;
            });
          }
        }
      },

      hasValue() {
        return !! ( this.multiple ? this.value.length : this.value );
      },

      inActive() {
        return this.isOpened || this.hasValue;
      }
    },

    methods: {

      resetValue( formId ) {
        if ( this.formId !== formId ) return
        this.value = [];
      }
    }
  };

  /* script */
  const __vue_script__$5 = script$5;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$5.__file = "E:\\form-builder\\resources\\vue\\fb-select.vue";

  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
      _c(
        "div",
        {
          staticClass: "mselect",
          class: [
            { mselect_active: _vm.inActive },
            { mselect_opened: _vm.isOpened },
            { "form-builder_disabled": _vm.disabled }
          ]
        },
        [
          _c("span", { staticClass: "mselect__label" }, [
            _vm._v(_vm._s(_vm.label || _vm.$lang.FORMS_SELECT_LABEL))
          ]),
          _vm._v(" "),
          _c("multiselect", {
            staticClass: "mselect__field",
            attrs: {
              "show-labels": false,
              multiple: _vm.multiple,
              placeholder:
                _vm.placeholderText || _vm.$lang.FORMS_SELECT_PLACEHOLDER,
              options: _vm.selectOptions,
              label: "name",
              "track-by": "value",
              "hide-selected": true,
              disabled: _vm.isDisabled
            },
            on: {
              open: function($event) {
                _vm.isOpened = true;
              },
              close: function($event) {
                _vm.isOpened = false;
              }
            },
            model: {
              value: _vm.selected,
              callback: function($$v) {
                _vm.selected = $$v;
              },
              expression: "selected"
            }
          })
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
    

    
    var fbSelect = normalizeComponent(
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

  let unwatcher;

  var script$6 = {

    name: "fb-textarea",

    inheritAttrs: false,

    mixins: [ fieldMixin, focusMixin ],


    props: {

      label: {
        type: String,
        default: ''
      },

      fixsize: {
        type: Boolean,
        default: false
      }
    },


    data() {
      return {
        value: '',
      }
    },


    methods: {

      setAutoResize() {
        if ( ! this.fixsize ) {
          autosize( this.$refs.element );
          unwatcher = this.$watch('value', this.updateAutoResize);
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
    },

    beforeDestroy() {
      if ( typeof unwatcher === 'function' ) unwatcher();
    }

  };

  /* script */
  const __vue_script__$6 = script$6;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$6.__file = "E:\\form-builder\\resources\\vue\\fb-textarea.vue";

  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
      _c(
        "div",
        {
          staticClass: "input input_textarea",
          class: {
            "form-builder_disabled": _vm.isDisabled,
            input_active: _vm.inActive,
            input_error: _vm.hasError,
            "animated shake": _vm.shake
          }
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.tooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c("span", { staticClass: "input__label" }, [
                _vm._v(_vm._s(_vm.label))
              ]),
              _vm._v(" "),
              _c(
                "textarea",
                _vm._b(
                  {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.value,
                        expression: "value"
                      }
                    ],
                    ref: "element",
                    class: [
                      "input__textarea",
                      { "is-focusable": _vm.isFocusable },
                      { "in-focus": _vm.inFocus }
                    ],
                    attrs: { disabled: _vm.isDisabled },
                    domProps: { value: _vm.value },
                    on: {
                      focus: function($event) {
                        _vm.inFocus = true;
                      },
                      blur: function($event) {
                        _vm.inFocus = false;
                      },
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.value = $event.target.value;
                      }
                    }
                  },
                  "textarea",
                  _vm.$attrs,
                  false
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
    

    
    var fbTextarea = normalizeComponent(
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

      mixins: [fieldMixin, focusMixin],

      props: {

          length: {
              type: Number,
              default: 6
          },

          autoSubmit: {
              type: Boolean,
              default: true
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

          hasCaptchaError() {
              return this.$awesForms.getters['hasCaptchaError'](this.formId)
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
          },

          autoSubmitForm(value) {
              if (this.hasCaptchaError) return
              if (value.length === this.length) {
                  this.$root.$emit('forms:submit', this.formId);
              }
          }
      },

      created() {
          for (let index = 0; index < this.length; index++) {
              this.inFocus.push(index === 0 && this.focus ? true : false);
              this.inputValue.push('');
          }

          if (this.autoSubmit) {
              this.__unwatchFormSubmit = this.$watch('value', this.autoSubmitForm);
          }
      },

      beforeDestroy() {
          this.$refs.fields.forEach(field => {
              field.removeEventListener('input', this.resetError);
          });
          if (this.__unwatchFormSubmit) this.__unwatchFormSubmit();
      }
  };

  /* script */
  const __vue_script__$7 = script$7;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$7.__file = "E:\\form-builder\\resources\\vue\\fb-code.vue";

  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      {
        class: [
          "keycode",
          { "animated shake": _vm.shake },
          { "form-builder_disabled": _vm.isDisabled }
        ]
      },
      [
        _c(
          "div",
          { staticClass: "keycode__block" },
          [
            _c(
              "fb-error-wrap",
              {
                attrs: { open: _vm.tooltip, error: _vm.error },
                on: { clickTooltip: _vm.clickTooltip }
              },
              [
                _c(
                  "div",
                  { staticClass: "keycode__wrap", attrs: { id: "keywrap" } },
                  _vm._l(_vm.length, function(i) {
                    return _c("div", { key: i, staticClass: "keycode__ffield" }, [
                      _c("input", {
                        ref: "fields",
                        refInFor: true,
                        class: [
                          "keycode__field",
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
                                !("button" in $event) &&
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
                                !("button" in $event) &&
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
                                !("button" in $event) &&
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
                                !("button" in $event) &&
                                _vm._k($event.keyCode, "right", 39, $event.key, [
                                  "Right",
                                  "ArrowRight"
                                ])
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
                            _vm.onInput($event, i - 1);
                          },
                          paste: function($event) {
                            $event.preventDefault();
                            return _vm.onPaste($event)
                          }
                        }
                      })
                    ])
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
    

    
    var fbCode = normalizeComponent(
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
          length: 32,
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

          domain: String,

          input: {
              type: String,
              required: true
          },

          maxLength: Number,
      },


      data() {
          return {
              watchInput: true
          }
      },


      computed: {

          fromName() {
              return this.multiblock ? `${this.multiblock}.${this.id}.${this.input}` : this.input
          },

          fromValue() {
              return this.$awesForms.getters['fieldValue'](this.formId, this.fromName);
          }
      },


      watch: {

          fromValue( val ) {
              if ( ! this.watchInput || ! val ) return
              this.value = this.noramlizeUrl(val); 
          }
      },


      methods: {

          noramlizeUrl( string ) {
              return this._toUrl(string).substr(0, this.maxlength)
          },

          toggleWatcher( $event ) {
              if ( $event.target.value === '' ) {
                  this.watchInput = true;
              } else if ( this.watchInput ) {
                  this.watchInput = false;
              }
          },
          
          slugBlur( $event ) {
              this.inFocus = false;
              if ( ! this.watchInput ) {
                  this.value = this.noramlizeUrl( $event.target.value );
              }
          }
      },


      beforeCreate() {
          this._config = Object.assign({}, _config.companySlug, AWES._config.companySlug);
          this._toUrl = Urlify.create(this._config.ulrifyOptions);
      }
  };

  /* script */
  const __vue_script__$8 = script$8;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$8.__file = "E:\\form-builder\\resources\\vue\\fb-company-slug.vue";

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
            "input",
            "input_company",
            {
              "form-builder_disabled": _vm.isDisabled,
              input_active: _vm.inActive,
              input_error: _vm.hasError,
              "animated shake": _vm.shake
            }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.tooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c("div", { staticClass: "input__group-wrap" }, [
                _c("span", { staticClass: "input__group-field" }, [
                  _c(
                    "label",
                    {
                      staticClass: "input__label",
                      attrs: { for: "#" + _vm.inputId }
                    },
                    [_vm._v(_vm._s(_vm.label))]
                  ),
                  _vm._v(" "),
                  _c(
                    "input",
                    _vm._b(
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.value,
                            expression: "value"
                          }
                        ],
                        ref: "element",
                        class: [
                          "input__field",
                          { "is-focusable": _vm.isFocusable },
                          { "in-focus": _vm.inFocus }
                        ],
                        attrs: {
                          id: _vm.inputId,
                          "data-awes": _vm.$options.name + "." + _vm.name,
                          maxlength: _vm.maxLength || _vm._config.length,
                          type: "text",
                          disabled: _vm.isDisabled
                        },
                        domProps: { value: _vm.value },
                        on: {
                          input: [
                            function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.value = $event.target.value;
                            },
                            _vm.toggleWatcher
                          ],
                          focus: function($event) {
                            _vm.inFocus = true;
                          },
                          blur: _vm.slugBlur,
                          keydown: function($event) {
                            if (
                              !("button" in $event) &&
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
                ]),
                _vm._v(" "),
                _c("span", { staticClass: "input__group-label" }, [
                  _vm._v("." + _vm._s(_vm.domain || _vm._config.domain))
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
    

    
    var fbCompanySlug = normalizeComponent(
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

    mixins: [ fieldMixin ],


    props: {

      show: {
        type: Boolean,
        default: false
      },

      name: {
        type: String,
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
          let theme = this.$store.state.theme;
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
        this.value = response;
        this.resetError();
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
      if ( ! this.$isServer ) this.manageCaptchaScript('add');
    },

    beforeDestroy() {
      this.manageCaptchaScript('remove');
    }
  };

  /* script */
  const __vue_script__$9 = script$9;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$9.__file = "E:\\form-builder\\resources\\vue\\fb-auto-captcha.vue";

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
                attrs: { open: _vm.tooltip, error: _vm.error },
                on: { clickTooltip: _vm.clickTooltip }
              },
              [
                _c("vue-recaptcha", {
                  ref: "recaptcha",
                  staticClass: "re-captcha",
                  attrs: { sitekey: _vm.sitekey, theme: _vm.theme },
                  on: {
                    verify: _vm.onVerify,
                    expired: function($event) {
                      _vm.value = null;
                    }
                  }
                })
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
    

    
    var fbAutoCaptcha = normalizeComponent(
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

      mixins: [ fieldMixin, focusMixin ],


      props: {
          items: Array
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
              this.inFocus.push( index === 0 && this.focus ? true : false );
          }
      }
  };

  /* script */
  const __vue_script__$a = script$a;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$a.__file = "E:\\form-builder\\resources\\vue\\fb-radio-group.vue";

  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _vm.items && _vm.items.length
      ? _c("div", { staticClass: "grid__cell", class: [_vm.cellClass] }, [
          _c(
            "div",
            { staticClass: "fc-radio", class: [{ "animated shake": _vm.shake }] },
            [
              _c(
                "fb-error-wrap",
                {
                  attrs: { open: _vm.tooltip, error: _vm.error },
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
                            _vm._b(
                              {
                                directives: [
                                  {
                                    name: "model",
                                    rawName: "v-model",
                                    value: _vm.value,
                                    expression: "value"
                                  }
                                ],
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
                                  disabled: _vm.isDisabled
                                },
                                domProps: {
                                  value: item.value
                                    ? item.value
                                    : item.toString(),
                                  checked: _vm._q(
                                    _vm.value,
                                    item.value ? item.value : item.toString()
                                  )
                                },
                                on: {
                                  focus: function($event) {
                                    _vm.$set(_vm.inFocus, i, true);
                                  },
                                  blur: function($event) {
                                    _vm.$set(_vm.inFocus, i, false);
                                  },
                                  keydown: function($event) {
                                    if (
                                      !("button" in $event) &&
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
                                  change: function($event) {
                                    _vm.value = item.value
                                      ? item.value
                                      : item.toString();
                                  }
                                }
                              },
                              "input",
                              _vm.$attrs,
                              false
                            )
                          ),
                          _vm._v(" "),
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
    

    
    var fbRadioGroup = normalizeComponent(
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

      mixins: [ fieldMixin, focusMixin ],

      props: {
        label: {
          type: String,
          default: ''
        },
        min: {
          type: [Number,String],
          default: 0
        },
        max: {
          type: [Number,String],
          default: 100
        }
      },

      data() {
        return {
          value: 0,
          inputType: this.$attrs.type || 'text',
          autoFilled: false
        }
      },

      computed: {
        
        inputId() {
          return 'slider-' + _sliderId++
        },

        percent() {
            return Math.round( Number(this.value) / Number(this.max) * 100 )
        }
      }
    };

  /* script */
  const __vue_script__$b = script$b;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$b.__file = "E:\\form-builder\\resources\\vue\\fb-slider.vue";

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
            "input",
            "input_range",
            {
              "form-builder_disabled": _vm.isDisabled,
              input_active: _vm.inActive,
              input_error: _vm.hasError,
              "animated shake": _vm.shake
            }
          ]
        },
        [
          _c(
            "fb-error-wrap",
            {
              attrs: { open: _vm.tooltip, error: _vm.error },
              on: { clickTooltip: _vm.clickTooltip }
            },
            [
              _c("div", { staticClass: "input__range-wrap" }, [
                _c("div", { staticClass: "input__range-left" }, [
                  _c(
                    "label",
                    {
                      staticClass: "input__label input__label_field",
                      attrs: { for: "#" + _vm.inputId }
                    },
                    [_vm._v(_vm._s(_vm.label))]
                  ),
                  _vm._v(" "),
                  _c("span", { staticClass: "input__range-value" }, [
                    _vm._v(_vm._s(_vm.percent) + " %")
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "input__range-right" }, [
                  _c(
                    "input",
                    _vm._b(
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.value,
                            expression: "value"
                          }
                        ],
                        ref: "element",
                        class: [
                          "input__range",
                          { "is-focusable": _vm.isFocusable },
                          { "in-focus": _vm.inFocus },
                          {
                            input__field_password: _vm.$attrs.type === "password"
                          }
                        ],
                        style: "--percent: " + _vm.percent + "%",
                        attrs: {
                          id: _vm.inputId,
                          "data-awes": _vm.$options.name + "." + _vm.name,
                          type: "range",
                          disabled: _vm.isDisabled
                        },
                        domProps: { value: _vm.value },
                        on: {
                          focus: function($event) {
                            _vm.inFocus = true;
                          },
                          blur: function($event) {
                            _vm.inFocus = false;
                          },
                          keydown: function($event) {
                            if (
                              !("button" in $event) &&
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
                          __r: function($event) {
                            _vm.value = $event.target.value;
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
    

    
    var fbSlider = normalizeComponent(
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

      mixins: [ fieldMixin, focusMixin ],

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
          label: String
      },


      data() {
          return {
              nativeTelInput: false,
              value: ''
          }
      },


      methods: {

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
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$c.__file = "E:\\form-builder\\resources\\vue\\fb-phone.vue";

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
            "input",
            "input_phone",
            {
              "form-builder_disabled": _vm.isDisabled,
              "animated shake": _vm.shake,
              input_active: _vm.inActive,
              input_error: _vm.hasError
            }
          ]
        },
        [
          _c("span", { staticClass: "input__label" }, [
            _vm._v(_vm._s(_vm.label))
          ]),
          _vm._v(" "),
          _c("vue-tel-input", {
            ref: "tel",
            attrs: { disabled: _vm.isDisabled },
            on: {
              onBlur: function($event) {
                _vm.inFocus = false;
              },
              onInput: _vm.checkFocus
            },
            model: {
              value: _vm.value,
              callback: function($$v) {
                _vm.value = $$v;
              },
              expression: "value"
            }
          })
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
    

    
    var fbPhone = normalizeComponent(
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
              value: [],
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

          toggleFormBlock(isBlocked) {
              this.$awesForms.commit('toggleFormBlocked', {
                  id: this.formId,
                  isBlocked
              });
              if ( ! isBlocked ) this.$forceUpdate();
          },

          addFileNameToForm(rootFile, file, message, chunk) {
              delete this.filesProgress[file.uniqueIdentifier];
              try {
                  let response = JSON.parse(message);
                  let fileName = _.get(response, 'meta.path', file.relativePath);
                  this.value.push(fileName);
              } catch(e) {
                  console.log(e);
              }
          },

          removeFile(file, index) {
              if ( file.isComplete() ) {
                  this.value.splice(index, 1);
              }
              file.cancel();
              delete this.filesProgress[file.uniqueIdentifier];
          }
      }
  };

  /* script */
  const __vue_script__$d = script$d;
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$d.__file = "E:\\form-builder\\resources\\vue\\fb-uploader.vue";

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
            class: { "form-builder_disabled": _vm.isDisabled },
            attrs: { options: _vm.uploaderOptions },
            on: {
              "file-added": _vm.checkFile,
              "file-progress": _vm.setProgress,
              "file-success": _vm.addFileNameToForm,
              "upload-start": function($event) {
                _vm.toggleFormBlock(true);
              },
              complete: function($event) {
                _vm.toggleFormBlock(false);
              }
            }
          },
          [
            _c("uploader-unsupport"),
            _vm._v(" "),
            _c("uploader-drop", [
              _c(
                "p",
                { staticClass: "fb-uploader__message" },
                [
                  _vm._v(
                    "\n                " +
                      _vm._s(_vm.$lang.FORMS_UPLOAD_DROP) +
                      "\n                "
                  ),
                  _c("span", { staticClass: "fb-uploader__fakebtn" }, [
                    _vm._v(_vm._s(_vm.$lang.FORMS_UPLOAD_ADD))
                  ]),
                  _vm._v(" "),
                  _c("uploader-btn", { staticClass: "fb-uploader__btn" }, [
                    _c("span", [_vm._v(_vm._s(_vm.$lang.FORMS_UPLOAD_ADD))])
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _vm.format || _vm.size
                ? _c("p", [
                    _vm.format
                      ? _c("i", { staticClass: "fb-uploader__formats" }, [
                          _vm._v(
                            "\n                    " +
                              _vm._s(_vm.$lang.FORMS_UPLOAD_FORMAT) +
                              " " +
                              _vm._s(_vm.formatString) +
                              ".\n                "
                          )
                        ])
                      : _vm._e(),
                    _vm._v(" "),
                    _vm.size
                      ? _c("i", { staticClass: "fb-uploader__size" }, [
                          _vm._v(
                            "\n                    " +
                              _vm._s(_vm.$lang.FORMS_UPLOAD_SIZE) +
                              " " +
                              _vm._s(_vm.size) +
                              "Mb\n                "
                          )
                        ])
                      : _vm._e()
                  ])
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("uploader-list", {
              scopedSlots: _vm._u([
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
                                              _vm._v(" "),
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
                                              _vm._v(" "),
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
                                              _vm._v(" "),
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
                                              _vm._v(" "),
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
                                                          "\n                                                " +
                                                            _vm._s(
                                                              _vm._f(
                                                                "timestampToDate"
                                                              )(
                                                                file._lastProgressCallback
                                                              )
                                                            ) +
                                                            "\n                                            "
                                                        )
                                                      ]
                                                    : _vm._e()
                                                ],
                                                2
                                              ),
                                              _vm._v(" "),
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
                                                          _vm.removeFile(file, i);
                                                        }
                                                      }
                                                    },
                                                    [_vm._v("×")]
                                                  )
                                                ]
                                              )
                                            ]),
                                            _vm._v(" "),
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
              ])
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
    

    
    var fbUploader = normalizeComponent(
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

  let _uid = 0,
      codeEditor;

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
              codeEditorInited: false,
              value: ''
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
              let options = _.get(AWES._config, 'formBuilder.fbEditor', {});
              Object.assign(options, this.options, defaultOptions);
              tinymce.init(options);
              const editor = tinymce.get(this.editorId);
              editor.on('Change', _.debounce(this.save, 1000));
              if ( typeof AWES._theme !== undefined ) {
                  editor.once('Init', () => {
                      this._switchThemeAttribute({detail: AWES._theme});
                  });
              }
          },

          initCodeEditor() {
              this.codeEditorInited = true;
              codeEditor = CodeMirror.fromTextArea( this.$refs.code, defaultCodeOptions);
              codeEditor.on('update', _.debounce(this.save, 1000));
              return codeEditor
          },

          save() {
              this.mode === 'visual' ? this._saveVisual() : this._saveCode();
          },

          _saveVisual() {
              this.value = tinymce.get(this.editorId).save();
          },

          _saveCode() {
              if ( codeEditor ) this.value = codeEditor.doc.getValue();
          },

          _setCodeValue() {
              codeEditor.doc.setValue( this.value );
              setTimeout( () => { codeEditor.refresh(); }, 1);
          },

          _switchThemeAttribute($event) {
              const doc = tinymce.get(this.editorId).getDoc();
              if ( $event.detail === 1 ) {
                  doc.documentElement.setAttribute('data-dark', true);
              } else {
                  doc.documentElement.removeAttribute('data-dark');
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
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$e.__file = "E:\\form-builder\\resources\\vue\\fb-editor.vue";

  /* template */
  var __vue_render__$e = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "grid__cell", class: _vm.cellClass }, [
      _c(
        "div",
        {
          staticClass: "input input_editor",
          class: { "form-builder_disabled": _vm.isDisabled }
        },
        [
          _c("div", { staticClass: "input__editor-modes" }, [
            _c(
              "button",
              {
                class: [
                  "input__modes-button",
                  { "is-active": _vm.mode === "visual" }
                ],
                attrs: { type: "button" },
                on: {
                  click: function($event) {
                    _vm.mode = "visual";
                  }
                }
              },
              [
                _vm._v(
                  "\n                " +
                    _vm._s(_vm.$lang.FORMS_EDITOR_VISUAL) +
                    "\n            "
                )
              ]
            ),
            _vm._v(" "),
            _c(
              "button",
              {
                class: [
                  "input__modes-button",
                  { "is-active": _vm.mode === "code" }
                ],
                attrs: { type: "button" },
                on: {
                  click: function($event) {
                    _vm.mode = "code";
                  }
                }
              },
              [
                _vm._v(
                  "\n                " +
                    _vm._s(_vm.$lang.FORMS_EDITOR_CODE) +
                    "\n            "
                )
              ]
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "input__editor-tabs" }, [
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
                staticClass: "fb-input__editor-tab"
              },
              [
                _c(
                  "textarea",
                  {
                    staticClass: "input__editor-tiny",
                    attrs: { id: _vm.editorId }
                  },
                  [_vm._v(_vm._s(_vm.value))]
                )
              ]
            ),
            _vm._v(" "),
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
                staticClass: "fb-input__editor-tab"
              },
              [
                _c(
                  "textarea",
                  {
                    ref: "code",
                    staticClass: "input__editor-codemirror",
                    attrs: { id: _vm.codeEditorId }
                  },
                  [_vm._v(_vm._s(_vm.value))]
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
    

    
    var fbEditor = normalizeComponent(
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
  // For security concerns, we use only base name in production mode. See https://github.com/vuejs/rollup-plugin-vue/issues/258
  script$f.__file = "E:\\form-builder\\resources\\vue\\fb-group.vue";

  /* template */
  var __vue_render__$f = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
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
    const __vue_is_functional_template__$f = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var fbGroup = normalizeComponent(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
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
      FORMS_MULTIBLOCK_ADD: 'add',
      FORMS_SELECT_LABEL: 'Select a value',
      FORMS_SELECT_PLACEHOLDER: 'Pick a value',
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

  function reactiveUpdate( state, formId, fieldName, value ) {

    let form = state.forms.find( form => form.id == formId );
    const index = state.forms.findIndex( form => form.id == formId );

    value === null ? _.unset( form, fieldName ) : _.set( form, fieldName, value );

    Vue.set( state.forms, index, form ); // reactive update
  }

  const FORM_SCHEMA = ({ id, url, method, storeData }) => {
    return {
      id,
      url,
      storeData,
      initialState: {
        _method: method
      },
      realFields: [],
      workingState: {},
      loading: false,
      isEdited: false,
      isBlocked: false,
      editCounter: 0,
      errors: {},
      firstErrorField: null,
      multiblockState: {}
    }
  };


  const state = {
    forms: []
  };


  const getters = {

    form: ( state ) => formId => {
      return state.forms.find( form => form.id == formId )
    },
    
    formErrorsOrFalse: ( state, getters ) => formId => {
      const errors = getters.form(formId).errors;
      return Object.keys(errors).length ? errors : false
    },

    isEdited: ( state, getters ) => formId => {
      return getters.form(formId).isEdited
    },

    isBlocked: ( state, getters ) => formId => {
      return getters.form(formId).isBlocked
    },

    fieldValue: ( state, getters ) => ( formId, fieldName ) => {
      return _.get( getters.form(formId).workingState, fieldName )
    },

    fieldError: ( state, getters ) => ( formId, fieldName ) => {
      return _.get( getters.form(formId).errors, fieldName )
    },

    firstErrorField: ( state, getters ) => formId => {
      return getters.form(formId).firstErrorField
    },

    workingState: ( state, getters ) => formId => {
      const form = getters.form( formId );
      return form.workingState;
    },

    loading: ( state, getters ) => formId => {
      return getters.form(formId).loading
    },

    multiblockDisabled: ( state, getters ) => ( formId, multiblock ) => {
      return _.get( getters.form(formId).multiblockState, multiblock )
    },
   
    hasCaptchaError: ( state, getters ) => formId => {
      return getters.form(formId).errors.hasOwnProperty('g-recaptcha-response') ? true : false
    }
  };


  const mutations = {

    createForm( state, payload ) {
      if ( this.getters['form'](payload.id) ) {
        throw new Error(`Form with ID ${payload.id} already exists`)
      }
      state.forms.push( FORM_SCHEMA(payload) );
    },

    deleteForm( state, id ) {
      const formIndex = state.forms.findIndex( form => form.id === id);
      if ( formIndex !== -1 ) {
        Vue.delete( state.forms, formIndex);
      } else {
        console.warn('No form to delete with id: ' + id );
      }
    },

    setDefaultData( state, { id, fields }) {
      const form = this.getters['form'](id);
      form.initialState = _.merge( form.initialState,  _.cloneDeep( fields ) );
      form.workingState = _.cloneDeep( form.initialState );
    },

    resetFormEdited( state, id ) {
      const form = this.getters['form'](id);
      form.isEdited = false;
    },

    setErrors( state, { id, errors } ) {
      const form = this.getters['form'](id);
      form.firstErrorField = Object.keys(errors)[0];
      form.errors = errors;
    },

    resetError( state, { id, fieldName }) {
      const form = this.getters['form'](id);
      if ( form ) {
        delete form.errors[fieldName];
        reactiveUpdate( state, id, `errors`, form.errors );
      }
    },

    resetErrors( state, id ) {
      this.getters['form'](id).errors = {};
    },

    renameError( state, { id, oldName, newName, message }) {
      const form = this.getters['form'](id);
      Vue.set( form.errors, newName, message );
      Vue.delete( form.errors, oldName );
    },

    setField( state, { id, fieldName, value, initial }) {
      reactiveUpdate( state, id, `workingState.${fieldName}`, value );
      const form = this.getters['form'](id);
      if ( initial ) form.realFields.push(fieldName);
      if ( initial !== true ) {
        form.editCounter += 1;
        form.isEdited = true;
      }
    },

    unsetRealField( state, { id, fieldName }) {
      const form = this.getters['form'](id);
      if ( ! form ) return
      let index = form.realFields.indexOf(fieldName);
      Vue.delete(form.realFields, index);
    },

    toggleFormLoading( state, {id, isLoading }) {
      const form = this.getters['form'](id);
      form.loading = isLoading;
    },

    toggleFormBlocked( state, {id, isBlocked }) {
      const form = this.getters['form'](id);
      form.isBlocked = isBlocked;
    },

    toggleMultiblockState( state, {id, multiblock, value} ) {
      const form = this.getters['form'](id);
      reactiveUpdate( state, id, `multiblockState.${multiblock}`, value );
    },

    resetFirstErrorField( state, id ) {
      const form = this.getters['form'](id);
      form.firstErrorField = null;
    }
  };


  var storeModule = {
    state,
    getters,
    mutations
  };

  const awesPlugin = {

      modules: {
          'vue': {
              src: 'https://unpkg.com/vue@2.5.21/dist/vue.min.js',
              cb() {
                  Vue.use(plugin);
              }
          },
          'lodash': 'https://unpkg.com/lodash@4.17.11/lodash.min.js',
          'vuex': {
              src: 'https://unpkg.com/vuex@2.5.0/dist/vuex.min.js',
              deps: ['vue'],
              cb() {
                  Vue.prototype.$awesForms = new Vuex.Store(storeModule);
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
          'vue-recaptcha': {
              src: 'https://unpkg.com/vue-recaptcha@latest/dist/vue-recaptcha.min.js',
              deps: ['vue'],
              cb() {
                  Vue.component('vue-recaptcha', window.VueRecaptcha);
              }
          },
          'vue-the-mask': {
              src: 'https://unpkg.com/vue-the-mask@0.11.1/dist/vue-the-mask.js',
              deps: ['vue']
          },
          'urlify': 'https://unpkg.com/urlify@0.3.6/dist/urlify.js',
          'hammerjs': 'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js'
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
