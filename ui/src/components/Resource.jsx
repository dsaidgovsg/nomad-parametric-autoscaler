import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent, CardHeader } from '../../node_modules/@material-ui/core';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';

import NomadParameters from './NomadParameters';
import EC2Parameters from './EC2Parameters';

const Resource = props => {
    const { name } = props;
    
    const updateField = field => event => {
        props.updateResourceField({ name: name, value: event.target.value, field: field})
    }

    const deleteResource = (event) => {
        props.deleteResource({ name: name })
    }

    const renameResource = (event) => {
        props.updateResourceName({ oldName: name, newName: event.target.value })
    }
    
    // resource will contain details for ratio, cooldown, 
    return (
        <Card>
            <CardHeader
                title="Resource"
            />
            <CardContent>
                <TextField
                    required
                    id="standard-required"
                    label="Resource Name"
                    value={ name }
                    onChange={ renameResource }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="Scale-In Cooldown"
                    value={ props.scaleInCooldown }
                    onChange={ updateField("ScaleInCooldown") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="Scale-Out Cooldown"
                    value={ props.scaleOutCooldown }
                    onChange={ updateField("ScaleOutCooldown") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="Nomad-EC2 Ratio"
                    value={ props.ratio }
                    onChange={ updateField("N2CRatio") }
                    margin="normal"
                    />
                <Fab size="small" color="primary" aria-label="Delete" onClick={deleteResource}>
                    <DeleteIcon />
                </Fab>
            </CardContent>
            <NomadParameters name={ name }/>
            <EC2Parameters name={name}/>
        </Card>
    )
};

const mapStateToProps = (state, ownProps) => {
    return {
        scaleInCooldown: state.policyChange.Resources[ownProps.name].ScaleInCooldown,
        scaleOutCooldown: state.policyChange.Resources[ownProps.name].ScaleOutCooldown,
        ratio: state.policyChange.Resources[ownProps.name].N2CRatio,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    updateResourceName: (event) => dispatch({ type: 'UPDATE_RESOURCE_NAME', change: event }),
    updateResourceField: (event) => dispatch({ type: 'UPDATE_RESOURCE_FIELD', change: event }),
    deleteResource: (event) => dispatch({ type: 'DELETE_RESOURCE', change: event })
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Resource)