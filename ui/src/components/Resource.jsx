// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import {
  Card,
  CardContent,
  CardHeader
} from "../../node_modules/@material-ui/core";
import NomadParameters from "./NomadParameters";
import EC2Parameters from "./EC2Parameters";
import DeleteButtonWithWarning from "./DeleteButtonWithWarning";
import {
  updateResourceName,
  updateResourceField,
  deleteResource,
  updateNumericResourceField
} from "../actions";
import type { ResourceType } from "../types";

type Props = {
  id: string,
  resource: ResourceType,
  dispatch: Function
};

const Resource = (props: Props) => {
  const { id, resource, dispatch } = props;

  const updateField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateResourceField({
        id: id,
        value: event.target.value,
        field: field
      })
    );
  };

  const updateNumericField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateNumericResourceField({
        id: id,
        value: event.target.value,
        field: field
      })
    );
  };

  const delResource = () => {
    dispatch(deleteResource(id));
  };

  const renameResource = (event: SyntheticInputEvent<HTMLInputElement>) => {
    dispatch(updateResourceName({ id: id, value: event.target.value }));
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
          value={resource.Name}
          onChange={renameResource}
          margin="normal"
        />
        <TextField
          required
          id="standard-required"
          label="Scale-In Cooldown"
          value={resource.ScaleInCooldown}
          onChange={updateField("ScaleInCooldown")}
          margin="normal"
        />
        <TextField
          required
          id="standard-required"
          label="Scale-Out Cooldown"
          value={resource.ScaleOutCooldown}
          onChange={updateField("ScaleOutCooldown")}
          margin="normal"
        />
        <TextField
          required
          id="standard-required"
          label="Nomad-EC2 Ratio"
          type="number"
          value={resource.N2CRatio}
          onChange={updateNumericField("N2CRatio")}
          margin="normal"
        />
        <DeleteButtonWithWarning fn={delResource} />
      </CardContent>
      <NomadParameters name={id} params={resource.Nomad} dispatch={dispatch} />
      <EC2Parameters name={id} params={resource.EC2} dispatch={dispatch} />
    </Card>
  );
};

export default Resource;
