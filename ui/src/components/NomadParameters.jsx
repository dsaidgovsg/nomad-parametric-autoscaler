import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Card, CardContent, CardHeader } from '../../node_modules/@material-ui/core';

const NomadParameters = props => {
    const { name } = props;
    const updateField = (field) => (event) => {
        props.updateNomadParameters({ name: name, value: event.target.value, field: field})
    }
    // resource will contain details for ratio, cooldown, 
    return (
        <div>
            <Card>
            <CardHeader
                subheader="Nomad Parameters"
            />
            <CardContent>
                <TextField
                    required
                    id="standard-required"
                    label="Address"
                    value={ props.address }
                    onChange={ updateField("Address") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="JobName"
                    value={ props.jobName }
                    onChange={ updateField("JobName") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="NomadPath"
                    value={ props.nomadPath }
                    onChange={ updateField("NomadPath") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="MaxCount"
                    value={ props.maxCount }
                    onChange={ updateField("MaxCount") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="MinCount"
                    value={ props.minCount }
                    onChange={ updateField("MinCount") }
                    margin="normal"
                    />
            </CardContent>
            </Card>
        </div>
    )
};

const mapStateToProps = (state, ownProps) => {
    return {
        address: state.policyChange.Resources[ownProps.name].Nomad.Address,
        jobName: state.policyChange.Resources[ownProps.name].Nomad.JobName,
        nomadPath: state.policyChange.Resources[ownProps.name].Nomad.NomadPath,
        maxCount: state.policyChange.Resources[ownProps.name].Nomad.MaxCount,
        minCount: state.policyChange.Resources[ownProps.name].Nomad.MinCount,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    updateNomadParameters: (input) =>  dispatch({ type: 'UPDATE_NOMAD_PARAM', change: input})
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(NomadParameters)