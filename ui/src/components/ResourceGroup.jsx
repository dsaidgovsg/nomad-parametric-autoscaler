import React from 'react';
import { Paper } from '../../node_modules/@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Resource from '../containers/Resource'
 
const ResourceGroup = props => {
    const { resources } = props;

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

export default ResourceGroup;
