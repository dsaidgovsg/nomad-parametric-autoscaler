import {
  UPDATE_FREQUENCY,
  UPDATE_ENSEMBLER,
  CREATE_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE_FIELD,
  UPDATE_RESOURCE_NUMERIC_FIELD,
  UPDATE_NOMAD_PARAM,
  UPDATE_EC2_PARAM,
  UPDATE_NOMAD_NUMERIC_PARAM,
  UPDATE_EC2_NUMERIC_PARAM,
  CREATE_SUBPOLICY
} from "../../src/actions";
import { initialState, policy } from "../../src/reducers";

describe("Actions", () => {
  it("Unknown actions should result in no change", () => {
    const nochange = policy(initialState, {
      type: "something new",
      change: 1
    });
    expect(nochange).toEqual(initialState);
  });

  it("Simple policy params should update correctly", () => {
    const newFreq = "test";
    const output = policy(initialState, {
      type: UPDATE_FREQUENCY,
      change: newFreq
    });
    expect(output.CheckingFreq).toEqual(newFreq);

    const output2 = policy(initialState, {
      type: UPDATE_ENSEMBLER,
      change: newFreq
    });
    expect(output2.Ensembler).toEqual(newFreq);
  });

  it("create new resources", () => {
    expect(Object.keys(initialState.Resources).length).toEqual(2);
    const out = policy(initialState, {
      type: CREATE_RESOURCE
    });
    expect(Object.keys(out.Resources).length).toEqual(3);
  });

  it("should delete resources", () => {
    expect(Object.keys(initialState.Resources).length).toEqual(2);
    const out = policy(initialState, {
      type: DELETE_RESOURCE,
      id: "uuid1"
    });

    expect(Object.keys(out.Resources).length).toEqual(1);
    const out2 = policy(out, {
      type: DELETE_RESOURCE,
      id: "uuid2"
    });
    expect(Object.keys(out.Resources).length).toEqual(1);
    expect(Object.keys(out2.Resources).length).toEqual(0);
  });

  it("should handle attempted deletion of non-existent resources", () => {
    expect(Object.keys(initialState.Resources).length).toEqual(2);
    const out = policy(initialState, {
      type: DELETE_RESOURCE,
      id: "uuid3"
    });
    expect(Object.keys(out.Resources).length).toEqual(2);
  });

  it("should change resource field correctly", () => {
    const change = { id: "uuid2", field: "ScaleUpCooldown", value: "13" };
    const out = policy(initialState, {
      type: UPDATE_RESOURCE_FIELD,
      change: change
    });

    expect(out.Resources[change.id].ScaleUpCooldown).toEqual(change.value);
  });

  it("should change resource numeric field correctly", () => {
    const change = { id: "uuid2", field: "N2CRatio", value: 12 };
    const out = policy(initialState, {
      type: UPDATE_RESOURCE_NUMERIC_FIELD,
      change: change
    });
    expect(out.Resources[change.id].N2CRatio).toEqual(change.value);

    const incorrect = { id: "uuid2", field: "N2CRatio", value: "hi" };
    const out2 = policy(initialState, {
      type: UPDATE_RESOURCE_NUMERIC_FIELD,
      change: incorrect
    });
    expect(out2.Resources[change.id].N2CRatio).toEqual(
      initialState.Resources[change.id].N2CRatio
    );
  });

  it("should change resource's nomad param correctly", () => {
    const change = { id: "uuid2", field: "Address", value: "13" };
    const out = policy(initialState, {
      type: UPDATE_NOMAD_PARAM,
      change: change
    });

    expect(out.Resources[change.id].Nomad.Address).toEqual(change.value);
  });

  it("should change resource nomad numeric field correctly", () => {
    const change = { id: "uuid2", field: "MaxCount", value: 12 };
    const out = policy(initialState, {
      type: UPDATE_NOMAD_NUMERIC_PARAM,
      change: change
    });
    expect(out.Resources[change.id].Nomad.MaxCount).toEqual(change.value);

    const incorrect = { id: "uuid2", field: "MaxCount", value: "hi" };
    const out2 = policy(initialState, {
      type: UPDATE_NOMAD_NUMERIC_PARAM,
      change: incorrect
    });
    expect(out2.Resources[change.id].Nomad.MaxCount).toEqual(
      initialState.Resources[change.id].Nomad.MaxCount
    );
  });

  it("should change resource's EC2 param correctly", () => {
    const change = { id: "uuid2", field: "ScalingGroupName", value: "13" };
    const out = policy(initialState, {
      type: UPDATE_EC2_PARAM,
      change: change
    });

    expect(out.Resources[change.id].EC2.ScalingGroupName).toEqual(change.value);
  });

  it("should change resource EC2 numeric field correctly", () => {
    const change = { id: "uuid2", field: "MaxCount", value: 12 };
    const out = policy(initialState, {
      type: UPDATE_EC2_NUMERIC_PARAM,
      change: change
    });
    expect(out.Resources[change.id].EC2.MaxCount).toEqual(change.value);

    const incorrect = { id: "uuid2", field: "MaxCount", value: "hi" };
    const out2 = policy(initialState, {
      type: UPDATE_EC2_NUMERIC_PARAM,
      change: incorrect
    });
    expect(out2.Resources[change.id].EC2.MaxCount).toEqual(
      initialState.Resources[change.id].EC2.MaxCount
    );
  });

  it("should create new subpolicy correctly", () => {
    expect(initialState.Subpolicies.length).toEqual(1);
    const out = policy(initialState, {
      type: CREATE_SUBPOLICY
    });
    expect(out.Subpolicies.length).toEqual(2);
  });
});
