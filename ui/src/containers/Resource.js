// @flow

import { connect } from "react-redux";
import Resource from "../components/Resource";
import {
  updateResourceName,
  updateResourceField,
  deleteResource,
  updateNumericResourceField
} from "../actions";

import type {
  Dispatch,
  FieldChangeType,
  State,
  SimpleChangeType
} from "../types";
import type { OwnProps } from "../components/Resource";

const mapStateToProps = (state: State, ownProps: OwnProps) => {
  return {
    resourceName: state.policy.Resources[ownProps.id].Name,
    scaleDownCooldown: state.policy.Resources[ownProps.id].ScaleDownCooldown,
    scaleUpCooldown: state.policy.Resources[ownProps.id].ScaleUpCooldown,
    ratio: state.policy.Resources[ownProps.id].N2CRatio
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateResourceName: (event: SimpleChangeType) =>
      dispatch(updateResourceName(event)),
    updateNumericResourceField: (event: FieldChangeType) =>
      dispatch(updateNumericResourceField(event)),
    updateResourceField: (event: FieldChangeType) =>
      dispatch(updateResourceField(event)),
    deleteResource: (event: string) => dispatch(deleteResource(event))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Resource);

export default container;
