// @flow

import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { Paper } from "../../node_modules/@material-ui/core";
import Subpolicy from "../containers/Subpolicy";

type Props = {
  subpolicies: Array<string>,
  createSubpolicy: (s: string) => Function
}

const SubpolicyGroup = (props: Props) => {
  const { subpolicies } = props;

  return (
    <div>
      <Paper elevation={1}>
        {subpolicies.map(sp => (
          <Subpolicy key={sp} id={sp} />
        ))}
      </Paper>
      <Button size="small" color="primary" onClick={props.createSubpolicy}>
        Add New Subpolicy
        <AddIcon />
      </Button>
    </div>
  );
};

SubpolicyGroup.propTypes = {
  subpolicies: PropTypes.arrayOf(PropTypes.string).isRequired,
  createSubpolicy: PropTypes.func.isRequired
};

export default SubpolicyGroup;
