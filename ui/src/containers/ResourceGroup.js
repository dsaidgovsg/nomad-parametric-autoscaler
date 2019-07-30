// @flow

import { connect } from "react-redux";
import ResourceGroup from "../components/ResourceGroup";
import { createResource } from "../actions";

import type { State } from "../types";

const mapStateToProps = (state: State) => {
  return {
    resources: Object.keys(state.policy.Resources).map((key, _) => key)
  };
};

const mapDispatchToProps = {
  createResource
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceGroup);

export default container;
