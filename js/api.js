class API {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
    this.currentTrackUri = null;
    this.playlists = [];
    this.client_id = "4252feb807d04ced962e15f346258957";
  }

  /**
   * [sets currentTrackUri as the spotify uri of the current playing song]
   * @return {Promise} [resolve on success reject on failure]
   *                   promise value will contain json data on success
   *                   and the api response on failure
   */
  currentPlayer() {
    return new Promise((resolve, reject) => {
      fetch("https://api.spotify.com/v1/me/player", {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(response => {
          if(response.status === 204)
          {
            reject("Error: no track playing");
          }
          return response;
        })
        .then(response => this.checkStatus(response))
        .then(data => data.json())
        .then((json) => {
          this.currentTrackUri = json.item.uri;
          resolve(json);
        })
        .catch((error) => reject(new Error(error)));
    });
  }

  /**
   * [Gets user playlists]
   * @return {[promise]} [contains playlist object json on success]
   *                     and api response on failure
   */
  getPlaylists() {
    return new Promise((resolve, reject) => {
      fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(response => this.checkStatus(response))
        .then(data => data.json())
        .then(json => {
          resolve(json);
        })
        .catch(error => reject(new Error(error)));
    });
  }

  /**
   * [checkStatus checks the status code and rejects/resolves based on it]
   * @param  {API response object} response [the api response, needed for response.status]
   * @return {Promise}          [reject on bad status, resolve otherwise, value always contains response]
   */
  checkStatus(response) {
    return new Promise((resolve, reject) => {
      switch(response.status)
      {
        case 401:
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
   * [takes a ID and name of a playlist and saves/returns all of its tracks]
   * @param {int} ID   [the spotify id of the playlist used to query the playlist]
   * @param {the name of the playlist} name [used to label the playlist]
   */
  addPlaylistByID(ID, name) {
    return new Promise((resolve, reject) => {
      if (this.playlists.length > 0 && this.playlists.find(element => element.id === ID)) {
        resolve("already added");
      } else {
        let tracks = [];
        let param = "?fields=next,items(track(name,artists,external_urls,id,uri,album(name)))"
        fetch(`https://api.spotify.com/v1/playlists/${ID}/tracks${param}`, {
            headers: {
              'Authorization': "Bearer " + this.bearerToken
            },
            method: "GET"
          })
          .then(response => this.checkStatus(response))
          .then(data => data.json())
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

  //this function takes a URL from getNextTracks(ID, tracks) and fetches it, this is used to deal with the fact that spotify only returns 100 tracks at a time
  getNextTracks(ID, next, tracks) {
    return new Promise((resolve, reject) => {
      fetch(next, {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(response => this.checkStatus(response))
        .then(data => data.json())
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
