import _ from "lodash";
import moment from "moment";
import { getAccruedInterest, getCouponPaymentDates } from "../lib/portfolioReport";
import { Bond } from "./account.types";

export const getBondsTotal = ({ bonds }: {bonds: Array<Bond>}): number => {
  return _.reduce(bonds, (acc: number, bond: Bond) => {
    let paymentDates = getCouponPaymentDates(bond, bond.sellingDate);
    let coupon =  getAccruedInterest(bond, moment(), paymentDates)
    return acc + (bond.purchasePrice + coupon) * bond.count 
  }, 0)
};
