import Fine from '..';

describe('redux-fine', () => {

    test('config', () => {
        const logger = store => next => action => {
            return next(action);
        };

        Fine.config({ devtool: true, middlewares: [logger] });

        const { config } = Fine._$;
        expect(config).toEqual({
            devtool: true, middlewares: [logger],
        });
    });

    test('module', () => {
        class IndexMudole extends Fine.Module {
            initState = {
                name: 'index',
                list: [1, 2, 3],
            };
        }

        Fine.module('index', IndexMudole);
        const index = Fine.module('index');

        Fine.store();

        expect(index.state).toEqual({
            name: 'index',
            list: [1, 2, 3],
        });
    });

    test('action', () => {
        class Index2Module extends Fine.Module {
            initState = {
                name: 'index2',
                list: [1, 2, 3],
            };
            add = (n) => {
                const list = this.state.list;
                list.push(n);
                this.commitAssign({ list });
            }
            _add2 = (n) => {
                const list = this.state.list;
                list.push(n);
                this.commitAssign({ list });
            }
            add3(n) {
                const list = this.state.list;
                list.push(n);
                this.commitAssign({ list });
            }
        }

        Fine.module('index2', Index2Module);
        const action = Fine.action('index2');
        const index2 = Fine.module('index2');

        Fine.store();

        expect(Object.keys(action)).toEqual(['add', 'add3']);

        action.add(4);

        expect(index2.state).toEqual({
            name: 'index2',
            list: [1, 2, 3, 4],
        });
    });

    test('mixin', () => {
        class Index3Module extends Fine.Module {
            initState = {
                name: 'index3',
                list: [1, 2, 3],
            };
        }

        Fine.mixin('api', () => { });
        Fine.module('index3', Index3Module);
        Fine.store();

        const index3 = Fine.module('index3');

        expect(index3.api).not.toBeUndefined();
    });

    test('helper', () => {
        class Index4Module extends Fine.Module {
            initState = {
                name: 'index3',
                list: [1, 2, 3],
            };
        }

        Fine.mixin('merge', () => { });
        Fine.module('index4', Index4Module);
        Fine.store();

        const index4 = Fine.module('index4');

        expect(index4.helper).not.toBeUndefined();
    });
});