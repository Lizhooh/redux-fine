import Fine from 'redux-fine';

export default class TestModule extends Fine.Module {
    initState = {
        navigator: null,
    }

    updateNavigator = (navigator) => {
        this.commit(state => ({ ...state, navigator }));
    }

    initialized() {
        console.log('我');
    }
}