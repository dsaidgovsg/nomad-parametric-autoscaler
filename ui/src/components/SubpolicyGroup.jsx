import React from 'react';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent } from '../../node_modules/@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Subpolicy from './Subpolicy'

// RG represents a group of resources, uniquely identified by their names 
// 
const SubpolicyGroup = props => {
    const { subpolicies } = props;

    // of sorts???? idea is to have 1 card for each resource, each card 
    return (
        <div>
            <Paper elevation={1}>
                {subpolicies.map(sp => <Subpolicy name={sp}/>)}
            </Paper>
            <Button size="small" color="primary" onClick={props.createSubpolicy}>
                Add New Subpolicy
                <AddIcon />
            </Button>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        subpolicies : state.policyChange.Subpolicies.map((sp) => sp.Name),
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    createSubpolicy: () => dispatch({ type: 'CREATE_SUBPOLICY' }),
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SubpolicyGroup)

