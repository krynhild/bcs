import { Account, AccountType } from "./account.types";
import { SET_TOTAL, SET_REINVEST, SET_ACCOUNT_TYPE } from "./account.actions";

const initialState: Account = {
  type: AccountType.IIS,
  reinvest: false,
  total: 300000
}

export const reducer = (state: Account = initialState, { type, payload }: { type: string, payload: any }) => {
  switch (type) {
    case SET_REINVEST:
      return {
        ...state,
        reinvest: payload
      };
    case SET_TOTAL:
      return {
        ...state,
        total: payload
      };
    case SET_ACCOUNT_TYPE:
      return {
        ...state,
        type: payload
      };
    default:
      return state;
  }
};

