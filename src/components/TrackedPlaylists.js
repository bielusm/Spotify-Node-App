import React from "react";

const TrackedPlaylists = props => (
  <div>
    {props.trackedPlaylists.length > 0 && (
      <div id="trackedPlaylists">
        <h2>Tracked Playlists</h2>
        <ul className="list-group">
          {props.trackedPlaylists.map(playlist => {
            const plName = playlist.name.replace(/ /g, "-");
            return (
              <li
                key={playlist.id}
                id={playlist.id}
                className={
                  "d-flex justify-content-between list-group-item " + plName
                }
              >
                {playlist.name}
                {playlist.found ? (
                  <button
                    className="btn btn-danger remove"
                    onClick={props.addOrRemove}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="btn btn-success add"
                    onClick={props.addOrRemove}
                  >
                    Add
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    )}
  </div>
);

export default TrackedPlaylists;
