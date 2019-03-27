import { connect } from "react-redux";
import App from "../App";
import { updatePossibleSubpolicyList } from "../actions";

const mapStateToProps = state => {
  return {
    state: state.policy
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshState: event => {
      dispatch({ type: "UPDATE_STATE", change: event });
    },
    updatePossibleSubpolicyList: event => {
      dispatch(updatePossibleSubpolicyList(event));
    }
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default container;
