import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import { Provider }from 'react-redux';
import * as serviceWorker from './serviceWorker';
import store from './store/store';
import ReactBreakpoints from 'react-breakpoints';

const breakpoints = {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
}

ReactDOM.render(
    <Provider store ={store}>
    <ReactBreakpoints breakpoints = {breakpoints}>
        <App />
    </ReactBreakpoints>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
