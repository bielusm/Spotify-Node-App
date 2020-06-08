import React from "react";
import Button from "@material-ui/core/Button";

export class LoginBtn extends React.Component {
  login = () => {
    const scope =
      "playlist-modify-public%20user-read-playback-state%20playlist-read-private%20playlist-modify-private%20user-modify-playback-state%20user-library-read%20user-library-modify%20user-read-private";
    const redirect_uri = window.location.href;
    const url = `https://accounts.spotify.com/authorize?client_id=4252feb807d04ced962e15f346258957&response_type=token&redirect_uri=${redirect_uri}&scope=${scope}&show_dialog=true`;
    window.location.href = url;
  };

  render() {
    return (
      <>
        {this.props.loginVisible && (
          <Button
            id="login"
            variant="contained"
            color="primary"
            onClick={this.login}
          >
            Log in to spotify
          </Button>
        )}
      </>
    );
  }
}

export default LoginBtn;
