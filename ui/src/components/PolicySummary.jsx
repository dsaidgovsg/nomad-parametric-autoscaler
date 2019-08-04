// @flow

import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import { Paper, Card, CardContent } from "../../node_modules/@material-ui/core";
import ResourceGroup from "../containers/ResourceGroup";
import SubpolicyGroup from "../containers/SubpolicyGroup";
import { updateCheckingFrequency, updateEnsembler } from "../actions";

import { DefaultOptionsContext, StateContext } from "../App";

const PolicySummary = () => {
  const { defaultsState } = useContext(DefaultOptionsContext);
  const { nopasState, nopasDispatch } = useContext(StateContext);
  const { ensemblers } = defaultsState;

  const updateFreq = (event: SyntheticInputEvent<HTMLInputElement>) => {
    nopasDispatch(updateCheckingFrequency(event.target.value));
  };

  const updateEnsem = (event: SyntheticInputEvent<HTMLInputElement>) => {
    nopasDispatch(updateEnsembler(event.target.value));
  };

  return (
    <div>
      <Paper>
        <Card>
          <CardContent>
            <TextField
              required
              id="standard-required"
              label="Checking Frequency"
              value={nopasState.CheckingFreq}
              onChange={updateFreq}
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
              value={ensemblers}
              onChange={updateEnsem}
              margin="normal"
            >
              {ensemblers &&
                ensemblers.map(pe => (
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
