import {
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
  UPDATE_SUBPOLICY_RESOURCE,
  UPDATE_SP_META,
  DELETE_SUBPOLICY,
  updateNomadParameters,
  updateNumericNomadParameters,
  updateEnsembler,
  updateCheckingFrequency,
  updateEC2Parameter,
  updateNumericEC2Parameter,
  createSubpolicy,
  updateSubpolicyName,
  deleteSubpolicy,
  updateMeta,
  updateSubpolicyResource,
  deleteResource,
  updateNumericResourceField,
  updateResourceField,
  updateResourceName,
  createResource
} from "../../src/actions";

describe("Actions", () => {
  it("Nomad param updates should show produce right action", () => {
    expect(updateNomadParameters({ val: 1 })).toEqual({
      type: UPDATE_NOMAD_PARAM,
      change: { val: 1 }
    });

    expect(updateNumericNomadParameters({ val: 1 })).toEqual({
      type: UPDATE_NOMAD_NUMERIC_PARAM,
      change: { val: 1 }
    });
  });

  it("EC2 param updates should show produce right action", () => {
    expect(updateEC2Parameter({ val: 1 })).toEqual({
      type: UPDATE_EC2_PARAM,
      change: { val: 1 }
    });

    expect(updateNumericEC2Parameter({ val: 1 })).toEqual({
      type: UPDATE_EC2_NUMERIC_PARAM,
      change: { val: 1 }
    });
  });

  it("Policy simple variable update should show produce right action", () => {
    expect(updateEnsembler({ val: 1 })).toEqual({
      type: UPDATE_ENSEMBLER,
      change: { val: 1 }
    });

    expect(updateCheckingFrequency({ val: 1 })).toEqual({
      type: UPDATE_FREQUENCY,
      change: { val: 1 }
    });
  });

  it("Subpolicy updates should show produce right action", () => {
    expect(createSubpolicy()).toEqual({
      type: CREATE_SUBPOLICY
    });

    expect(updateSubpolicyName({ val: "name" })).toEqual({
      type: UPDATE_SUBPOLICY_NAME,
      change: { val: "name" }
    });

    expect(deleteSubpolicy({ val: "name" })).toEqual({
      type: DELETE_SUBPOLICY,
      id: { val: "name" }
    });

    expect(updateMeta({ val: "name" })).toEqual({
      type: UPDATE_SP_META,
      change: { val: "name" }
    });

    expect(updateSubpolicyResource({ val: "name" })).toEqual({
      type: UPDATE_SUBPOLICY_RESOURCE,
      change: { val: "name" }
    });
  });

  it("Resource updates should show produce right action", () => {
    expect(createResource()).toEqual({
      type: CREATE_RESOURCE
    });

    expect(updateResourceName({ val: "name" })).toEqual({
      type: UPDATE_RESOURCE_NAME,
      change: { val: "name" }
    });

    expect(updateResourceField({ val: "name" })).toEqual({
      type: UPDATE_RESOURCE_FIELD,
      change: { val: "name" }
    });

    expect(updateNumericResourceField({ val: "name" })).toEqual({
      type: UPDATE_RESOURCE_NUMERIC_FIELD,
      change: { val: "name" }
    });

    expect(deleteResource({ val: "name" })).toEqual({
      type: DELETE_RESOURCE,
      id: { val: "name" }
    });
  });
});
