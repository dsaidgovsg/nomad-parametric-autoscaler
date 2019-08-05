import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Button from "@material-ui/core/Button";
import SubpolicyGroup from "../../src/components/SubpolicyGroup";
import Subpolicy from "../../src/components/Subpolicy";

function shallowSetup() {
  const enzymeWrapper = shallow(<SubpolicyGroup />);
  return {
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("SubpolicyGroup", () => {
  describe("renders", () => {
    it("it should render correct number of resources", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(Subpolicy).length).toEqual(1);
    });
  });

  describe("clicks", () => {
    it("clicking delete should trigger createResource", () => {
      const { enzymeWrapper, props } = shallowSetup();
      expect(enzymeWrapper.find(Button).length).toEqual(1);
      expect(enzymeWrapper.find(Subpolicy).length).toEqual(1);
      const button = enzymeWrapper.find(Button).first();
      button.simulate("click");
      expect(enzymeWrapper.find(Subpolicy).length).toEqual(2);
    });
  });
});
