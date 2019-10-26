import React from "react";

const TrackedPlaylists = props => (
  <div>
    {props.trackedPlaylists.length > 0 && (
      <div id="trackedPlaylists">
        <h2 className="trackedPlaylists-header">Tracked Playlists</h2>
        <div className="tracked trackedPlaylists-list">
          {props.trackedPlaylists.map(playlist => {
            const plName = playlist.name.replace(/ /g, "-");
            let button;
            if (!props.currentTrack || playlist.loading) {
              button = (
                <button
                  className="button trackedPlaylists-list-button"
                  disabled
                >
                  Add
                </button>
              );
            } else if (playlist.found) {
              button = (
                <button
                  className="button button-remove remove trackedPlaylists-list-button"
                  onClick={props.addOrRemove}
                >
                  Remove
                </button>
              );
            } else
              button = (
                <button
                  className="button button-add add trackedPlaylists-list-button"
                  onClick={props.addOrRemove}
                >
                  Add
                </button>
              );

            return (
              <div
                key={playlist.id}
                id={playlist.id}
                className={"trackedPlaylists-list_item " + plName}
              >
                <p className="trackedPlaylists-list_item_text">
                  {playlist.name}
                </p>
                {button}
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

export default TrackedPlaylists;
