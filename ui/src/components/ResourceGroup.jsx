import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Paper } from "../../node_modules/@material-ui/core";
import Resource from "../containers/Resource";

const ResourceGroup = props => {
  const { resources } = props;

  return (
    <div>
      <Paper elevation={1}>
        {resources.map(r => (
          <Resource key={r} name={r} />
        ))}
      </Paper>
      <Button size="small" color="primary" onClick={props.createResource}>
        Add New Resource
        <AddIcon />
      </Button>
    </div>
  );
};

ResourceGroup.propTypes = {
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
  createResource: PropTypes.func.isRequired
};

export default ResourceGroup;
