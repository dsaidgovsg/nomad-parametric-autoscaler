import { connect } from "react-redux";
import Resource from "../components/Resource";
import {
  updateResourceName,
  updateResourceField,
  deleteResource,
  updateNumericResourceField
} from "../actions";

const mapStateToProps = (state, ownProps) => {
  return {
    scaleInCooldown: state.policy.Resources[ownProps.name].ScaleInCooldown,
    scaleOutCooldown: state.policy.Resources[ownProps.name].ScaleOutCooldown,
    ratio: state.policy.Resources[ownProps.name].N2CRatio
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateResourceName: event => dispatch(updateResourceName(event)),
    updateNumericResourceField: event =>
      dispatch(updateNumericResourceField(event)),
    updateResourceField: event => dispatch(updateResourceField(event)),
    deleteResource: event => dispatch(deleteResource(event))
  };
};

const container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Resource);

export default container;
