import React from "react";

const GetPlaylistsBtn = props => (
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
