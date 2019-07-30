// @flow

import { connect } from "react-redux";
import App from "../App";
import { updatePossibleDefaultsList } from "../actions";

import type { Dispatch, State, NopasState, PossibleDefaults } from "../types";

const mapStateToProps = (state: State) => {
  return {
    state: state.policy
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    refreshState: (event: NopasState) => {
      dispatch({ type: "UPDATE_STATE", state: event });
    },
    updatePossibleDefaultsList: (event: PossibleDefaults) => {
      dispatch(updatePossibleDefaultsList(event));
    }
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default container;
