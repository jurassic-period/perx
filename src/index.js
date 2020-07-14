import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import { reducer, dilerReducer } from "./redux/reducer";
import thunk from 'redux-thunk';
import App from "./App";

const store = createStore(
  combineReducers({ tableData: reducer, dilers: dilerReducer }),
  applyMiddleware(thunk)
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
