import React from "react";
import { shallow } from "enzyme";
import { Loading } from "../../components/Loading";

test("Loading snapshot while not loading", () => {
  const wrapper = shallow(<Loading loading={false} />);
  expect(wrapper).toMatchSnapshot();
});

test("Loading snapshot while loading", () => {
  const wrapper = shallow(<Loading loading={true} />);
  expect(wrapper).toMatchSnapshot();
});
