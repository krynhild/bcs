import React from "react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import { formatCash } from "../../lib/formatCash";

const useStyles = makeStyles((theme) => ({
  root: {
    "margin-left": "-20px"
  },
  tooltip: {
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
  total: {
    color: "#82ca9d"
  },
  invested: {
    color: "#8884d8"
  }
}));

const CustomTooltip = ({ active, payload, label }) => {
  const classes = useStyles();
  if (active) {
    const portfolio = payload[0].payload;
    return (
      <>
        <div className={classes.tooltip}>
          <div className={classes.tooltipLabel}>{portfolio.date.format("DD MMMM YYYY")}</div>
          <div className={classes.tooltipContent}>
            <div className={classes.invested}>
              В НКД: {formatCash(portfolio.coupon)}
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export const CouponChart = ({ portfolio }) => {
  const classes = useStyles();

  const data = portfolio.map(slice => ({
    coupon: Math.round(slice.coupon),
    date: slice.date,
    month: slice.date.format("MMM YYYY")
  }));

  return (
    <div className={classes.root}>
      <ResponsiveContainer width={"100%"} height={250}>
        <AreaChart data={data}
                   margin={{ top: 10, right: 50, left: 50, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCoupon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="coupon" stroke="#82ca9d" fillOpacity={1} fill="url(#colorCoupon)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
