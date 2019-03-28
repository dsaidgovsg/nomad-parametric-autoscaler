import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { CardContent } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import _ from 'lodash';

const ManagedResources = props => {
  const { id, resources } = props;

  const deleteSubpolicyResource = resourceName => () => {
    let newResource = resources.slice().filter(r => r !== resourceName);

    props.updateSubpolicyResource({
      id: id,
      newManagedResources: newResource
    });
  };

  const updateResource = resourceName => event => {
    let newResource = resources.slice();
    const idx = newResource.findIndex(val => val === resourceName);
    newResource[idx] = event.target.value;
    props.updateSubpolicyResource({
      id: id,
      newManagedResources: newResource
    });
  };

  const addSPResource = () => {
    let newResource = resources.slice();
    newResource.push("");
    props.updateSubpolicyResource({
      id: id,
      newManagedResources: newResource
    });
  };

  return (
    <CardContent>
      {resources.map(mr => (
        <div key={mr}>
          <TextField
            required
            label="Resource Name"
            value={mr}
            onChange={updateResource(mr)}
            margin="normal"
          />
          <Fab
            size="small"
            color="primary"
            onClick={deleteSubpolicyResource(mr)}
          >
            <DeleteIcon />
          </Fab>
        </div>
      ))}
      <Fab size="small" color="primary" onClick={addSPResource}>
        <AddIcon />
      </Fab>
    </CardContent>
  );
};

ManagedResources.propTypes = {
  id: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateSubpolicyResource: PropTypes.func.isRequired
};

export default ManagedResources;
