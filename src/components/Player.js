import React from "react";
import { Button, IconButton } from "@material-ui/core";

import {
  modifyLibrary,
  startPlayer,
  pausePlayer,
  nextTrack,
  prevTrack
} from "../api/player";

import { setErrorMsg } from "../store/actions/error";
import { connect } from "react-redux";

export class Player extends React.Component {
  togglePause = async () => {
    if (this.props.is_playing)
      pausePlayer(this.props.bearerToken).then(() => this.props.update());
    else startPlayer(this.props.bearerToken).then(() => this.props.update());
  };

  nextTrack = async () => {
    nextTrack(this.props.bearerToken).then(() => this.props.update());
  };

  prevTrack = async () => {
    prevTrack(this.props.bearerToken).then(() => {
      this.props.update();
    });
  };

  toggleLike = async () => {
    modifyLibrary(
      this.props.bearerToken,
      this.props.id,
      this.props.likes_song
    ).then(() => this.props.update());
  };
  render() {
    return (
      <>
        <IconButton
          className="prevBtn fas fa-backward"
          onClick={this.prevTrack}
        />

        <IconButton
          className={
            "playBtn fas " + (this.props.is_playing ? "fa-pause" : "fa-play")
          }
          onClick={this.togglePause}
        />
        <IconButton
          className="nextBtn fas fa-forward"
          onClick={this.nextTrack}
        />
        <IconButton
          className={
            "likeBtn " +
            (this.props.likes_song ? "fas fa-heart" : "far fa-heart")
          }
          onClick={this.toggleLike}
        />
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setErrorMsg: error => dispatch(setErrorMsg(error))
});

export default connect(undefined, mapDispatchToProps)(Player);
