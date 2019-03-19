import { connect } from 'react-redux';
import EC2Parameters from '../components/EC2Parameters'

import { updateEC2Parameter, updateNumericEC2Parameter } from '../actions'

const mapStateToProps = (state, ownProps) => {
    return {
        autoScalingGroupName: state.policy.Resources[ownProps.name].EC2.ScalingGroupName,
        region: state.policy.Resources[ownProps.name].EC2.Region,
        maxCount: state.policy.Resources[ownProps.name].EC2.MaxCount,
        minCount: state.policy.Resources[ownProps.name].EC2.MinCount,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    updateEC2Parameter: input =>  dispatch(updateEC2Parameter(input)),
    updateNumericEC2Parameter: input =>  dispatch(updateNumericEC2Parameter(input)),
  }
};

const container = connect(
    mapStateToProps,
    mapDispatchToProps
  )(EC2Parameters);

export default container;
