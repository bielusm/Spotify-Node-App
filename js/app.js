import API from './api.js';

const getPlaylistsBtn = document.querySelector("#getPlaylistsBtn");
const playlistsDiv = document.querySelector("#playlists");
const loginButton = document.querySelector("#login");
const updateBtn = document.querySelector("#updateBtn");
const savePlaylistBtn = document.querySelector("#savePlaylistBtn");

let playlistIDs = [];

let hash = location.hash;
hash = hash.replace("#", "?");
const urlParams = new URLSearchParams(hash);

const api = new API(urlParams.get('access_token'));

loginButton.addEventListener('click', () => {
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=4252feb807d04ced962e15f346258957&response_type=token&redirect_uri=http://localhost:3000/index.html&scope=user-read-playback-state%20playlist-read-private';
});

updateBtn.addEventListener('click', () => {
  const trackEl = document.querySelector("#currentTrack");
  trackEl.classList.remove("hide");
  api.currrentPlayer()
    .then(currTrack => {
      let str = currTrack.name + " by ";
      currTrack.artists.forEach(artist => {
        str += artist.name;
      });
      trackEl.innerHTML = str;
      let promises = [];
      playlistIDs.forEach(id=>{
        promises.push(api.addPlaylistByID(id));
      });
      const inPlaylists = document.querySelector("#inPlaylists");
      inPlaylists.innerHTML = "Loading..."
      Promise.all(promises)
      .then(() =>{
        let ids = api.currentTrackInPlaylists();
        let html = "In playlists:\n"
        if(ids.length > 0)
          ids.forEach(id => {
            html += id + "\n";
          });
        else
          html = "Not in playlist";
        inPlaylists.innerHTML = html;
      })
      .catch(error=>console.log(error));

    })
    .catch(error => console.log(error));
});

getPlaylistsBtn.addEventListener('click', () => {
  playlistsDiv.classList.toggle("hide");
  if(playlistsDiv.childElementCount === 0)
  {
  api.getPlaylists()
    .then(playlists => {
      playlists.items.forEach(playlist => {
        const playlistBtnLabel = document.createElement("p");
        playlistBtnLabel.classList.add("playlist");
        playlistBtnLabel.innerText = playlist.name;
        playlistBtnLabel.id = playlist.id;
        playlistsDiv.appendChild(playlistBtnLabel);
      })
    })
  }
});


playlistsDiv.addEventListener('click', e=>{
  if(e.target.tagName === "P")
    e.target.classList.toggle("clicked");
  if(e.target.classList.contains("clicked"))
    playlistIDs.push(e.target.id);
})
