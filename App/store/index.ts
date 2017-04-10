import { createStore } from "redux";

import { IState } from "../interfaces/state";
import reducers from "./reducers";
import initialState from "../constants/state";
import middlewares from "./middlewares";

let devtools: any = window["__REDUX_DEVTOOLS_EXTENSION__"] ? window["__REDUX_DEVTOOLS_EXTENSION__"](): (f:any)=>f;

export default middlewares(devtools(createStore))(reducers, initialState);