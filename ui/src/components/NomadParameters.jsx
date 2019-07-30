// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import {
  Card,
  CardContent,
  CardHeader
} from "../../node_modules/@material-ui/core";

import type { FieldChangeType } from "../types";

export type OwnProps = {|
  name: string
|};

type Props = {
  ...OwnProps,
  address: string,
  jobName: string,
  nomadPath: string,
  maxCount: string,
  minCount: string,
  updateNomadParameters: FieldChangeType => Function,
  updateNumericNomadParameters: FieldChangeType => Function
};

const NomadParameters = (props: Props) => {
  const { name } = props;
  const updateField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    props.updateNomadParameters({
      id: name,
      value: event.target.value,
      field: field
    });
  };

  const updateNumericField = (field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    props.updateNumericNomadParameters({
      id: name,
      value: event.target.value,
      field: field
    });
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
            value={props.address}
            onChange={updateField("Address")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="JobName"
            value={props.jobName}
            onChange={updateField("JobName")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="NomadPath"
            value={props.nomadPath}
            onChange={updateField("NomadPath")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MaxCount"
            type="number"
            value={props.maxCount}
            onChange={updateNumericField("MaxCount")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MinCount"
            type="number"
            value={props.minCount}
            onChange={updateNumericField("MinCount")}
            margin="normal"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NomadParameters;
