import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  stretch: {
    "background": "#3a4fcc"
  },
  wrapper: {
    padding: "20px 0",
    margin: "0 auto",
    maxWidth: "1000px",
  },
  textWrapper: {
    margin: "0",
    width: "150px",
  },
  title: {
    "margin-left": "10px",
    "font-size": "16px",
    "font-weight": 600,
    color: "white"
  }
})

export const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.stretch}>
      <div className={classes.wrapper}>
        <div className={classes.textWrapper}>
          <img alt="logo" src={"logo.svg"} width={26} height={26} />
          <span className={classes.title}>BCS EXPRESS</span>
        </div>
      </div>
    </div>
  );
}
