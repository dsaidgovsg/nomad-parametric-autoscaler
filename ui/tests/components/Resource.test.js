import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Resource from "../../src/components/Resource";
import EC2Parameters from "../../src/containers/EC2Parameters";
import NomadParameters from "../../src/containers/NomadParameters";

function shallowSetup() {
  const props = {
    name: "test",
    scaleInCooldown: "1m",
    scaleOutCooldown: "1m30s",
    ratio: 3,
    updateResourceField: jest.fn(),
    updateNumericResourceField: jest.fn(),
    deleteResource: jest.fn(),
    updateResourceName: jest.fn()
  };

  const enzymeWrapper = shallow(<Resource {...props} />);
  return {
    props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("Resource", () => {
  describe("renders", () => {
    it("it should render with nomad parameters", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(NomadParameters).exists()).toEqual(true);
    });

    it("it should render with ec2 parameters", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(EC2Parameters).exists()).toEqual(true);
    });

    it("it should render with 2 other text fields", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(TextField).length).toEqual(4);
    });
  });

  describe("clicks", () => {
    it("clicking delete should trigger deleteResource", () => {
      const { enzymeWrapper, props } = shallowSetup();
      const button = enzymeWrapper.find(Fab).first();
      button.simulate("click");
      expect(props.deleteResource.mock.calls.length).toBe(1);
    });
  });
});
