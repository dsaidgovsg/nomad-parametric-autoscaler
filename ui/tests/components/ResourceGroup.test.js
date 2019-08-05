import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Button from "@material-ui/core/Button";
import ResourceGroup from "../../src/components/ResourceGroup";
import Resource from "../../src/components/Resource";
import sinon from "sinon";

function shallowSetup() {
  const enzymeWrapper = shallow(<ResourceGroup />);
  return {
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("ResourceGroup", () => {
  describe("renders", () => {
    it("it should render correct number of resources", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(Resource).length).toEqual(2);
    });
  });

  describe("clicks", () => {
    it("clicking delete should trigger createResource", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(Resource).length).toEqual(2);
      const button = enzymeWrapper.find(Button).first();
      button.simulate("click");
      expect(enzymeWrapper.find(Resource).length).toEqual(3);
    });
  });
});
