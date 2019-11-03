import { fetchToJson } from "./util";

/**
 * [sets currentTrack as the current playing song]
 *
 * @async
 * @param {string} bearerToken returned from the inital Spotify API call
 * @return {Promise} A track object, keeping the properties
 * {name, artists, external_uris, id, uri, album{name}}
 * for more info on the track object see
 * https://developer.spotify.com/documentation/web-api/reference/object-model/
 */
export const currentPlayer = async bearerToken => {
  try {
    const json = await fetchToJson(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + bearerToken
        },
        method: "GET"
      }
    );

    //This case happens when the user skips to no track
    const item = json.item;
    if (item === null) throw new Error(204);

    const currentTrack = {
      name: item.name,
      artists: item.artists,
      external_urls: item.external_urls,
      id: item.id,
      uri: item.uri,
      album: {
        name: item.album.name
      },
      is_playing: json.is_playing
    };
    return currentTrack;
  } catch (error) {
    if (error.message == 204) throw new Error("No track playing");
    throw error;
  }
};
/**
 * Pauses the users playback
 * @param {string} bearerToken returned from the inital Spotify API call
 * @returns {promise} any error message
 */
export const pausePlayer = async bearerToken => {
  try {
    const json = await fetchToJson(
      "https://api.spotify.com/v1/me/player/pause",
      {
        headers: {
          Authorization: "Bearer " + bearerToken
        },
        method: "PUT"
      }
    );
  } catch (error) {
    if (error.message != 204) throw error;
  }
};

/**
 * Starts the users playback
 * @param {string} bearerToken returned from the inital Spotify API call
 * @returns {promise} any error message
 */
export const startPlayer = async bearerToken => {
  try {
    const json = await fetchToJson(
      "https://api.spotify.com/v1/me/player/play",
      {
        headers: {
          Authorization: "Bearer " + bearerToken
        },
        method: "PUT"
      }
    );
  } catch (error) {
    if (error.message != 204) throw error;
  }
};

/**
 * Skip user to next track
 * @param {string} bearerToken returned from the inital Spotify API call
 * @returns {promise} any error message
 */
export const nextTrack = async bearerToken => {
  try {
    const json = await fetchToJson(
      "https://api.spotify.com/v1/me/player/next",
      {
        headers: {
          Authorization: "Bearer " + bearerToken
        },
        method: "POST"
      }
    );
  } catch (error) {
    if (error.message != 204) throw error;
  }
};

/**
 * Goes to previous track
 * @param {string} bearerToken returned from the inital Spotify API call
 * @returns {promise} any error message
 */
export const prevTrack = async bearerToken => {
  try {
    const json = await fetchToJson(
      "https://api.spotify.com/v1/me/player/previous",
      {
        headers: {
          Authorization: "Bearer " + bearerToken
        },
        method: "POST"
      }
    );
  } catch (error) {
    if (error.message != 204) throw error;
  }
};

export const likesSong = async (bearerToken, songID) => {
  const json = await fetchToJson(
    `https://api.spotify.com/v1/me/tracks/contains?ids=${songID}`,
    {
      headers: {
        Authorization: "Bearer " + bearerToken
      },
      method: "GET"
    }
  );

  return json[0];
};

export const modifyLibrary = async (bearerToken, songID, remove) => {
  const method = remove ? "DELETE" : "PUT";
  const response = fetch(`https://api.spotify.com/v1/me/tracks?ids=${songID}`, {
    headers: {
      Authorization: "Bearer " + bearerToken
    },
    method
  });
  //TODO check error
};
