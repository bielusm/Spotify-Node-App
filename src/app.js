import SpotifyApp from "./components/SpotifyApp";
import React from "react";
import ReactDOM from "react-dom";

import configureStore from "./store/configureStore";
import { Provider } from "react-redux";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import "./styles/styles.scss";

const store = configureStore;

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const jsx = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <SpotifyApp />
    </ThemeProvider>
  </Provider>
);

ReactDOM.render(jsx, document.getElementById("app"));
