import { connect } from "react-redux";

import SubpolicyGroup from "../components/SubpolicyGroup";
import { createSubpolicy } from "../actions";

const mapStateToProps = state => {
  return {
    subpolicies: state.policy.Subpolicies.map(sp => sp.Name)
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
