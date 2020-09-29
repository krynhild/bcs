import React from "react";
import { Bond } from "../../../store/account.types";
import {
  Paper,
  TableCell, TableContainer, TableBody, TableRow, Table, IconButton, TableHead
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import { increaseBondCounter } from "../../../store/bonds.actions";
import { formatCash } from "../../../lib/formatCash";
import { useStyles } from "../common/useListStyles";

export const AllBondsList = ({ bonds }: { bonds: Array<Bond> }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <TableContainer className={classes.root} component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.logoCell} />
            <TableCell className={`${classes.th} ${classes.head}`} component="th" scope="row">Компания</TableCell>
            <TableCell className={classes.head} align="right">Номинал</TableCell>
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
                {formatCash(bond.purchasePrice)}
              </TableCell>
              <TableCell align="right" className={classes.profitCell}>
                {`${(bond.interestRate * 100).toPrecision(2)}%`}
              </TableCell>
              <TableCell className={classes.actionCell} align="right">
                <IconButton
                  size="small"
                  onClick={() => dispatch(increaseBondCounter(bond.company.name))}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
