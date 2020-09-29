import _ from 'lodash';
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';

import { Box, Grid, Slider } from '@material-ui/core';
import { getAccountTotal } from "../../store/account.selectors";
import { setTotal } from "../../store/account.actions";
import { formatCash } from "../../lib/formatCash";
import { getBondsTotal } from "../../store/bonds.selector";

const useStyles = makeStyles({
  root: {
    "margin-bottom": '60px',
  },
  header: {
    "margin-bottom": "60px",
    "text-align": "left"
  }
})

const getMarks = () => _.map(_.range(0, 1001, 200), num => {
  return {
    value: num,
    label: num ? `${num} K` : 0
  }
})

export const Summary = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const total = useSelector(getAccountTotal);
  const bondsTotal = useSelector(getBondsTotal);

  const onChange = (e, val) => {
    if (val * 1000 > bondsTotal) {
      dispatch(setTotal(val * 1000))
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="space-between">
        <Grid className={classes.block} item xs={"auto"}>
          <Box className={classes.header} textAlign="left" fontSize="h6.fontSize">Сколько вы готовы вложить?</Box>
        </Grid>
        <Grid className={classes.block} item xs={"auto"}>
          <Box fontSize="h4.fontSize" textAlign="right">{formatCash(total)}</Box>
        </Grid>
        <Grid className={classes.block} item xs={12}>
        <Slider
            value={total / 1000}
            onChange={onChange}
            min={0}
            max={1000}
            step={50}
            marks={getMarks()}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>
    </div>
  )
};
