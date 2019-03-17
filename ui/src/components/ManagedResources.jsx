import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Paper, Card, CardContent, CardHeader } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

const ManagedResources = (props) => {
    const { name, resources } = props;

    const deleteSubpolicyResource = (resourceName) => event => {
        let newResource = resources.slice().filter(r => r !== resourceName);
        
        props.updateSubpolicyResource({
            name: name,
            newManagedResources: newResource,
        })
    }

    const updateResource = resourceName => event => {
        let newResource = resources.slice();
        const idx = newResource.findIndex((val) => val == resourceName)
        newResource[idx] = event.target.value
        props.updateSubpolicyResource({
            name: name,
            newManagedResources: newResource,
        })
    }

    const addSPResource = () => {
        let newResource = resources.slice();
        newResource.push('');
        props.updateSubpolicyResource({
            name: name,
            newManagedResources: newResource,
        })
        
    }

    return (
        <Card>
            <CardContent>
                { resources.map(mr => 
                <div>
                    <TextField
                    required
                    label="Managed Resource Name"
                    value={ mr }
                    onChange={ updateResource(mr) }
                    margin="normal"
                    />
                    <Fab size="small" color="primary" onClick={ deleteSubpolicyResource(mr) }>
                        <DeleteIcon />
                    </Fab>  
                </div>
                ) }
            </CardContent>
            <Fab size="small" color="primary" onClick={ addSPResource }>
                <AddIcon />
            </Fab>
        </Card>
    )
};

const mapDispatchToProps = dispatch => {
  return {
    updateSubpolicyResource: (name) => dispatch({type: 'UPDATE_SUBPOLICY_RESOURCE', change: name}),
  }
}

export default connect(
    null,
    mapDispatchToProps
  )(ManagedResources)