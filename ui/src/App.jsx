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
    this.refreshPolicy = this.refreshPolicy.bind(this);

    this.state = {
      status: true,
      refreshState: this.refreshState
    }
  }

  componentDidMount() {
    this.refreshPolicy();
  }

  async refreshState() {
    const stateUrl = new URL(
      "/state",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );

    axios.get(stateUrl).then((rsp) => {
      this.setState({ status: rsp})
    }).catch(function (error) {
      console.log(error);
    })
  }

  async refreshPolicy() {
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

    this.props.updatePossibleDefaultsList(firstResponse.data);
    let secondResponse = await axios.get(policyUrl);
    if (secondResponse.err) {
      alert(secondResponse.err);
    } else {
      const newState = serverToUIConversion(secondResponse.data);
      this.Stateprops.refreshState(newState);
    }
  }

  sendUpdate() {
    const out = uiToServerConversion(this.props.state);
    const reqUrl = new URL(
      "/policy",
      window.config.env.REACT_APP_NOPAS_ENDPOINT
    );
    out && axios.post(reqUrl, out);
  }

  render() {
    return (
      <div className="App">
        <Topbar>
          <StatusSwitch isRunning={this.state.status} refreshState={this.state.refreshState}/>
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
  refreshState: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default App;
