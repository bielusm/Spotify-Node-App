import API from './api.js'

const getPlaylistsBtn = document.querySelector("#getPlaylistsBtn");
const playlistsDiv = document.querySelector("#playlistSelection");
const loginButton = document.querySelector("#login");
const updateBtn = document.querySelector("#updateBtn");
const savePlaylistBtn = document.querySelector("#savePlaylistBtn");
const trackedPlaylists = document.querySelector("#trackedPlaylists");

let currentTrack = null;
let playlists = [];
let updatingPlaylists = false;

let hash = location.hash;

if (location.hash !== "") {
  loginButton.classList.add("d-none");

}
hash = hash.replace("#", "?");
const urlParams = new URLSearchParams(hash);

const api = new API(urlParams.get('access_token'));

//Redirects user to spotify auth link
loginButton.addEventListener('click', () => {
  const scope = "playlist-modify-public%20user-read-playback-state%20playlist-read-private%20playlist-modify-private";
  const url = `https://accounts.spotify.com/authorize?client_id=4252feb807d04ced962e15f346258957&response_type=token&redirect_uri=http://localhost:3000/index.html&scope=${scope}&show_dialog=false`;
  console.log(url);
  window.location.href = url;
});

//Listens to the update button and calls the update method when its clicked
updateBtn.addEventListener('click', () => {
  update();
});


let updateTimer = null;
/**
 * Updates the UI
 * @async
 */
const update = async () => {
  try {
    const json = await api.currentPlayer();
    let currTrack = json.item;
    let newTrackUri = currTrack.uri;
    if (currentTrack === null || currentTrack.uri !== newTrackUri) {
      setTrackContext(currTrack);
    }
    markInPlaylist();
    if (updateTimer === null)
      updateTimer = setInterval(update, 2000);
    success();
  } catch (msg) {
    error(msg);
  }
};

/**
 * Asks the API if current track is in playlist, if it is display that to the user,
 * adds remove and add buttons to each playlist in the tracked playlist list
 */
const markInPlaylist = () => {
  const inPlaylists = api.currentTrackInPlaylists();
  const ul = document.querySelector("#trackedPlaylists ul")
  const children = Array.from(ul.children);
  children.forEach(child => {
    if (child.tagName === "LI") {
      child.classList.remove("found");
    const btn = child.firstElementChild;
    btn.className = "add btn btn-success";
    btn.innerText = "Add";
    }
  });
  inPlaylists.forEach(inPl => {
    const pl = trackedPlaylists.querySelector("." + inPl.name.replace(/ /g, "-"));
    pl.classList.add("found");
    const btn = pl.firstElementChild;
    btn.className = "remove btn btn-danger";
    btn.innerText = "Remove";
  });
}

/**
 * Takes a spotify track object and displays the name and artist to the user
 * 
 * @param {Spotify Track Object} currTrack 
 */
const setTrackContext = (currTrack) => {
  const trackEl = document.querySelector("#currentTrack");
  trackEl.classList.remove("d-none");
  currentTrack = currTrack;
  let trackContext = currTrack.name + " by ";
  currTrack.artists.forEach(artist => {
    trackContext += " " + artist.name + ",";
  });
  //remove trailing comma
  trackContext = trackContext.slice(0, trackContext.length - 1)
  trackEl.innerHTML = trackContext;
};

/**
 * gets a list of all users playlists and prints them on the DOM
 * 
 * @async
 */
getPlaylistsBtn.addEventListener('click', async () => {
  playlistsDiv.classList.toggle("d-none");
  if (playlistsDiv.childElementCount === 0) {
    try {
      const playlists = await api.getPlaylists()
      playlists.items.forEach(playlist => {      
        const plName = playlist.name.replace(/ /g, "-");

        const html = 
        `<a id="${playlist.id}"class="playlist ${plName} list-group-item list-group-item-action">${playlist.name}</a>`
        playlistsDiv.innerHTML += html;
      })
      success();
    } catch (msg) {
      error(msg)
    };
  }

  if (playlistsDiv.classList.contains("d-none")) {
    let promises = [];
  
    if (playlists.length > 0) {
      getPlaylistsBtn.disabled = true;
      updateBtn.disabled = true;
      const trackedHeader = document.querySelector("#trackedPlaylists h2");
      trackedHeader.classList.remove("d-none");
      const playlistUl = document.querySelector("#trackedPlaylists .list-group");
      playlistUl.innerHTML = "";
      playlists.forEach(playlist => {
        promises.push(api.addPlaylistByID(playlist.id, playlist.name));
        const plName = playlist.name.replace(/ /g, "-");
        const html = `
        <li id="${playlist.id}" class="d-flex justify-content-between list-group-item ${plName}">${playlist.name}<button class="btn btn-danger"></button></li>`
        playlistUl.innerHTML += html;
      });
      const loading = document.querySelector(".loadingStatus");
      loading.classList.remove("d-none");
      updatingPlaylists = true;
      Promise.all(promises)
        .then(() => {
          loading.classList.add("d-none");
          getPlaylistsBtn.disabled = false;
          updateBtn.disabled = false;
        })
        .catch(msg => error(msg));
    }
  }
});

//When the user clicks on a playlist it will become selected/unselected
playlistsDiv.addEventListener('click', e => {
  try {
  if (e.target.tagName === "A")
    e.target.classList.toggle("active");
  if (e.target.classList.contains("active"))
    playlists.push({
      name: e.target.innerHTML,
      id: e.target.id
    });
  else { //remove from api playlist and app playlist
    for (let index = 0; index < playlists.length; index++) {
      if (playlists[index].id === e.target.id)
        playlists.splice(index, 1);
    }
      api.removePlaylist(e.target.id);
  }
  } catch (err) {
    error(err)
  }
});

//clears the error msg on success
const success = (() => {
  const errMsg = document.querySelector("#errMsg");
  errMsg.innerText = "";
});



trackedPlaylists.addEventListener('click', async e => {
  if (e.target.tagName === "BUTTON") {
      const playlist_id = e.target.parentElement.id;
      let track_uri = currentTrackUri;
      let promise = null;
      try {
      if (e.target.classList.contains("remove")) {
        await api.removeTrackFromPlaylist(playlist_id, track_uri);
      } else {
        await api.addTrackToPlaylist(playlist_id, track_uri);
      }

    } catch (err) {
      error(err)
    }
  }
});



const showLoginBtn = (() => {
  const loginButton = document.querySelector("#login");
  loginButton.classList.remove("d-none");
});

//handles error msgs given from rejected promises
const error = (error => {
  console.log(error);
  const errLoc = document.querySelector("#errMsg");
  let msg = error.message;
  if (!isNaN(msg)) {
    const status = parseInt(msg);
    switch (status) {
      case 401:
        msg = "Please login, sessions are only valid for one hour";
        showLoginBtn();
        break;
      case 429:
        msg = "Error: too many requests to spotify api, please wait a little and try again";
        break;
      default: {
        msg = status;
      }
    }
  }

  errLoc.innerText = msg;
});