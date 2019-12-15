import SpotifyApp from "./components/SpotifyApp";
import React from "react";
import ReactDOM from "react-dom";

import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

import { StylesProvider } from "@material-ui/core/styles";

import "./styles/styles.scss";

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <StylesProvider injectFirst>
      <SpotifyApp />
    </StylesProvider>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById("app"));
