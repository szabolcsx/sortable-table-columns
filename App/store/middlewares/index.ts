import { applyMiddleware } from "redux";

const createLogger = require("redux-logger");
import thunk from "redux-thunk";

export default applyMiddleware(
    createLogger({collapsed: true}),
    thunk
);