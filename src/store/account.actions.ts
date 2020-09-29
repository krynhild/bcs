import {Action, ActionCreator, Dispatch} from 'redux';
import { AccountType } from "./account.types";

export const SET_TOTAL = "[ACCOUNT] SET_AMOUNT";
export const SET_REINVEST = "[ACCOUNT] SET_REINVEST";
export const SET_ACCOUNT_TYPE = "[ACCOUNT] SET_ACCOUNT_TYPE";
export const LOAD_SUCCESS = "[ACCOUNT] LOAD_SUCCESS";
export const LOAD_FAILURE = "[ACCOUNT] LOAD_FAILURE";

export const load = () => async (dispatch: Dispatch, getState: Function) => {}

export const setTotal = (total: number) => ({
  type: SET_TOTAL,
  payload: total
});

export const setReinvest = (value: boolean) => ({
  type: SET_REINVEST,
  payload: value
});

export const setAccountType = (value: AccountType) => ({
  type: SET_ACCOUNT_TYPE,
  payload: value
});

export const loadSuccess: ActionCreator<Action> = (data: any) => ({
  type: LOAD_SUCCESS,
  payload: data
});

export const loadFailure: ActionCreator<Action> = (error: any) => ({
  type: LOAD_FAILURE,
  payload: error
});


