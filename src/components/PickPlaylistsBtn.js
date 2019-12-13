import React from "react";
import Button from "@material-ui/core/Button";

export const PickPlaylistsBtn = props => (
  <Button
    variant="contained"
    color="primary"
    id="pickPlaylistsBtn"
    onClick={props.getPlaylists}
    disabled={props.getPlaylistsDisabled}
  >
    Pick playlists
  </Button>
);

export default PickPlaylistsBtn;
