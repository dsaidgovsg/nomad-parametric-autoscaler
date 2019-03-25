import { connect } from "react-redux";
import App from "../App";

const mapStateToProps = state => {
  return {
    state: state.policy
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshState: event => {
      dispatch({ type: "UPDATE_STATE", change: event });
    }
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default container;
