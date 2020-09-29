import thunk from "redux-thunk";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer as rootReducer } from "./root.reducer";

export const makeStore = (deps, state) =>
  createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(
      thunk.withExtraArgument(deps)
    ))
  );
