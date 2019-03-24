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
    axios
      .get(`${window.config.env.REACT_APP_NOPAS_ENDPOINT}/state`)
      .then(response => {
        try {
          const newState = response.data;
          for (let sp of newState.Subpolicies) {
            // convert metadata object to string
            sp.Metadata = JSON.stringify(sp.Metadata);
          }
          this.props.refreshState(newState);
        } catch (error) {
          alert(error);
        }
      })
      .catch(function(error) {
        alert(error);
      });
  }

  sendUpdate() {
    const state = JSON.parse(JSON.stringify(this.props.state));
    for (let sp of state.Subpolicies) {
      sp.Metadata = JSON.parse(sp.Metadata);
    }
    axios.post(`${window.config.env.REACT_APP_NOPAS_ENDPOINT}/update`, state);
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
