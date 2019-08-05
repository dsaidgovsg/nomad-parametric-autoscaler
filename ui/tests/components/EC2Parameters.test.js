import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import TextField from "@material-ui/core/TextField";
import EC2Parameters from "../../src/components/EC2Parameters";

function shallowSetup() {
  const props = {
    name: "test",
    params: {
      ScalingGroupName: "grpname",
      Region: "region",
      MaxCount: 2,
      MinCount: 1
    },
    dispatch: jest.fn()
  };

  const enzymeWrapper = shallow(<EC2Parameters {...props} />);
  return {
    props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("EC2Parameters", () => {
  describe("renders", () => {
    it("it should render correct number of text fields", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(TextField).length).toEqual(4);
    });
  });

  describe("text changes", () => {
    it("updateNumericEC2Parameters is called when numeric field is updated", () => {
      const { enzymeWrapper, props } = shallowSetup();
      enzymeWrapper
        .find({ label: "MinCount" })
        .simulate("change", { target: { value: 3 } });
      expect(props.dispatch.mock.calls.length).toBe(1);
      enzymeWrapper
        .find({ label: "MaxCount" })
        .simulate("change", { target: { value: 20 } });
      expect(props.dispatch.mock.calls.length).toBe(2);
    });

    it("updateEC2Parameters is called when text fields are updated", () => {
      const { enzymeWrapper, props } = shallowSetup();
      enzymeWrapper
        .find({ label: "AWS region" })
        .simulate("change", { target: { value: "My new value" } });
      expect(props.dispatch.mock.calls.length).toBe(1);

      enzymeWrapper
        .find({ label: "Auto-Scaling grp name" })
        .simulate("change", { target: { value: "My new value" } });
      expect(props.dispatch.mock.calls.length).toBe(2);

      enzymeWrapper
        .find({ label: "Auto-Scaling grp name" })
        .simulate("change", { target: { value: "My new value" } });
      expect(props.dispatch.mock.calls.length).toBe(3);
    });
  });
});
