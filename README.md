
## Redux-Fine
基于 Redux 的上层封装，数据状态管理库，主要目的是为了简化 Redux 的编写代码。

__特性：__
- 上手简单，只有 4 个 API 和一个基类。
- 一键初始化 Store，避免重复写复杂的初始化代码。
- 约束与统一的管理 Module。
-

### Install
直接使用 npm/yarn 安装即可，需要把 Redux 也安装了。

```bash
npm install redux
npm install redux-fine
```

### Usage
使用分为几步，如果有配置，则需要把配置代码放在前面。之后就是注册 Module，注册完成 Module 之后，调用 store 方法，返回一个 `createStroe` 实例给 `<Provider>`。


```js
import Fine from 'redux-fine';

// 模块
class IndexModule extends Fine.Module {
    initState = {}  // 初始数据

    getList = () => {
        // 提交一个数据状态的改变
        this.commit(state => ({ ...state }));
    }
}

// 配置
Fine.config({
    devtool: true,
    moduleMixin: { api },   // <-- 注入 mixin
});

// 注册模块
Fine.modules('index', IndexModule);

// 返回创建后的 store
const store = Fine.store();
```

### Example
你还可以直接查看 [Example](https://github.com/Lizhooh/redux-fine/tree/master/example) 代码。

### API

#### config(option: object): void
option 对象包括以下几项：
- devtool -> bool - 默认是 false，true 的时候会检查并开启 redux devtool。
- moduleMixin -> object - 默认是 {}，一个对象，对象里的属性会注入到 Module 的属性里。

#### actions(name: string): object
name 是 module 的名称。返回指定 module 的 action 函数。

#### modules(name: string, module?: object): object | void
如果只有一个 name 参数，则尝试获取 module 对象。如果有两个参数则是注册一个模块。

#### store(initState?: object, middlewares?: [any] = []): object
返回一个 createStroe 返回的 store。

#### Module
这是一个基类，你需要继承它实现自己的 module。 Module 有以下属性与方法。
- initState -> any - 模块的初始数据，默认是 {}
- store -> any - 全局的 store 浅引用。
- state -> any - 本模块的 state。
- commit -> void - 用于提交数据的更改。类似 dispatch，但不需要 type。


