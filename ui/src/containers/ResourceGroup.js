import { connect } from "react-redux";
import ResourceGroup from '../components/ResourceGroup';
import { createResource } from '../actions';

const mapStateToProps = state => {
    return {
        resources : Object.keys(state.policy.Resources).map((key, _) => key),
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    createResource: () => dispatch(createResource()),
  }
}

const container = connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResourceGroup)

export default container;