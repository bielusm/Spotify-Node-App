import React from "react";
import { Button } from "@material-ui/core";

export const TrackedPlaylists = props => (
  <>
    {props.trackedPlaylists.length > 0 && (
      <div id="trackedPlaylists">
        <h2 className="trackedPlaylists-header">Tracked Playlists</h2>
        <div className="tracked trackedPlaylists-list">
          {props.trackedPlaylists.map(playlist => {
            const plName = playlist.name.replace(/ /g, "-");
            let button;
            if (!props.currentTrack || playlist.loading) {
              button = (
                <Button
                  variant="contained"
                  className="trackedPlaylists-list-button"
                  disabled
                >
                  Add
                </Button>
              );
            } else if (playlist.found) {
              button = (
                <Button
                  variant="contained"
                  color="secondary"
                  className="button button-remove remove trackedPlaylists-list-button"
                  onClick={props.addOrRemove}
                >
                  Remove
                </Button>
              );
            } else
              button = (
                <Button
                  variant="contained"
                  color="primary"
                  className="button button-add add trackedPlaylists-list-button"
                  onClick={props.addOrRemove}
                >
                  Add
                </Button>
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
  </>
);

export default TrackedPlaylists;
