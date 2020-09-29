import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getCouponValue, getTax} from "../../lib/portfolioReport";
import { makeStyles } from "@material-ui/core/styles";
import { formatCash } from "../../lib/formatCash";

const useStyles = makeStyles(() => ({
  root: {},
  tooltip: {
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
  tooltipLabel: {
    "margin-bottom": "5px"
  },
  tooltipContent: {
    color: "#8884d8"
  }
}));

const COLORS = ['#0088FE', '#00C49F', '#8884d8', '#FF8042'];

const CustomTooltip = ({ active, payload, label }) => {
  const classes = useStyles();

  if (active) {
    return (
      <>
        <div className={classes.tooltip}>
          <div className={classes.tooltipLabel}>{label}</div>
          <div className={classes.tooltipContent}>
            {
              payload[0].payload.payments.map(
                (bond, index) => bond.returned ?
                  <div style={{"color": COLORS[index % 4]}}>
                    {bond.name}: {formatCash(bond.returned)}
                  </div> :
                  null
              )
            }
          </div>
        </div>
      </>
    );
  }

  return null;
};

export const PaymentChart = ({ portfolio, withTax }) => {
  const classes = useStyles();

  var data = [{
    month: portfolio[0].date.format("MMM YY"),
    payments: [],
    returned: 0
  }];

  portfolio.forEach(element => {
    var month = element.date.format("MMM YY");
    if (data[data.length - 1].month !== month) {
      data.push({
        month: month,
        payments: [],
        returned: 0
      });
    }
    var carrentData = data[data.length - 1];
    element.couponPayment.forEach(coupon => {
      let cash = Math.round(coupon.count *
        getCouponValue(coupon.bond, undefined) *
        getTax(withTax))
      carrentData.payments.push({
        name: coupon.bond.company.name,
        returned: cash,
      })
      carrentData.returned += cash
    });
  });

  return (
    <div className={classes.root}>
      <ResponsiveContainer width={"100%"} height={250}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="returned" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
