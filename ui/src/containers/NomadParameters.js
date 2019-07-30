// @flow

import { connect } from "react-redux";
import NomadParameters from "../components/NomadParameters";
import {
  updateNomadParameters,
  updateNumericNomadParameters
} from "../actions";

import type { Dispatch, State, FieldChangeType } from "../types";
import type { OwnProps } from "../components/NomadParameters";

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    address: state.policy.Resources[ownProps.name].Nomad.Address,
    jobName: state.policy.Resources[ownProps.name].Nomad.JobName,
    nomadPath: state.policy.Resources[ownProps.name].Nomad.NomadPath,
    maxCount: state.policy.Resources[ownProps.name].Nomad.MaxCount,
    minCount: state.policy.Resources[ownProps.name].Nomad.MinCount
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateNomadParameters: (input: FieldChangeType) =>
      dispatch(updateNomadParameters(input)),
    updateNumericNomadParameters: (input: FieldChangeType) =>
      dispatch(updateNumericNomadParameters(input))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(NomadParameters);

export default container;
