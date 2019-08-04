// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import {
  Card,
  CardContent,
  CardHeader
} from "../../node_modules/@material-ui/core";
import { updateEC2Parameter, updateNumericEC2Parameter } from "../actions";
import type { EC2 } from "../types";

type Props = {
  name: string,
  params: EC2,
  dispatch: Function
};

const EC2Parameters = (props: Props) => {
  const { name, params, dispatch } = props;
  const updateField = (name: string, field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateEC2Parameter({
        id: name,
        value: event.target.value,
        field: field
      })
    );
  };

  const updateNumericField = (name: string, field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    dispatch(
      updateNumericEC2Parameter({
        id: name,
        value: event.target.value,
        field: field
      })
    );
  };

  return (
    <div>
      <Card>
        <CardHeader subheader="EC2 Parameters" />
        <CardContent>
          <TextField
            required
            id="standard-required"
            label="Auto-Scaling grp name"
            value={params.ScalingGroupName}
            onChange={updateField(name, "ScalingGroupName")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="AWS region"
            value={params.Region}
            onChange={updateField(name, "Region")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MaxCount"
            type="number"
            value={params.MaxCount}
            onChange={updateNumericField(name, "MaxCount")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MinCount"
            type="number"
            value={params.MinCount}
            onChange={updateNumericField(name, "MinCount")}
            margin="normal"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EC2Parameters;
