import Store from 'redux-store-init';
import thunk from 'redux-thunk';

function isFunction(obj) {
    return typeof obj === 'function';
}

function isString(obj) {
    return typeof obj === 'string';
}

const ErrorMap = {
    CTX: 'Redux-Fine: Please do not use this.store, this.state, this.app in constructor or commit callback.',
    INT: 'Redux-Fine: You need to call store first.',
    TYPE: 'Redux-Fine: wrong parameter type.',
};

const om = [
    'mixin', 'store', 'state', 'initState',
    'initialized', 'commit', 'app', 'helper',
    'constructor',
];

const $ = {
    module: {},
    reducer: {},
    initState: {},
    store: {},
    config: {},
    action: {},
    mixin: {},
    helper: {},
};

// 创建模块
const _module = (name, module) => {
    // 空参数
    if (typeof name === 'undefined') {
        return Object.keys($.module || {}) || [];
    }
    if (typeof name === 'string' && !module) {
        return $.module[name];
    }
    else if (typeof name === 'string' && module) {
        const m = new module(name);
        $.module[name] = m;
        $.initState[name] = m.initState;
        $.reducer[name] = (state = $.initState[name], action) => {
            const { type, newState } = action;
            if (type.indexOf(name) > -1 && isFunction(newState)) {
                return newState(state);
            }
            return state;
        }
    }
}

// 创建数据源
const _store = (initState, middlewares = []) => {
    _config({}); // 至少初始创建一次

    middlewares = [...$.config.middlewares, thunk];
    initState = initState || $.initState;

    $.store = Store({
        reducers: $.reducer,
        initState,
        devtool: $.config.devtool,
    }, middlewares);

    // 生命周期函数
    Object.keys($.module).forEach(key => {
        const initialized = $.module[key].initialized;
        if (isFunction(initialized)) {
            initialized.bind($.module[key]);
        }
    });

    return $.store;
}

// 返回 action
const _action = (name) => {
    const obj = {};
    const list = Object.keys($.module[name] || {});

    if (list.length === 0) return;

    // const pt = Object.getPrototypeOf($.module[name]);
    // const list = Object.getOwnPropertyNames(pt);

    list.forEach(key => {
        if (isFunction($.module[name][key]) && key[0] !== '_') {
            if (om.indexOf(om) > -1 || Object.keys($.mixin).indexOf(key) > -1) return;
            obj[key] = (...arg) => {
                if (isFunction($.module[name][key])) {
                    $.module[name][key].apply($.module[name], arg);
                }
                return () => { };
            };
        }
    });

    return obj;
}

// 模块基类
class _Module {
    constructor(name) {
        this._name = name;
        this.initState = {};
        Object.keys($.mixin).forEach(key => {
            if (om.indexOf(key) === -1) {
                this[key] = $.mixin[key];
            }
        });
    }

    initialized() { }

    get helper() {
        return $.helper;
    }

    get store() {
        try { return $.store.getState(); }
        catch (err) { console.error(ErrorMap.CTX) }
    }
    get state() {
        return this.store[this._name];
    }

    /**
     * 提交一个数据改变请求
     * - commit(state => {}, [(newState) => {}])
     * - commit(name, state => {}, [(newState) => {}])
     * @params{String}: name
     * @params{Function}: cb
     */
    commit(...arg) {
        let res = null;
        const now = (() => {
            const date = new Date();
            // h, m, s, ms
            const fm = n => n < 10 ? '0' + n : n;
            const h = date.getHours();
            const m = date.getMinutes();
            const s = date.getSeconds();
            const ss = date.getMilliseconds();
            return `[${fm(h)}:${fm(m)}:${fm(s)}.${ss}]`;
        })();

        if (Object.keys($.store).length === 0) {
            return console.error(ErrorMap.INT);
        }
        // (cb: function)
        if (arg.length === 1 && isFunction(arg[0])) {
            res = $.store.dispatch({
                type: `${this._name}-${now}`,
                newState: state => arg[0](state) || state,
            });
        }
        else if (arg.length === 2 && isFunction(arg[1])) {
            // (name: string, cb: function)
            if (isString(arg[0])) {
                res = $.store.dispatch({
                    type: `${this._name}-${arg[0]}`,
                    newState: state => arg[1](state) || state,
                });
            }
            // (cb: function, cb: function)
            else {
                res = $.store.dispatch({
                    type: `${this._name}-${now}`,
                    newState: state => arg[0](state) || state,
                });
                setTimeout(() => {
                    arg[1]($.store.getState());
                }, 20);
            }
        }
        else if (arg.length === 3 && isFunction(arg[1])) {
            // (name: string, cb: function, cb: function)
            res = $.store.dispatch({
                type: `${this._name}-${arg[0]}`,
                newState: state => arg[1](state) || state,
            });
            if (isFunction(arg[2])) {
                setTimeout(() => {
                    arg[2]($.store.getState());
                }, 20);
            }
        }
        else {
            console.error(ErrorMap.TYPE);
        }

        return res;
    }

    // 全局的上下文
    get app() {
        const action = {};

        Object.keys($.module).forEach(k => {
            action[k] = _action(k);
        });

        return {
            module: Object.assign($.module, {}),
            mixin: Object.assign($.mixin, {}),
            action: action,
        }
    }
}

// 配置项
function _config(options) {
    $.config = {
        devtool: false,
        middlewares: [],
        ...options,
        ...$.config,
    };
}

function _mixin(name, cb) {
    $.mixin[name] = cb;
}

function _helper(name, cb) {
    $.helper[name] = cb;
}

export const action = _action;
export const store = _store;
export const mixin = _mixin;
export const module = _module;
export const config = _config;
export const helper = _helper;
export const Module = _Module;

export default {
    store: _store,
    mixin: _mixin,
    module: _module,
    action: _action,
    config: _config,
    helper: _helper,
    Module: _Module,
    _$: $,
};
