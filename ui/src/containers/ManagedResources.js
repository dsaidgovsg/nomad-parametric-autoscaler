import { connect } from "react-redux";
import ManagedResources from "../components/ManagedResources";
import { updateSubpolicyResource } from "../actions";

const mapStateToProps = state => {
  let possibleResources = [];
  for (let key in state.policy.Resources) {
    if (state.policy.Resources.hasOwnProperty(key)) {
      // possibleResources.push(state.policy.Resources[key].Name);
      possibleResources.push(key);
    }
  }

  return {
    possibleResources: possibleResources
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSubpolicyResource: input => dispatch(updateSubpolicyResource(input))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManagedResources);

export default container;
