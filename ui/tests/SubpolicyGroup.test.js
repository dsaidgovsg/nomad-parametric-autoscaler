import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Button from "@material-ui/core/Button";
import SubpolicyGroup from "../src/components/SubpolicyGroup";
import Subpolicy from "../src/containers/Subpolicy";

function shallowSetup() {
  const props = {
    subpolicies: ["a", "b", "c"],
    createSubpolicy: jest.fn()
  };

  const enzymeWrapper = shallow(<SubpolicyGroup {...props} />);
  return {
    props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("SubpolicyGroup", () => {
  describe("renders", () => {
    it("it should render correct number of resources", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(Subpolicy).length).toEqual(3);
    });
  });

  describe("clicks", () => {
    it("clicking delete should trigger createResource", () => {
      const { enzymeWrapper, props } = shallowSetup();
      expect(enzymeWrapper.find(Button).length).toEqual(1);

      const button = enzymeWrapper.find(Button).first();
      button.simulate("click");
      expect(props.createSubpolicy.mock.calls.length).toBe(1);
    });
  });
});
