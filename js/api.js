class API {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
    this.currentTrackUri = null;
    this.playlists = [];
    this.client_id = "4252feb807d04ced962e15f346258957";
  }

  //sets currentTrackUri as the spotify uri of the current playing song
  currrentPlayer() {
    return new Promise((resolve, reject) => {
      fetch("https://api.spotify.com/v1/me/player", {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(response => this.checkStatus(response))
        .then(data =>
          if (data === "")
            reject("Nothing is playing"); //TODO needs testing
          return data;
        .then((json) => {
          this.currentTrackUri = json.item.uri;
          resolve(json.item);
        })
        .catch((error) => reject(error));
    });
  }

  //returns a json object containing information about all users playlists
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
        .catch(error => {
          reject(error);
        });
    });
  }

  //checks the status code and rejects/resolves based on it
  checkStatus(response) {
    return new Promise((resolve, reject) => {

      if (response.status === 401 || response.status === 429)
        reject(response);
      else
        resolve(response);
    });
  }

  //takes a ID and name of a playlist and saves/returns all of its tracks
  //the name variable is only used as a label
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
                .catch(error => reject(error));
            } else {
              this.playlists.push({
                id: ID,
                tracks: tracks,
                name: name
              });
              resolve("fetch finished");
            }
          })
          .catch((error) => reject(error));
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
            .catch(error => reject(error));
          else
            return resolve("fetch finished");
        })
        .catch((error) => reject(error));
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
