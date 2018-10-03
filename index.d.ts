import * as React from 'react';

interface IApp {
    action: object | any,
    module: object | any,
    mixin: object | any,
}

/** 模块基类，需要继承使用 */
export class Module {
    constructor(name: string);
    /** 初始化的状态数据 */
    initState: [any] | object | any;
    /** 获取数据源 */
    readonly store: object | any;
    /** 获取本模块的状态数据 */
    readonly state: object | any;
    /* 获取注入的 mixin */
    readonly helper: object | any;

    /**
     * 在 Module 构建完成后自动调用，此时可以获取 this.app
     */
    initialized(): void;

    /**
     * 提交一个数据改变请求
     * @params{Function}: cb - 执行函数
     */
    commit(cb: (state?: any) => any);
    /**
     * 提交一个数据改变请求
     * @params{Function}: cb1 - 执行函数
     * @params{Function}: cb2 - 新状态改变后回调
     */
    commit(cb1: (state?: any) => any, cb2: (newState?: any) => any);
    /**
     * 提交一个数据改变请求
     * @params{String}: name - 模块名称
     * @params{Function}: cb - 执行函数
     */
    commit(name: string, cb: (state?: any) => any);
    /**
     * 提交一个数据改变请求
     * @params{String}: name - 模块名称
     * @params{Function}: cb1 - 执行函数
     * @params{Function}: cb2 - 新状态改变后回调
     */
    commit(name: string, cb1: (state?: any) => any, cb2: (newState?: any) => any);

    /**
     * 提交一个数据改变请求，参数数据会被合并到 state 里。
     * @params{Object}: newState - 新的状态
     */
    commitAssign(updateState: any);
    commitAssign(updateState: any, cb: (state?: any) => any);

    /* 应用的上下文 */
    app: IApp;

    [rest: string]: any;
    [index: number]: any;

    /** 生命周期函数绑定 */
    onDidCatch(err: Error, info: React.ErrorInfo, self?: React.ReactElement<any>);
    onDidMount(self?: React.ReactElement<any>);
    onWillMount(self?: React.ReactElement<any>);
    onWillReceiveProps(nextProps: any, self?: React.ReactElement<any>);
    onDidUpdate(prevProps: any, prevState: any, self?: React.ReactElement<any>);
    onWillUpdate(nextProps: any, nextState: any, self?: React.ReactElement<any>);
    onWillUnmount(self?: React.ReactElement<any>);
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
export function module(name: string, module: any): object | any;

/**
 * 返回一个创建后的 store 对象
 */
export function store(initState: any, middlewares: [any]): object | any;

/**
 * 返回模块所有的 action 函数
 */
export function action(name: string): object | any;

/**
 * 对 Module 注入属性，会被合并到 this 里
 */
export function mixin(key: string, value: any)

/**
 * 对 Module 添加辅助实例方法
 */
export function helper(key: string, value: any);
/**
 * 配置项
 */
export function config(options: Opts);

/**
 * 绑定生命周期函数
 */
export function ComponentBind(name: string);

/**
 * 获取所有的数据对象
 */
export const _$: object;

// export default class Fine {
//     /** 加载模块类 */
//     static module;
//     /** 返回一个创建后的 store 对象 */
//     static store;
//     /** 返回模块所有的 action 函数 */
//     static action;
//     /** 对 Module 注入属性，会被合并到 this 里 */
//     static mixin;
//     /** 对 Module 添加辅助实例方法 */
//     static helper;
//     /** 配置项 */
//     static config;
//     /** 获取所有的数据对象 */
//     static _$;
//     /** 模块基类，需要继承使用 */
//     static Module;
//     /** 绑定生命周期函数 */
//     static ComponentBind;
// }
