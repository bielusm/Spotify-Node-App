import React from "react";

import Header from "./Header";
import LoginBtn from "./LoginBtn";
import UpdateBtn from "./UpdateBtn";
import PickPlaylistsBtn from "./PickPlaylistsBtn";
import ErrorMsg from "./ErrorMsg";
import TrackContext from "./TrackContext";
import Loading from "./Loading";
import PlaylistSelection from "./PlaylistSelection";
import TrackedPlaylists from "./TrackedPlaylists";
import Player from "./Player";

import { currentPlayer, likesSong } from "../api/player";
import Playlists from "../api/playlists";
import { connect } from "react-redux";
import { setErrorMsg, resetErrorMsg } from "../store/actions/error";
import { setAccessToken } from "../store/actions/userInfo";

import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core";

export class SpotifyApp extends React.Component {
  state = {
    loginVisible: true,
    trackContext: "",
    showPlaylistsDiv: true,
    showTrackedPlaylists: false,
    showPlaylists: false,
    playlists: undefined,
    trackedPlaylists: [],
    loading: false
  };
  currentTrack = null;

  updateTimer = null;
  playlists = null;
  is_playing = false;
  likesSong = false;
  /**
   * Updates the UI
   * @async
   */
  update = async () => {
    try {
      //need to better parallelise this
      const newTrack = await currentPlayer(this.props.access_token);
      this.likesSong = await likesSong(this.props.access_token, newTrack.id);
      this.is_playing = newTrack.is_playing;
      if (
        this.currentTrack === null ||
        this.currentTrack.uri !== newTrack.Uri
      ) {
        this.setTrackContext(newTrack);
      }
      this.markInPlaylist();
      if (this.updateTimer === null)
        this.updateTimer = setInterval(this.update, 2000);
    } catch (error) {
      this.error(error);
    }
  };

  /**
   * Takes a spotify track object and displays the name and artist to the user
   *
   * @param {Spotify Track Object} currentTrack
   */
  setTrackContext = currentTrack => {
    this.currentTrack = currentTrack;
    let trackContext = currentTrack.name + " by ";
    currentTrack.artists.forEach(artist => {
      trackContext += " " + artist.name + ",";
    });
    //remove trailing comma
    trackContext = trackContext.slice(0, trackContext.length - 1);
    document.title = trackContext;
    this.setState(() => ({ trackContext }));
  };

  /**
   * gets a list of all users playlists and prints them on the DOM
   *
   * @async
   */
  getPlaylists = async () => {
    let showPlaylists = !this.state.showPlaylists;

    if (this.state.playlists === undefined) {
      try {
        const playlistsFetch = await this.playlists.getPlaylists(
          this.props.access_token
        );

        const playlists = playlistsFetch.items.map(item => ({
          ...item,
          selected: false
        }));
        this.setState({
          playlists
        });
      } catch (error) {
        this.error(error);
        //do not show playlists on error
        showPlaylists = false;
      }
    }

    this.setState(() => ({ showPlaylists }));
    this.addNewPlaylists();
  };

  /**
   * Adds new tracked playlists to the playlist array in the API class
   */
  addNewPlaylists = () => {
    if (this.state.trackedPlaylists.length > 0) {
      let promises = [];

      this.setState(() => ({
        getPlaylistsDisabled: true,
        updateDisabled: true,
        showTrackedPlaylists: true,
        loading: true
      }));

      this.state.trackedPlaylists.forEach(playlist => {
        if (playlist.loading) {
          promises.push(
            this.playlists.addPlaylistByID(
              this.props.access_token,
              playlist.id,
              playlist.name
            )
          );
        }
      });
      Promise.all(promises)
        .then(() => {})
        .catch(error => this.error(error))
        .finally(() => {
          this.setState(prevState => ({
            loading: false,
            trackedPlaylists: prevState.trackedPlaylists.map(pl => {
              pl.loading = false;
              return pl;
            })
          }));
        });
    }
  };

  //When the user clicks on a playlist it will become selected/unselected
  selectPlaylist = e => {
    try {
      e.persist();
      const { tagName, id, classList } = e.target;
      if (classList.contains("playlist-selection__item")) {
        const pl = this.state.playlists.find(pl => pl.id === id);
        const selected = !pl.selected;
        if (selected === true)
          this.setState(prevState => ({
            trackedPlaylists: [
              ...prevState.trackedPlaylists,
              {
                name: e.target.textContent,
                id: e.target.id,
                found: false,
                loading: true
              }
            ]
          }));
        else {
          this.setState(prevState => {
            return {
              trackedPlaylists: prevState.trackedPlaylists.filter(
                item => item.id !== e.target.id
              )
            };
          });
          this.playlists.removePlaylist(e.target.id);
        }

        this.setState(prevState => ({
          playlists: prevState.playlists.map(pl => {
            if (pl.id === id) return { ...pl, selected: !pl.selected };
            else return pl;
          })
        }));
      }
    } catch (error) {
      this.error(error);
    }
  };

  /**
   * Asks the API if current track is in playlist, if it is display that to the user,
   * adds remove and add buttons to each playlist in the tracked playlist list
   */
  markInPlaylist = () => {
    const inPlaylists = this.playlists.trackInPlaylists(this.currentTrack);
    const trackedPlaylists = this.state.trackedPlaylists;

    trackedPlaylists.forEach(child => {
      child.found = false;
    });

    inPlaylists.forEach(inPl => {
      const pl = trackedPlaylists.find(element => element.name === inPl.name);
      pl.found = true;
    });
  };

  addOrRemove = async e => {
    var target = e.target;
    var button, tr;
    while (target.tagName !== "TR") {
      if (target.tagName === "BUTTON") {
        button = target;
      }
      target = target.parentElement;
    }
    button.disabled = true;
    var tr = target;

    const playlist_id = tr.id;
    let track_uri = this.currentTrack.uri;
    let promise = null;
    try {
      if (button.classList.contains("remove")) {
        await this.playlists.removeTrackFromPlaylist(
          this.props.access_token,
          playlist_id,
          this.currentTrack
        );
      } else {
        await this.playlists.addTrackToPlaylist(
          this.props.access_token,
          playlist_id,
          this.currentTrack
        );
      }
      this.update().finally(() => {
        button.disabled = false;
      });
    } catch (error) {
      this.error(error);
    }
  };

  error = error => {
    console.log("this is the error" + error.message);
    if (error.message === "401") this.setState({ loginVisible: true });

    this.props.setErrorMsg(error);
  };

  componentDidMount() {
    let hash = location.hash;

    if (location.hash !== "") {
      this.setState(() => ({ loginVisible: false }));
    }
    hash = hash.replace("#", "?");
    const urlParams = new URLSearchParams(hash);

    this.playlists = new Playlists();
    const bearerToken = urlParams.get("access_token");
    this.props.setAccessToken(bearerToken);
  }

  render() {
    return (
      <>
        <CssBaseline>
          <Paper>
            <Header />
            <LoginBtn loginVisible={this.state.loginVisible} />
            <UpdateBtn update={this.update} />
            <PickPlaylistsBtn
              getPlaylists={this.getPlaylists}
              disabled={this.state.getPlaylistsDisabled}
            />
            <ErrorMsg />
            <TrackContext trackContext={this.state.trackContext} />

            {this.currentTrack !== null && (
              <Player
                bearerToken={this.props.access_token}
                is_playing={this.is_playing}
                likes_song={this.likesSong}
                id={this.currentTrack.id}
                update={this.update}
              />
            )}
            <Loading loading={this.state.loading} />
            <PlaylistSelection
              showPlaylists={this.state.showPlaylists}
              playlists={this.state.playlists}
              selectPlaylist={this.selectPlaylist}
            />
            <TrackedPlaylists
              trackedPlaylists={this.state.trackedPlaylists}
              currentTrack={this.currentTrack}
              addOrRemove={this.addOrRemove}
            />
          </Paper>
        </CssBaseline>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    access_token: state.userInfo.access_token
  };
};

const mapDispatchToProps = dispatch => ({
  setErrorMsg: error => dispatch(setErrorMsg(error)),
  resetErrorMsg: () => dispatch(resetErrorMsg()),
  setAccessToken: bearerToken => dispatch(setAccessToken(bearerToken))
});

export default connect(mapStateToProps, mapDispatchToProps)(SpotifyApp);
