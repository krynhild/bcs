import { combineReducers } from "redux";
import { reducer as bondsReducer } from "./bonds.reducer";
import { reducer as accountReducer } from "./account.reducer";

export const reducer = combineReducers({
  bonds: bondsReducer,
  account: accountReducer
});
