import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer from "store";

const store = createStore(reducer);
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#006d77",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
