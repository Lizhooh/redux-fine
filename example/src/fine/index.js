import Fine from 'redux-fine';
import IndexModule from './module';
import UserModule from './module/user';

function api() {
    return new Promise(rs => setTimeout(rs, Math.random() * 2000 | 0));
}

// 配置
Fine.config({ devtool: true  });

// 扩展功能
Fine.mixin('api', api);

// 注册模块
Fine.module('index', IndexModule);
Fine.module('user', UserModule);


// 返回创建后的 store
export default Fine.store();