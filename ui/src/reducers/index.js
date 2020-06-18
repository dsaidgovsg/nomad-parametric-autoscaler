// @flow

import remove from "lodash/remove";
import { combineReducers } from "redux";
import uniqueIdGen from "../utils/uniqueIdGenerator";

import {
  UPDATE_STATE,
  UPDATE_FREQUENCY,
  UPDATE_ENSEMBLER,
  CREATE_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE_NAME,
  UPDATE_RESOURCE_FIELD,
  UPDATE_RESOURCE_NUMERIC_FIELD,
  UPDATE_NOMAD_PARAM,
  UPDATE_EC2_PARAM,
  UPDATE_NOMAD_NUMERIC_PARAM,
  UPDATE_EC2_NUMERIC_PARAM,
  CREATE_SUBPOLICY,
  UPDATE_SUBPOLICY_NAME,
  UPDATE_SP_RESOURCE,
  UPDATE_SUBPOLICY_RESOURCE,
  UPDATE_SP_META,
  DELETE_SUBPOLICY,
  UPDATE_POSSIBLE_DEFAULTS_LIST
} from "../actions";

import type { NopasState, Action, PossibleDefaults } from "../types";

export const possibleDefaults = {
  subpolicies: ["CoreRatio"],
  ensemblers: ["Conservative"]
};

export const initialState: NopasState = {
  CheckingFreq: "1m",
  Ensembler: "Conservative",
  Resources: {
    uuid1: {
      Name: "Sample",
      Nomad: {
        Address: "",
        JobName: "",
        NomadPath: "",
        MaxCount: 10,
        MinCount: 1
      },
      EC2: {
        ScalingGroupName: "asg name",
        Region: "ap-southeast-1",
        MaxCount: 10,
        MinCount: 1
      },
      ScaleUpCooldown: "2m",
      ScaleDownCooldown: "2m",
      N2CRatio: 0
    },
    uuid2: {
      Name: "Sample2",
      Nomad: {
        Address: "",
        JobName: "",
        NomadPath: "",
        MaxCount: 10,
        MinCount: 1
      },
      EC2: {
        ScalingGroupName: "asg name",
        Region: "ap-southeast-1",
        MaxCount: 10,
        MinCount: 1
      },
      ScaleUpCooldown: "2m",
      ScaleDownCooldown: "2m",
      N2CRatio: 0
    }
  },
  Subpolicies: [
    {
      Id: "coreratio",
      Name: "CoreRatio",
      ManagedResources: ["Sample2", "Sample"],
      Metadata: JSON.stringify({
        MetricSource: "https://some.source/json",
        UpThreshold: 0.5,
        DownThreshold: 0.25,
        ScaleUp: {
          Changetype: "multiply",
          ChangeValue: 2
        },
        ScaleDown: {
          Changetype: "multiply",
          ChangeValue: 0.5
        }
      })
    }
  ]
};

export const policy: (state: NopasState, action: Action) => NopasState = (
  state = initialState,
  action
) => {
  const updatedResource = JSON.parse(JSON.stringify(state.Resources));
  let sp = state.Subpolicies.slice();

  switch (action.type) {
    case UPDATE_STATE:
      return action.state;

    // action.change is string
    case UPDATE_FREQUENCY:
      return {
        ...state,
        CheckingFreq: action.change
      };

    case UPDATE_ENSEMBLER:
      return {
        ...state,
        Ensembler: action.change
      };

    case CREATE_RESOURCE:
      // TODO: get refactor
      updatedResource[uniqueIdGen()] = {
        Name: "",
        Nomad: {
          Address: "",
          JobName: "",
          NomadPath: "",
          MaxCount: 10,
          MinCount: 1
        },
        EC2: {
          ScalingGroupName: "asg name",
          Region: "ap-southeast-1",
          MaxCount: 10,
          MinCount: 1
        },
        ScaleUpCooldown: "1m",
        ScaleDownCooldown: "2m",
        N2CRatio: 0
      };
      return {
        ...state,
        Resources: updatedResource
      };

    // action.change is {id: string}
    case DELETE_RESOURCE:
      delete updatedResource[action.id];
      return {
        ...state,
        Resources: updatedResource
      };

    // action.change is {id: string, value: string}
    case UPDATE_RESOURCE_NAME:
      updatedResource[action.change.id].Name = action.change.value;
      return {
        ...state,
        Resources: updatedResource
      };

    // action.change is {id: string, value: string, field: string}
    case UPDATE_RESOURCE_FIELD:
      updatedResource[action.change.id][action.change.field] =
        action.change.value;
      return {
        ...state,
        Resources: updatedResource
      };

    // action.change is {id: string, value: string, field: string}
    case UPDATE_RESOURCE_NUMERIC_FIELD: {
      let resourceNumericField = parseInt(action.change.value, 10);
      if (resourceNumericField) {
        updatedResource[action.change.id][
          action.change.field
        ] = resourceNumericField;
        return {
          ...state,
          Resources: updatedResource
        };
      } else {
        return state;
      }
    }

    case UPDATE_NOMAD_PARAM:
      updatedResource[action.change.id].Nomad[action.change.field] =
        action.change.value;
      return {
        ...state,
        Resources: updatedResource
      };

    case UPDATE_NOMAD_NUMERIC_PARAM: {
      let nomadNumericParam = parseInt(action.change.value, 10);
      if (nomadNumericParam) {
        updatedResource[action.change.id].Nomad[
          action.change.field
        ] = nomadNumericParam;
        return {
          ...state,
          Resources: updatedResource
        };
      } else {
        return state;
      }
    }

    case UPDATE_EC2_PARAM:
      updatedResource[action.change.id].EC2[action.change.field] =
        action.change.value;
      return {
        ...state,
        Resources: updatedResource
      };

    case UPDATE_EC2_NUMERIC_PARAM: {
      let ec2NumericParam = parseInt(action.change.value, 10);
      if (ec2NumericParam) {
        updatedResource[action.change.id].EC2[
          action.change.field
        ] = ec2NumericParam;
        return {
          ...state,
          Resources: updatedResource
        };
      } else {
        return state;
      }
    }

    case CREATE_SUBPOLICY:
      sp.push({
        Id: uniqueIdGen(),
        Name: "",
        ManagedResources: [],
        Metadata: ""
      });

      return {
        ...state,
        Subpolicies: sp
      };

    case UPDATE_SUBPOLICY_NAME:
      // make sure no current SP have that name
      for (let i = 0; i < sp.length; i++) {
        if (sp[i].Id === action.change.id) {
          sp[i].Name = action.change.value;
          break;
        }
      }

      return {
        ...state,
        Subpolicies: sp
      };

    case UPDATE_SP_RESOURCE:
      for (let i = 0; i < sp.length; i++) {
        if (sp[i].Id === action.change.id) {
          sp[i].ManagedResources = action.change.value; // TODO thsi implementation is wrong
          break;
        }
      }

      return {
        ...state,
        Subpolicies: sp
      };

    case UPDATE_SUBPOLICY_RESOURCE:
      for (let i = 0; i < sp.length; i++) {
        if (sp[i].Id === action.change.id) {
          sp[i].ManagedResources = action.change.value;
          break;
        }
      }

      return {
        ...state,
        Subpolicies: sp
      };

    case UPDATE_SP_META:
      for (let i = 0; i < sp.length; i++) {
        if (sp[i].Id === action.change.id) {
          sp[i].Metadata = action.change.value;
          break;
        }
      }
      return {
        ...state,
        Subpolicies: sp
      };

    case DELETE_SUBPOLICY: {
      const newSP = remove(sp, elem => {
        return elem.Id !== action.id;
      });

      return {
        ...state,
        Subpolicies: newSP
      };
    }

    default:
      return state;
  }
};

export const defaultsList: (
  pd: PossibleDefaults,
  a: Action
) => PossibleDefaults = (state = possibleDefaults, action) => {
  switch (action.type) {
    case UPDATE_POSSIBLE_DEFAULTS_LIST:
      return action.change;
    default:
      return state;
  }
};

export const rootReducer = combineReducers({ policy, defaultsList });
