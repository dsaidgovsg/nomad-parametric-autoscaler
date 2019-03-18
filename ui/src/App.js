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
  
  render() {

    const sendUpdate = () => {
      const state = JSON.parse(JSON.stringify(this.props.state));
      for (let sp of state.Subpolicies) {
        sp.Metadata = JSON.parse(sp.Metadata);
      }
      
      axios.post('http://localhost:8080/update', state)
    }

    const updateStatus = () => {
      // make get call
      axios.get('http://localhost:8080/state')
        .then((response) => {
          try {
            const newState = response.data
            for (let sp of newState.Subpolicies) { // convert metadata object to string
              sp.Metadata = JSON.stringify(sp.Metadata);
            }
            this.props.updateState(newState)
          } catch {
            console.log("Unable to convert json to string")
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    return (
      <div className="App">
      <Topbar>
        <StatusSwitch/>
        <Button variant="contained" color="primary" onClick={ updateStatus }>
          Refresh
          <RefreshIcon/>
        </Button>
        <Button variant="contained" color="primary" onClick={ sendUpdate }>
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
    updateState: (event) => dispatch({ type: 'UPDATE_STATE', change: event }),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

