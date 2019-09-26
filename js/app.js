import API from './api.js';

const getPlaylistsBtn = document.querySelector("#getPlaylistsBtn");
const playlistsDiv = document.querySelector("#playlists");
const loginButton = document.querySelector("#login");
const updateBtn = document.querySelector("#updateBtn");
const savePlaylistBtn = document.querySelector("#savePlaylistBtn");

let playlists = [];

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
        str += " " + artist.name;
      });
      trackEl.innerHTML = str;
      let promises = [];
      playlists.forEach(playlist => {
        promises.push(api.addPlaylistByID(playlist.id, playlist.name));
      });
      const inPlaylists = document.querySelector("#inPlaylists");
      inPlaylists.innerHTML = "Loading..."
      Promise.all(promises)
        .then(() => {
          const playlists = api.currentTrackInPlaylists();
          let html = "In playlists:\n"
          if (playlists.length > 0)
            playlists.forEach(playlist => {
              html += playlist.name + "\n";
            });
          else
            html = "Not in playlist";
          inPlaylists.innerHTML = html;
        })
        .catch(error => console.log(error));

    })
    .catch(error => console.log(error));
});

getPlaylistsBtn.addEventListener('click', () => {
  playlistsDiv.classList.toggle("hide");
  if (playlistsDiv.childElementCount === 0) {
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

//When the user clicks on a playlist it will become selected/unselected
playlistsDiv.addEventListener('click', e => {
  if (e.target.tagName === "P")
    e.target.classList.toggle("clicked");
  if (e.target.classList.contains("clicked"))
    playlists.push({
      name: e.target.innerHTML,
      id: e.target.id
    });
  else { //remove from api playlist and app playlist
    for (let index = 0; index < playlists.length; index++) {
      if (playlists[index].id === e.target.id)
        playlists.splice(index, 1);
    }
    api.removeFromPlaylist(e.target.id);
  }
})
