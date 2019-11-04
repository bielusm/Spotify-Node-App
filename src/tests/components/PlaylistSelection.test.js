import React from "react";
import { shallow } from "enzyme";
import { PlaylistSelection } from "../../components/PlaylistSelection";
import { playlists as playlistsFixture } from "../fixtures/playlists";

let showPlaylists, selectPlaylist, wrapper, playlists;
beforeEach(() => {
  showPlaylists = true;
  selectPlaylist = jest.fn();
  playlists = playlistsFixture;
  wrapper = shallow(
    <PlaylistSelection
      showPlaylists={showPlaylists}
      playlists={playlists}
      selectPlaylist={selectPlaylist}
    />
  );
});

test("Snapshot with showPlaylists false", () => {
  wrapper.setProps({ showPlaylists: false });
  expect(wrapper).toMatchSnapshot();
});

test("Snapshot with showPlaylists true", () => {
  wrapper.setProps({ showPlaylists: true });
  expect(wrapper).toMatchSnapshot();
});
