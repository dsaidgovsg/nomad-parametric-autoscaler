import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import { Paper, Card, CardContent } from "../../node_modules/@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import ResourceGroup from "../containers/ResourceGroup";
import SubpolicyGroup from "../containers/SubpolicyGroup";

const PolicySummary = props => {
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
                  <MenuItem value={pe}>{pe}</MenuItem>
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

PolicySummary.propTypes = {
  frequency: PropTypes.string.isRequired,
  possibleEnsemblerList: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateCheckingFrequency: PropTypes.func.isRequired,
  ensembler: PropTypes.string.isRequired,
  updateEnsembler: PropTypes.func.isRequired
};

export default PolicySummary;
