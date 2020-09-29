import React from "react";
import { Box, Checkbox, FormControlLabel, FormGroup, Grid } from "@material-ui/core";
import { setAccountType, setReinvest } from "../../store/account.actions";
import { AccountType } from "../../store/account.types";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAccountReinvest, isAccountIIS } from "../../store/account.selectors";

const useStyles = makeStyles({
  root: {
    "margin-bottom": '60px',
  },
  header: {
    "margin-bottom": "25px",
  },
  formGroup: {
    "margin-bottom": "10px",
  }
})

export const InvestmentConditions = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const reinvest = useSelector(getAccountReinvest);
  const iis = useSelector(isAccountIIS);

  return (
    <div className={classes.root}>
      <Grid item xs={12}>
        <Box>
          <Box className={classes.header} textAlign="left" fontSize="h6.fontSize">Условия инвестирования</Box>
          <FormGroup className={classes.formGroup}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={iis}
                  onChange={
                    (event) =>
                      dispatch(setAccountType(event.target.checked ? AccountType.IIS : AccountType.Broker))
                  }
                  name="IIS"
                  color="primary"
                />
              }
              label="Индивидуальный инвестиционный счет"
            />
            <FormHelperText>
              Индивидуальный инвестиционный счет открывается не менее чем на три года и позволяет получить +13%
              к инвестициям за счет налогового вычета.
              <a href="https://bcspremier.ru/investment/iis/">Подробнее...</a>
            </FormHelperText>
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={reinvest}
                  onChange={(event) => dispatch(setReinvest(event.target.checked))}
                  name="Reinvest"
                  color="primary"
                />
              }
              label="Реинвестировать"
            />
            <FormHelperText>
              Накопленный доход с облигаций будет автоматически использован для покупки новых облигаций того же
              эмитента. Доходы с облигаций одного эмитента не будут использоваться дл покупки облигаций других
              эмитентов.
            </FormHelperText>
          </FormGroup>
        </Box>
      </Grid>
    </div>
  );
}
