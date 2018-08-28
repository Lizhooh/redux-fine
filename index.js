'use strict';var _extends=Object.assign||function(a){for(var c,b=1;b<arguments.length;b++)for(var d in c=arguments[b],c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d]);return a},_createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_reduxStoreInit=require('redux-store-init'),_reduxStoreInit2=_interopRequireDefault(_reduxStoreInit),_reduxThunk=require('redux-thunk'),_reduxThunk2=_interopRequireDefault(_reduxThunk);Object.defineProperty(exports,'__esModule',{value:!0}),exports.Module=exports.helper=exports.config=exports.module=exports.mixin=exports.store=exports.action=void 0;function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function _toConsumableArray(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)}function isFunction(a){return'function'==typeof a}function isString(a){return'string'==typeof a}var ErrorMap={CTX:'Redux-Fine: Please do not use this.store, this.state, this.app in constructor or commit callback.',INT:'Redux-Fine: You need to call store first.',TYPE:'Redux-Fine: wrong parameter type.'},om=['mixin','store','state','initState','initialized','commit','app','helper','constructor'],$={module:{},reducer:{},initState:{},store:{},config:{},action:{},mixin:{},helper:{}},_module=function(a,b){if('undefined'==typeof a)return Object.keys($.module||{})||[];if('string'==typeof a&&!b)return $.module[a];if('string'==typeof a&&b){var c=new b(a);$.module[a]=c,$.initState[a]=c.initState,$.reducer[a]=function(){var g=0<arguments.length&&void 0!==arguments[0]?arguments[0]:$.initState[a],j=arguments[1],e=j.type,f=j.newState;return-1<e.indexOf(a)&&isFunction(f)?f(g):g}}},_store=function(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return _config({}),b=[].concat(_toConsumableArray($.config.middlewares),[_reduxThunk2.default]),a=a||$.initState,$.store=(0,_reduxStoreInit2.default)({reducers:$.reducer,initState:a,devtool:$.config.devtool},b),Object.keys($.module).forEach(function(c){var d=$.module[c].initialized;isFunction(d)&&d.call($.module[c])}),$.store},_action=function(a){var b={},c=Object.keys($.module[a]||{});if(0!==c.length)return c.forEach(function(d){if(isFunction($.module[a][d])&&'_'!==d[0]){if(-1<om.indexOf(om)||-1<Object.keys($.mixin).indexOf(d))return;b[d]=function(){for(var f=arguments.length,e=Array(f),g=0;g<f;g++)e[g]=arguments[g];return isFunction($.module[a][d])&&$.module[a][d].apply($.module[a],e),function(){}}}}),b},_Module=function(){function a(b){var c=this;_classCallCheck(this,a),this._name=b,this.initState={},Object.keys($.mixin).forEach(function(d){-1===om.indexOf(d)&&(c[d]=$.mixin[d])})}return _createClass(a,[{key:'initialized',value:function initialized(){}},{key:'commit',value:function commit(){for(var c=arguments.length,b=Array(c),d=0;d<c;d++)b[d]=arguments[d];var e=null,f=function(){var g=new Date,j=function(r){return 10>r?'0'+r:r},l=g.getHours(),o=g.getMinutes(),p=g.getSeconds(),q=g.getMilliseconds();return'['+j(l)+':'+j(o)+':'+j(p)+'.'+q+']'}();return 0===Object.keys($.store).length?console.error(ErrorMap.INT):(1===b.length&&isFunction(b[0])?e=$.store.dispatch({type:this._name+'-'+f,newState:function newState(g){return b[0](g)||g}}):2===b.length&&isFunction(b[1])?isString(b[0])?e=$.store.dispatch({type:this._name+'-'+b[0],newState:function newState(g){return b[1](g)||g}}):(e=$.store.dispatch({type:this._name+'-'+f,newState:function newState(g){return b[0](g)||g}}),setTimeout(function(){b[1]($.store.getState())},20)):3===b.length&&isFunction(b[1])?(e=$.store.dispatch({type:this._name+'-'+b[0],newState:function newState(g){return b[1](g)||g}}),isFunction(b[2])&&setTimeout(function(){b[2]($.store.getState())},20)):console.error(ErrorMap.TYPE),e)}},{key:'helper',get:function get(){return $.helper}},{key:'store',get:function get(){try{return $.store.getState()}catch(b){console.error(ErrorMap.CTX)}}},{key:'state',get:function get(){return this.store[this._name]}},{key:'app',get:function get(){var b={};return Object.keys($.module).forEach(function(c){b[c]=_action(c)}),{module:Object.assign($.module,{}),mixin:Object.assign($.mixin,{}),action:b}}}]),a}();function _config(a){$.config=_extends({devtool:!1,middlewares:[]},a,$.config)}function _mixin(a,b){$.mixin[a]=b}function _helper(a,b){$.helper[a]=b}var d=exports.d=_action,store=exports.store=_store,mixin=exports.mixin=_mixin,_module2=_module;exports.module=_module2;var config=exports.config=_config,helper=exports.helper=_helper,Module=exports.Module=_Module;exports.default={store:_store,mixin:_mixin,module:_module,action:_action,config:_config,helper:_helper,Module:_Module,_$:$};