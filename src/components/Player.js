import React from "react";

import {
  modifyLibrary,
  startPlayer,
  pausePlayer,
  nextTrack,
  prevTrack
} from "../api/player";

export default class Player extends React.Component {
  togglePause = () => {
    if (this.props.is_playing)
      pausePlayer(this.props.bearerToken).then(() => this.props.update());
    else startPlayer(this.props.bearerToken).then(() => this.props.update());
  };

  nextTrack = () => {
    nextTrack(this.props.bearerToken).then(() => this.props.update());
  };

  prevTrack = () => {
    prevTrack(this.props.bearerToken).then(() => this.props.update());
  };

  toggleLike = () => {
    modifyLibrary(
      this.props.bearerToken,
      this.props.id,
      this.props.likes_song
    ).then(() => this.props.update());
  };
  render() {
    return (
      <div className="player-container">
        <button className="player-button" onClick={this.prevTrack}>
          <i className="fas fa-backward"></i>
        </button>

        <button className="player-button" onClick={this.togglePause}>
          <i
            className={
              "fas " + (this.props.is_playing ? "fa-pause" : "fa-play")
            }
          ></i>
        </button>
        <button className="player-button" onClick={this.nextTrack}>
          <i className="fas fa-forward"></i>
        </button>
        <button className="player-button" onClick={this.toggleLike}>
          <i
            className={this.props.likes_song ? "fas fa-heart" : "far fa-heart"}
          ></i>
        </button>
      </div>
    );
  }
}
