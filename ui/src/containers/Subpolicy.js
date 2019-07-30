// @flow

import { connect } from "react-redux";
import Subpolicy from "../components/Subpolicy";
import { updateSubpolicyName, deleteSubpolicy, updateMeta } from "../actions";

import type { OwnProps } from "../components/Subpolicy";
import type {
  Dispatch,
  FieldChangeType,
  State,
  SimpleChangeType
} from "../types";

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  const thisSP = state.policy.Subpolicies.filter(sp => sp.Id === ownProps.id);
  const sp = thisSP && thisSP[0];

  return {
    name: sp.Name,
    metadata: sp.Metadata,
    resources: sp.ManagedResources,
    possibleSubpolicyList: state.defaultsList.subpolicies
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    // dispatching plain actions
    updateSubpolicyName: (event: SimpleChangeType) =>
      dispatch(updateSubpolicyName(event)),
    deleteSubpolicy: (event: string) => dispatch(deleteSubpolicy(event)),
    updateMeta: (event: FieldChangeType) => dispatch(updateMeta(event))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Subpolicy);

export default container;
