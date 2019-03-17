import React, { Component } from 'react';
import { connect } from "react-redux";
import logo from './logo.svg';
import './App.css';
import Topbar from './components/Topbar';
import StatusSwitch from './components/StatusSwitch';
import PolicyDisplay from './components/PolicyDisplay';
import { Button } from '../node_modules/@material-ui/core';
import axios from 'axios';

class App extends Component {
  
  render() {

    const sendUpdate = () => {
      const state = this.props.state;
      for (let sp of state.Subpolicies) {
        sp.Metadata = JSON.parse(sp.Metadata);
      }
      // make POST call
      axios.post('http://localhost:8080/update', state)
    }

    const updateStatus = () => {
      // make get call
      axios.get('http://localhost:8080/status')
        .then((response) => {
          console.log(response);
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
        <StatusSwitch>
        </StatusSwitch>
        <Button variant="contained" color="primary" onClick={ updateStatus }>
        Refresh
      </Button>
        </Topbar>
      <PolicyDisplay></PolicyDisplay>
      <Button variant="contained" color="primary" onClick={ sendUpdate }>
        Update
      </Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
      state : state.policyChange,
   };
};

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    updateState: (event) => dispatch({ type: 'UPDATE_STATE', change: event }),
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

