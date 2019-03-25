import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";

import ManagedResources from "../containers/ManagedResources";

const Subpolicy = props => {
  const { name, resources, metadata } = props;
  const updateField = event => {
    props.updateMeta({ name: name, value: event.target.value });
  };

  const deleteSubpolicy = () => {
    props.deleteSubpolicy({ name: name });
  };

  const renameSubpolicy = event => {
    props.updateSubpolicyName({ oldName: name, newName: event.target.value });
  };

  // resource will contain details for ratio, cooldown,
  return (
    <Card>
      <CardHeader title="Subpolicy" />
      <CardContent>
        <TextField
          required
          id="standard-required"
          label="Subpolicy Name"
          value={name}
          onChange={renameSubpolicy}
          margin="normal"
        />
        <ManagedResources name={name} resources={resources} />
        <TextField
          required
          multiline
          fullWidth
          id="standard-required"
          label="Metadata"
          value={metadata}
          onChange={updateField}
          margin="normal"
        />
        <Fab
          size="small"
          color="primary"
          aria-label="Delete"
          onClick={deleteSubpolicy}
        >
          <DeleteIcon />
        </Fab>
      </CardContent>
    </Card>
  );
};

Subpolicy.propTypes = {
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
  metadata: PropTypes.string.isRequired,
  updateMeta: PropTypes.func.isRequired,
  deleteSubpolicy: PropTypes.func.isRequired,
  updateSubpolicyName: PropTypes.func.isRequired
};

export default Subpolicy;
