/*
 * action types
 */
export const UPDATE_STATE = 'UPDATE_STATE';
export const UPDATE_FREQUENCY = 'UPDATE_FREQUENCY';
export const UPDATE_ENSEMBLER = 'UPDATE_ENSEMBLER';
export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const DELETE_RESOURCE = 'DELETE_RESOURCE';
export const UPDATE_RESOURCE_NAME = 'UPDATE_RESOURCE_NAME';
export const UPDATE_RESOURCE_COOLDOWN = 'UPDATE_RESOURCE_COOLDOWN';
export const UPDATE_RESOURCE_RATIO = 'UPDATE_RESOURCE_RATIO';
export const UPDATE_RESOURCE_FIELD = 'UPDATE_RESOURCE_FIELD';
export const UPDATE_RESOURCE_NUMERIC_FIELD = 'UPDATE_RESOURCE_NUMERIC_FIELD';
export const UPDATE_NOMAD_PARAM = 'UPDATE_NOMAD_PARAM';
export const UPDATE_NOMAD_NUMERIC_PARAM = 'UPDATE_NOMAD_NUMERIC_PARAM';
export const UPDATE_EC2_PARAM = 'UPDATE_EC2_PARAM';
export const UPDATE_EC2_NUMERIC_PARAM = 'UPDATE_EC2_NUMERIC_PARAM';

export const CREATE_SUBPOLICY = 'CREATE_SUBPOLICY';
export const UPDATE_SUBPOLICY_NAME = 'UPDATE_SUBPOLICY_NAME';
export const UPDATE_SP_RESOURCE = 'UPDATE_SP_RESOURCE';
export const UPDATE_SUBPOLICY_RESOURCE = 'UPDATE_SUBPOLICY_RESOURCE';
export const UPDATE_SP_META = 'UPDATE_SP_META';
export const DELETE_SUBPOLICY = 'DELETE_SUBPOLICY';

/*
 * action creators
 */
export const updateEnsembler = value => ({
    type: UPDATE_ENSEMBLER,
    change: value,
});

export const updateCheckingFrequency = value => ({
    type: UPDATE_FREQUENCY,
    change: value,
})

export const updateEC2Parameter = change => ({
    type: UPDATE_EC2_PARAM,
    change: change,
});

export const updateNumericEC2Parameter = change => ({
    type: UPDATE_EC2_NUMERIC_PARAM,
    change: change,
});

export const updateNomadParameters = change => ({
    type: UPDATE_NOMAD_PARAM,
    change: change,
});

export const updateNumericNomadParameters = change => ({
    type: UPDATE_NOMAD_NUMERIC_PARAM,
    change: change,
});

export const updateSubpolicyResource = change => ({
    type: UPDATE_SUBPOLICY_RESOURCE,
    change: change,
});

export const createSubpolicy = () => ({
    type: CREATE_SUBPOLICY,
});

export const createResource = () => ({
    type: CREATE_RESOURCE,
});

export const updateResourceName = change => ({
    type: UPDATE_RESOURCE_NAME,
    change: change,
});

export const updateResourceField = change => ({
    type: UPDATE_RESOURCE_FIELD,
    change: change,
});

export const updateNumericResourceField = change => ({
    type: UPDATE_RESOURCE_NUMERIC_FIELD,
    change: change,
});

export const deleteResource = change => ({
    type: DELETE_RESOURCE,
    change: change,
});

export const updateSubpolicyName = change => ({
    type: UPDATE_SUBPOLICY_NAME,
    change: change,
});

export const deleteSubpolicy = change => ({
    type: DELETE_SUBPOLICY,
    change: change,
});

export const updateMeta = change => ({
    type: UPDATE_SP_META,
    change: change,
});
