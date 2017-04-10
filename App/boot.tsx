require("es6-promise").polyfill();
import "babel-polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "./store";
import * as Containers from "./containers";

// import "./style/style.scss";
import "font-awesome/scss/font-awesome.scss";

ReactDOM.render(
    <Provider store={store}>
        <Containers.App />
    </Provider>,
    document.getElementById("app")
);

// ReactDOM.render(
//     <DemoApp />,
//     document.getElementById("app")
// );