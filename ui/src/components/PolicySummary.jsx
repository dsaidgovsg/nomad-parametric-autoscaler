// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Paper, Card, CardContent } from "../../node_modules/@material-ui/core";
import ResourceGroup from "../containers/ResourceGroup";
import SubpolicyGroup from "../containers/SubpolicyGroup";

type Props = {
  frequency: string,
  ensembler: string,
  possibleEnsemblerList: Array<string>,
  updateCheckingFrequency: (SyntheticInputEvent<HTMLInputElement>) => Function,
  updateEnsembler: (SyntheticInputEvent<HTMLInputElement>) => Function
};

const PolicySummary = (props: Props) => {
  return (
    <div>
      <Paper>
        <Card>
          <CardContent>
            <TextField
              required
              id="standard-required"
              label="Checking Frequency"
              value={props.frequency}
              onChange={props.updateCheckingFrequency}
              margin="normal"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <TextField
              required
              select
              id="standard-required"
              label="Ensembler"
              value={props.ensembler}
              onChange={props.updateEnsembler}
              margin="normal"
            >
              {props.possibleEnsemblerList &&
                props.possibleEnsemblerList.map(pe => (
                  <MenuItem key={pe} value={pe}>
                    {pe}
                  </MenuItem>
                ))}
            </TextField>
          </CardContent>
        </Card>
      </Paper>
      <ResourceGroup />
      <SubpolicyGroup />
    </div>
  );
};

export default PolicySummary;
