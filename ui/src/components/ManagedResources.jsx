// @flow

import React from "react";
import TextField from "@material-ui/core/TextField";
import { CardContent } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";

import { updateSubpolicyResource } from "../actions";

export type Props = {
  id: string,
  resources: Array<string>,
  possibleResources: Array<string>,
  dispatch: Function
};

const ManagedResources = (props: Props) => {
  const { id, resources, possibleResources, dispatch } = props;

  const deleteSubpolicyResource = (resourceName: string) => () => {
    let newResource = resources.slice().filter(r => r !== resourceName);

    dispatch(
      updateSubpolicyResource({
        id: id,
        value: newResource
      })
    );
  };

  const updateResource = (resourceName: string) => (
    event: SyntheticInputEvent<HTMLInputElement>
  ) => {
    let newResource = resources.slice();
    const idx = newResource.findIndex(val => val === resourceName);

    if (!newResource.includes(event.target.value)) {
      newResource[idx] = event.target.value;
      dispatch(
        updateSubpolicyResource({
          id: id,
          value: newResource
        })
      );
    } else {
      alert("Resource already selected");
    }
  };

  const addSPResource = () => {
    let newResource = resources.slice();
    newResource.push("");
    dispatch(
      updateSubpolicyResource({
        id: id,
        value: newResource
      })
    );
  };

  return (
    <CardContent>
      {resources.map(mr => (
        <div key={mr}>
          <TextField
            required
            select
            label="Resource Name"
            value={mr}
            onChange={updateResource(mr)}
            margin="normal"
          >
            {possibleResources.map(pr => (
              <MenuItem key={pr} value={pr}>
                {pr}
              </MenuItem>
            ))}
          </TextField>
          <Fab
            size="small"
            color="primary"
            onClick={deleteSubpolicyResource(mr)}
          >
            <DeleteIcon />
          </Fab>
        </div>
      ))}
      <Fab size="small" color="primary" onClick={addSPResource}>
        <AddIcon />
      </Fab>
    </CardContent>
  );
};

export default ManagedResources;
