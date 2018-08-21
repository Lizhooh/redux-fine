import Fine from 'redux-fine';
import assign from 'lodash.assign';

import IndexModule from './module';
import UserModule from './module/user';

// 配置
Fine.config({ devtool: true });

// 扩展功能
Fine.mixin('assign', (...arg) => ({ ...assign(...arg) }));

// 注册模块
Fine.module('index', IndexModule);
Fine.module('user', UserModule);

// 返回创建后的 store
export default Fine.store();
