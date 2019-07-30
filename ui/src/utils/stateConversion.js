// @flow

import uniqueIdGen from "./uniqueIdGenerator";

import type { NopasState } from "../types";

export const serverToUIConversion: (
  st: Object
) => NopasState | typeof undefined = input => {
  try {
    // subpolicy stringify + give Id
    for (const sp of input.Subpolicies) {
      sp.Metadata = JSON.stringify(sp.Metadata, null, 2);
      sp["Id"] = uniqueIdGen();
    }

    // resource naming
    const resource = {};
    for (const key in input.Resources) {
      if (input.Resources.hasOwnProperty(key)) {
        resource[uniqueIdGen()] = {
          ...input.Resources[key],
          Name: key
        };
      }
    }
    return {
      ...input,
      Resources: resource
    };
  } catch (error) {
    alert(error);
  }
};

export const uiToServerConversion: (st: NopasState) => Object = input => {
  try {
    const state = JSON.parse(JSON.stringify(input));
    const resource = {};
    for (const key in state.Resources) {
      if (state.Resources.hasOwnProperty(key)) {
        const name = state.Resources[key].Name;
        resource[name] = state.Resources[key];
      }
    }

    for (const sp of state.Subpolicies) {
      sp.Metadata = JSON.parse(sp.Metadata);
    }

    return {
      ...state,
      Resources: resource
    };
  } catch (error) {
    alert(error);
  }
};
