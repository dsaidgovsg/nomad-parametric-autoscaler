// @flow

import { connect } from "react-redux";
import ManagedResources from "../components/ManagedResources";
import { updateSubpolicyResource } from "../actions";

import type { Dispatch, State } from "../types";

const mapStateToProps = (state: State) => {
  let possibleResources = [];
  for (let key in state.policy.Resources) {
    if (state.policy.Resources.hasOwnProperty(key)) {
      possibleResources.push(state.policy.Resources[key].Name);
    }
  }

  return {
    possibleResources: possibleResources
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateSubpolicyResource: (input: { id: string, value: Array<string> }) =>
      dispatch(updateSubpolicyResource(input))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagedResources);

export default container;
