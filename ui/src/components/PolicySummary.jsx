import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent } from '../../node_modules/@material-ui/core';

import ResourceGroup from '../containers/ResourceGroup'
import SubpolicyGroup from '../containers/SubpolicyGroup'

const PolicySummary = props => {
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

export default PolicySummary;
