import React from 'react';
import { useDispatch } from "react-redux";
import { Box, Typography } from "@material-ui/core";
import { Summary } from "./components/Summary/Summary";
import { Portfolio } from "./components/Portfolio/Portfolio";
import { Bonds } from "./components/Bonds/Bonds";
import { InvestmentConditions } from "./components/InvestmentConditions/InvestmentConditions";
import { Header } from "./components/common/Header";
import { loadBonds } from "./store/bonds.actions";
import './App.css';

function App() {
  const dispatch = useDispatch();
  dispatch(loadBonds());

  return (
    <div className="app">
      <Header />
      <div style={{ maxWidth: "1000px", padding: "20px 5%" , margin: "0 auto" }}>
        <Box style={{ "margin": "35px 0" }} textAlign={"left"}>
          <Typography variant={"h4"}>
            Календарь инвестиций
          </Typography>
        </Box>
        <Summary />
        <InvestmentConditions />
        <Portfolio />
        <Bonds />
      </div>
    </div>
  );
}

export default App;
