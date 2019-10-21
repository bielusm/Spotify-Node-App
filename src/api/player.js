import fetchToJson from "./util";

/**
 * [sets currentTrack as the current playing song]
 *
 * @sync
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
    const item = json.item;
    const currentTrack = {
      name: item.name,
      artists: item.artists,
      external_urls: item.external_urls,
      id: item.id,
      uri: item.uri,
      album: {
        name: item.album.name
      }
    };
    return currentTrack;
  } catch (error) {
    if (error.message == 204) throw new Error("No track playing");
    throw error;
  }
};
