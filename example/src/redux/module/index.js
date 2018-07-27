import Fine from 'redux-fine';

export default class IndexModule extends Fine.Module {

    initState = {
        name: 'index-view',
        list: [],
    }

    constructor(props) {
        super(props);
        this.api().then(res => {
            console.log('调用了注入的 mixin 函数');
        });
    }

    // action
    addItem = text => this.commit(state => ({
        ...state, list: [...state.list, {
            id: Math.random().toString(32).slice(2),
            text: text,
        }],
    }))

    // action
    removeItem = id => this.commit(state => ({
        ...state, list: state.list.filter(i => i.id !== id),
    }))

}




