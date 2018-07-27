
/** 模块基类，需要继承使用 */
declare class Module {
    constructor(name: string);
    /** 初始化的状态数据 */
    initState: [any] | object | any;
    /** 获取数据源 */
    get store(): object;
    /** 获取本模块的状态数据 */
    get state(): object;
    /**
     * 提交一个数据改变请求
     * @params{Function}: cb - 执行函数
     */
    commit(cb: (state) => {});
    /**
     * 提交一个数据改变请求
     * @params{Function}: cb1 - 执行函数
     * @params{Function}: cb2 - 新状态改变后回调
     */
    commit(cb1: (state) => {}, cb2: (newState) => {});
    /**
     * 提交一个数据改变请求
     * @params{String}: name - 模块名称
     * @params{Function}: cb - 执行函数
     */
    commit(name: string, cb: (state) => {});
    /**
     * 提交一个数据改变请求
     * @params{String}: name - 模块名称
     * @params{Function}: cb1 - 执行函数
     * @params{Function}: cb2 - 新状态改变后回调
     */
    commit(name: string, cb1: (state) => {}, cb2: (newState) => {});
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
