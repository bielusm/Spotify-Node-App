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
    if (this.props.is_playing) pausePlayer(this.props.bearerToken);
    else startPlayer(this.props.bearerToken);
  };

  nextTrack = () => {
    nextTrack(this.props.bearerToken);
  };

  prevTrack = () => {
    prevTrack(this.props.bearerToken);
  };

  toggleLike = () => {
    modifyLibrary(this.props.bearerToken, this.props.id, this.props.likes_song);
  };
  render() {
    return (
      <div>
        <button className="btn">
          <i className="fas fa-backward" onClick={this.prevTrack}></i>
        </button>

        <button className="btn">
          <i
            className={
              "fas " + (this.props.is_playing ? "fa-pause" : "fa-play")
            }
            onClick={this.togglePause}
          ></i>
        </button>
        <button className="btn">
          <i className="fas fa-forward" onClick={this.nextTrack}></i>
        </button>
        <button className="btn">
          <i
            className={this.props.likes_song ? "fas fa-heart" : "far fa-heart"}
            onClick={this.toggleLike}
          ></i>
        </button>
      </div>
    );
  }
}
