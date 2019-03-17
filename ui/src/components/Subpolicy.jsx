import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent, CardHeader } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';

import _ from 'lodash';

import NomadParameters from './NomadParameters';
import EC2Parameters from './EC2Parameters';
import ManagedResources from './ManagedResources';

const Subpolicy = props => {
    const { name, resources } = props;
    const updateField = event => {
        props.updateMeta({ name: name, value: event.target.value })
    };

    const deleteSubpolicy = event => {
        props.deleteSubpolicy({ name: name })
    }

    const renameSubpolicy = (event) => {
        props.updateSubpolicyName({ oldName: name, newName: event.target.value })
    }

    // resource will contain details for ratio, cooldown, 
    return (
        <Card>
            <CardHeader
                title="Subpolicy"
            />
            <CardContent>
                <TextField
                    required
                    id="standard-required"
                    label="Subpolicy Name"
                    value={ name }
                    onChange={ renameSubpolicy }
                    margin="normal"
                    />
                <ManagedResources
                    name={ name }
                    resources={ resources }
                />
                <TextField
                    required
                    multiline
                    fullWidth
                    id="standard-required"
                    label="Metadata"
                    value={ props.metadata }
                    onChange={ updateField }
                    margin="normal"
                    />
                <Fab size="small" color="primary" aria-label="Delete" onClick={deleteSubpolicy}>
                    <DeleteIcon />
                </Fab>
            </CardContent>
        </Card>
    )
};

const mapStateToProps = (state, ownProps) => {
    const thisSP = state.policyChange.Subpolicies.filter(sp => sp.Name === ownProps.name)
    const sp = thisSP && thisSP[0]

    return {
        metadata: sp.Metadata,
        resources: sp.ManagedResources,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    updateSubpolicyName: (event) => dispatch({ type: 'UPDATE_SUBPOLICY_NAME', change: event }),
    deleteSubpolicy: (event) => dispatch({ type: 'DELETE_SUBPOLICY', change: event }),
    updateMeta: (event) => dispatch({ type: 'UPDATE_SP_META', change: event })
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Subpolicy)