import fetchToJson from "./util";

/**
 * Playlist
 * @description A container
 */
export default class Playlist {
  playlists = [];

  /**
   * [Gets information about user playlists and returns them  as a JSON object]
   *
   * @sync
   * @return {[promise]} [Contains playlist object JSON on success]
   *                     and API response on failure
   */
  async getPlaylists(bearerToken) {
    const json = await fetchToJson("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: "Bearer " + bearerToken
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
  async addPlaylistByID(bearerToken, ID, name) {
    if (
      this.playlists.length > 0 &&
      this.playlists.find(element => element.id === ID)
    ) {
      return "already added";
    } else {
      let tracks = [];
      let param =
        "?fields=next,items(track(name,artists,external_urls,id,uri,album(name)))";
      let json = await fetchToJson(
        `https://api.spotify.com/v1/playlists/${ID}/tracks${param}`,
        {
          headers: {
            Authorization: "Bearer " + bearerToken
          },
          method: "GET"
        }
      );
      tracks.push(...json.items);
      const next = json["next"];
      if (next != null) {
        const response = await this.getNextTracks(
          bearerToken,
          ID,
          next,
          tracks
        );
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
        return "success";
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
  async getNextTracks(bearerToken, ID, next, tracks) {
    const json = await fetchToJson(next, {
      headers: {
        Authorization: "Bearer " + bearerToken
      },
      method: "GET"
    });
    tracks.push(...json.items);
    next = json["next"];
    if (next != null) return this.getNextTracks(bearerToken, ID, next, tracks);
    else return;
  }

  /**
   * Calls the currentTrackInPlaylist(index, track)
   * function with an index to each playlist, see that function below for more info
   * @param {track object} The track to be checked
   *
   *
   * @return {Array} An array of playlist IDs that contain the currents song
   */
  trackInPlaylists(track) {
    let ids = [];
    let index = 0;
    this.playlists.forEach(playlist => {
      if (this.trackInPlaylist(index, track)) ids.push(playlist);
      index++;
    });
    return ids;
  }

  /**
   * Checks if a playlist at the given index contains the current playing song
   *
   * @param {Number} index The index of the Spotify playlist
   * @param {Track Object} the track to be checked, needs a URI property
   * @return {Boolean} True if the track does contain the playlist, false otherwise
   */
  trackInPlaylist(index, track) {
    let equal = false;
    //TODO forEach is slow for this because it doesen't break the loop
    this.playlists[index].tracks.forEach(item => {
      if (item.track.uri === track.uri) equal = true;
    });
    return equal;
  }

  /**
   *  Adds a given track to a given playlist
   * @async
   * @param {String} playlist_id Spotify URI identifier for the playlist
   * @param {String} track_uri Spotify URI for the track to be added
   *
   * @return {Promise} Success of success and the error on failure
   */
  async addTrackToPlaylist(bearerToken, playlist_id, track) {
    const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${track.uri}`;
    const op = {
      headers: {
        Authorization: "Bearer " + bearerToken
      },
      method: "POST"
    };
    this.addTrackToCache(playlist_id, track);
    return fetchToJson(url, op);
  }

  /**
   * Takes a playlist URI and removes all instances of a given track URI from it
   * @async
   * @param {String} playlist_id
   * @param {String} track_uri
   *
   * @return {Promise} An empty promise
   */
  async removeTrackFromPlaylist(bearerToken, playlist_id, track) {
    const url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`;
    const op = {
      headers: {
        Authorization: "Bearer " + bearerToken,
        "Content-Type": "application/json"
      },
      method: "DELETE",
      body: JSON.stringify({
        tracks: [
          {
            uri: track.uri
          }
        ]
      })
    };
    this.removeTrackFromCache(playlist_id, track);
    return await fetchToJson(url, op);
  }

  /**
   * Removes the playlist with the given playlist URI from the playlist array
   *
   * @param {Number} id  The Spotify URI for the playlist
   */
  removePlaylist(id) {
    const index = this.indexOfPlaylist(id);
    this.playlists.splice(index, 1);
  }

  /**
   * Finds the index of a playlist with the given playlist ID
   *
   * @param {Number} id
   */
  indexOfPlaylist(id) {
    for (let index = 0; index < this.playlists.length; index++) {
      if (this.playlists[index].id === id) return index;
    }
  }

  /**
   * Takes a track object and adds it to the array of all playlists
   *
   * @param {string} playlist_id the Spotify URI of the playlist
   * @param {Spotify track object} track
   */
  addTrackToCache(playlist_id, track) {
    const index = this.indexOfPlaylist(playlist_id);
    this.playlists[index].tracks.push({
      track
    });
  }

  /**
   * Takes a track object and removes it from the array of all playlists
   *
   * @param {string} playlist_id
   * @param {Spotify track object} track
   */
  removeTrackFromCache(playlist_id, track) {
    const index = this.indexOfPlaylist(playlist_id);
    this.playlists[index].tracks = this.playlists[index].tracks.filter(item => {
      return item.track.uri !== track.uri;
    });
  }
}
