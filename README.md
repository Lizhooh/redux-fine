
## Redux-Fine

基于 Redux 的上层封装，数据状态管理库，主要目的是为了简化 Redux 的编写代码。

**注意：此库已不维护。**
**Warning: This library is not maintained.**

<hr />

### Features and constraints
- There is no need to write `Reducer`, this part will be built automatically when the framework is initialized.
- No need to write `action.type`, everything is built in the process of automatic build.
- In order to simplify the code, the `Action` method will be changed, and the `actions` can be introduced in a global way, which is very convenient.
- Developed with the syntax of `ES6`, lightweight, with no additional performance overhead.
- Only available for logical split (`combineReducers`) mode. Because logical splitting is used in most projects, it's rare to use only one `reducer`. If there is only one `reducer`, then there is no need to use `Redux`.
- Logical splits cannot be nested extensions, they can only be extended vertically in the same level, and a logical split is defined as a `module`.
- In order to facilitate the acquisition of `module`, it can be introduced in a global way, and `action` can also be introduced globally.
- Provide one-click way to create `store`, write less code.
- Ability to get global context at runtime.
- Provide `mixin, helper` to let you easily extend the capabilities of `Module`.

### Install
Install directly using npm/yarn, you need to install Redux as well.

```bash
npm install redux
npm install redux-fine
```

### Usage
There are a few steps to use, and if you have a configuration, you need to put the configuration code first. Then register the Module. After registering the Module, call the store method and return a `createStroe` instance to `<Provider>`.

```js
import Fine from 'redux-fine';
import IndexModule from './module';
import UserModule from './module/user';

// config
Fine.config({ devtool: true  });

// extended function (optional)
Fine.mixin('api', api);
Fine.helper('merge', merge);

// registration module
Fine.module('index', IndexModule);
Fine.module('user', UserModule);

// return to the created store
export default Fine.store();

// Load the store in the Provider
<Provider store={store}>
    ...
</Provider>
```

In IndexModule, it is defined as a logically split module.

```js
// module/index.js
import Fine from 'redux-fine';

export default class IndexModule extends Fine.Module {

    initState = {
        name: 'index-view',
        list: [],
    }

    getList = () => {
        // ... Use commit to commit changes to the data.
        this.commit(state => ({ ... state }));
        // Use this.state to get the data of the current module.
        this.state;
        // Use this.store to get global store data.
        this.store;
        // Use this.app to get the global context.
        this.app;
        // Call the commit of the UserModule in the IndexModule.
        this.app.module.user.commit();
        // Call the ActionModle's action function in the IndexModule.
        this.app.action.user.getList();
        // Get the set mixin.
        this.app.mixin.api();
        // It can also be obtained from an instance.
        this.api();
        // Get useful methods from the helper.
        this.helper.merge();
    }
}
```

### Lifecycle binding (v4.0+)
Added the ability to bind lifecycles of React components in v4.0.

For the sake of simplicity, make a mapping relationship:
- componentDidCatch -> onDidCatch
- componentWillMount -> onWillMount
- componentDidMount -> onDidMount
- componentWillReceiveProps -> onWillReceiveProps
- componentWillUpdate -> onWillUpdate
- componentDidUpdate -> onDidUpdate
- componentWillUnmount -> onWillUnmount

Use as follows:

1. Bind your component.

```js
import Fine, { ComponentBind } from 'redux-fine';

export default connect(
    state => ({ state: state.index }),
    Fine.action('index'),
)(class IndexView extends ComponentBind('index') {
    render() {
        // ...
    }
}
```

2. Add a lifecycle to the Module.

```js
export default class IndexModule extends Fine.Module {

    initState = {
        name: 'index-view',
        list: [],
    }

    onDidCatch(err, info) {
        console.log('onDidCatch');
    }
    onWillMount() {
        console.log('onWillMount');
    }
    onDidMount() {
        console.log(this.state); // { name: 'index-view', list: [] }
        console.log('onDidMount');
    }
    onWillReceiveProps(nextProps) {
        console.log('onWillReceiveProps');
    }
    onWillUpdate(nextProps, nextState) {
        console.log('onWillUpdate');
    }
    onDidUpdate(prevProps, prevState) {
        console.log('onDidUpdate');
    }
    onWillUnmount() {
        console.log('onWillUnmount');
    }
}
```

### Precautions

- this.state, this.store, this.app can't be used in constructors or commit callbacks, they are runtime properties.
- Fine.config, Fine.module are valid until Fine.store() is called, and the setting is invalid after the call.
- action requires an arrow function form, the function starting with an underscore (_xxx) and the non-arrow function form will be filtered.
- The action function returns an empty function, so all return items will be invalid.

```js
class IndexModule extends Fine.Module {
    getList1() {
        // not action
    }
    _getList2() {
        // not action
    }
    getList3 = () => {
        // is action
        return true;
    }
}

Fine.module('index', IndexModule);

console.log(Fine.action('index'));
// { getList3: () => {} }
console.log(Fine.action('index').getList3());
// () => {}，Invalid return value
```

### Example
You can also directly view the [Example](https://github.com/Lizhooh/redux-fine/tree/master/example) code.

### API

#### config(option: object): void
The option object includes the following items:
- `devtool -> bool` - The default is false, true will check and open redux devtool.
- `middlewares -> Array` - redux middleware.

#### action(name: string): object
Name is the name of the module. Returns the action function of the specified module.

#### module(name: string, module?: object): object | void
If there is only one name parameter, try to get the module object. If there are two parameters, register a module.

#### store(initState?: object): object
Returns a store returned by createStroe .

#### mixin(key, val): void
Add a built-in method or property to the Module instance and add it to this at the end. Note that fixed properties with the same name cannot be overwritten.

#### helper(key, val): void
Add a built-in method or property to the Module instance and add it to this.helper.

#### Module
This is a base class, you need to inherit it to implement your own module. Module has the following properties and methods.
- `initState -> any` - the initial data of the module, the default is {}.
- `initialized() -> function` - the lifecycle function, called after the module has been created.
- `store -> any` - a global store shallow reference.
- `state -> any` - the state of this module.
- `app -> object` - global above.
    - app.module
    - app.action
    - app.mixin
- `helper -> object` - the helper added for the base class. The default is {};
- `commit -> void` - used to commit data changes. Similar to dispatch, but does not require type.
    There are four ways to commit:
    - `commit(cb: (state) => {});` - Submit a data state change, the callback function returns the most recent state, only changes the state of this module.
    - `commit(cb1: (state) => {}, cb2: (newState) => {});` - The second callback function is triggered after changing the state of the data, the parameter is the new state value.
    - `commit(name: string, cb: (state) => {});` - If the first argument is a string, it is an additional name for the action type.
    - `commit(name: string, cb1: (state) => {}, cb2: (newState) => {});` - The general function of the above.
- `commitAssign(newState)` -
