/**
 * Bundle of awes-forms transpiled and polyfilled
 * Generated: 2018-12-28
 * Version: 0.0.1
 */

!function(){"use strict";function t(t,e){return e={exports:{}},t(e,e.exports),e.exports}function e(t,e,n,i){let o=t.forms.find(t=>t.id==e);const r=t.forms.findIndex(t=>t.id==e);null===i?_.unset(o,n):_.set(o,n,i),Vue.set(t.forms,r,o)}function n(t,e,n){function i(t){if(!n||0===Object.keys(n).length)return t;for(let e in n)t[e]=n[e];return t}if(document.createEvent){const n=new Event(t,{bubbles:!0,cancelable:!0});e.dispatchEvent(i(n))}else{const n=document.createEventObject();e.fireEvent("on"+t,i(n))}}function i(t){try{t.prototype.$awesForms=new Vuex.Store(Nt)}catch(t){console.log("Error creating store :",t)}t.component("form-builder",Pt),t.component("fb-input",Gt),t.component("fb-multi-block",Yt),t.component("fb-checkbox",Kt),t.component("fb-select",Jt),t.component("fb-textarea",te)}function o(t){t.$options.components=Object.assign(t.$options.components,{formBuilder:Pt,fbInput:Gt,fbMultiBlock:Yt,fbCheckbox:Kt,fbSelect:Jt,fbTextarea:te})}"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var r=t(function(t){var e=t.exports={version:"2.6.1"};"number"==typeof __e&&(__e=e)}),s=(r.version,t(function(t){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)})),a=t(function(t){var e=s["__core-js_shared__"]||(s["__core-js_shared__"]={});(t.exports=function(t,n){return e[t]||(e[t]=void 0!==n?n:{})})("versions",[]).push({version:r.version,mode:"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})}),l=0,u=Math.random(),c=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++l+u).toString(36))},d=t(function(t){var e=a("wks"),n=s.Symbol,i="function"==typeof n;(t.exports=function(t){return e[t]||(e[t]=i&&n[t]||(i?n:c)("Symbol."+t))}).store=e}),f=function(t){return"object"==typeof t?null!==t:"function"==typeof t},h=function(t){if(!f(t))throw TypeError(t+" is not an object!");return t},p=function(t){try{return!!t()}catch(t){return!0}},m=!p(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}),v=s.document,b=f(v)&&f(v.createElement),g=function(t){return b?v.createElement(t):{}},y=!m&&!p(function(){return 7!=Object.defineProperty(g("div"),"a",{get:function(){return 7}}).a}),w=function(t,e){if(!f(t))return t;var n,i;if(e&&"function"==typeof(n=t.toString)&&!f(i=n.call(t)))return i;if("function"==typeof(n=t.valueOf)&&!f(i=n.call(t)))return i;if(!e&&"function"==typeof(n=t.toString)&&!f(i=n.call(t)))return i;throw TypeError("Can't convert object to primitive value")},k=Object.defineProperty,F={f:m?Object.defineProperty:function(t,e,n){if(h(t),e=w(e,!0),h(n),y)try{return k(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},E=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},S=m?function(t,e,n){return F.f(t,e,E(1,n))}:function(t,e,n){return t[e]=n,t},$=d("unscopables"),x=Array.prototype;void 0==x[$]&&S(x,$,{});var O=function(t){x[$][t]=!0},C=function(t,e){return{value:e,done:!!t}},D={},L={}.toString,T=function(t){return L.call(t).slice(8,-1)},R=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==T(t)?t.split(""):Object(t)},I=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t},A=function(t){return R(I(t))},N={}.hasOwnProperty,M=function(t,e){return N.call(t,e)},j=t(function(t){var e=c("src"),n=Function.toString,i=(""+n).split("toString");r.inspectSource=function(t){return n.call(t)},(t.exports=function(t,n,o,r){var a="function"==typeof o;a&&(M(o,"name")||S(o,"name",n)),t[n]!==o&&(a&&(M(o,e)||S(o,e,t[n]?""+t[n]:i.join(String(n)))),t===s?t[n]=o:r?t[n]?t[n]=o:S(t,n,o):(delete t[n],S(t,n,o)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[e]||n.call(this)})}),P=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t},V=function(t,e,n){if(P(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,i){return t.call(e,n,i)};case 3:return function(n,i,o){return t.call(e,n,i,o)}}return function(){return t.apply(e,arguments)}},W=function(t,e,n){var i,o,a,l,u=t&W.F,c=t&W.G,d=t&W.S,f=t&W.P,h=t&W.B,p=c?s:d?s[e]||(s[e]={}):(s[e]||{}).prototype,m=c?r:r[e]||(r[e]={}),v=m.prototype||(m.prototype={});c&&(n=e);for(i in n)a=((o=!u&&p&&void 0!==p[i])?p:n)[i],l=h&&o?V(a,s):f&&"function"==typeof a?V(Function.call,a):a,p&&j(p,i,a,t&W.U),m[i]!=a&&S(m,i,l),f&&v[i]!=a&&(v[i]=a)};s.core=r,W.F=1,W.G=2,W.S=4,W.P=8,W.B=16,W.W=32,W.U=64,W.R=128;var H=W,z=Math.ceil,B=Math.floor,q=function(t){return isNaN(t=+t)?0:(t>0?B:z)(t)},U=Math.min,G=function(t){return t>0?U(q(t),9007199254740991):0},X=Math.max,Y=Math.min,K=function(t,e){return t=q(t),t<0?X(t+e,0):Y(t,e)},J=a("keys"),Q=function(t){return J[t]||(J[t]=c(t))},Z=function(t){return function(e,n,i){var o,r=A(e),s=G(r.length),a=K(i,s);if(t&&n!=n){for(;s>a;)if((o=r[a++])!=o)return!0}else for(;s>a;a++)if((t||a in r)&&r[a]===n)return t||a||0;return!t&&-1}}(!1),tt=Q("IE_PROTO"),et=function(t,e){var n,i=A(t),o=0,r=[];for(n in i)n!=tt&&M(i,n)&&r.push(n);for(;e.length>o;)M(i,n=e[o++])&&(~Z(r,n)||r.push(n));return r},nt="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),it=Object.keys||function(t){return et(t,nt)},ot=m?Object.defineProperties:function(t,e){h(t);for(var n,i=it(e),o=i.length,r=0;o>r;)F.f(t,n=i[r++],e[n]);return t},rt=s.document,st=rt&&rt.documentElement,at=Q("IE_PROTO"),lt=function(){},ut=function(){var t,e=g("iframe"),n=nt.length;for(e.style.display="none",st.appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),ut=t.F;n--;)delete ut.prototype[nt[n]];return ut()},ct=Object.create||function(t,e){var n;return null!==t?(lt.prototype=h(t),n=new lt,lt.prototype=null,n[at]=t):n=ut(),void 0===e?n:ot(n,e)},dt=F.f,ft=d("toStringTag"),ht=function(t,e,n){t&&!M(t=n?t:t.prototype,ft)&&dt(t,ft,{configurable:!0,value:e})},pt={};S(pt,d("iterator"),function(){return this});var mt=function(t,e,n){t.prototype=ct(pt,{next:E(1,n)}),ht(t,e+" Iterator")},vt=function(t){return Object(I(t))},_t=Q("IE_PROTO"),bt=Object.prototype,gt=Object.getPrototypeOf||function(t){return t=vt(t),M(t,_t)?t[_t]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?bt:null},yt=d("iterator"),wt=!([].keys&&"next"in[].keys()),kt=function(){return this},Ft=function(t,e,n,i,o,r,s){mt(n,e,i);var a,l,u,c=function(t){if(!wt&&t in p)return p[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},d=e+" Iterator",f="values"==o,h=!1,p=t.prototype,m=p[yt]||p["@@iterator"]||o&&p[o],v=m||c(o),_=o?f?c("entries"):v:void 0,b="Array"==e?p.entries||m:m;if(b&&(u=gt(b.call(new t)))!==Object.prototype&&u.next&&(ht(u,d,!0),"function"!=typeof u[yt]&&S(u,yt,kt)),f&&m&&"values"!==m.name&&(h=!0,v=function(){return m.call(this)}),(wt||h||!p[yt])&&S(p,yt,v),D[e]=v,D[d]=kt,o)if(a={values:f?v:c("values"),keys:r?v:c("keys"),entries:_},s)for(l in a)l in p||j(p,l,a[l]);else H(H.P+H.F*(wt||h),e,a);return a}(Array,"Array",function(t,e){this._t=A(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,C(1)):"keys"==e?C(0,n):"values"==e?C(0,t[n]):C(0,[n,t[n]])},"values");D.Arguments=D.Array,O("keys"),O("values"),O("entries");for(var Et=d("iterator"),St=d("toStringTag"),$t=D.Array,xt={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},Ot=it(xt),Ct=0;Ct<Ot.length;Ct++){var Dt,Lt=Ot[Ct],Tt=xt[Lt],Rt=s[Lt],It=Rt&&Rt.prototype;if(It&&(It[Et]||S(It,Et,$t),It[St]||S(It,St,Lt),D[Lt]=$t,Tt))for(Dt in Ft)It[Dt]||j(It,Dt,Ft[Dt],!0)}const At=t=>{let e=t.id,n=t.url,i=t.method,o=t.storeData;return{id:e,url:n,storeData:o,initialState:{_method:i},realFields:[],workingState:{},loading:!1,isEdited:!1,editCounter:0,errors:{},firstErrorField:null,multiblockState:{}}};var Nt={state:{forms:[]},getters:{form:t=>e=>t.forms.find(t=>t.id==e),formErrorsOrFalse:(t,e)=>t=>{const n=e.form(t).errors;return!!Object.keys(n).length&&n},isEdited:(t,e)=>t=>e.form(t).isEdited,fieldValue:(t,e)=>(t,n)=>_.get(e.form(t).workingState,n),fieldError:(t,e)=>(t,n)=>_.get(e.form(t).errors,n),firstErrorField:(t,e)=>t=>e.form(t).firstErrorField,workingState:(t,e)=>t=>{const n=e.form(t);return n.workingState},loading:(t,e)=>t=>e.form(t).loading,multiblockDisabled:(t,e)=>(t,n)=>_.get(e.form(t).multiblockState,n),hasCaptchaError:(t,e)=>t=>!!e.form(t).errors.hasOwnProperty("g-recaptcha-response")},mutations:{createForm(t,e){if(this.getters.form(e.id))throw new Error(`Form with ID ${e.id} already exists`);t.forms.push(At(e))},deleteForm(t,e){const n=t.forms.findIndex(t=>t.id===e);-1!==n?Vue.delete(t.forms,n):console.warn("No form to delete with id: "+e)},setDefaultData(t,e){let n=e.id,i=e.fields;const o=this.getters.form(n);o.initialState=_.merge(o.initialState,_.cloneDeep(i)),o.workingState=_.cloneDeep(o.initialState)},resetFormEdited(t,e){this.getters.form(e).isEdited=!1},setErrors(t,e){let n=e.id,i=e.errors;const o=this.getters.form(n);o.firstErrorField=Object.keys(i)[0],o.errors=i},resetError(t,n){let i=n.id,o=n.fieldName;const r=this.getters.form(i);r&&(delete r.errors[o],e(t,i,`errors`,r.errors))},resetErrors(t,e){this.getters.form(e).errors={}},renameError(t,e){let n=e.id,i=e.oldName,o=e.newName,r=e.message;const s=this.getters.form(n);Vue.set(s.errors,o,r),Vue.delete(s.errors,i)},setField(t,n){let i=n.id,o=n.fieldName,r=n.value,s=n.initial;e(t,i,`workingState.${o}`,r);const a=this.getters.form(i);s&&a.realFields.push(o),!0!==s&&(a.editCounter+=1,a.isEdited=!0)},unsetRealField(t,e){let n=e.id,i=e.fieldName;const o=this.getters.form(n);if(o){let t=o.realFields.indexOf(i);Vue.delete(o.realFields,t)}},toggleFormLoading(t,e){let n=e.id,i=e.isLoading;this.getters.form(n).loading=i},toggleMultiblockState(t,n){let i=n.id,o=n.multiblock,r=n.value;this.getters.form(i);e(t,i,`multiblockState.${o}`,r)},resetFirstErrorField(t,e){this.getters.form(e).firstErrorField=null}}};let Mt=0;const jt=[{type:"beforeunload",handler:"windowUnloadHandler"},{type:"popstate",handler:"popStateHandler"}];var Pt=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="form-builder.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("form",{staticClass:"form-builder",class:{modal__form:t.modal},attrs:{action:t.url,method:t.method}},[n("div",{staticClass:"grid grid_forms"},[t._t("default",null,{fields:t.workingState})],2),t._v(" "),t.autoSubmit?t._e():n("div",{class:t.modal?"line-btns":null},[n("div",{class:t.modal?"line-btns__wrap":"line-btns"},[n("button",{directives:[{name:"shortkey",rawName:"v-shortkey",value:["ctrl","enter"],expression:"['ctrl', 'enter']"}],staticClass:"btn btn-send waves-effect waves-button",class:{"loading-inline":t.showLoader},attrs:{disabled:!t.isEdited,"data-loading":t.$lang.FORMS_LOADING,type:"submit","data-awes":"modal_button_ok"},on:{shortkey:t.send,click:function(e){return e.preventDefault(),t.send(e)}},nativeOn:{click:function(e){return e.preventDefault(),t.send(e)}}},[t._v("\n          "+t._s(t.sendText||t.$lang.FORMS_SEND)+" "),n("span",{staticClass:"g-res--tablet-lg_n"},[t._v("(ctrl+enter)")])]),t._v(" "),t.modal||t.cancelbtn?n("button",{directives:[{name:"shortkey",rawName:"v-shortkey",value:["esc"],expression:"['esc']"}],staticClass:"btn waves-effect waves-button",class:{btn_transparent:t.cancelbtn},attrs:{type:"button"},on:{shortkey:t.close,click:function(e){e.preventDefault(),t.modal?t.close(t.modal.name):t.$emit("cancel")}}},[t._v("\n          "+t._s(t.cancelText||t.$lang.FORMS_CANCEL)+"\n        ")]):t._e(),t._v(" "),t._t("buttons-after")],2)])])},staticRenderFns:[]},void 0,{name:"form-builder",props:{cancelbtn:{type:Boolean,default:!1},name:{type:String,default:()=>`form-builder-${Mt++}`},url:{type:String,required:!0},sendText:String,cancelText:String,loadingText:String,default:{type:Object,default:null},method:{type:String,default:"post",validator(t){return void 0===t||["get","put","post","delete","patch"].includes(t.toLowerCase())}},storeData:String,disabledDialog:{type:Boolean,default:!1},autoSubmit:{type:Boolean,default:!1}},inject:{modal:{from:"modal",default:!1}},provide(){return{formId:this.name,isModal:!!this.modal}},data(){return{loading:!1,serverData:null,serverDataErrors:null,showLoader:!1}},computed:{form(){return this.$awesForms.getters.form(this.name)},isEdited(){return this.$awesForms.getters.isEdited(this.name)},workingState(){return this.$awesForms.getters.workingState(this.name)},storeFormData(){return!!this.storeData&&this.$awesForms.state[this.storeData]},usedFormData(){return this.storeFormData?(this.default&&console.warn("Only VUEX STORE data will be used, despite DEFAULT data exists"),this.storeFormData):!!this.default&&this.default}},watch:{usedFormData:{handler:function(t){this.form||(this.createForm(),t&&this.$awesForms.commit("setDefaultData",{id:this.name,fields:t}))},deep:!0,immediate:!0},loading(t){this.$awesForms.commit("toggleFormLoading",{id:this.name,isLoading:t})},serverData(t){t&&(this.storeData?this.$awesForms.commit("setData",{param:this.storeData,data:t.data}):this.$awesForms.commit("setDefaultData",{id:this.name,fields:t.data}),this.$awesForms.commit("resetFormEdited",this.name),this.serverData=null,this.$emit("sended",t.data),this.modal&&this.close(this.modal.name))},serverDataErrors(t){t&&(this.$awesForms.commit("setErrors",{id:this.name,errors:t}),this.serverDataErrors=null,this.disabledDialog||this.addUnloadHandlers())}},methods:{createForm(){this.$awesForms.commit("createForm",{id:this.name,url:this.url,method:this.method,storeData:this.storeData})},send(){this.$listeners.hasOwnProperty("send")?this.$emit("send",this.workingState):this.loading||(this.removeUnloadHandlers(),this.$awesForms.commit("resetErrors",this.name),this.loading=!0,AWES.on("core:ajax",this.onRequestProcess),AWES.ajax(this.workingState,this.url,this.method).then(t=>{this.serverData=t}).catch(t=>{this.serverDataErrors=t}).finally(()=>{this.loading=!1;this.showLoader=!1;AWES.off("core:ajax",this.onRequestProcess)}))},onRequestProcess(t){this.showLoader=t.detail},addUnloadHandlers(){jt.forEach(t=>{window.addEventListener(t.type,this[t.handler],!1)})},removeUnloadHandlers(){jt.forEach(t=>{window.removeEventListener(t.type,this[t.handler])})},checkCloseAllowed(){if(this.disabledDialog)return!0;if(this.isEdited){const t=confirm(this.$lang.FORMS_CONFIRM);return t}return!0},popStateHandler(){if(this.removeUnloadHandlers(),this.checkCloseAllowed())this.modal&&this.close();else{const t=this.modal?this.modal.hash:"",e=location.href+t;history.pushState({modal:t},document.title,e),this.addUnloadHandlers()}},windowUnloadHandler(t){return!(!this.disabledDialog&&this.isEdited)||(t.returnValue=this.$lang.FORMS_CONFIRM,this.$lang.FORMS_CONFIRM)},close(){let t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];t&&t!==this.modal.name||this.checkCloseAllowed()&&(this.removeUnloadHandlers(),this.$root.$emit("modals:prevent",{name:this.modal.name,state:!1}),this.$root.$emit("modals:close",this.modal.name))}},created(){this.$root.$on("forms:submit",t=>{this.name===t&&this.send()}),this.modal&&(this.__unwatchModalPrevent=this.$watch("isEdited",t=>{this.$root.$emit("modals:prevent",{name:this.modal.name,state:t})}),this.$root.$on("modals:on-close-prevented",this.close))},mounted(){this.addUnloadHandlers(),this.autoSubmit&&(this._unwatchEdit=this.$watch("form.editCounter",this.send))},beforeDestroy(){this.removeUnloadHandlers(),"function"==typeof this.__unwatchModalPrevent&&this.__unwatchModalPrevent(),this.$awesForms.commit("deleteForm",this.name),"function"==typeof this._unwatchEdit&&this._unwatchEdit(),this.$root.$off("modals:on-close-prevented",this.close)}},void 0,!1,void 0,void 0,void 0),Vt=function(){var t=h(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};m&&"g"!=/./g.flags&&F.f(RegExp.prototype,"flags",{configurable:!0,get:Vt});var Wt=/./.toString,Ht=function(t){j(RegExp.prototype,"toString",t,!0)};p(function(){return"/a/b"!=Wt.call({source:"a",flags:"b"})})?Ht(function(){var t=h(this);return"/".concat(t.source,"/","flags"in t?t.flags:!m&&t instanceof RegExp?Vt.call(t):void 0)}):"toString"!=Wt.name&&Ht(function(){return Wt.call(this)});var zt={props:{name:{type:String,required:!0},id:Number,disabled:{type:Boolean,default:!1},cell:{type:[String,Number],validator(t){return["2","3"].includes(t.toString())}}},inject:{formId:{from:"formId",default:!1},isModal:{from:"isModal",default:!1},multiblock:{from:"multiblock",default:!1}},data(){return{tooltip:!1,hasError:!1}},computed:{realName(){return this.multiblock?`${this.multiblock}.${this.id}.${this.name}`:this.name},computedValue(){return this.$awesForms.getters.fieldValue(this.formId,this.realName)},formLoading(){return this.$awesForms.getters.loading(this.formId)},inActive(){return!(!this.inFocus&&!this.value)},isDisabled(){return this.formLoading||this.disabled||this.isMultiblockDisabled},isMultiblockDisabled(){return!!this.multiblock&&this.$awesForms.getters.multiblockDisabled(this.formId,this.multiblock)},cellClass(){return this.cell?"grid__cell_"+this.cell:""},error(){return this.$awesForms.getters.fieldError(this.formId,this.realName)},firstErrorField(){return this.$awesForms.getters.firstErrorField(this.formId)},shake(){return!this.formLoading&&this.tooltip}},watch:{error:{handler:function(t){t?(this.tooltip=!0,this.hasError=!0,this.$refs.element&&this.$refs.element.addEventListener("input",this.resetError,!1),"function"==typeof this.setFocus&&this.$nextTick(this.checkFocus)):(this.tooltip=!1,this.hasError=!1,this.resetInputWatcher())},immediate:!0}},methods:{createStoreInstance(){this.$awesForms.commit("setField",{id:this.formId,fieldName:this.realName,value:this.value,initial:!0})},initField(){void 0!==this.computedValue&&(this.value=this.computedValue),this.createStoreInstance(),this.__unwatchValue=this.$watch("value",this.valueHandler),this.multiblock&&(this.__unwatchId=this.$watch("id",this.idHandler))},idHandler(t,e){const n=`${this.multiblock}.${e}.${this.name}`,i=this.$awesForms.getters.fieldError(this.formId,n);i&&this.$awesForms.commit("renameError",{id:this.formId,oldName:n,newName:this.realName,message:i})},valueHandler(t){this.$awesForms.commit("setField",{id:this.formId,fieldName:this.realName,value:t})},clickTooltip(){this.tooltip=!1,"function"==typeof this.setFocus&&this.setFocus()},resetError(){this.tooltip=!1,this.$awesForms.commit("resetError",{id:this.formId,fieldName:this.realName}),this.resetInputWatcher()},resetInputWatcher(){this.$refs.element&&this.$refs.element.removeEventListener("input",this.resetError)},resetValue(t){this.formId===t&&(this.value=void 0)},checkFocus(){this.firstErrorField===this.realName&&(setTimeout(this.setFocus,0),this.$awesForms.commit("resetFirstErrorField",this.formId))}},created(){this.initField(),this.$root.$on("forms:reset",this.resetValue)},beforeDestroy(){this.multiblock&&(this.resetError(),this.$awesForms.commit("unsetRealField",{id:this.formId,fieldName:this.realName})),this.__unwatchValue(),"function"==typeof this.__unwatchId&&this.__unwatchId(),this.resetInputWatcher(),this.$root.$off("forms:reset",this.resetValue)}},Bt={props:{enterSkip:{type:Boolean,default:!1},focus:{type:Boolean,default:!1}},data(){return{inFocus:this.focus}},computed:{isFocusable(){return!this.enterSkip&&!this.disabled&&this.formId}},methods:{focusNext(t){try{const e=t.target.closest("form"),n=e.querySelectorAll(".is-focusable"),i=Array.from(n).findIndex(e=>e===t.target)+1;if(i<n.length)n[i].focus();else{t.target.blur();const n=e.querySelector('[type="submit"]');this.$nextTick(()=>{n.click();this.initWawesEffect(n)})}}catch(t){console.warn("Error while setting focus"),console.error(t)}},setFocus(t){try{let e=!1!==t?"focus":"blur";this.$refs.element[e]()}catch(t){console.warn("Error while setting focus"),console.error(t)}},initWawesEffect(t){let e={top:0,left:0};"function"==typeof t.getBoundingClientRect&&(e=t.getBoundingClientRect()),n("mousedown",t,{pageY:e.top+window.pageYOffset-document.documentElement.clientTop+t.clientHeight/2,pageX:e.left+window.pageXOffset-document.documentElement.clientLeft+t.clientWidth/2}),setTimeout(n,250,"mouseup",t)}},mounted(){this.setFocus(this.focus)}};var qt=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="fb-error-wrap.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-popover",{staticClass:"display-block",attrs:{placement:t.placement,open:t.open,"popover-class":["theme-error",{tooltip_modal:t.isModal}]}},[t._t("default"),t._v(" "),t.open?n("span",{staticClass:"tooltip__text",attrs:{slot:"popover"},on:{click:function(e){t.$emit("clickTooltip")}},slot:"popover"},[t.error?n("span",{staticClass:"errors__list"},t._l(t.error,function(e,i){return n("span",{key:i},[t._v(t._s(e))])}),0):t._e()]):t._e()],2)},staticRenderFns:[]},void 0,{name:"error-wrap",inject:{isModal:{from:"isModal",default:!1}},props:{open:{type:Boolean,default:!1},placement:{type:String,default:"top"},error:{type:Array}}},void 0,!1,void 0,void 0,void 0);let Ut=0;var Gt=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="fb-input.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"fb__input grid__cell",class:[{input_active:t.inActive||t.autoFilled,input_error:t.hasError,"animated shake":t.shake,disabled:t.isDisabled},t.cellClass]},[n("div",{class:["input",{input_disabled:t.isDisabled}]},[n("fb-error-wrap",{attrs:{open:t.tooltip,error:t.error},on:{clickTooltip:t.clickTooltip}},[n("label",{staticClass:"input__label input__label_field",attrs:{for:"#"+t.inputId}},[t._v(t._s(t.label))]),t._v(" "),"checkbox"===t.inputType?n("input",t._b({directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"element",class:["input__field",{"is-focusable":t.isFocusable},{"in-focus":t.inFocus},{input__field_password:"password"===t.$attrs.type}],attrs:{id:t.inputId,"data-awes":t.$options.name+"."+t.name,disabled:t.isDisabled,spellcheck:t.spellcheck,type:"checkbox"},domProps:{checked:Array.isArray(t.value)?t._i(t.value,null)>-1:t.value},on:{focus:function(e){t.inFocus=!0},blur:function(e){t.inFocus=!1},keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),t.focusNext(e)):null},animationstart:t.autoFillHack,change:function(e){var n=t.value,i=e.target,o=!!i.checked;if(Array.isArray(n)){var r=t._i(n,null);i.checked?r<0&&(t.value=n.concat([null])):r>-1&&(t.value=n.slice(0,r).concat(n.slice(r+1)))}else t.value=o}}},"input",t.$attrs,!1)):"radio"===t.inputType?n("input",t._b({directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"element",class:["input__field",{"is-focusable":t.isFocusable},{"in-focus":t.inFocus},{input__field_password:"password"===t.$attrs.type}],attrs:{id:t.inputId,"data-awes":t.$options.name+"."+t.name,disabled:t.isDisabled,spellcheck:t.spellcheck,type:"radio"},domProps:{checked:t._q(t.value,null)},on:{focus:function(e){t.inFocus=!0},blur:function(e){t.inFocus=!1},keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),t.focusNext(e)):null},animationstart:t.autoFillHack,change:function(e){t.value=null}}},"input",t.$attrs,!1)):n("input",t._b({directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"element",class:["input__field",{"is-focusable":t.isFocusable},{"in-focus":t.inFocus},{input__field_password:"password"===t.$attrs.type}],attrs:{id:t.inputId,"data-awes":t.$options.name+"."+t.name,disabled:t.isDisabled,spellcheck:t.spellcheck,type:t.inputType},domProps:{value:t.value},on:{focus:function(e){t.inFocus=!0},blur:function(e){t.inFocus=!1},keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),t.focusNext(e)):null},animationstart:t.autoFillHack,input:function(e){e.target.composing||(t.value=e.target.value)}}},"input",t.$attrs,!1)),t._v(" "),"password"===t.$attrs.type?n("button",{staticClass:"input__eye",attrs:{type:"button","aria-label":t.$lang.SHOW_PASSWORD},on:{click:function(e){return e.preventDefault(),t.togglePassword(e)}}},[n("i",{class:["icon","password"===t.inputType?"icon-eye":"icon-eye2"]})]):t._e()])],1)])},staticRenderFns:[]},void 0,{name:"fb-input",inheritAttrs:!1,mixins:[zt,Bt],components:{fbErrorWrap:qt},props:{label:{type:String,default:""},spellcheck:{type:Boolean,default:!1}},data(){return{value:"",inputType:this.$attrs.type||"text",autoFilled:!1}},computed:{inputId(){return"input-"+Ut++}},methods:{togglePassword(){this.setFocus(),"password"===this.inputType?this.inputType="text":this.inputType="password"},autoFillHack(t){switch(t.animationName){case"autoFillStart":this.autoFilled=!0;break;case"autoFillEnd":this.autoFilled=!1}}}},void 0,!1,void 0,void 0,void 0);let Xt=0;var Yt=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="fb-multi-block.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{class:["grid__wrap multi-bl",{"multi-bl_disabled":this.isDisabled}]},[t._l(t.value,function(e,i){return n("div",{key:"slot-"+t.uniqIds[i],class:["grid__wrap",{"multi-bl__has-close":t.hasClose}]},[t._t("default",null,{id:i}),t._v(" "),t.hasClose?n("button",{staticClass:"multi-bl__clear",attrs:{"aria-label":"delete"},on:{click:function(e){e.preventDefault(),t.removeField(i)}}},[n("i",{staticClass:"icon icon-cross"})]):t._e()],2)}),t._v(" "),n("button",{staticClass:"multi-bl__add",on:{click:function(e){return e.preventDefault(),t.addField(e)}}},[t._v("\n    "+t._s(t.label||t.$lang.FORMS_MULTIBLOCK_ADD)+"\n  ")])],2)},staticRenderFns:[]},void 0,{name:"fb-multi-block",mixins:[zt],props:{label:String},provide(){return{multiblock:this.multiblock?this.realName:this.name}},data(){return{value:[{}],uniqIds:[]}},computed:{hasClose(){return this.value.length>1},errors(){return this.$awesForms.getters.formErrorsOrFalse(this.formId)}},watch:{disabled:{handler:function(t){this.$awesForms.commit("toggleMultiblockState",{id:this.formId,multiblock:this.realName,value:t})},immediate:!0}},methods:{initField(){if(void 0!==this.computedValue&&this.computedValue.length){this.value=this.computedValue;for(let t in this.computedValue)this.uniqIds.push(Xt++)}else this.uniqIds.push(Xt++);this.createStoreInstance(),this.__unwatchValue=this.$watch("value",this.valueHandler)},addField(){this.isDisabled||(this.value.push({}),this.uniqIds.push(Xt++),this.updateTooltips())},removeField(t){this.isDisabled||(this.$delete(this.value,t),this.uniqIds.splice(t,1),this.updateTooltips())},resetValue(){this.value=[{}]},updateTooltips(){this.errors&&this.$nextTick(()=>{n("scroll",window)})}}},void 0,!1,void 0,void 0,void 0);var Kt=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="fb-checkbox.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"grid__cell",class:[{checkbox_error:t.hasError},{checkbox_active:t.inActive},{grid__cell_padding:t.padding},t.cellClass]},[n("label",{class:["checkbox",t.themeClass,{checkbox_disabled:t.isDisabled}],attrs:{"data-awes":t.$options.name+"."+t.name}},[n("fb-error-wrap",{attrs:{open:t.tooltip,error:t.error},on:{clickTooltip:t.clickTooltip}},[n("input",t._b({directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"element",class:{"is-focusable":t.isFocusable,"in-focus":t.inFocus},attrs:{type:"checkbox",disabled:t.isDisabled},domProps:{checked:Array.isArray(t.value)?t._i(t.value,null)>-1:t.value},on:{focus:function(e){t.inFocus=!0},blur:function(e){t.inFocus=!1},keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),t.focusNext(e)):null},change:function(e){var n=t.value,i=e.target,o=!!i.checked;if(Array.isArray(n)){var r=t._i(n,null);i.checked?r<0&&(t.value=n.concat([null])):r>-1&&(t.value=n.slice(0,r).concat(n.slice(r+1)))}else t.value=o}}},"input",t.$attrs,!1)),t._v(" "),n("span",{staticClass:"checkbox__text"},[n("i",{ref:"switcher",staticClass:"icon icon-checkbox"}),t._v(" "),n("span",[t._v(t._s(t.label))])])])],1)])},staticRenderFns:[]},void 0,{name:"fb-checkbox",inheritAttrs:!1,mixins:[zt,Bt],components:{fbErrorWrap:qt},props:{label:{type:String,required:!0},padding:{type:Boolean,default:!0},theme:String},data(){return{value:!1}},computed:{themeClass(){return this.theme?`checkbox_${this.theme}`:null},isSwitcher(){return"s2"===this.theme}},methods:{},mounted(){},beforeDestroy(){}},void 0,!1,void 0,void 0,void 0);var Jt=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="fb-select.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"mselect grid__cell",class:[{mselect_active:t.inActive},{mselect_opened:t.isOpened},t.cellClass]},[n("span",{staticClass:"mselect__label"},[t._v(t._s(t.label||t.$lang.FORMS_SELECT_LABEL))]),t._v(" "),n("multiselect",{staticClass:"input__field",attrs:{"show-labels":!1,multiple:t.multiple,placeholder:t.placeholderText||t.$lang.FORMS_SELECT_PLACEHOLDER,options:t.selectOptions,label:"name","track-by":"value","hide-selected":!0},on:{open:function(e){t.isOpened=!0},close:function(e){t.isOpened=!1}},model:{value:t.selected,callback:function(e){t.selected=e},expression:"selected"}})],1)},staticRenderFns:[]},void 0,{name:"fb-select",inheritAttrs:!1,mixins:[zt],props:{label:String,selectOptions:{type:Array,default:()=>[]},multiple:{type:Boolean,default:!0},placeholderText:String},data(){return{selected:[],isOpened:!1}},computed:{value:{get(){return this.multiple?this.selected.map(t=>t.value):this.selected.value},set(t){this.multiple?this.selected=this.selectOptions.filter(e=>t.includes(e.value)):this.selected=this.selectOptions.find(e=>t===e.value)}},hasValue(){return!!(this.multiple?this.value.length:this.value)},inActive(){return this.isOpened||this.hasValue}},methods:{resetValue(t){this.formId===t&&(this.value=[])}}},void 0,!1,void 0,void 0,void 0),Qt=t(function(t,e){!function(n,i){!function(t,e){function n(t){function e(e){var n=t.style.width;t.style.width="0px",t.offsetWidth,t.style.width=n,t.style.overflowY=e}function n(t){for(var e=[];t&&t.parentNode&&t.parentNode instanceof Element;)t.parentNode.scrollTop&&e.push({node:t.parentNode,scrollTop:t.parentNode.scrollTop}),t=t.parentNode;return e}function i(){if(0!==t.scrollHeight){var e=n(t),i=document.documentElement&&document.documentElement.scrollTop;t.style.height="",t.style.height=t.scrollHeight+a+"px",l=t.clientWidth,e.forEach(function(t){t.node.scrollTop=t.scrollTop}),i&&(document.documentElement.scrollTop=i)}}function o(){i();var n=Math.round(parseFloat(t.style.height)),o=window.getComputedStyle(t,null),r="content-box"===o.boxSizing?Math.round(parseFloat(o.height)):t.offsetHeight;if(r<n?"hidden"===o.overflowY&&(e("scroll"),i(),r="content-box"===o.boxSizing?Math.round(parseFloat(window.getComputedStyle(t,null).height)):t.offsetHeight):"hidden"!==o.overflowY&&(e("hidden"),i(),r="content-box"===o.boxSizing?Math.round(parseFloat(window.getComputedStyle(t,null).height)):t.offsetHeight),u!==r){u=r;var a=s("autosize:resized");try{t.dispatchEvent(a)}catch(t){}}}if(t&&t.nodeName&&"TEXTAREA"===t.nodeName&&!r.has(t)){var a=null,l=null,u=null,c=function(){t.clientWidth!==l&&o()},d=function(e){window.removeEventListener("resize",c,!1),t.removeEventListener("input",o,!1),t.removeEventListener("keyup",o,!1),t.removeEventListener("autosize:destroy",d,!1),t.removeEventListener("autosize:update",o,!1),Object.keys(e).forEach(function(n){t.style[n]=e[n]}),r.delete(t)}.bind(t,{height:t.style.height,resize:t.style.resize,overflowY:t.style.overflowY,overflowX:t.style.overflowX,wordWrap:t.style.wordWrap});t.addEventListener("autosize:destroy",d,!1),"onpropertychange"in t&&"oninput"in t&&t.addEventListener("keyup",o,!1),window.addEventListener("resize",c,!1),t.addEventListener("input",o,!1),t.addEventListener("autosize:update",o,!1),t.style.overflowX="hidden",t.style.wordWrap="break-word",r.set(t,{destroy:d,update:o}),function(){var e=window.getComputedStyle(t,null);"vertical"===e.resize?t.style.resize="none":"both"===e.resize&&(t.style.resize="horizontal"),a="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(a)&&(a=0),o()}()}}function i(t){var e=r.get(t);e&&e.destroy()}function o(t){var e=r.get(t);e&&e.update()}var r="function"==typeof Map?new Map:function(){var t=[],e=[];return{has:function(e){return t.indexOf(e)>-1},get:function(n){return e[t.indexOf(n)]},set:function(n,i){-1===t.indexOf(n)&&(t.push(n),e.push(i))},delete:function(n){var i=t.indexOf(n);i>-1&&(t.splice(i,1),e.splice(i,1))}}}(),s=function(t){return new Event(t,{bubbles:!0})};try{new Event("test")}catch(t){s=function(t){var e=document.createEvent("Event");return e.initEvent(t,!0,!1),e}}var a=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?((a=function(t){return t}).destroy=function(t){return t},a.update=function(t){return t}):((a=function(t,e){return t&&Array.prototype.forEach.call(t.length?t:[t],function(t){return n(t)}),t}).destroy=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],i),t},a.update=function(t){return t&&Array.prototype.forEach.call(t.length?t:[t],o),t}),e.default=a,t.exports=e.default}(t,e)}()});let Zt;var te=function(t,e,n,i,o,r,s,a){const l=("function"==typeof n?n.options:n)||{};return l.__file="fb-textarea.vue",l.render||(l.render=t.render,l.staticRenderFns=t.staticRenderFns,l._compiled=!0,o&&(l.functional=!0)),l._scopeId=i,l}({render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"fb__input grid__cell",class:[{input_active:t.inActive,input_error:t.hasError,"animated shake":t.shake,disabled:t.isDisabled},t.cellClass]},[n("div",{staticClass:"input",class:{input_disabled:t.isDisabled}},[n("fb-error-wrap",{attrs:{open:t.tooltip,error:t.error},on:{clickTooltip:t.clickTooltip}},[n("span",{staticClass:"input__label"},[t._v(t._s(t.label))]),t._v(" "),n("textarea",t._b({directives:[{name:"model",rawName:"v-model",value:t.value,expression:"value"}],ref:"element",class:["input__textarea",{"is-focusable":t.isFocusable},{"in-focus":t.inFocus}],attrs:{disabled:t.isDisabled},domProps:{value:t.value},on:{focus:function(e){t.inFocus=!0},blur:function(e){t.inFocus=!1},keydown:function(e){return"button"in e||!t._k(e.keyCode,"enter",13,e.key,"Enter")?(e.preventDefault(),t.focusNext(e)):null},input:function(e){e.target.composing||(t.value=e.target.value)}}},"textarea",t.$attrs,!1))])],1)])},staticRenderFns:[]},void 0,{name:"fb-textarea",inheritAttrs:!1,mixins:[zt,Bt],components:{fbErrorWrap:qt},props:{label:{type:String,default:""},fixsize:{type:Boolean,default:!1}},data(){return{value:""}},methods:{setAutoResize(){this.fixsize||(Qt(this.$refs.element),Zt=this.$watch("value",this.updateAutoResize))},updateAutoResize(){this.$nextTick(()=>{Qt.update(this.$refs.element)})}},mounted(){this.setAutoResize()},beforeDestroy(){"function"==typeof Zt&&Zt()}},void 0,!1,void 0,void 0,void 0);const ee={install:i};var ne={FORMS_SEND:"Send",FORMS_CANCEL:"Cancel",FORMS_LOADING:"Loading...",FORMS_CONFIRM:"Are you shure? All not submitted data will be erased...",FORMS_MULTIBLOCK_ADD:"add",FORMS_SELECT_LABEL:"Select a value",FORMS_SELECT_PLACEHOLDER:"Pick a value"};let ie=200;!function t(){window&&"AWES"in window?AWES.use({modules:{vue:{src:"https://unpkg.com/vue@2.5.21/dist/vue.js",cb(){Vue.config.ignoredElements.push("form-builder",/^fb-/)}},lodash:"https://unpkg.com/lodash@4.17.11/lodash.min.js",vuex:{src:"https://unpkg.com/vuex@2.5.0/dist/vuex.min.js",deps:["vue"]},"vue-shortkey":{src:"https://unpkg.com/vue-shortkey@3",deps:["vue"],cb(){Vue.use(VueShortkey)}},"v-tooltip":{src:"https://unpkg.com/v-tooltip@2.0.0-rc.33/dist/v-tooltip.min.js",deps:["vue"]},"vue-multiselect":{src:["https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.js","https://unpkg.com/vue-multiselect@2.1.0/dist/vue-multiselect.min.css"],deps:["vue"],cb(){Vue.component("multiselect",window.VueMultiselect.default)}}},install(){AWES.lang=ne,Vue.use(ee),AWES._vueRoot&&AWES._vueRoot._isMounted&&o(AWES._vueRoot)}}):ie?(ie--,setTimeout(t,300)):console.error("Delayed loading failed, no AWES core found")}()}();
