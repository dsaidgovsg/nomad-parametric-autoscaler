import { connect } from "react-redux";
import App from "../App";
import { updatePossibleDefaultsList } from "../actions";

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
    updatePossibleDefaultsList: event => {
      dispatch(updatePossibleDefaultsList(event));
    }
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default container;
