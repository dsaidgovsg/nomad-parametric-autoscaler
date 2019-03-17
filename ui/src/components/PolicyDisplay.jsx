import React from 'react';
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent } from '../../node_modules/@material-ui/core';

import ResourceGroup from './ResourceGroup'
import SubpolicyGroup from './SubpolicyGroup'

const PolicyDisplay = props => {
    return (
        <div>
            <Paper>
                <Card>
                    <CardContent>
                        <TextField
                            required
                            id="standard-required"
                            label="Checking Frequency"
                            value={props.frequency}
                            onChange={props.updateCheckingFrequency}
                            margin="normal"
                            />
                    </CardContent>
                </Card>
                <Card>
                    <CardContent>
                        <TextField
                            required
                            id="standard-required"
                            label="Ensembler"
                            value={props.ensembler}
                            onChange={props.updateEnsembler}
                            margin="normal"
                            />
                    </CardContent>
                </Card>
            </Paper>
            <ResourceGroup></ResourceGroup>
            <SubpolicyGroup></SubpolicyGroup>
        </div>
        
    )
};

const mapStateToProps = state => {
    return { 
        frequency: state.policyChange.CheckingFrequency,
        ensembler: state.policyChange.Ensembler,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    updateEnsembler: (event) => dispatch({ type: 'UPDATE_ENSEMBLER', change: event.target.value }),
    updateCheckingFrequency: (event) => dispatch({ type: 'UPDATE_FREQUENCY', change: event.target.value }),
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(PolicyDisplay)

