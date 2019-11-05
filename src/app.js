import SpotifyApp from "./components/SpotifyApp";
import React from "react";
import ReactDOM from "react-dom";

import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

import "normalize.css/normalize.css";
import "./styles/styles.scss";

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <SpotifyApp />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById("app"));
