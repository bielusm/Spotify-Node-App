import React from "react";
import { shallow } from "enzyme";
import { TrackedPlaylists } from "../../components/TrackedPlaylists";
import {
  trackedPlaylists as trackedPlaylistsFixture,
  currentTrack as currentTrackFixture
} from "../fixtures/trackedPlaylists";

let wrapper, trackedPlaylists, currentTrack, addOrRemove;

beforeEach(() => {
  trackedPlaylists = trackedPlaylistsFixture;
  currentTrack = currentTrackFixture;
  addOrRemove = jest.fn();
  wrapper = shallow(
    <TrackedPlaylists
      currentTrack={currentTrack}
      trackedPlaylists={trackedPlaylists}
      addOrRemove={addOrRemove}
    />
  );
});

test("Tracked playlist snapshot test", () => {
  expect(wrapper).toMatchSnapshot();
});

test("Tracked playlist snapshot test no data", () => {
  wrapper.setProps({ trackedPlaylists: [] });
  expect(wrapper).toMatchSnapshot();
});

test("Test add or remove click", () => {
  wrapper
    .find("button")
    .at(0)
    .simulate("click");
  expect(addOrRemove).toHaveBeenCalled();
});
