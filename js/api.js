/**
 * API
 * @description Queries the Spotify API
 */
class API {
  constructor(bearerToken) {
    this.bearerToken = bearerToken;
    this.currentTrack = {
      name: null,
      artists: null,
      external_urls: null,
      id: null,
      uri: null,
      album: {
        name: null
      }
    };
    this.playlists = [];
    this.client_id = "4252feb807d04ced962e15f346258957";
  }


  /**
   * @function fetchToJson
   * @description Takes the parameters for a fetch request and converts the response to json
   * @param {string} url URL for the fetch request
   * @param {JSON} op  Options for the fetch request
   *
   * @return {Promise} Resolves with JSON when response.status === 200
   *                   Rejects response object otherwise
   */
  async fetchToJson(url, op) {
    const response = await fetch(url, op)
    const status = response.status;
    if (status != 200 && status != 201) {
      throw new Error(response.status);
    }
    const json = await response.json();
    return json;
  }
  /**
   * [sets currentTrack as the current playing song]
   * 
   * @sync
   * @return {Promise} [resolve on success reject on failure]
   *                   promise value will contain JSON data on success
   *                   and the API Response on failure
   */
  async currentPlayer() {
    try {
      const json = await this.fetchToJson("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          'Authorization': "Bearer " + this.bearerToken
        },
        method: "GET"
      });
      const item = json.item;
      this.currentTrack = {
        name: item.name,
        artists: item.artists,
        external_urls: item.external_urls,
        id: item.id,
        uri: item.uri,
        album: {
          name: item.album.name
        }
      };
      return json;
    } catch (error) {
      if (error.message == 204)
        throw new Error("No track playing");
      throw error;
    };
  }

  /**
   * [Gets information about user playlists and returns them  as a JSON object]
   * 
   * @sync
   * @return {[promise]} [Contains playlist object JSON on success]
   *                     and API response on failure
   */
  async getPlaylists() {
    const json = await this.fetchToJson('https://api.spotify.com/v1/me/playlists', {
      headers: {
        'Authorization': "Bearer " + this.bearerToken
      },
      method: "GET"
    });
    return json;
  }
  /**
   * Takes a ID and name of a playlist and saves/returns all of its tracks as JSON object
   *
   * @async
   * @param {int} ID   [the spotify ID of the playlist used to query the playlist]
   * @param {string} name [used to label the playlist]
   *
   * @return {Promise} Resolves with JSON on success, rejects with Error Object on failure
   */
  async addPlaylistByID(ID, name) {
    if (this.playlists.length > 0 && this.playlists.find(element => element.id === ID)) {
      return "already added";
    } else {
      let tracks = [];
      let param = "?fields=next,items(track(name,artists,external_urls,id,uri,album(name)))"
      let json = await this.fetchToJson(`https://api.spotify.com/v1/playlists/${ID}/tracks${param}`, {
        headers: {
          'Authorization': "Bearer " + this.bearerToken
        },
        method: "GET"
      });
      tracks.push(...json.items);
      const next = json['next'];
      if (next != null) {
        const response = await this.getNextTracks(ID, next, tracks)
        this.playlists.push({
          id: ID,
          tracks: tracks,
          name: name
        });
      } else {
        this.playlists.push({
          id: ID,
          tracks: tracks,
          name: name
        });
        return "success"
      }
    }
  }


  /**
   * Takes a URL from getNextTracks(ID, tracks) and fetches it,
   * this is used to deal with the fact that Spotify only returns 100 tracks at a time
   *
   * @async
   * @param {number} ID   ID of the Spotify playlist
   * @param {type} next   URL of the next playlist chunk to fetch
   * @param {type} tracks Array containing all tracks so far
   *
   * @return {type} Description
   */
  async getNextTracks(ID, next, tracks) {
    const json = await this.fetchToJson(next, {
      headers: {
        'Authorization': "Bearer " + this.bearerToken
      },
      method: "GET"
    });
    tracks.push(...json.items);
    next = json['next'];
    if (next != null)
      return this.getNextTracks(ID, next, tracks)
    else
      return;
  }


  /**
   * Calls the currentTrackInPlaylist(index)
   * function with an index to each playlist, see that function below for more info
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
   * Checks if a playlist at the given index contains the current playing song
   *
   * @param {Number} index The index of the Spotify playlist
   * @return {Boolean} True if the track does contain the playlist, false otherwise
   */
  currentTrackInPlaylist(index) {
    let equal = false;
    //TODO forEach is slow for this because it doesen't break the loop
    this.playlists[index].tracks.forEach(item => {
      if (item.track.uri === this.currentTrack.uri)
          equal = true;
      });
    return equal;
  }

  /**
   * Removes the playlist with the given playlist URI from the playlist array
   * 
   * @param {Number} id  The Spotify URI for the playlist
   */
  removeFromPlaylists(id) {
    for (let index = 0; index < this.playlists.length; index++) {
      if (this.playlists[index].id === id) {
        this.playlists.splice(index, 1);
        break;
      }
    }
  }

  /**
   *  Adds a given track to a given playlist
   * @async
   * @param {String} playlist_id Spotify URI identifier for the playlist
   * @param {String} track_uri Spotify URI for the track to be added
   * 
   * @return {Promise} Success of success and the error on failure 
   */
  async addTrackToPlaylist(playlist_id, track) {
    const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${track.uri}`;
    const op = {
      headers: {
        'Authorization': "Bearer " + this.bearerToken
      },
      method: "POST"
    };
    return this.fetchToJson(url, op);
  }

  /**
   * Takes a playlist URI and removes all instances of a given track URI from it
   * @async
   * @param {String} playlist_id 
   * @param {String} track_uri 
   * 
   * @return {Promise} An empty promise
   */
  async removeTrackFromPlaylist(playlist_id, track) {
    const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
    const op = {
      headers: {
        'Authorization': "Bearer " + this.bearerToken,
        'Content-Type': "application/json"
      },
      method: "DELETE",
      body: JSON.stringify({
        "tracks": [{
          "uri": track.uri
        }]
      })
    };
    return await this.fetchToJson(url, op);

  }

}


export default API;