import _ from "lodash";
import React from "react";
import { useDispatch } from "react-redux";
import { Bond } from "../../../store/account.types";
import {
  Paper,
  TableCell, TableContainer, TableBody, TableRow, Table, IconButton,
  InputBase, TableHead
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import CloseIcon from "@material-ui/icons/Close";
import { increaseBondCounter, decreaseBondCounter, setBondQuantity } from "../../../store/bonds.actions";
import { formatCash } from "../../../lib/formatCash";
import { useStyles } from "../common/useListStyles";

export const UserBondsList = ({ bonds }: { bonds: Array<Bond> }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onChange = ({ target: { value } }: { target: { value: string } }, bond: Bond) => {
    let quantity = +(value.trim());

    if (_.isNaN(quantity)) return;
    if ((+value) < 1) return;

    dispatch(setBondQuantity(bond.company.name, quantity))
  }

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell className={classes.logoCell} />
            <TableCell className={`${classes.th} ${classes.head}`} component="th" scope="row">Компания</TableCell>
            <TableCell className={classes.head} align="right">Количество</TableCell>
            <TableCell className={classes.head} align="right">Инвестировано</TableCell>
            <TableCell className={classes.head} align="right">Ставка</TableCell>
            <TableCell className={classes.head} align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
          {bonds.map((bond, index) => (
            <TableRow key={index}>
              <TableCell className={classes.logoCell} >
                <img alt="logo" className={classes.img} height={30} src={bond.company.logo} />
              </TableCell>
              <TableCell className={classes.th} component="th" scope="row">
                {bond.company.description}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => dispatch(decreaseBondCounter(bond.company.name))}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <InputBase
                  error={true}
                  className={classes.numberInput}
                  value={bond.count}
                  inputProps={{
                    style: { textAlign: "center" }
                  }}
                  onChange={(e) => onChange(e, bond)}
                />
                <IconButton
                  size="small"
                  onClick={() => dispatch(increaseBondCounter(bond.company.name))}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </TableCell>
              <TableCell align="right">
                {formatCash(bond.count * bond.sellingPrice)}
              </TableCell>
              <TableCell align="right" className={classes.profitCell}>
                {`${(bond.interestRate * 100).toPrecision(2)}%`}
              </TableCell>
              <TableCell className={classes.actionCell} align="right">
                <IconButton
                  size="small"
                  onClick={() => dispatch(setBondQuantity(bond.company.name, 0))}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
