import Store from 'redux-store-init';
import thunk from 'redux-thunk';

function isFunction(obj) {
    return typeof obj === 'function';
}

function isString(obj) {
    return typeof obj === 'string';
}

const ErrorMap = {
    CTX: 'Redux-Fine: 请不要在 constructor 或 commit callback 里使用 this.store、this.state、this.app',
    INT: 'Redux-Fine: 你需要先调用 store 才可以',
    TYPE: 'Redux-Fine: 参数类型错误',
};

const $ = {
    module: {},
    reducer: {},
    initState: {},
    store: {},
    config: {},
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
    _config({}); // 初始创建一次

    middlewares = [...$.config.middlewares, thunk];
    initState = initState || $.initState;

    $.store = Store({
        reducers: $.reducer,
        initState,
        devtool: $.config.devtool,
    }, middlewares);

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
    const list = Object.keys($.module[name] || {}) || [];
    list.forEach(key => {
        if (isFunction($.module[name][key]) && key[0] !== '_') {
            obj[key] = (...arg) => {
                if (isFunction($.module[name][key])) {
                    $.module[name][key].apply($.module[name], arg);
                }
                return _ => _;
            };
        }
    });
    return obj;
}

// 模块基类
class Module {
    constructor(name) {
        this._name = name;
        this.initState = {};
        Object.keys($.mixin).forEach(key => {
            const om = [
                'mixin', 'store', 'state', 'initState',
                'initialized', 'commit', 'app', 'helper',
                'constructor',
            ];
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

        if (Object.keys($.store).length === 0) {
            return console.error(ErrorMap.INT);
        }
        // (cb: function)
        if (arg.length === 1 && isFunction(arg[0])) {
            res = $.store.dispatch({
                type: `${this._name}-${Date.now()}`,
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
                    type: `${this._name}-${Date.now()}`,
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
    options = {
        devtool: false,
        middlewares: [],
        ...options,
    };
    $.config = options;
}

function _mixin(name, cb) {
    $.mixin[name] = cb;
}

function _helper(name, cb) {
    $.helper[name] = cb;
}

export default {
    store: _store,
    mixin: _mixin,
    module: _module,
    action: _action,
    config: _config,
    helper: _helper,
    Module: Module,
};
