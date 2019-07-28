// @flow

export type PossibleDefaults = {
  subpolicies: Array<string>,
  ensemblers: Array<string>
};

export type Subpolicy = {
  Name: string,
  Id: string,
  Metadata: string,
  ManagedResources: Array<string>
};

export type EC2 = {
  ScalingGroupName: string,
  Region: string,
  MaxCount: number,
  MinCount: number
};

export type Nomad = {
  Address: string,
  JobName: string,
  NomadPath: string,
  MaxCount: number,
  MinCount: number
};

export type Resource = {
  Name: string,
  EC2: EC2,
  Nomad: Nomad,
  ScaleOutCooldown: string,
  ScaleInCooldown: string,
  N2CRatio: number
};

export type State = {
  CheckingFreq: string,
  Ensembler: string,
  Resources: { [key: string]: Resource },
  Subpolicies: Array<Subpolicy>
};

export type ChangeObjectAction = {
  id: string,
  value?: string,
  change?: string,
  field?: string
};

export type UpdatePossibleDefaults = {
  type: string,
  change: PossibleDefaults
};

export type UpdateStateAction = {
  type: string,
  change: State
};

export type SimpleChangeType = {
  id: string,
  field: ?string,
  value: string
};

export type Action =
  | { type: "CREATE_RESOURCE" }
  | { type: "UPDATE_STATE", state: State }
  | { type: "UPDATE_FREQUENCY", change: string }
  | { type: "UPDATE_ENSEMBLER", change: string }
  | { type: "UPDATE_RESOURCE_NAME", change: SimpleChangeType }
  | {
      type: "UPDATE_RESOURCE_FIELD",
      change: SimpleChangeType
    }
  | {
      type: "UPDATE_RESOURCE_NUMERIC_FIELD",
      change: SimpleChangeType
    }
  | { type: "UPDATE_NOMAD_PARAM", change: SimpleChangeType }
  | { type: "UPDATE_NOMAD_NUMERIC_PARAM", change: SimpleChangeType }
  | { type: "UPDATE_EC2_PARAM", change: SimpleChangeType }
  | { type: "UPDATE_EC2_NUMERIC_PARAM", change: SimpleChangeType }
  | { type: "CREATE_SUBPOLICY" }
  | { type: "UPDATE_SUBPOLICY_NAME", change: SimpleChangeType }
  | { type: "UPDATE_SP_RESOURCE", change: { id: string, value: Array<string> } }
  | {
      type: "UPDATE_SUBPOLICY_RESOURCE",
      change: { id: string, value: Array<string> }
    }
  | { type: "UPDATE_SP_META", change: SimpleChangeType }
  | { type: "DELETE_SUBPOLICY", id: string }
  | { type: "DELETE_RESOURCE", id: string }
  | { type: "UPDATE_POSSIBLE_DEFAULTS_LIST", change: PossibleDefaults };
