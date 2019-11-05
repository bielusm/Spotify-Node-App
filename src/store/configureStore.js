import { combineReducers, createStore } from "redux";
import errorReducer from "./reducers/errorReducer";
import userInfo from "./reducers/userInfo";

const reducer = combineReducers({ error: errorReducer, userInfo });

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
