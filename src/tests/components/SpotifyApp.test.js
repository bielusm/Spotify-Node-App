import React from "react";
import { shallow } from "enzyme";
import { SpotifyApp } from "../../components/SpotifyApp";

test("SpotifyApp snapshot test", () => {
  const wrapper = shallow(<SpotifyApp setAccessToken={jest.fn()} />);
  expect(wrapper).toMatchSnapshot();
});
