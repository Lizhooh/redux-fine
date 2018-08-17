import Fine from '../fine';
import merge from 'lodash.merge';

import IndexModule from './module';
import UserModule from './module/user';

// 配置
Fine.config({ devtool: true, middlewares: [] });

// 扩展功能
Fine.mixin('merge', (a, b) => merge({ ...a }, b));

// 注册模块
Fine.module('index', IndexModule);
Fine.module('user', UserModule);

// 返回创建后的 store
export default Fine.store();

