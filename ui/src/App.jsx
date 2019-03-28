import React, { Component } from "react";
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

class App extends Component {
  constructor(props) {
    super(props);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.refreshState = this.refreshState.bind(this);
  }

  componentDidMount() {
    this.refreshState();
  }

  refreshState() {
    const reqUrl = new URL(
      "/state",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );

    axios
      .get(reqUrl)
      .then(response => {
        const newState = serverToUIConversion(response.data);
        newState && this.props.refreshState(newState);
      })
      .catch(function(error) {
        alert(error);
      });
  }

  sendUpdate() {
    const state = JSON.parse(JSON.stringify(this.props.state));
    const out = uiToServerConversion(state);
    const reqUrl = new URL(
      "/update",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );
    out && axios.post(reqUrl, out);
  }

  render() {
    return (
      <div className="App">
        <Topbar>
          <StatusSwitch />
          <Button
            variant="contained"
            color="primary"
            onClick={this.refreshState}
          >
            Refresh
            <RefreshIcon />
          </Button>
          <Button variant="contained" color="primary" onClick={this.sendUpdate}>
            Update
            <SendIcon />
          </Button>
        </Topbar>
        <PolicySummary />
      </div>
    );
  }
}

App.propTypes = {
  refreshState: PropTypes.func,
  state: PropTypes.object
};

export default App;
