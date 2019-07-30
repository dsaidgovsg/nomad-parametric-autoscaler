import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import ManagedResources from "../../src/components/ManagedResources";

function shallowSetup() {
  const props = {
    id: "test",
    resources: ["a", "b", "c"],
    possibleResources: ["a", "b", "c", "d"],
    updateSubpolicyResource: jest.fn()
  };

  const enzymeWrapper = shallow(<ManagedResources {...props} />);
  return {
    props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("ManagedResources", () => {
  describe("renders", () => {
    it("it should render with correct number of components", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(TextField).length).toEqual(3);
      expect(enzymeWrapper.find(Fab).length).toEqual(3 + 1);
    });

    it("it should render with correct number of resources", () => {
      const { enzymeWrapper } = shallowSetup();
      const extraAppearances = enzymeWrapper.find(TextField).length;
      // + 3 due to each textfield having menu item w resource name
      expect(enzymeWrapper.find({ value: "a" }).length).toEqual(
        1 + extraAppearances
      );
      expect(enzymeWrapper.find({ value: "b" }).length).toEqual(
        1 + extraAppearances
      );
      expect(enzymeWrapper.find({ value: "c" }).length).toEqual(
        1 + extraAppearances
      );
    });
  });

  describe("clicks", () => {
    it("clicking delete should trigger deleteResource", () => {
      const { enzymeWrapper, props } = shallowSetup();
      const addButton = enzymeWrapper.find(Fab).last(); // first n-1 buttons are for deleting resources
      addButton.simulate("click");
      expect(props.updateSubpolicyResource.mock.calls.length).toBe(1);

      const button = enzymeWrapper.find(Fab).first();
      button.simulate("click");
      expect(props.updateSubpolicyResource.mock.calls.length).toBe(2);
    });
  });
});
