// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import {
  Card,
  CardContent,
  CardHeader
} from "../../node_modules/@material-ui/core";
import {
  updateNomadParameters,
  updateNumericNomadParameters
} from "../actions";

import type { Nomad } from "../types";

type Props = {
  name: string,
  params: Nomad,
  dispatch: Function
};

const NomadParameters = (props: Props) => {
  const { name, params, dispatch } = props;

  const updateField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateNomadParameters({
        id: name,
        value: event.target.value,
        field: field
      })
    );
  };

  const updateNumericField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateNumericNomadParameters({
        id: name,
        value: event.target.value,
        field: field
      })
    );
  };

  return (
    <div>
      <Card>
        <CardHeader subheader="Nomad Parameters" />
        <CardContent>
          <TextField
            required
            id="standard-required"
            label="Address"
            value={params.Address}
            onChange={updateField("Address")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="JobName"
            value={params.JobName}
            onChange={updateField("JobName")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="NomadPath"
            value={params.NomadPath}
            onChange={updateField("NomadPath")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MaxCount"
            type="number"
            value={params.MaxCount}
            onChange={updateNumericField("MaxCount")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MinCount"
            type="number"
            value={params.MinCount}
            onChange={updateNumericField("MinCount")}
            margin="normal"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NomadParameters;
