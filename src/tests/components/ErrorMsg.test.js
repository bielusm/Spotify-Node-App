import React from "react";
import { shallow } from "enzyme";
import { ErrorMsg } from "../../components/ErrorMsg";

test("Snapshot for no error msg", () => {
  const wrapper = shallow(<ErrorMsg errMsg={null} />);
  expect(wrapper).toMatchSnapshot();
});

test("Snapshot with error msg", () => {
  const wrapper = shallow(<ErrorMsg errMsg={"Sample error text"} />);
  expect(wrapper).toMatchSnapshot();
});
