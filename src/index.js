import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'
import store from '@reducers'
import { Provider } from 'react-redux'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
   document.getElementById('app')
);

module.hot.accept(); // 热更新
