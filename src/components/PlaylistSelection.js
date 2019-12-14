import React from "react";
import {
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Table
} from "@material-ui/core";

export const PlaylistSelection = props => (
  <>
    {props.showPlaylists && (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Your playlists</TableCell>
          </TableRow>
        </TableHead>
        <TableBody onClick={props.selectPlaylist}>
          {props.playlists.map(playlist => {
            let className = "playlist-selection__item";
            return (
              <TableRow hover selected={playlist.selected} key={playlist.name}>
                <TableCell id={playlist.id} className={className}>
                  {playlist.name}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    )}
  </>
);

export default PlaylistSelection;
