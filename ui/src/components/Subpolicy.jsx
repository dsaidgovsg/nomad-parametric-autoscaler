// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import { Card, CardContent, CardHeader } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ManagedResources from "../containers/ManagedResources";
import DeleteButtonWithWarning from "./DeleteButtonWithWarning";

import type { SimpleChangeType } from "../types";

export type OwnProps = {|
  id: string
|};

export type Props = {
  ...OwnProps,
  name: string,
  resources: Array<string>,
  metadata: string,
  possibleSubpolicyList: Array<string>,
  updateSubpolicyName: SimpleChangeType => Function,
  deleteSubpolicy: string => Function,
  updateMeta: SimpleChangeType => Function
};

const Subpolicy = (props: Props) => {
  const { id, name, resources, metadata, possibleSubpolicyList } = props;
  const updateField = (event: SyntheticInputEvent<HTMLInputElement>) => {
    props.updateMeta({ id: id, value: event.target.value });
  };

  const deleteSubpolicy = () => {
    props.deleteSubpolicy(id);
  };

  const renameSubpolicy = (event: SyntheticInputEvent<HTMLInputElement>) => {
    props.updateSubpolicyName({ id: id, value: event.target.value });
  };

  const jsonify = () => {
    try {
      const jsonified = JSON.stringify(JSON.parse(metadata), null, 2);
      props.updateMeta({ id: id, value: jsonified });
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
          {possibleSubpolicyList &&
            possibleSubpolicyList.map(ps => (
              <MenuItem key={ps} value={ps}>
                {ps}
              </MenuItem>
            ))}
        </TextField>
        <ManagedResources id={id} resources={resources} />
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
        <DeleteButtonWithWarning fn={deleteSubpolicy} />
      </CardContent>
    </Card>
  );
};

export default Subpolicy;
