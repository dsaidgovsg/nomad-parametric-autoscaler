import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Card, CardContent, CardHeader } from '../../node_modules/@material-ui/core';

const EC2Parameters = props => {
    const { name } = props;
    const updateField = (field) => (event) => {
        props.updateNomadParameters({ name: name, value: event.target.value, field: field})
    }
    // resource will contain details for ratio, cooldown, 
    return (
        <div>
            <Card>
            <CardHeader
                subheader="EC2 Parameters"
            />
            <CardContent>
                <TextField
                    required
                    id="standard-required"
                    label="Auto-Scaling grp name"
                    value={ props.autoScalingGroupName }
                    onChange={ updateField("ScalingGroupName") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="AWS region"
                    value={ props.region }
                    onChange={ updateField("Region") }
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
        autoScalingGroupName: state.policyChange.Resources[ownProps.name].EC2.ScalingGroupName,
        region: state.policyChange.Resources[ownProps.name].EC2.Region,
        maxCount: state.policyChange.Resources[ownProps.name].EC2.MaxCount,
        minCount: state.policyChange.Resources[ownProps.name].EC2.MinCount,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    updateNomadParameters: (input) =>  dispatch({ type: 'UPDATE_EC2_PARAM', change: input})
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(EC2Parameters)