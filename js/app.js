import API from './api.js';

const getPlaylistsBtn = document.querySelector("#getPlaylistsBtn");
const playListCheckList = document.querySelector("#playListCheckList");
const loginButton = document.querySelector("#login");
const currentTrackBtn = document.querySelector("#currentTrackBtn");
const savePlaylistBtn = document.querySelector("#savePlaylistBtn");
let hash = location.hash;
hash = hash.replace("#", "?");
const urlParams = new URLSearchParams(hash);

const api = new API(urlParams.get('access_token'));

loginButton.addEventListener('click', () => {
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=4252feb807d04ced962e15f346258957&response_type=token&redirect_uri=http://localhost:3000/index.html&scope=user-read-playback-state%20playlist-read-private';
});

currentTrackBtn.addEventListener('click', () => {
  api.currrentPlayer()
    .then(currTrack => {
      let str = currTrack.name + " by ";
      currTrack.artists.forEach(artist => {
        str += artist.name;
      });
      const trackEl = document.querySelector("#currentTrack");
      trackEl.innerHTML = str;
    })
    .catch(error => console.log(error));
});

getPlaylistsBtn.addEventListener('click', () => {
  api.getPlaylists()
    .then(playlists => {
      playlists.items.forEach(playlist => {
        const playlistBtnLabel = document.createElement("p");
        playlistBtnLabel.classList.add("playlist");
        playlistBtnLabel.innerText = playlist.name;
        playlistBtnLabel.id = playlist.id;
        playListCheckList.appendChild(playlistBtnLabel);
      })
    })
});

savePlaylistBtn.addEventListener('click', e => {
  //e.preventDefault();
  const playListCheckList = document.querySelector("#playListCheckList");
  console.log(playListCheckList);
  let nodes = playListCheckList.childNodes;
  nodes.forEach(item=>{
    if(item.nodeType === Node.ELEMENT_NODE)
    if(item.classList.contains("clicked"))
      console.log(item);
  });
});


playListCheckList.addEventListener('click', e=>{
  if(e.target.tagName === "P")
    e.target.classList.toggle("clicked");
})
