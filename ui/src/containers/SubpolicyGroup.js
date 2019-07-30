// @flow

import { connect } from "react-redux";

import SubpolicyGroup from "../components/SubpolicyGroup";
import { createSubpolicy } from "../actions";

import type { State } from "../types";

const mapStateToProps = (state: State) => {
  return {
    subpolicies: state.policy.Subpolicies.map(sp => sp.Id)
  };
};

const mapDispatchToProps = {
  createSubpolicy
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubpolicyGroup);

export default container;
