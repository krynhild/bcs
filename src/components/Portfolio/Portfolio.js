import moment from "moment";
import MomentUtils from '@date-io/moment';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles, Tab, Tabs, Box } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { getAccountReinvest, getAccountTotal } from "../../store/account.selectors";
import { getTax, portfolioReport } from "../../lib/portfolioReport";
import { getBondsTotal } from "../../store/bonds.selector";
import { TabPanel } from "../common/TabPanel";
import { isAccountIIS } from "../../store/account.selectors";
import { ProfitChart } from "../ProfitChart/ProfitChart";
import { PaymentChart } from "../PaymentChart/PaymentChart";
import { CouponChart } from "../CouponChart/CouponChart";
import { PortfolioChart } from "../CompositionChart/PortfolioChart";
import { formatCash } from "../../lib/formatCash";

const useStyles = makeStyles((theme) => ({
  root: {
    "margin-bottom": "50px",
  },
  header: {
    "margin-bottom": "25px",
    "text-align": "left"
  },
  picker: {
    width: "200px",
    "margin-bottom": "20px"
  },
  tabs: {
    "margin-bottom": "25px"
  },
  leftAlign: {
    "text-align": "left"
  },
  flex: {
    display: "flex",
    "justify-content": "space-between"
  },
  badge: {
    color: "white",
    margin: "30px auto 0",
    padding: "10px 15px",
    "max-width": "300px",
    "border-radius": "20px",
    "background-color": "#3a4fcc",
  }
}));

const TABS = { Profit: 0, Composition: 1 };

export const Portfolio = () => {
  const classes = useStyles();
  const [activeTab, setTab] = useState(TABS.Profit);
  const [date, setDate] = useState(moment().add(1, 'year'));
  const iis = useSelector(isAccountIIS);

  const startDate = moment().startOf('day');
  const endDate = moment(date);

  const isReinvest = useSelector(getAccountReinvest);
  const reinvest = isReinvest ? 1 : undefined;

  const bonds = useSelector(state => state.bonds);
  const accountTotal = useSelector(getAccountTotal); //slider
  const initialInvestment = useSelector(getBondsTotal); // slice.invested[first]
  
  const portfolio = portfolioReport(startDate, endDate, bonds,
     accountTotal - initialInvestment, undefined, reinvest, 0, !iis);

  const firstSlice = portfolio[0];
  const lastSlice = portfolio[portfolio.length - 1];

  const firstSliceTotal = firstSlice.invested + firstSlice.freeCash + firstSlice.reservedCash + firstSlice.coupon;
  const lastSliceTotal = lastSlice.invested + lastSlice.freeCash + lastSlice.reservedCash + lastSlice.coupon * getTax(!iis);
  const percentage = ((lastSliceTotal * 100 / accountTotal) - 100).toFixed(2)

  return (
    <Box className={classes.root}>
      <div className={classes.flex}>
        <Box className={classes.header} textAlign="left" fontSize="h6.fontSize">Посчитаем доходы?</Box>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div className={classes.leftAlign}>
            <DatePicker
              className={classes.picker}
              views={["year", "month"]}
              label="Изменить конечную дату"
              minDate={moment().add(1, 'year')}
              maxDate={moment().add(5, 'year')}
              value={date}
              onChange={(value) => setDate(value)}
            />
          </div>
        </MuiPickersUtilsProvider>
      </div>
      <Tabs
        className={classes.tabs}
        indicatorColor="primary"
        textColor={"primary"}
        value={activeTab}
        onChange={(e, tab) => setTab(tab)}
      >        
        <Tab label="Состав портфеля" />
        <Tab label="Расписание выплат" />
        <Tab label="Купонный доход" />
        <Tab label="Прогноз доходов" />
      </Tabs>
      <TabPanel activeTab={activeTab} index={0}>
        <PortfolioChart portfolio={portfolio} withTax={!iis}/>
      </TabPanel>
      <TabPanel activeTab={activeTab} index={1}>
        <PaymentChart portfolio={portfolio} withTax={!iis}/>
      </TabPanel>
      <TabPanel activeTab={activeTab} index={2}>
        <CouponChart portfolio={portfolio} />
      </TabPanel>
      <TabPanel activeTab={activeTab} index={3}>
        <ProfitChart portfolio={portfolio} />
      </TabPanel>
      <Box className={classes.badge}>
        Чистая прибыль: {formatCash(lastSliceTotal - firstSliceTotal)} {` (+${percentage}%)`}
      </Box>
    </Box>
  );
}
