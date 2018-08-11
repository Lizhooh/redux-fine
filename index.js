'use strict';var _extends=Object.assign||function(a){for(var c,b=1;b<arguments.length;b++)for(var d in c=arguments[b],c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d]);return a},_createClass=function(){function a(b,c){for(var e,d=0;d<c.length;d++)e=c[d],e.enumerable=e.enumerable||!1,e.configurable=!0,'value'in e&&(e.writable=!0),Object.defineProperty(b,e.key,e)}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),_reduxStoreInit=require('redux-store-init'),_reduxStoreInit2=_interopRequireDefault(_reduxStoreInit),_reduxThunk=require('redux-thunk'),_reduxThunk2=_interopRequireDefault(_reduxThunk);Object.defineProperty(exports,'__esModule',{value:!0});function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function')}function isFunction(a){return'function'==typeof a}function isString(a){return'string'==typeof a}var gb={module:{},reducer:{},initState:{},store:{},config:{},mixin:{}},_module=function(a,b){if('undefined'==typeof a)return Object.keys(gb.module||{})||[];if('string'==typeof a&&!b)return gb.module[a];if('string'==typeof a&&b){var c=new b(a);gb.module[a]=c,gb.initState[a]=c.initState,gb.reducer[a]=function(){var f=0<arguments.length&&void 0!==arguments[0]?arguments[0]:gb.initState[a],g=arguments[1],d=g.type,e=g.newState;return-1<d.indexOf(a)&&isFunction(e)?e(f):f}}},_store=function(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];return b.push(_reduxThunk2.default),a=a||gb.initState,gb.store=(0,_reduxStoreInit2.default)({reducers:gb.reducer,initState:a,devtool:gb.config.devtool},b.concat(gb.config.middlewares)),gb.store},_action=function(a){var b={},c=Object.keys(gb.module[a]||{})||[];return c.forEach(function(d){isFunction(gb.module[a][d])&&'_'!==d[0]&&(b[d]=gb.module[a][d])}),b},Module=function(){function a(b){_classCallCheck(this,a),this._name=b,this.initState={}}return _createClass(a,[{key:'commit',value:function commit(){for(var c=arguments.length,b=Array(c),d=0;d<c;d++)b[d]=arguments[d];var e=null;return 0===Object.keys(gb.store).length?console.error('Redux-Fine: \u4F60\u9700\u8981\u5148\u8C03\u7528 store \u624D\u53EF\u4EE5'):(1===b.length&&isFunction(b[0])?e=gb.store.dispatch({type:this._name+'-'+Date.now(),newState:function newState(f){return b[0](f)||f}}):2===b.length&&isFunction(b[1])?isString(b[0])?e=gb.store.dispatch({type:this._name+'-'+b[0],newState:function newState(f){return b[1](f)||f}}):(e=gb.store.dispatch({type:this._name+'-'+Date.now(),newState:function newState(f){return b[0](f)||f}}),setTimeout(function(){b[1](gb.store.getState())},16)):3===b.length&&isFunction(b[1])?(e=gb.store.dispatch({type:this._name+'-'+b[0],newState:function newState(f){return b[1](f)||f}}),isFunction(b[2])&&setTimeout(function(){b[2](gb.store.getState())},16)):console.error('Redux-Fine: \u53C2\u6570\u7C7B\u578B\u9519\u8BEF'),function(){return e})}},{key:'mixin',get:function get(){return gb.mixin}},{key:'store',get:function get(){try{return gb.store.getState()}catch(b){console.error('Redux-Fine: \u8BF7\u4E0D\u8981\u5728 constructor \u6216 commit callback \u91CC\u4F7F\u7528 this.store\u3001this.state\u3001this.app')}}},{key:'state',get:function get(){return this.store[this._name]}},{key:'app',get:function get(){var b={};return Object.keys(gb.module).forEach(function(c){b[c]=_action(c)}),{module:Object.assign(gb.module,{}),mixin:Object.assign(gb.mixin,{}),action:b}}}]),a}();function _config(a){a=_extends({devtool:!1,middlewares:[]},a),gb.config=a}function _mixin(a,b){gb.mixin[a]=b}exports.default={module:_module,store:_store,action:_action,config:_config,mixin:_mixin,Module:Module};