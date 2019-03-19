import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Card, CardContent, CardHeader } from '../../node_modules/@material-ui/core';

const NomadParameters = props => {
    const { name } = props;
    const updateField = (field) => (event) => {
        props.updateNomadParameters({ name: name, value: event.target.value, field: field})
    }

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

export default NomadParameters;