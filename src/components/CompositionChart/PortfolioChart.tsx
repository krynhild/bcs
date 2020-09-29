import React from "react";
import Grid from "@material-ui/core/Grid";
import { CompositionChart } from "./CompositionChart";
import { makeStyles } from '@material-ui/core/styles';
import { Box } from "@material-ui/core";
import { Slice } from "../../lib/portfolioReport";

//слайдер - accountTotal = slice.invested[first] + freeMoney
//первый чарт - slice.invested[first] | freeMoney
//второй чарт - slice.invested[last] | slice.returned + accountTotal - slice.invested[first]

// 1 000 000 <-слайдер
//500 K - bondsTotal, 500 K - free money
//550 K - slice.invested, 20 K - slice.returned, freeMoney - 500 K

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  badge: {
    color: "white",
    margin: "0 auto",
    padding: "10px 15px",
    "max-width": "300px",
    "border-radius": "20px",
    "background-color": "#3a4fcc",
  }
}));

export const PortfolioChart = ({ portfolio }: { portfolio: Array<Slice>, withTax: boolean }) => {
  const classes = useStyles();

  const firstSlice = portfolio[0];
  const lastSlice = portfolio[portfolio.length - 1];

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box fontSize={"h6.fontSize"}>Сейчас</Box>
          <CompositionChart
            cash={Math.round(firstSlice.freeCash + firstSlice.reservedCash)}
            invested={Math.round(firstSlice.coupon + firstSlice.invested)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box fontSize={"h6.fontSize"}>В конце периода</Box>
          <CompositionChart
            cash={Math.round(lastSlice.freeCash + lastSlice.reservedCash)}
            invested={Math.round(lastSlice.coupon + lastSlice.invested)}
          />
        </Grid>
      </Grid>
    </div>
  );
}
