import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import App from './App';
import './index.css';

import moment from "moment";
import "moment/locale/ru";

import { HttpClient } from "./services/http.service";
import { makeStore } from "./store";

const http = new HttpClient("http://93.175.12.111:8001/api");
const store = makeStore({ api: http }, {});

moment.locale('ru');

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
