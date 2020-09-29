import { Dispatch } from "redux";
import { HttpClient } from "../services/http.service";
import { Bond } from "./account.types";

export const INCREASE_BOND_COUNTER = "[BONDS] INCREASE_BOND_COUNTER";
export const DECREASE_BOND_COUNTER = "[BONDS] DECREASE_BOND_COUNTER";
export const SET_BOND_QUANTITY = "[BONDS] SET_BOND_QUANTITY";
export const LOAD_BONDS_SUCCESS = "[BONDS] LOAD_BONDS_SUCCESS";


export const loadBonds = () => async (dispatch: Dispatch, getState: Function, { api }: { api: HttpClient }) => {
  const { data }: { data: Array<Bond> } = await api.get("/bonds");
  dispatch(loadBondsSuccess(data));
};

export const loadBondsSuccess = (bonds: Array<Bond>) => ({
  type: LOAD_BONDS_SUCCESS,
  payload: bonds
});

export const increaseBondCounter = (companyName: string) => ({
  type: INCREASE_BOND_COUNTER,
  payload: { companyName }
});

export const setBondQuantity = (companyName: string, count: number) => ({
  type: SET_BOND_QUANTITY,
  payload: { companyName, count }
});

export const decreaseBondCounter = (companyName: string) => ({
  type: DECREASE_BOND_COUNTER,
  payload: { companyName }
});
