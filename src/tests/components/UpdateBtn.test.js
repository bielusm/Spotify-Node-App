import React from "react";
import { shallow } from "enzyme";
import { UpdateBtn } from "../../components/UpdateBtn";
import Button from "@material-ui/core/Button";

let wrapper, update;

beforeEach(() => {
  update = jest.fn();
  wrapper = shallow(<UpdateBtn update={update} />);
});

test("Update btn snapshot test", () => {
  expect(wrapper).toMatchSnapshot();
});

test("updatebtn test", () => {
  wrapper.find(Button).simulate("click");
  expect(update).toHaveBeenCalled();
});
