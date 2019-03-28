import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  Card,
  CardContent,
  CardHeader
} from "../../node_modules/@material-ui/core";
import NomadParameters from "../containers/NomadParameters";
import EC2Parameters from "../containers/EC2Parameters";

const Resource = props => {
  const { id } = props;

  const updateField = field => event => {
    props.updateResourceField({
      id: id,
      value: event.target.value,
      field: field
    });
  };

  const updateNumericField = field => event => {
    props.updateNumericResourceField({
      id: id,
      value: event.target.value,
      field: field
    });
  };

  const deleteResource = () => {
    props.deleteResource({ id: id });
  };

  const renameResource = event => {
    props.updateResourceName({ id: id, newName: event.target.value });
  };

  // resource will contain details for ratio, cooldown,
  return (
    <Card>
      <CardHeader title="Resource" />
      <CardContent>
        <TextField
          required
          id="standard-required"
          label="Resource Name"
          value={props.resourceName}
          onChange={renameResource}
          margin="normal"
        />
        <TextField
          required
          id="standard-required"
          label="Scale-In Cooldown"
          value={props.scaleInCooldown}
          onChange={updateField("ScaleInCooldown")}
          margin="normal"
        />
        <TextField
          required
          id="standard-required"
          label="Scale-Out Cooldown"
          value={props.scaleOutCooldown}
          onChange={updateField("ScaleOutCooldown")}
          margin="normal"
        />
        <TextField
          required
          id="standard-required"
          label="Nomad-EC2 Ratio"
          type="number"
          value={props.ratio}
          onChange={updateNumericField("N2CRatio")}
          margin="normal"
        />
        <Fab
          size="small"
          color="primary"
          aria-label="Delete"
          onClick={deleteResource}
        >
          <DeleteIcon />
        </Fab>
      </CardContent>
      <NomadParameters name={id} />
      <EC2Parameters name={id} />
    </Card>
  );
};

Resource.propTypes = {
  id: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  scaleInCooldown: PropTypes.string.isRequired,
  scaleOutCooldown: PropTypes.string.isRequired,
  ratio: PropTypes.number.isRequired,
  updateResourceField: PropTypes.func.isRequired,
  updateNumericResourceField: PropTypes.func.isRequired,
  deleteResource: PropTypes.func.isRequired,
  updateResourceName: PropTypes.func.isRequired
};

export default Resource;