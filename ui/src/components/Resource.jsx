// @flow

import React from "react";
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

import type { FieldChangeType, SimpleChangeType } from "../types";

export type OwnProps = {|
  id: string
|};

type Props = {
  ...OwnProps,
  resourceName: string,
  scaleInCooldown: string,
  scaleOutCooldown: string,
  ratio: number,
  updateResourceField: FieldChangeType => Function,
  updateNumericResourceField: FieldChangeType => Function,
  deleteResource: string => Function,
  updateResourceName: SimpleChangeType => Function
};

const Resource = (props: Props) => {
  const { id } = props;

  const updateField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    props.updateResourceField({
      id: id,
      value: event.target.value,
      field: field
    });
  };

  const updateNumericField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    props.updateNumericResourceField({
      id: id,
      value: event.target.value,
      field: field
    });
  };

  const deleteResource = () => {
    props.deleteResource(id);
  };

  const renameResource = (event: SyntheticInputEvent<HTMLInputElement>) => {
    props.updateResourceName({ id: id, value: event.target.value });
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

export default Resource;
