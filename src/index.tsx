import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Provider } from 'react-redux'
import { createStore } from "redux";
import reducer from "./reducers/reducer";

import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Call the element loader after the app has been rendered the first time
defineCustomElements(window);

const container = document.getElementById("root");
const root = createRoot(container!);
const store = createStore(reducer)
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
