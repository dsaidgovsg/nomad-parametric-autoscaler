import { connect } from 'react-redux';
import ManagedResources from '../components/ManagedResources';
import { updateSubpolicyResource } from '../actions';

const mapDispatchToProps = dispatch => {
    return {
      updateSubpolicyResource: (input) => dispatch(updateSubpolicyResource(input)),
    }
  }
  
const container = connect(
    null,
    mapDispatchToProps
)(ManagedResources)

export default container;