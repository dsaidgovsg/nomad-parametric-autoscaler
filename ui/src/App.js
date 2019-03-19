import React, { Component } from 'react';
import { connect } from "react-redux";
import './App.css';

import { Button } from '../node_modules/@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import RefreshIcon from '@material-ui/icons/Refresh';
import axios from 'axios';

import Topbar from './components/Topbar';
import StatusSwitch from './components/StatusSwitch';
import PolicySummary from './containers/PolicySummary';

class App extends Component {
  constructor(props) {
    super(props);
    this.sendUpdate = this.sendUpdate.bind(this);
    this.refreshState = this.refreshState.bind(this);
  }
  
  sendUpdate() {
    const state = JSON.parse(JSON.stringify(this.props.state));
    for (let sp of state.Subpolicies) {
      sp.Metadata = JSON.parse(sp.Metadata);
    }
    axios.post(`${window.config.env.REACT_APP_NOPAS_ENDPOINT}/update`, state)
  }

  refreshState() {
    axios.get(`${window.config.env.REACT_APP_NOPAS_ENDPOINT}/state`)
      .then((response) => {
        try {
          const newState = response.data
          for (let sp of newState.Subpolicies) { // convert metadata object to string
            sp.Metadata = JSON.stringify(sp.Metadata);
          }
          this.props.refreshState(newState)
        } catch {
          console.log("Unable to convert json to string")
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.refreshState()
  }

  render() {
    return (
      <div className="App">
      <Topbar>
        <StatusSwitch/>
        <Button variant="contained" color="primary" onClick={ this.refreshState }>
          Refresh
          <RefreshIcon/>
        </Button>
        <Button variant="contained" color="primary" onClick={ this.sendUpdate }>
          Update
          <SendIcon/>
        </Button>
      </Topbar>
      <PolicySummary></PolicySummary>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      state : state.policy,
   };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshState: (event) => dispatch({ type: 'UPDATE_STATE', change: event }),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
