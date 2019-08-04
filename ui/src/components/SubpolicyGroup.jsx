// @flow

import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Paper } from "../../node_modules/@material-ui/core";
import Subpolicy from "./Subpolicy";
import { createSubpolicy } from "../actions";
import { StateContext } from "../App";

const SubpolicyGroup = () => {
  const { nopasState, nopasDispatch } = useContext(StateContext);

  const possibleResources = [];
  for (let key in nopasState.Resources) {
    if (nopasState.Resources.hasOwnProperty(key)) {
      possibleResources.push(nopasState.Resources[key].Name);
    }
  }

  const createNewSP = () => {
    nopasDispatch(createSubpolicy());
  };

  return (
    <div>
      <Paper elevation={1}>
        {nopasState.Subpolicies.map(sp => (
          <Subpolicy
            key={sp.Id}
            id={sp.Id}
            name={sp.Name}
            resources={sp.ManagedResources}
            metadata={sp.Metadata}
            dispatch={nopasDispatch}
            possibleResources={possibleResources}
          />
        ))}
      </Paper>
      <Button size="small" color="primary" onClick={createNewSP}>
        Add New Subpolicy
        <AddIcon />
      </Button>
    </div>
  );
};

export default SubpolicyGroup;
