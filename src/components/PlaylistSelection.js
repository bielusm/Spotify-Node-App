import React from "react";

const PlaylistSelection = props => (
  <div>
    {props.showPlaylists && (
      <ul
        id="playlistSelection"
        className="list-group"
        onClick={props.selectPlaylist}
      >
        {props.playlists.items.map(playlist => {
          const plName = playlist.name.replace(/ /g, "-");
          return (
            <a
              key={playlist.name}
              id={playlist.id}
              className={
                "playlist " + plName + " list-group-item list-group-item-action"
              }
            >
              {playlist.name}
            </a>
          );
        })}
      </ul>
    )}
  </div>
);

export default PlaylistSelection;
