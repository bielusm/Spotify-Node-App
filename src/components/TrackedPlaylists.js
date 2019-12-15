import React from "react";
import { Button, Typography } from "@material-ui/core";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";

export const TrackedPlaylists = props => (
  <>
    {props.trackedPlaylists.length > 0 && (
      <Table id="trackedPlaylists">
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography className="trackedPlaylists-header">
                Tracked Playlists
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
              <TableRow
                key={playlist.id}
                id={playlist.id}
                className={"trackedPlaylists-list_item " + plName}
              >
                <TableCell>
                  <Typography className="trackedPlaylists-list_item_text">
                    {playlist.name}
                  </Typography>
                </TableCell>
                <TableCell>{button}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )}
  </>
);

export default TrackedPlaylists;
