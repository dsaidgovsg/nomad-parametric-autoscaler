import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import NomadParameters from "../../src/components/NomadParameters";
import TextField from "@material-ui/core/TextField";

function shallowSetup() {
  const props = {
    name: "test",
    updateNomadParameters: jest.fn(),
    updateNumericNomadParameters: jest.fn(),
    address: "addresss",
    jobName: "job",
    nomadPath: "path",
    maxCount: 2,
    minCount: 1
  };

  const enzymeWrapper = shallow(<NomadParameters {...props} />);
  return {
    props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("NomadParameters", () => {
  describe("renders", () => {
    it("it should render correct number of text fields", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(TextField).length).toEqual(5);
    });
  });

  describe("text changes", () => {
    it("updateNumericNomadParameters is called when numeric field is updated", () => {
      const { enzymeWrapper, props } = shallowSetup();
      enzymeWrapper
        .find({ label: "MinCount" })
        .simulate("change", { target: { value: 3 } });
      expect(props.updateNumericNomadParameters.mock.calls.length).toBe(1);
      enzymeWrapper
        .find({ label: "MaxCount" })
        .simulate("change", { target: { value: 20 } });
      expect(props.updateNumericNomadParameters.mock.calls.length).toBe(2);
    });

    it("updateNomadParameters is called when text fields are updated", () => {
      const { enzymeWrapper, props } = shallowSetup();
      enzymeWrapper
        .find({ label: "NomadPath" })
        .simulate("change", { target: { value: "My new value" } });
      expect(props.updateNomadParameters.mock.calls.length).toBe(1);

      enzymeWrapper
        .find({ label: "JobName" })
        .simulate("change", { target: { value: "My new value" } });
      expect(props.updateNomadParameters.mock.calls.length).toBe(2);

      enzymeWrapper
        .find({ label: "JobName" })
        .simulate("change", { target: { value: "My new value" } });
      expect(props.updateNomadParameters.mock.calls.length).toBe(3);
    });
  });
});
