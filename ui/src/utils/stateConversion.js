import { uniqueIdGen } from "./uniqueIdGenerator";

export const serverToUIConversion = input => {
  try {
    // subpolicy stringify + give Id
    for (let sp of input.Subpolicies) {
      sp.Metadata = JSON.stringify(sp.Metadata);
      sp["Id"] = uniqueIdGen();
    }

    // resource naming
    let resource = {};
    for (let key in input.Resources) {
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

export const uiToServerConversion = state => {
  // put resource name as key
  try {
    let resource = {};
    for (let key in state.Resources) {
      if (state.Resources.hasOwnProperty(key)) {
        const name = state.Resources[key].Name;
        resource[name] = state.Resources[key];
      }
    }

    for (let sp of state.Subpolicies) {
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
