import React from "react";

const GetPlaylistsBtn = props => (
  <button
    id="getPlaylistsBtn"
    className="btn btn-secondary"
    onClick={props.getPlaylists}
    disabled={props.getPlaylistsDisabled}
  >
    Pick playlists
  </button>
);

export default GetPlaylistsBtn;
