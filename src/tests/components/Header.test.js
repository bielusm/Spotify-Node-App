import React from "react";
import { shallow } from "enzyme";
import { Header } from "../../components/Header";

test("Header snapshot test", () => {
  const wrapper = shallow(<Header />);
  expect(wrapper).toMatchSnapshot();
});
