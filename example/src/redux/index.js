import Fine from 'redux-fine';
import IndexModule from './module';

// 配置
Fine.config({
    devtool: true,
    moduleMixin: { api },   // <-- 注入 mixin
});

// 注册模块
Fine.modules('index', IndexModule);

function api() {
    return new Promise(rs => setTimeout(rs, Math.random() * 2000 | 0));
}

// 返回创建后的 store
export default Fine.store();