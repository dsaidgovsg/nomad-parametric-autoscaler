import remove from 'lodash/remove';
// TODO: change to fetch fn that gets from nopas backend
export const initialState = {
    CheckingFrequency: "1m",
    Ensembler: "conservative",
    Resources: {
        "Sample": {
            "Nomad": {
                Address: "",
                JobName: "",
                NomadPath: "",
                MaxCount: 10,
                MinCount: 1,
            },
            "EC2": {
                ScalingGroupName: "asg name",
                Region: "ap-southeast-1",
                MaxCount: 10,
                MinCount: 1,
            },
            "ScaleOutCooldown": "2m",
            "ScaleInCooldown": "2m",
            "N2CRatio": 0,
        },
        "Sample2": {
            "Nomad": {
                Address: "",
                JobName: "",
                NomadPath: "",
                MaxCount: 10,
                MinCount: 1,
            },
            "EC2": {
                ScalingGroupName: "asg name",
                Region: "ap-southeast-1",
                MaxCount: 10,
                MinCount: 1,
            },
            "ScaleOutCooldown": "2m",
            "ScaleInCooldown": "2m",
            "N2CRatio": 0,
        }
    },
    Subpolicies: [
        {
            Name: "CoreRatio",
            ManagedResources: [
                "Sample2", "Sample"
            ],
            Metadata: `{
                "MetricSource": "https://some.source/json",
                "UpThreshold": 0.5,
                "DownThreshold": 0.25,
                "ScaleOut": {
                    "Changetype": "multiply",
                    "ChangeValue": 2
                },
                "ScaleIn": {
                    "Changetype": "multiply",
                    "ChangeValue": 0.5
                }
            }`
        }
    ],
};

export const policyChange = (state = initialState, action) => {
    const updatedResource = JSON.parse(JSON.stringify(state.Resources));
    let sp = state.Subpolicies;
    
    switch (action.type) {
        case 'UPDATE_FREQUENCY':
        return {
            ...state,
            CheckingFrequency: action.change,
        }
        case 'UPDATE_ENSEMBLER':
        return {
            ...state, 
            Ensembler: action.change,
        }

        case 'CREATE_RESOURCE':
        // TODO: get refactor
        updatedResource['New'] = {
            "Nomad": {
                Address: "",
                JobName: "",
                NomadPath: "",
                MaxCount: 10,
                MinCount: 1,
            },
            "EC2": {
                ScalingGroupName: "asg name",
                Region: "ap-southeast-1",
                MaxCount: 10,
                MinCount: 1,
            },
            "ScaleOutCooldown": "1m",
            "ScaleInCooldown": "2m",
            "N2CRatio": 0,
        }
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'DELETE_RESOURCE':
        delete updatedResource[action.change.name]
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'UPDATE_RESOURCE_NAME':
        updatedResource[action.change.newName] = updatedResource[action.change.oldName]
        delete updatedResource[action.change.oldName]
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'UPDATE_RESOURCE_COOLDOWN':
        updatedResource[action.change.name].Cooldown = action.change.value
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'UPDATE_RESOURCE_RATIO':
        updatedResource[action.change.name].N2CRatio = action.change.value
        return {
            ...state,
            Resources: updatedResource,
        }
        
        case 'UPDATE_RESOURCE_FIELD':
        updatedResource[action.change.name][action.change.field] = action.change.value
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'UPDATE_NOMAD_PARAM':
        updatedResource[action.change.name].Nomad[action.change.field] = action.change.value
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'UPDATE_EC2_PARAM':
        updatedResource[action.change.name].EC2[action.change.field] = action.change.value
        return {
            ...state,
            Resources: updatedResource,
        }

        case 'CREATE_SUBPOLICY':
        sp.push({
            Name: "new",
            ManagedResources: [],
            Metadata: ""
        })
        
        return {
            ...state,
            Subpolicies: sp,
        }

        case 'UPDATE_SUBPOLICY_NAME':
        for (let i = 0; i < sp.length; i++) {
            if (sp[i].Name === action.change.oldName) {
                sp[i].Name = action.change.newName;
                break;
            }
        }
        
        return {
            ...state,
            Subpolicies: sp,
        }

        case 'UPDATE_SP_RESOURCE':
        for (let i = 0; i < sp.length; i++) {
            if (sp[i].Name === action.change.name) {
                sp[i].ManagedResources = action.change.value; // TODO thsi implementation is wrong
                break;
            }
        }
        
        return {
            ...state,
            Subpolicies: sp,
        }

        case 'UPDATE_SUBPOLICY_RESOURCE':
        for (let i = 0; i < sp.length; i++) {
            if (sp[i].Name === action.change.name) {
                sp[i].ManagedResources = action.change.newManagedResources;
                break;
            }
        }
        
        return {
            ...state,
            Subpolicies: sp,
        }

        case 'UPDATE_SP_META':
        for (let i = 0; i < sp.length; i++) {
            if (sp[i].Name === action.change.name) {
                sp[i].Metadata = action.change.value;
                break;
            }
        }
        return {
            ...state,
            Subpolicies: sp,
        }

        case 'DELETE_SUBPOLICY':
        const newSP = remove(sp, (elem) => {
            return elem.Name !== action.change.name;
          });

        return {
            ...state,
            Subpolicies: newSP,
        }
        
        default:
        return state
    }
}
