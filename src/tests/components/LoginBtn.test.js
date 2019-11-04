import React from "react";
import { shallow } from "enzyme";
import { LoginBtn } from "../../components/LoginBtn";

test("Login btn snapshot test", () => {
  const wrapper = shallow(<LoginBtn />);
  expect(wrapper).toMatchSnapshot();
});
