import React from "react";
import { shallow } from "enzyme";
import { GetPlaylistsBtn } from "../../components/GetPlaylistsBtn";

test("Snapshot for get playlists btn", () => {
  const wrapper = shallow(<GetPlaylistsBtn />);
  expect(wrapper).toMatchSnapshot();
});
