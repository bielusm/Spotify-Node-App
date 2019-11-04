import React from "react";

export const GetPlaylistsBtn = props => (
  <button
    id="getPlaylistsBtn"
    className="button"
    onClick={props.getPlaylists}
    disabled={props.getPlaylistsDisabled}
  >
    Pick playlists
  </button>
);

export default GetPlaylistsBtn;
