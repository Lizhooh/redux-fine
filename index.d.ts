
declare class ModuleBase {
    constructor(name: string);
    /** 初始化的状态数据 */
    initState: [any] | object | any;
    /** 获取数据源 */
    get store(): object;
    /** 获取本模块的状态数据 */
    get state(): object;
    /** 提交一个数据改变请求 */
    commit(cb: (state) => {});
    commit(cb1: (state) => {}, cb2: (newState) => {});
    commit(name: string, cb: (state) => {});
    commit(name: string, cb1: (state) => {}, cb2: (newState) => {});
    /** 返回对象白名单 */
    only(obj: object, keys: string);
}

interface Opts {
    /**
     * 是否开启 redux devtool 工具
     */
    devtool?: boolean,
    /**
     * redux 中间件设置
     */
    middlewares?: [any],
    /**
     * 对 Module 基类插入 mixin 函数
     */
    moduleMixin: object,
}

/** 加载模块类 */
export function modules(name: string, module: any): void;
/** 返回一个创建后的 store 对象 */
export function store(initState: any, middlewares: [any]): object;
/** 返回模块所有的 action 函数 */
export function actions(name: string): object;
/** 配置项 */
export function config(options: Opts): any;
/** 模块基类，需要继承使用 */
export const Module: ModuleBase;
