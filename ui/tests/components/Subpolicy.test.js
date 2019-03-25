import React from "react";
import ReactDOM from "react-dom";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import configureStore from "redux-mock-store"; //ES6 modules
import { Provider } from "react-redux";
import Fab from "@material-ui/core/Fab";
import TextField from "@material-ui/core/TextField";
import Subpolicy from "../../src/components/Subpolicy";
import ManagedResources from "../../src/containers/ManagedResources";

const middlewares = [];
const mockStore = configureStore(middlewares);

const initialState = {};
const store = mockStore(initialState);

function shallowSetup() {
  // Sample props to pass to our shallow render
  const props = {
    name: "test",
    resources: ["1", "2"],
    metadata: "meta",
    updateMeta: jest.fn(),
    deleteSubpolicy: jest.fn(),
    updateSubpolicyName: jest.fn()
  };
  // wrapper instance around rendered output
  const enzymeWrapper = shallow(<Subpolicy {...props} />);

  return {
    props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("Subpolicy", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    const { props } = shallowSetup();
    ReactDOM.render(
      <Provider store={store}>
        <Subpolicy {...props} />
      </Provider>,
      div
    );
  });

  describe("renders", () => {
    it("it should render with managed resource", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(ManagedResources).exists()).toEqual(true);
    });

    it("it should render with 2 other text fields", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(TextField).length).toEqual(2);
    });
  });

  describe("clicks", () => {
    it("clicking delete should trigger deleteSubpolicy", () => {
      const { enzymeWrapper, props } = shallowSetup();
      const button = enzymeWrapper.find(Fab).first();
      button.simulate("click");
      expect(props.deleteSubpolicy.mock.calls.length).toBe(1);
    });
  });
});
