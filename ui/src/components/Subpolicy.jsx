import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import MenuItem from "@material-ui/core/MenuItem";
import ManagedResources from "../containers/ManagedResources";

const Subpolicy = props => {
  const { id, name, resources, metadata, possibleSubpolicyList } = props;
  const updateField = event => {
    props.updateMeta({ id: id, value: event.target.value });
  };

  const deleteSubpolicy = () => {
    props.deleteSubpolicy({ id: id });
  };

  const renameSubpolicy = event => {
    props.updateSubpolicyName({ id: id, newName: event.target.value });
  };

  // resource will contain details for ratio, cooldown,
  return (
    <Card>
      <CardHeader title="Subpolicy" />
      <CardContent>
        <TextField
          required
          select
          id="standard-required"
          label="Subpolicy Name"
          value={name}
          onChange={renameSubpolicy}
          margin="normal"
        >
          {possibleSubpolicyList &&
            possibleSubpolicyList.map(ps => (
              <MenuItem value={ps}>{ps}</MenuItem>
            ))}
        </TextField>
        <ManagedResources id={id} resources={resources} />
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
  metadata: PropTypes.string.isRequired,
  possibleSubpolicyList: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateMeta: PropTypes.func.isRequired,
  deleteSubpolicy: PropTypes.func.isRequired,
  updateSubpolicyName: PropTypes.func.isRequired
};

export default Subpolicy;
