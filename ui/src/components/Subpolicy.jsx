// @flow

import React, { useContext } from "react";
import TextField from "@material-ui/core/TextField";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ManagedResources from "./ManagedResources";
import DeleteButtonWithWarning from "./DeleteButtonWithWarning";

import { updateSubpolicyName, deleteSubpolicy, updateMeta } from "../actions";
import { DefaultOptionsContext } from "../App";

export type Props = {
  id: string,
  name: string,
  resources: Array<string>,
  metadata: string,
  dispatch: Function,
  possibleResources: Array<string>
};

const Subpolicy = (props: Props) => {
  const { id, name, resources, metadata, dispatch, possibleResources } = props;

  const { defaultsState } = useContext(DefaultOptionsContext);
  const { subpolicies } = defaultsState;

  const updateField = (event: SyntheticInputEvent<HTMLInputElement>) => {
    dispatch(updateMeta({ id: id, value: event.target.value }));
  };

  const delSubpolicy = () => {
    dispatch(deleteSubpolicy(id));
  };

  const renameSubpolicy = (event: SyntheticInputEvent<HTMLInputElement>) => {
    dispatch(updateSubpolicyName({ id: id, value: event.target.value }));
  };

  const jsonify = () => {
    try {
      const jsonified = JSON.stringify(JSON.parse(metadata), null, 2);
      dispatch(updateMeta({ id: id, value: jsonified }));
    } catch (error) {
      alert(error);
    }
  };

  // resource will contain details for ratio, cooldown,
  return (
    <Card>
      <CardHeader title="Subpolicy" />
      <CardContent>
        <TextField
          required
          select
          id="standard-required"
          label="Subpolicy Name"
          value={name}
          onChange={renameSubpolicy}
          margin="normal"
        >
          {subpolicies &&
            subpolicies.map(ps => (
              <MenuItem key={ps} value={ps}>
                {ps}
              </MenuItem>
            ))}
        </TextField>
        <ManagedResources
          id={id}
          resources={resources}
          possibleResources={possibleResources}
          dispatch={dispatch}
        />
        <TextField
          required
          multiline
          fullWidth
          id="standard-required"
          label="Metadata"
          value={metadata}
          onChange={updateField}
          margin="normal"
        />
        <Button variant="contained" onClick={jsonify}>
          JSON-it!
        </Button>
        <DeleteButtonWithWarning fn={delSubpolicy} />
      </CardContent>
    </Card>
  );
};

export default Subpolicy;
