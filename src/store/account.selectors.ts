import { Account, AccountType } from "./account.types";

export const getAccountTotal = (state: {account: Account}) => state.account.total;
export const getAccountReinvest = (state: {account: Account}) => state.account.reinvest;
export const isAccountIIS = (state: {account: Account}) => state.account.type === AccountType.IIS;
