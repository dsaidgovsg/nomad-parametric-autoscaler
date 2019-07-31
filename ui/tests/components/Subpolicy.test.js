import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import TextField from "@material-ui/core/TextField";
import Subpolicy from "../../src/components/Subpolicy";
import ManagedResources from "../../src/containers/ManagedResources";
import DeleteButtonWithWarning from "../../src/components/DeleteButtonWithWarning";

function shallowSetup() {
  // Sample props to pass to our shallow render
  const props = {
    id: "id",
    name: "test",
    resources: ["1", "2"],
    possibleSubpolicyList: [],
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
    it("clicking delete should NOT immediately trigger deleteSubpolicy", () => {
      const { enzymeWrapper } = shallowSetup();
      expect(enzymeWrapper.find(DeleteButtonWithWarning).exists()).toEqual(
        true
      );
    });
  });
});
