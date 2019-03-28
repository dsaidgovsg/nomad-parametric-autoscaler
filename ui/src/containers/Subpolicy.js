import { connect } from "react-redux";
import Subpolicy from "../components/Subpolicy";
import { updateSubpolicyName, deleteSubpolicy, updateMeta } from "../actions";

const mapStateToProps = (state, ownProps) => {
  const thisSP = state.policy.Subpolicies.filter(
    sp => sp.Id === ownProps.id
  );
  const sp = thisSP && thisSP[0];

  return {
    name: sp.Name,
    metadata: sp.Metadata,
    resources: sp.ManagedResources,
    possibleSubpolicyList: state.defaultsList.subpolicies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    updateSubpolicyName: event => dispatch(updateSubpolicyName(event)),
    deleteSubpolicy: event => dispatch(deleteSubpolicy(event)),
    updateMeta: event => dispatch(updateMeta(event))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Subpolicy);

export default container;
