import { connect } from 'react-redux';
import NomadParameters from '../components/NomadParameters';
import { updateNomadParameters, updateNumericNomadParameters } from '../actions';

const mapStateToProps = (state, ownProps) => {
    return {
        address: state.policy.Resources[ownProps.name].Nomad.Address,
        jobName: state.policy.Resources[ownProps.name].Nomad.JobName,
        nomadPath: state.policy.Resources[ownProps.name].Nomad.NomadPath,
        maxCount: state.policy.Resources[ownProps.name].Nomad.MaxCount,
        minCount: state.policy.Resources[ownProps.name].Nomad.MinCount,
     };
  };

const mapDispatchToProps = dispatch => {
  return {
    updateNomadParameters: input =>  dispatch(updateNomadParameters(input)),
    updateNumericNomadParameters: input =>  dispatch(updateNumericNomadParameters(input))
  }
}

const container = connect(
    mapStateToProps,
    mapDispatchToProps
  )(NomadParameters);

export default container;