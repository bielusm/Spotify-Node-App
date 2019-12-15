import SpotifyApp from "./components/SpotifyApp";
import React from "react";
import ReactDOM from "react-dom";

import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

import { StylesProvider, ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core";

import "./styles/styles.scss";

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const store = configureStore;

const jsx = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <StylesProvider injectFirst>
        <SpotifyApp />
      </StylesProvider>
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById("app"));
