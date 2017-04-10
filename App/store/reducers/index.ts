import { IState } from "../../interfaces/state";
import { combineReducers } from "redux";

import table from "./table";

export default combineReducers<IState>({
    table
});