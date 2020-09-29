import moment from "moment";
import { Company } from "./companies";

export enum AccountType { Broker, IIS};
export enum Risk {AAA, AA, A, BBB, BB, B, CC, C};

export type Bond = 	{
  company: Company,
  purchasePrice: number,
  purchaseDate: moment.Moment,
  sellingPrice: number,
  sellingDate: moment.Moment,
  risk: Risk,
  interestRate: number,
  couponFrequency: number,
  count: number
}

export type Account = {
  type: AccountType,
  reinvest: boolean,
  total: number
}
