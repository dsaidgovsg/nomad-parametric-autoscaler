// @flow

import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import {
  Card,
  CardContent,
  CardHeader
} from "../../node_modules/@material-ui/core";

import type { FieldChangeType, SimpleChangeType } from "../types";

export type OwnProps = {|
  name: string
|};

type Props = {
  ...OwnProps,
  autoScalingGroupName: string,
  region: string,
  maxCount: string,
  minCount: string,
  updateEC2Parameter: FieldChangeType => Function,
  updateNumericEC2Parameter: FieldChangeType => Function
};

const EC2Parameters = (props: Props) => {
  const { name } = props;
  const updateField = (name: string, field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    props.updateEC2Parameter({
      id: name,
      value: event.target.value,
      field: field
    });
  };

  const updateNumericField = (name: string, field: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    props.updateNumericEC2Parameter({
      id: name,
      value: event.target.value,
      field: field
    });
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
            value={props.autoScalingGroupName}
            onChange={updateField(name, "ScalingGroupName")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="AWS region"
            value={props.region}
            onChange={updateField(name, "Region")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MaxCount"
            type="number"
            value={props.maxCount}
            onChange={updateNumericField(name, "MaxCount")}
            margin="normal"
          />
          <TextField
            required
            id="standard-required"
            label="MinCount"
            type="number"
            value={props.minCount}
            onChange={updateNumericField(name, "MinCount")}
            margin="normal"
          />
        </CardContent>
      </Card>
    </div>
  );
};

EC2Parameters.propTypes = {
  name: PropTypes.string.isRequired,
  autoScalingGroupName: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  maxCount: PropTypes.number.isRequired,
  minCount: PropTypes.number.isRequired,
  updateEC2Parameter: PropTypes.func.isRequired,
  updateNumericEC2Parameter: PropTypes.func.isRequired
};

export default EC2Parameters;
