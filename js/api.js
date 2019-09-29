/**
 * API
 * @description Queries the Spotify API
 */
class API {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
    this.currentTrackUri = null;
    this.playlists = [];
    this.client_id = "4252feb807d04ced962e15f346258957";
  }


  /**
   * @function fetchToJson
   * @description Takes the parameters for a fetch request and converts the response to json
   * @access private | public
   *
   * @param {string} url URL for the fetch request
   * @param {JSON} op  Options for the fetch request
   *
   * @return {Promise} Resolves with JSON when response.status === 200
   *                   Rejects response object otherwise
   */
  async fetchToJson(url, op) {
    const response = await fetch(url, op)
    if (response.status != 200)
      reject(response);
    const json = await response.json();
    return json;
  }
  /**
   * [sets currentTrackUri as the spotify URI of the current playing song]
   * @return {Promise} [resolve on success reject on failure]
   *                   promise value will contain JSON data on success
   *                   and the API Response on failure
   */
  currentPlayer() {
    return new Promise((resolve, reject) => {
      const url = "https://api.spotify.com/v1/me/player/currently-playing";
      this.fetchToJson("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then((json) => {
          this.currentTrackUri = json.item.uri;
          resolve(json);
        })
        .catch((response) => {
          if (response.status = 204)
            reject("No track playing");
          reject(new Error(response.status));
        });
    });
  }

  /**
   * [Gets information about user playlists and returns them  as a JSON object]
   * @return {[promise]} [Contains playlist object JSON on success]
   *                     and API response on failure
   */
  getPlaylists() {
    return new Promise((resolve, reject) => {
      this.fetchToJson('https://api.spotify.com/v1/me/playlists', {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(json => {
          resolve(json);
        })
        .catch(error => reject(new Error(error)));
    });
  }

  /**
   * [checkStatus checks the status code and rejects/resolves based on it]
   * @param  {API response object} response [the API response, needed to check the response status]
   * @return {Promise}          [Reject on bad status, resolve otherwise, value always contains response]
   */
  checkStatus(response) {
    return new Promise((resolve, reject) => {

      switch (response.status) {
        case 401:
          //TODO should put this in app.js
          const loginButton = document.querySelector("#login");
          loginButton.classList.remove("hide");
          reject("Error: you need to login/relogin to spotify");
          break;
        case 429:
          reject("Error: too many requests to spotify api, please wait a little and try again");
          break;

        default:
          resolve(response);
          break;
      }
    });
  }

  /**
   * @function addPlaylistByID
   * @description Takes a ID and name of a playlist and saves/returns all of its tracks as JSON object
   *
   * @param {int} ID   [the spotify ID of the playlist used to query the playlist]
   * @param {string} name [used to label the playlist]
   *
   * @return {Promise} Resolves with JSON on success, rejects with Error Object on failure
   */
  addPlaylistByID(ID, name) {
    return new Promise((resolve, reject) => {
      if (this.playlists.length > 0 && this.playlists.find(element => element.id === ID)) {
        resolve("already added");
      } else {
        let tracks = [];
        let param = "?fields=next,items(track(name,artists,external_urls,id,uri,album(name)))"
        this.fetchToJson(`https://api.spotify.com/v1/playlists/${ID}/tracks${param}`, {
            headers: {
              'Authorization': "Bearer " + this.bearerToken
            },
            method: "GET"
          })
          .then((json) => {
            tracks.push(json.items);
            const next = json['next'];
            if (next != null) {
              this.getNextTracks(ID, next, tracks)
                .then(response => {
                  this.playlists.push({
                    id: ID,
                    tracks: tracks,
                    name: name
                  });
                  resolve(response);
                })
                .catch(error => reject(new Error(error)));
            } else {
              this.playlists.push({
                id: ID,
                tracks: tracks,
                name: name
              });
              resolve("fetch finished");
            }
          })
          .catch((error) => reject(new Error(error)));
      }
    });
  }


  /**
   * @function getNextTracks
   * @description Takes a URL from getNextTracks(ID, tracks) and fetches it,
   *              this is used to deal with the fact that Spotify only returns 100 tracks at a time
   * @param {number} ID   ID of the Spotify playlist
   * @param {type} next   URL of the next playlist chunk to fetch
   * @param {type} tracks Array containing all tracks so far
   *
   * @return {type} Description
   */
  getNextTracks(ID, next, tracks) {
    return new Promise((resolve, reject) => {
      this.fetchToJson(next, {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then((json) => {
          tracks.push(json.items);
          const next = json['next'];
          if (next != null)
            this.getNextTracks(ID, next, tracks)
            .then(response => resolve(response))
            .catch(error => reject(new Error(error)));
          else
            return resolve("fetch finished");
        })
        .catch((error) => reject(new Error(error)));
    })
  }


  /**
   * @function currentTrackInPlaylists
   * @description Calls the currentTrackInPlaylist(index)
   *              function with an index to each playlist, see that function below for more info
   *
   * @return {Array} An array of playlist IDs that contain the currents song
   */
  currentTrackInPlaylists() {
    let ids = [];
    let index = 0;
    this.playlists.forEach(playlist => {
      if (this.currentTrackInPlaylist(index))
        ids.push(playlist);
      index++;
    });
    return ids;
  }


  /**
   * @function currentTrackInPlaylist
   * @description Checks if a playlist at the given index contains the current playing song
   *
   * @param {Number} index The index of the Spotify playlist
   *
   * @return {Boolean} True if the track does contain the playlist, false otherwise
   */
  currentTrackInPlaylist(index) {
    let equal = false;
    this.playlists[index].tracks.forEach(playlist => {
      playlist.forEach(subPlaylist => {
        if (subPlaylist.track.uri === this.currentTrackUri)
          equal = true;
      });
    });
    return equal;
  }

  removeFromPlaylist(id) {
    for (let index = 0; index < this.playlists.length; index++) {
      if (this.playlists[index].id === id) {
        this.playlists.splice(index, 1);
        break;
      }
    }
  }
}

export default API;
