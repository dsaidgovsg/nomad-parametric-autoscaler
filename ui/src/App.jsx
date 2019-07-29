// @flow

import React, { Component, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import axios from "axios";
import Topbar from "./components/Topbar";
import StatusSwitch from "./components/StatusSwitch";
import PolicySummary from "./containers/PolicySummary";
import { Button } from "../node_modules/@material-ui/core";
import {
  uiToServerConversion,
  serverToUIConversion
} from "./utils/stateConversion";

import type { NopasState, PossibleDefaults } from "./types";

type Props = {
  state: NopasState,
  refreshState: NopasState => Function,
  updatePossibleDefaultsList: PossibleDefaults => Function
};

const App = (props: Props) => {
  useEffect(() => {
    refreshPolicy();
  }, []);

  const refreshPolicy = async () => {
    const predefinedUrl = new URL(
      "/predefined",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );

    const policyUrl = new URL(
      "/policy",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );

    let firstResponse = await axios.get(predefinedUrl);
    if (firstResponse.err) {
      alert(firstResponse.err);
      return;
    }

    props.updatePossibleDefaultsList(firstResponse.data);
    let secondResponse = await axios.get(policyUrl);
    if (secondResponse.err) {
      alert(secondResponse.err);
    } else {
      const newState = serverToUIConversion(secondResponse.data);
      newState && props.refreshState(newState);
    }
  };

  const sendUpdate = () => {
    const out = uiToServerConversion(props.state);
    const reqUrl = new URL(
      "/policy",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );
    out && axios.post(reqUrl, out);
  };

  return (
    <div className="App">
      <Topbar>
        <StatusSwitch />
        <Button variant="contained" color="primary" onClick={refreshPolicy}>
          Refresh
          <RefreshIcon />
        </Button>
        <Button variant="contained" color="primary" onClick={sendUpdate}>
          Update
          <SendIcon />
        </Button>
      </Topbar>
      <PolicySummary />
    </div>
  );
};

App.propTypes = {
  refreshState: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default App;
