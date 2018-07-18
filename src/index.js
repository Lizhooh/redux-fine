import Store from 'redux-store-init';
import only from 'only';
import thunk from 'redux-thunk';

function isFunction(obj) {
    return typeof obj === 'function';
}

function isString(obj) {
    return typeof obj === 'string';
}

const gb = {
    modules: {},
    reducers: {},
    initState: {},
    store: {},
    config: {},
};

// 创建模块
const createModule = (name, module) => {
    // 空参数
    if (typeof name === 'undefined') {
        return Object.keys(gb.modules || {}) || [];
    }
    if (typeof name === 'string' && !module) {
        return gb.modules[name];
    }
    else if (typeof name === 'string' && module) {
        const m = new module(name);
        gb.modules[name] = m;
        gb.initState[name] = m.initState;
        gb.reducers[name] = (state = gb.initState[name], action) => {
            const { type, newState } = action;
            if (type.indexOf(name) > -1 && isFunction(newState)) {
                return newState(state);
            }
            return state;
        }
    }
}

// 创建数据源
const createStore = (initState, middlewares = [thunk]) => {
    initState = initState || gb.initState;
    gb.store = Store({
        reducers: gb.reducers,
        initState,
        devtool: gb.config.devtool,
    }, middlewares.concat(gb.config.middlewares));
    return gb.store;
}

// 返回 action
const getAction = (name) => {
    const obj = {};
    const list = Object.keys(gb.modules[name] || {}) || [];
    list.forEach(key => {
        if (isFunction(gb.modules[name][key]) && key[0] !== '_') {
            obj[key] = gb.modules[name][key];
        }
    });
    return obj;
}

// 模块基类
class Module {
    constructor(name) {
        this._name = name;
        this.initState = {};
        // 注入 mixin
        const keys = Object.keys(gb.config.moduleMixin || {});
        if (keys.length > 0) {
            keys.forEach(key => {
                this[key] = gb.config.moduleMixin[key];
            });
        }
    }
    get store() {
        try { return gb.store.getState(); }
        catch (err) {
            console.error('Redux-Fine: 请不要在 commit 的回调函数里使用 this.store 或 this.state');
        }
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
        if (Object.keys(gb.store).length === 0) {
            return console.error('Redux-Fine: 你需要先调用 store 才可以');
        }
        // (cb: function)
        if (arg.length === 1 && isFunction(arg[0])) {
            gb.store.dispatch({
                type: `${this._name}-${Date.now()}`,
                newState: state => arg[0](state) || state,
            });
        }
        else if (arg.length === 2 && isFunction(arg[1])) {
            // (name: string, cb: function)
            if (isString(arg[0])) {
                gb.store.dispatch({
                    type: `${arg[0]}-${Date.now()}`,
                    newState: state => arg[1](state) || state,
                });
            }
            // (cb: function, cb: function)
            else {
                gb.store.dispatch({
                    type: `${this._name}-${Date.now()}`,
                    newState: state => arg[0](state) || state,
                });
                setTimeout(() => {
                    arg[1](gb.store.getState());
                }, 16);
            }
        }
        else if (arg.length === 3 && isFunction(arg[1])) {
            // (name: string, cb: function, cb: function)
            gb.store.dispatch({
                type: `${arg[0]}-${Date.now()}`,
                newState: state => arg[1](state) || state,
            });
            if (isFunction(arg[2])) {
                setTimeout(() => {
                    arg[2](gb.store.getState());
                }, 16);
            }
        }
        else {
            console.error('Redux-Fine: 参数类型错误');
        }

        return () => { };
    }

    only(...arg) {
        return only(...arg);
    }
}

// 配置项
function setConfig(options) {
    options = {
        devtool: false,
        middlewares: [],
        moduleMixin: {},
        ...options,
    };
    gb.config = options;
}

export default {
    modules: createModule,
    store: createStore,
    actions: getAction,
    Module: Module,
    config: setConfig,
};