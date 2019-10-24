import React from "react";

const PlaylistSelection = props => (
  <div>
    {props.showPlaylists && (
      <div
        id="playlistSelection"
        className="playlistSelection_list"
        onClick={props.selectPlaylist}
      >
        {props.playlists.map(playlist => {
          const plName = playlist.name.replace(/ /g, "-");
          const selected = playlist.selected;
          let className = "playlistSelection_item";
          if (selected) className += " active";
          return (
            <div key={playlist.name} id={playlist.id} className={className}>
              {playlist.name}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default PlaylistSelection;
