import React from "react";
import { shallow } from "enzyme";
import { PickPlaylistsBtn } from "../../components/PickPlaylistsBtn";

test("Snapshot for get playlists btn", () => {
  const wrapper = shallow(<PickPlaylistsBtn />);
  expect(wrapper).toMatchSnapshot();
});
