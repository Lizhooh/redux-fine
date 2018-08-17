import Fine from '../../fine';

export default class IndexModule extends Fine.Module {

    initState = {
        name: 'index-view',
        list: [],
    }

    // action
    addItem = text => {
        console.log(this.state);

        this.commit(state => this.merge(state, {
            list: [...state.list, {
                id: Math.random().toString(32).slice(2),
                text: text,
            }],
        }));
    }

    // action
    removeItem = id => {
        this.commit(state => this.merge(state, {
            list: state.list.filter(i => i.id !== id),
        }));
    }

}
