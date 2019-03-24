import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import configureStore from "redux-mock-store"; //ES6 modules
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import ManagedResources from "../src/components/ManagedResources";

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {};
const store = mockStore(initialState);

function shallowSetup() {
  const props = {
    name: "test",
    resources: ["a", "b", "c"],
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
    it("it should render with correct number of resources", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(TextField).length).toEqual(3);
      expect(enzymeWrapper.find(Fab).length).toEqual(3 + 1);
    });

    it("it should render with correct number of resources", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find({ value: "a" }).length).toEqual(1);
      expect(enzymeWrapper.find({ value: "b" }).length).toEqual(1);
      expect(enzymeWrapper.find({ value: "c" }).length).toEqual(1);
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
