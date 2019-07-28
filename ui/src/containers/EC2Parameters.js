// @flow

import { connect } from "react-redux";
import EC2Parameters from "../components/EC2Parameters";

import { updateEC2Parameter, updateNumericEC2Parameter } from "../actions";

import type { Dispatch, State, FieldChangeType } from "../types";
import type { OwnProps } from "../components/EC2Parameters";

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    autoScalingGroupName:
      state.policy.Resources[ownProps.name].EC2.ScalingGroupName,
    region: state.policy.Resources[ownProps.name].EC2.Region,
    maxCount: state.policy.Resources[ownProps.name].EC2.MaxCount,
    minCount: state.policy.Resources[ownProps.name].EC2.MinCount
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateEC2Parameter: (input: FieldChangeType) =>
      dispatch(updateEC2Parameter(input)),
    updateNumericEC2Parameter: (input: FieldChangeType) =>
      dispatch(updateNumericEC2Parameter(input))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(EC2Parameters);

export default container;
