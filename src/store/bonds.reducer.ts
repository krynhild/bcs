import moment from "moment";
import { Bond } from "./account.types";
import { AnyAction } from "redux";
import {
  INCREASE_BOND_COUNTER,
  DECREASE_BOND_COUNTER,
  SET_BOND_QUANTITY,
  LOAD_BONDS_SUCCESS
} from "./bonds.actions";

export const reducer = (state: Array<Bond> = [], action: AnyAction) => {
  switch (action.type) {
    case LOAD_BONDS_SUCCESS:
      return action.payload.map(
        (item: Bond) => ({
          ...item,
          count: item.count || 0,
          interestRate: item.interestRate / 100000,
          purchasePrice: item.purchasePrice / 100,
          sellingPrice: item.sellingPrice / 100,
          sellingDate: moment(item.sellingDate, "DD.MM.YYYY"),
          purchaseDate: moment(item.purchaseDate, "DD.MM.YYYY")
        })
      );
    case INCREASE_BOND_COUNTER:
      return state.map(bond =>
        bond.company.name === action.payload.companyName ?
          {
            ...bond,
            count: bond.count + 1
          } :
          bond
      );
    case DECREASE_BOND_COUNTER:
      return state.map(bond =>
        bond.company.name === action.payload.companyName ?
          {
            ...bond,
            count: bond.count > 1 ? bond.count - 1 : bond.count
          } :
          bond
      );
    case SET_BOND_QUANTITY:
      return state.map(bond =>
        bond.company.name === action.payload.companyName ?
          {
            ...bond,
            count: action.payload.count
          } :
          bond
      );
    default:
      return state;
  }
};
