import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import DeleteButtonWithWarning from "../../src/components/DeleteButtonWithWarning";

function shallowSetup() {
    const props = {
    fn: jest.fn()
  };
  const enzymeWrapper = shallow(<DeleteButtonWithWarning {...props} />);
  return {
      props,
    enzymeWrapper
  };
}

configure({ adapter: new Adapter() });
describe("DeleteButtonWithWarning", () => {
  describe("clicks", () => {
    it("clicking delete should NOT immediately trigger fn", () => {
      const { enzymeWrapper, props } = shallowSetup();
      const button = enzymeWrapper.find(Fab).first();
      button.simulate("click");
      expect(props.fn.mock.calls.length).toBe(0);
    });

    it("clicking on inner delete should trigger fn", () => {
      const { enzymeWrapper, props } = shallowSetup();
      const button = enzymeWrapper.find(Fab).first();
      const innerButton = enzymeWrapper.find(Button).first();

      expect(enzymeWrapper.find(Button).length).toEqual(2);
      button.simulate("click");
      innerButton.simulate("click");
      expect(props.fn.mock.calls.length).toBe(1);
    });
  });

});
