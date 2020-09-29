import moment from "moment";
import { Bond } from "../store/account.types";

export type BondCount = {
    bond: PortfolioBond,
    count: number,
}

export type PortfolioBond = Bond & {
    paymentDays: Array<moment.Moment>
}

export type Slice = {
    date: moment.Moment,
    invested: number,
    coupon: number,
    reservedCash: number,
    freeCash: number,
    portfolio: Array<BondCount>,
    couponPayment: Array<BondCount>
}

export function getCouponPaymentDates(bond: Bond, lastDay: moment.Moment)
: Array<moment.Moment> {
    let bondPaymentDates: Array<moment.Moment> = [];

    const frequency = 1 / bond.couponFrequency;
    const bondEnd = lastDay.clone().add(1, 'day');

    for (let temp = bond.purchaseDate.clone().add(frequency, 'year');
        temp.isBefore(bondEnd);
        temp.add(frequency, 'year')) {
        bondPaymentDates.push(temp.clone());
    }

    return bondPaymentDates;
}

export function getBondSlices( bonds: Array<Bond>, end?: moment.Moment): Array<BondCount> {
    return bonds.slice().map((bond: Bond, index: number): BondCount => {
        return({
            bond: {
                ...bond,
                paymentDays: getCouponPaymentDates(bond,
                    end === undefined ?
                    bond.sellingDate :
                    end)
            },
            count: bond.count
        })
    });
}

export function getAccruedInterest(
    bond: Bond,
    date: moment.Moment,
    paymentDays :Array<moment.Moment>,
): number {
    let nextPaymentDay = paymentDays.find((paymentDay: moment.Moment) =>
      date.isBefore(paymentDay)
    )
    if (!nextPaymentDay) return 0;

    const frequency = 1 / bond.couponFrequency;
    let lastPaymentDay = nextPaymentDay.clone().subtract(frequency, "year");
    let frequencyDay = date.clone().diff(lastPaymentDay);
    let year = date.clone().add(1, "year").diff(date);

    return bond.purchasePrice * bond.interestRate * frequencyDay / year;
}

export function getExchangeRate( exchangeRates: Map<string, number>, bond: Bond): number {
    return 1
    //return exchangeRates.get(bond.currency) as number;
}

export function getTax( withTax: boolean): number {
    return (withTax ? 0.87 : 1);
}

export function getCurrentPriceWithoutAccruedInterest(
    bond: Bond, date: moment.Moment): number {
    if (bond.purchasePrice === bond.sellingPrice) {
        return bond.purchasePrice
    }

    let diffDay = date.clone().diff(bond.purchaseDate);
    let sumDay = bond.sellingDate.clone().diff(bond.purchaseDate);
    return bond.purchasePrice + (diffDay / sumDay) * (bond.sellingPrice - bond.purchasePrice)
}

export function getCouponValue( bond: Bond, exchangeRates: Map<string, number>): number {
    return bond.purchasePrice *  // номинал
    (bond.interestRate / // годовой процент
     bond.couponFrequency) * // какая часть года прошла
    getExchangeRate(exchangeRates, bond) // курс
}

export function isProfit(bond: Bond,
    accruedInterest: number,
    exchangeRates: Map<string, number>,
    withTax: boolean): boolean {
    return !withTax || // либо нет налога
           accruedInterest < getCouponValue(bond, exchangeRates) * getTax(withTax); // или купон больше нкд
}

export function sortBondSlices(slices: Array<BondCount>) : void {
    let index = 1;
    while (
      index < slices.length &&
        slices[index - 1].count / slices[index - 1].bond.count >
        slices[index].count / slices[index].bond.count
      )
    {
        [ slices[index - 1], slices[index] ] = [ slices[index], slices[index - 1] ];
    }
}

export const portfolioReport = (
    start: moment.Moment,
    end: moment.Moment,
    bonds: Array<Bond>,
    cash: number,
    exchangeRates: Map<string, number>,
    reinvest?: number,
    monthlyInvestment: number = 0,
    withTax: boolean = true,
  ): Array<Slice> => {
    let currentBonds = getBondSlices(bonds.filter(bond => bond.count));
    let currentReservedCash = reinvest === undefined ? 0 : cash;
    let currentFreeCash = reinvest === undefined ? cash : 0;
    let result: Array<Slice> = [];

    for (let currentDate = start.clone(); currentDate.isBefore(end); currentDate.add(1, 'day')) {
        result.push({
            date: currentDate.clone(),
            // Песчет НКД
            coupon: currentBonds.reduce((coupons: number, bondCount: BondCount): number =>
            {
                return coupons +
                    bondCount.count * // количество
                    getAccruedInterest(bondCount.bond, currentDate, bondCount.bond.paymentDays) * // нкд
                    getExchangeRate(exchangeRates, bondCount.bond); // курс
            }, 0),
            // Песчет стоимости облигаций
            invested: currentBonds.reduce((invested: number, bondCount: BondCount): number =>
            {
                return invested +
                bondCount.count * // количество
                    getCurrentPriceWithoutAccruedInterest(bondCount.bond, currentDate) * // цена
                    getExchangeRate(exchangeRates, bondCount.bond); // курс
            }, 0),
            reservedCash: currentReservedCash,
            freeCash: currentFreeCash,
            portfolio: currentBonds.map(bondSlice => ({...bondSlice})),
            couponPayment: []
        })
        var nextDay = currentDate.clone().add(1, "day").add(1, 'second');

        // Выплата купонов нкд - кеш
        currentBonds.forEach((bondCount: BondCount) =>{

            let hasCouponPayment = bondCount.bond.paymentDays
                .some((paymentDate: moment.Moment) => {
                return paymentDate.isBetween(currentDate, nextDay);
            });

            if (hasCouponPayment) {
                let couponValue = bondCount.count * // количество
                    getCouponValue(bondCount.bond, exchangeRates) * // размер купона
                    getTax(withTax); // налог

                if (reinvest === undefined) {
                    currentFreeCash += couponValue;
                } else {
                    currentFreeCash += couponValue * (1 - (reinvest as number));
                    currentReservedCash += couponValue * (reinvest as number);
                }
                result[result.length - 1].couponPayment.push({...bondCount})
            }
        });

        if (reinvest === undefined) {
            // Пополнение (кеш++)
            if (currentDate.toDate().getDate() === 1) {
                currentFreeCash += monthlyInvestment;
            }

            // Выплата номинала облигации -> кеш
            currentBonds.forEach((bondCount: BondCount) =>{
                let bond = bondCount.bond;
                let hasLastPayment = bond.paymentDays[bond.paymentDays.length - 1]
                    .isBetween(currentDate, nextDay);
                if (hasLastPayment) {
                    currentFreeCash += bondCount.count * // количество
                                    (bond.purchasePrice + // номинал покупки
                                    getTax(withTax) * (bond.sellingPrice -  bond.purchasePrice)) * // прибыль
                                    getExchangeRate(exchangeRates, bond) // курс;
                    bondCount.count = 0;
                }
            });
        } else {
            // Пополнение (кеш++)
            if (currentDate.toDate().getDate() === 1) {
                currentReservedCash += monthlyInvestment;
            }

            // Рефинансирование (кеш -> облигации)
            while(true) {
                if (currentBonds.length === 0) {
                    break;
                }
                let bondSlice = currentBonds[0];
                let bond = bondSlice.bond;

                let priceWithoutAccruedInterest = getCurrentPriceWithoutAccruedInterest(bond, nextDay) *  // цена без нкд
                            getExchangeRate(exchangeRates, bond)
                let accruedInterest = getAccruedInterest(bond, nextDay, bond.paymentDays) * // нкд
                                      getExchangeRate(exchangeRates, bond)
                let price = priceWithoutAccruedInterest + accruedInterest;

                if (price < currentReservedCash && // хватает денег и
                    isProfit(bond, accruedInterest, exchangeRates, withTax)) { // либо проверяем выгоду

                    currentReservedCash -= price;
                    bondSlice.count += 1;

                    // сортируем currentBonds
                    sortBondSlices(currentBonds);

                } else {
                    // Всё вложили
                    break;
                }
            }
        }
    }
    return result;
  };
