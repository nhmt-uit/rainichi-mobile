import {thunk} from "redux-thunk";
import { createLogger } from "redux-logger";
import { createStore, applyMiddleware } from "redux";
import reducers from "./reducers";
const middleware = [thunk];
if (process.env.NODE_ENV == "development") {
  middleware.push(createLogger());
}

export default createStore(reducers, applyMiddleware(...middleware));
