import _ from "lodash";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import Box from "@material-ui/core/Box";
import { makeStyles } from '@material-ui/core/styles';
import { AllBondsList } from "./AllBondsList/AllBondsList";
import { UserBondsList } from "./UserBondsList/UserBondsList";
import { Bond } from "../../store/account.types";

const useStyles = makeStyles((theme) => ({
  root: {
    "margin-bottom": "50px",
  },
  header: {
    "margin-bottom": "25px",
    "text-align": "left"
  }
}));

export const Bonds = () => {
  const classes = useStyles();
  const bonds = useSelector(({ bonds }: { bonds: Array<Bond> }) => bonds);

  const purchased = bonds.filter(bond => bond.count > 0);
  const nonPurchased = bonds.filter(bond => !bond.count);

  return (
    <div className={classes.root}>
      {
        !_.isEmpty(purchased) &&
        <Fragment>
          <Box className={classes.header} textAlign="left" fontSize="h6.fontSize">Ваши облигации</Box>
          <UserBondsList bonds={purchased} />
        </Fragment>
      }
      <Box className={classes.header} textAlign="left" fontSize="h6.fontSize">Все облигации</Box>
      <AllBondsList bonds={nonPurchased} />
    </div>
  )
}
