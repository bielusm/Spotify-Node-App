//check fetch request for token type
class API {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
    this.currentTrackUri = null;
    this.playlists = [];
    this.client_id = "4252feb807d04ced962e15f346258957";
  }

  currrentPlayer() {
    return new Promise((resolve, reject) => {
      fetch("https://api.spotify.com/v1/me/player", {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(data => data.json())
        .then((json) => {
          if (json === "")
            reject("Nothing is playing");
          this.currentTrackUri = json.item.uri;
          resolve(json.item);
        })
        .catch((error) => reject(error));
    });
  }
  getPlaylists() {
    return new Promise((resolve, reject) => {
      fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
        .then(data => data.json())
        .then((json) => {
          resolve(json);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

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

  getNextTracks(ID, next, tracks) {
    return new Promise((resolve, reject) => {
      fetch(next, {
          headers: {
            'Authorization': "Bearer " + this.bearerToken
          },
          method: "GET"
        })
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
