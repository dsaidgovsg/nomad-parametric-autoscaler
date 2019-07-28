// @flow

import { connect } from "react-redux";
import PolicySummary from "../components/PolicySummary";
import { updateCheckingFrequency, updateEnsembler } from "../actions";

import type { Dispatch, State } from "../types";

const mapStateToProps = (state: State) => {
  return {
    frequency: state.policy.CheckingFreq,
    ensembler: state.policy.Ensembler,
    possibleEnsemblerList: state.defaultsList.ensemblers
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateEnsembler: (event: SyntheticInputEvent<HTMLInputElement>) =>
      dispatch(updateEnsembler(event.target.value)),
    updateCheckingFrequency: (event: SyntheticInputEvent<HTMLInputElement>) =>
      dispatch(updateCheckingFrequency(event.target.value))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(PolicySummary);

export default container;
