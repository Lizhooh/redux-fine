
interface IApp {
    action: object,
    module: object,
    mixin: object,
}

/** 模块基类，需要继承使用 */
export class Module {
    constructor(name: string);
    /** 初始化的状态数据 */
    get initState(): [any] | object | any;
    /** 获取数据源 */
    get store(): object;
    /** 获取本模块的状态数据 */
    get state(): object;
    /* 获取注入的 mixin */
    get helper(): object;

    /**
     * 在 Module 构建完成后自动调用，此时可以获取 this.app
     */
    initialized(): void;

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

    /**
     * 提交一个数据改变请求，参数数据会被合并到 state 里。
     * @params{Object}: newState - 新的状态
     */
    commitAssign(updateState);
    commitAssign(updateState, cb: (staet) => {});

    /* 应用的上下文 */
    app: IApp;
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
}

/**
 * 加载模块类
 */
export function module(name: string, module: any): void;

/**
 * 返回一个创建后的 store 对象
 */
export function store(initState: any, middlewares: [any]): object;

/**
 * 返回模块所有的 action 函数
 */
export function action(name: string): object;

/**
 * 对 Module 注入属性，会被合并到 this 里
 */
export function mixin(key: string, value: any): object;

/**
 * 对 Module 添加辅助实例方法
 */
export function helper(key: string, value: any): object;
/**
 * 配置项
 */
export function config(options: Opts): any;

/**
 * 获取所有的数据对象
 */
export const _$: object;

type Fine = {
    /** 加载模块类 */
    module,
    /** 返回一个创建后的 store 对象 */
    store,
    /** 返回模块所有的 action 函数 */
    action,
    /** 对 Module 注入属性，会被合并到 this 里 */
    mixin,
    /** 对 Module 添加辅助实例方法 */
    helper,
    /** 配置项 */
    config,
    /** 获取所有的数据对象 */
    _$,
    /** 模块基类，需要继承使用 */
    Module,
}

export default Fine;