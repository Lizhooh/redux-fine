
## Redux-Fine
基于 Redux 的上层封装，数据状态管理库，主要目的是为了简化 Redux 的编写代码。

__特性与约束：__
- 不需要写 Reducer，这部分会在框架初始化的时候自动构建。
- 为了简化代码，Action 的写法将改变，并且可以通过全局的方式引入 actions，非常方便。
- 使用 ES6 的语法开发。
- 只适用于逻辑拆分（combineReducers）方式。因为在大多数项目里都会使用逻辑拆分，很少会使用只有一个 reducer 的方式，如果只有一个 reducer，那根本没必要使用 Redux。
- 逻辑拆分不能嵌套扩展，只能同级垂直扩展，一个逻辑拆分定义为一个 module。
- 为了方便获取 module，可以使用全局的方式引入，就像 mongoose 一样。
- 提供一键创建 store 的方式，少写点代码。
- 能够在运行时获取全局的上下文。

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
import IndexModule from './module';
import UserModule from './module/user';

function api() {
    return new Promise(rs => setTimeout(rs, Math.random() * 2000 | 0));
}

// 配置
Fine.config({ devtool: true  });

// 扩展功能（可选）
Fine.mixin('api', api);

// 注册模块
Fine.module('index', IndexModule);
Fine.module('user', UserModule);

// 返回创建后的 store
export default Fine.store();
```

在 IndexModule 里，被定义为一个 combineReducers 模块。

```js
// module/index.js
import Fine from 'redux-fine';

export default class IndexModule extends Fine.Module {

    initState = {
        name: 'index-view',
        list: [],
    }

    getList = () => {
        // ... 使用 commit 提交数据的变化
        this.commit(state => ({ ... state }));
        // 使用 this.state 获取当前 module 的数据
        this.state;
        // 使用 this.store 获取全局的 store 数据。
        this.store;
        // 使用 this.app 获取全局的上下文。
        this.app;
        // 在 IndexModule 里调用 UserModule 的 commit。
        this.app.module.user.commit();
        // 在 IndexModule 里调用 UserModule 的 action 函数。
        this.app.action.user.getList();
        // 获取设置的 mixin
        this.app.mixin.api();
        // 也可以从示例里获取
        this.mixin.api();
    }
}
```

> 注意，this.state、this.store、this.app 都不能在构造函数或 commit 回调函数里使用，它们是运行时的属性。

### Example
你还可以直接查看 [Example](https://github.com/Lizhooh/redux-fine/tree/master/example) 代码。

### API

#### config(option: object): void
option 对象包括以下几项：
- devtool -> bool - 默认是 false，true 的时候会检查并开启 redux devtool。
- middlewares -> Array - redux 中间件。

#### actions(name: string): object
name 是 module 的名称。返回指定 module 的 action 函数。

#### modules(name: string, module?: object): object | void
如果只有一个 name 参数，则尝试获取 module 对象。如果有两个参数则是注册一个模块。

#### store(initState?: object, middlewares?: [any] = []): object
返回一个 createStroe 返回的 store。

#### Module
这是一个基类，你需要继承它实现自己的 module。 Module 有以下属性与方法。
- `initState` -> any - 模块的初始数据，默认是 {}
- `store` -> any - 全局的 store 浅引用。
- `state` -> any - 本模块的 state。
- `app` -> object - 全局的上文。
    - app.module
    - app.action
    - app.mixin
- `mixin` -> object - 为基类添加的 mixin。默认是 {};
- `commit` -> void - 用于提交数据的更改。类似 dispatch，但不需要 type。
    commit 有四种方式：
    - commit(cb: (state) => {}); - 提交一个数据状态改变，回调函数返回值最为新的状态，只会改变本 module 的 state。
    - commit(cb1: (state) => {}, cb2: (newState) => {}); - 第二个回调函数是改变数据状态后触发的，参数是新的状态值。
    - commit(name: string, cb: (state) => {}); - 如果第一个参数为字符串，则是为 action type 提供额外的名称。
    - commit(name: string, cb1: (state) => {}, cb2: (newState) => {}); - 以上方式的综合函数。
