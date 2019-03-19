import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Card, CardContent, CardHeader } from '../../node_modules/@material-ui/core';

const EC2Parameters = props => {
    const { name } = props;
    const updateField = (name, field) => (event) => {
        props.updateEC2Parameters({ name: name, value: event.target.value, field: field})
    }

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
                    onChange={ updateField(name, "ScalingGroupName") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="AWS region"
                    value={ props.region }
                    onChange={ updateField(name, "Region") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="MaxCount"
                    value={ props.maxCount }
                    onChange={ updateField(name, "MaxCount") }
                    margin="normal"
                    />
                <TextField
                    required
                    id="standard-required"
                    label="MinCount"
                    value={ props.minCount }
                    onChange={ updateField(name, "MinCount") }
                    margin="normal"
                    />
            </CardContent>
            </Card>
        </div>
    )
};

export default EC2Parameters;