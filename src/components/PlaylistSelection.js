import React from "react";

const PlaylistSelection = props => (
  <div>
    {props.showPlaylists && (
      <ul
        id="playlistSelection"
        className="list-group"
        onClick={props.selectPlaylist}
      >
        {props.playlists.map(playlist => {
          const plName = playlist.name.replace(/ /g, "-");
          const selected = playlist.selected;
          let className =
            { plName } + "playlist list-group-item list-group-item-action";
          if (selected) className += " active";
          return (
            <a key={playlist.name} id={playlist.id} className={className}>
              {playlist.name}
            </a>
          );
        })}
      </ul>
    )}
  </div>
);

export default PlaylistSelection;
