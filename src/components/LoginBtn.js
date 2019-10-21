import React from "react";

export default class LoginBtn extends React.Component {
  login = () => {
    const scope =
      "playlist-modify-public%20user-read-playback-state%20playlist-read-private%20playlist-modify-private";
    const redirect_uri = window.location.origin;
    //redirect_uri = redirect_uri.slice(0, redirect_uri.length - 1);
    const url = `https://accounts.spotify.com/authorize?client_id=4252feb807d04ced962e15f346258957&response_type=token&redirect_uri=${redirect_uri}&scope=${scope}&show_dialog=false`;
    window.location.href = url;
  };

  render() {
    return (
      <div>
        {this.props.loginVisible && (
          <button id="login" className="btn btn-secondary" onClick={this.login}>
            Log in
          </button>
        )}
      </div>
    );
  }
}
