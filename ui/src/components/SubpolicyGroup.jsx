import React from 'react';
import { Paper } from '../../node_modules/@material-ui/core';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import Subpolicy from '../containers/Subpolicy'

const SubpolicyGroup = props => {
    const { subpolicies } = props;

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

export default SubpolicyGroup;