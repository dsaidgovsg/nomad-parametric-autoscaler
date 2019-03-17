import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { policyChange } from './reducers/Policy';
import { Provider } from "react-redux";
import { combineReducers, createStore } from 'redux'


const reducer = combineReducers({ policyChange })
const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
