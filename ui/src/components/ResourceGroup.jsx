// @flow

import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Paper } from "../../node_modules/@material-ui/core";
import Resource from "./Resource";
import { createResource } from "../actions";
import { StateContext } from "../App";

const ResourceGroup = () => {
  const { nopasState, nopasDispatch } = useContext(StateContext);

  const addNew = () => {
    nopasDispatch(createResource());
  };

  return (
    <div>
      <Paper elevation={1}>
        {Object.keys(nopasState.Resources).map(function(key, _) {
          return (
            <Resource
              key={key}
              id={key}
              resource={nopasState.Resources[key]}
              dispatch={nopasDispatch}
            />
          );
        })}
      </Paper>
      <Button size="small" color="primary" onClick={addNew}>
        Add New Resource
        <AddIcon />
      </Button>
    </div>
  );
};

export default ResourceGroup;
