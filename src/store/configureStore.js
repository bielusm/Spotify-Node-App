import { createStore } from "redux";
import errorReducer from "./reducers/errorReducer";

export default () => {
  const store = createStore(
    errorReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  return store;
};
