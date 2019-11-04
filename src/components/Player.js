import React from "react";

import {
  modifyLibrary,
  startPlayer,
  pausePlayer,
  nextTrack,
  prevTrack
} from "../api/player";

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
      <div className="player-container">
        <button className="player-button prevBtn" onClick={this.prevTrack}>
          <i className="fas fa-backward"></i>
        </button>

        <button className="player-button playBtn" onClick={this.togglePause}>
          <i
            className={
              "fas " + (this.props.is_playing ? "fa-pause" : "fa-play")
            }
          ></i>
        </button>
        <button className="player-button nextBtn" onClick={this.nextTrack}>
          <i className="fas fa-forward"></i>
        </button>
        <button className="player-button likeBtn" onClick={this.toggleLike}>
          <i
            className={this.props.likes_song ? "fas fa-heart" : "far fa-heart"}
          ></i>
        </button>
      </div>
    );
  }
}

export default Player;
