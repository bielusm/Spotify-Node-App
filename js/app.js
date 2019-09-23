import API from './api.js';


const everything = "78capR2HryfdSE2JallXDb";
const rap = "4TL6CsXn7AFFrgMWMxq1XL";
let hash = location.hash;
hash = hash.replace("#", "?");
const urlParams = new URLSearchParams(hash);
const api = new API(urlParams.get('access_token'));
  api.addPlaylistByID(everything)
  .then(() => api.addPlaylistByID(rap))
  .then(() => api.currrentPlayer())
  .then(() => api.currentTrackInPlaylists())
  .catch(error => console.log(error));
