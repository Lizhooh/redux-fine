import React from 'react';
import { Provider } from 'react-redux';
import store from './fine';
import IndexView from './views/index';
import './app.css';

export default () => (
    <Provider store={store}>
        <IndexView />
    </Provider>
)
