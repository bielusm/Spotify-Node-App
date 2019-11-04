import React from "react";

export const PlaylistSelection = props => (
  <>
    {props.showPlaylists && (
      <div>
        <h2 className="playlist-selection__header">Your playlists:</h2>
        <div
          id="playlist-selection"
          className="playlist-selection__list"
          onClick={props.selectPlaylist}
        >
          {props.playlists.map(playlist => {
            const plName = playlist.name.replace(/ /g, "-");
            const selected = playlist.selected;
            let className = "playlist-selection__item";
            if (selected) className += " active";
            return (
              <div key={playlist.name} id={playlist.id} className={className}>
                {playlist.name}
              </div>
            );
          })}
        </div>
      </div>
    )}
  </>
);

export default PlaylistSelection;
