import React from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent } from '../../node_modules/@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Resource from './Resource'

// RG represents a group of resources, uniquely identified by their names 
// 
const ResourceGroup = props => {
    const { resources } = props;

    // of sorts???? idea is to have 1 card for each resource, each card 
    return (
        <div>
            <Paper elevation={1}>
                {resources.map(r => <Resource name={r}></Resource>)}
            </Paper>
            <Button size="small" color="primary" onClick={props.createResource}>
                Add New Resource
                <AddIcon />
            </Button>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        resources : Object.keys(state.policyChange.Resources).map((key, _) => key),
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    createResource: () => dispatch({ type: 'CREATE_RESOURCE' }),
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResourceGroup)

