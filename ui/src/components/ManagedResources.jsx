import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { CardContent } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";

const ManagedResources = props => {
  const { id, resources, possibleResources } = props;

  const deleteSubpolicyResource = resourceName => () => {
    let newResource = resources.slice().filter(r => r !== resourceName);

    props.updateSubpolicyResource({
      id: id,
      value: newResource
    });
  };

  const updateResource = resourceName => event => {
    let newResource = resources.slice();
    const idx = newResource.findIndex(val => val === resourceName);

    if (!newResource.includes(event.target.value)) {
      newResource[idx] = event.target.value;
      props.updateSubpolicyResource({
        id: id,
        value: newResource
      });
    } else {
      alert("Resource already selected");
    }
  };

  const addSPResource = () => {
    let newResource = resources.slice();
    newResource.push("");
    props.updateSubpolicyResource({
      id: id,
      value: newResource
    });
  };

  return (
    <CardContent>
      {resources.map(mr => (
        <div key={mr}>
          <TextField
            required
            select
            label="Resource Name"
            value={mr}
            onChange={updateResource(mr)}
            margin="normal"
          >
            {possibleResources.map(pr => (
              <MenuItem key={pr} value={pr}>
                {pr}
              </MenuItem>
            ))}
          </TextField>
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
  possibleResources: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateSubpolicyResource: PropTypes.func.isRequired
};

export default ManagedResources;
