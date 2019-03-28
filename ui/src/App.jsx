updateNumericResourceFieldimport React, { Component } from "react";
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
    const predefinedUrl = new URL("/predefined", window.config.env.REACT_APP_NOPAS_ENDPOINT)
    const stateUrl = new URL("/state", window.config.env.REACT_APP_NOPAS_ENDPOINT)
    axios
      .get(predefinedUrl)
      .then(response => {
        this.props.updatePossibleDefaultsList(response.data);
        axios
          .get(stateUrl)
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
      })
      .catch(function(error) {
        alert(error);
      });
  }

  sendUpdate() {
    const out = uiToServerConversion(this.props.state);
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
  refreshState: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

export default App;
