import React from "react";
import { shallow } from "enzyme";
import { UpdateBtn } from "../../components/UpdateBtn";

let wrapper, update;

beforeEach(() => {
  update = jest.fn();
  wrapper = shallow(<UpdateBtn update={update} />);
});

test("Update btn snapshot test", () => {
  expect(wrapper).toMatchSnapshot();
});

test("updatebtn test", () => {
  wrapper.find("button").simulate("click");
  expect(update).toHaveBeenCalled();
});
