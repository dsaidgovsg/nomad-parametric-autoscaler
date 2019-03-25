import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Button from "@material-ui/core/Button";
import ResourceGroup from "../../src/components/ResourceGroup";
import Resource from "../../src/containers/Resource";

function shallowSetup() {
  const props = {
    resources: ["a", "b"],
    createResource: jest.fn()
  };

  const enzymeWrapper = shallow(<ResourceGroup {...props} />);
  return {
    props,
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
      const { enzymeWrapper, props } = shallowSetup();
      const button = enzymeWrapper.find(Button).first();
      button.simulate("click");
      expect(props.createResource.mock.calls.length).toBe(1);
    });
  });
});
