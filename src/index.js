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

const gb = {
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
        return Object.keys(gb.module || {}) || [];
    }
    if (typeof name === 'string' && !module) {
        return gb.module[name];
    }
    else if (typeof name === 'string' && module) {
        const m = new module(name);
        gb.module[name] = m;
        gb.initState[name] = m.initState;
        gb.reducer[name] = (state = gb.initState[name], action) => {
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

    middlewares = [...gb.config.middlewares, thunk];
    initState = initState || gb.initState;

    gb.store = Store({
        reducers: gb.reducer,
        initState,
        devtool: gb.config.devtool,
    }, middlewares);

    Object.keys(gb.module).forEach(key => {
        const initialized = gb.module[key].initialized;
        if (isFunction(initialized)) {
            initialized.bind(gb.module[key]);
        }
    });

    return gb.store;
}

// 返回 action
const _action = (name) => {
    const obj = {};
    const list = Object.keys(gb.module[name] || {}) || [];
    list.forEach(key => {
        if (isFunction(gb.module[name][key]) && key[0] !== '_') {
            obj[key] = (...arg) => {
                gb.module[name][key](...arg);
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
        Object.keys(gb.mixin).forEach(key => {
            const om = [
                'mixin', 'store', 'state', 'initState',
                'initialized', 'commit', 'app', 'helper',
                'constructor',
            ];
            if (om.indexOf(key) === -1) {
                this[key] = gb.mixin[key];
            }
        });
    }

    initialized() { }

    get helper() {
        return gb.helper;
    }

    get store() {
        try { return gb.store.getState(); }
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

        if (Object.keys(gb.store).length === 0) {
            return console.error(ErrorMap.INT);
        }
        // (cb: function)
        if (arg.length === 1 && isFunction(arg[0])) {
            res = gb.store.dispatch({
                type: `${this._name}-${Date.now()}`,
                newState: state => arg[0](state) || state,
            });
        }
        else if (arg.length === 2 && isFunction(arg[1])) {
            // (name: string, cb: function)
            if (isString(arg[0])) {
                res = gb.store.dispatch({
                    type: `${this._name}-${arg[0]}`,
                    newState: state => arg[1](state) || state,
                });
            }
            // (cb: function, cb: function)
            else {
                res = gb.store.dispatch({
                    type: `${this._name}-${Date.now()}`,
                    newState: state => arg[0](state) || state,
                });
                setTimeout(() => {
                    arg[1](gb.store.getState());
                }, 20);
            }
        }
        else if (arg.length === 3 && isFunction(arg[1])) {
            // (name: string, cb: function, cb: function)
            res = gb.store.dispatch({
                type: `${this._name}-${arg[0]}`,
                newState: state => arg[1](state) || state,
            });
            if (isFunction(arg[2])) {
                setTimeout(() => {
                    arg[2](gb.store.getState());
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

        Object.keys(gb.module).forEach(k => {
            action[k] = _action(k);
        });

        return {
            module: Object.assign(gb.module, {}),
            mixin: Object.assign(gb.mixin, {}),
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
    gb.config = options;
}

function _mixin(name, cb) {
    gb.mixin[name] = cb;
}

function _helper(name, cb) {
    gb.helper[name] = cb;
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
