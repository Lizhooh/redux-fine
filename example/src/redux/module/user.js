import Fine from 'redux-fine';

export default class UserModule extends Fine.Module {

    initState = {
        name: 'user-view',
        list: [],
    }

    say = () => {
        console.log('say: hello');
        return 'hello';
    }

}
