
class ModuleBase {
    constructor(name: string);
    get store(): Object;
    get state(): Object;
    commit(cb: (state) => {});
    commit(cb: (state) => {}, cb: (newState) => {});
    commit(name: string, cb: (state) => {});
    commit(name: string, cb: (state) => {}, cb: (newState) => {});
    only(obj: object, keys: string);
}

interface Opts {
    devtool?: boolean,
    middlewares?: [],
}

export default {
    modules: (name: string, module: any) => any,
    store: (initState: any, middlewares: []) => object,
    actions: (name: string) => object,
    Module: ModuleBase,
    config: (options: Opts) => any,
}

