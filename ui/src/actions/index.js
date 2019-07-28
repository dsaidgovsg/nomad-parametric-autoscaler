// @flow

import type { Action, PossibleDefaults, SimpleChangeType, FieldChangeType } from "../types";

/*
 * action types
 */
export const UPDATE_STATE = "UPDATE_STATE";
export const UPDATE_FREQUENCY = "UPDATE_FREQUENCY";
export const UPDATE_ENSEMBLER = "UPDATE_ENSEMBLER";
export const CREATE_RESOURCE = "CREATE_RESOURCE";
export const DELETE_RESOURCE = "DELETE_RESOURCE";
export const UPDATE_RESOURCE_NAME = "UPDATE_RESOURCE_NAME";
export const UPDATE_RESOURCE_FIELD = "UPDATE_RESOURCE_FIELD";
export const UPDATE_RESOURCE_NUMERIC_FIELD = "UPDATE_RESOURCE_NUMERIC_FIELD";
export const UPDATE_NOMAD_PARAM = "UPDATE_NOMAD_PARAM";
export const UPDATE_NOMAD_NUMERIC_PARAM = "UPDATE_NOMAD_NUMERIC_PARAM";
export const UPDATE_EC2_PARAM = "UPDATE_EC2_PARAM";
export const UPDATE_EC2_NUMERIC_PARAM = "UPDATE_EC2_NUMERIC_PARAM";

export const CREATE_SUBPOLICY = "CREATE_SUBPOLICY";
export const UPDATE_SUBPOLICY_NAME = "UPDATE_SUBPOLICY_NAME";
export const UPDATE_SP_RESOURCE = "UPDATE_SP_RESOURCE";
export const UPDATE_SUBPOLICY_RESOURCE = "UPDATE_SUBPOLICY_RESOURCE";
export const UPDATE_SP_META = "UPDATE_SP_META";
export const DELETE_SUBPOLICY = "DELETE_SUBPOLICY";

export const UPDATE_POSSIBLE_DEFAULTS_LIST = "UPDATE_POSSIBLE_DEFAULTS_LIST";

/*
 * action creators
 */
export const updateEnsembler: (s: string) => Action = value => ({
  type: UPDATE_ENSEMBLER,
  change: value
});

export const updateCheckingFrequency: (s: string) => Action = value => ({
  type: UPDATE_FREQUENCY,
  change: value
});

export const updateEC2Parameter: (s: FieldChangeType) => Action = change => ({
  type: UPDATE_EC2_PARAM,
  change: change
});

export const updateNumericEC2Parameter: (
  s: FieldChangeType
) => Action = change => ({
  type: UPDATE_EC2_NUMERIC_PARAM,
  change: change
});

export const updateNomadParameters: (
  s: FieldChangeType
) => Action = change => ({
  type: UPDATE_NOMAD_PARAM,
  change: change
});

export const updateNumericNomadParameters: (
  s: FieldChangeType
) => Action = change => ({
  type: UPDATE_NOMAD_NUMERIC_PARAM,
  change: change
});

// change should be object containing resource
export const updateSubpolicyResource: (s: {
  id: string,
  value: Array<string>
}) => Action = change => ({
  type: UPDATE_SUBPOLICY_RESOURCE,
  change: change
});

export const createSubpolicy: () => Action = () => ({
  type: CREATE_SUBPOLICY
});

export const createResource: () => Action = () => ({
  type: CREATE_RESOURCE
});

export const updateResourceName: (s: SimpleChangeType) => Action = change => ({
  type: UPDATE_RESOURCE_NAME,
  change: change
});

export const updateResourceField: (s: FieldChangeType) => Action = change => ({
  type: UPDATE_RESOURCE_FIELD,
  change: change
});

export const updateNumericResourceField: (s: FieldChangeType) => Action = change => ({
  type: UPDATE_RESOURCE_NUMERIC_FIELD,
  change: change
});

export const deleteResource: (s: string) => Action = id => ({
  type: DELETE_RESOURCE,
  id: id
});

export const updateSubpolicyName: (s: SimpleChangeType) => Action = change => ({
  type: UPDATE_SUBPOLICY_NAME,
  change: change
});

export const deleteSubpolicy: (s: string) => Action = change => ({
  type: DELETE_SUBPOLICY,
  id: change
});

export const updateMeta: (s: FieldChangeType) => Action = change => ({
  type: UPDATE_SP_META,
  change: change
});

export const updatePossibleDefaultsList: (
  s: PossibleDefaults
) => Action = change => ({
  type: UPDATE_POSSIBLE_DEFAULTS_LIST,
  change: change
});
