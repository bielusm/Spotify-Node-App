import API from './api.js'

const getPlaylistsBtn = document.querySelector("#getPlaylistsBtn");
const playlistsDiv = document.querySelector("#playlistSelection");
const loginButton = document.querySelector("#login");
const updateBtn = document.querySelector("#updateBtn");
const savePlaylistBtn = document.querySelector("#savePlaylistBtn");
const trackingPlaylists = document.querySelector("#trackedPlaylists");

let currentTrackUri = null;
let playlists = [];
let updatingPlaylists = false;

let hash = location.hash;

if (location.hash !== "") {
  loginButton.classList.add("hide");

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

updateBtn.addEventListener('click', () => {
  update();
});


let updateTimer = null;
const update = () => {
  api.currentPlayer()
    .then(json => {
      let currTrack = json.item;
      let newTrackUri = currTrack.uri;
      return new Promise((resolve, reject) => {
          if (currentTrackUri !== newTrackUri) {
            setTrackContext(currTrack);
          }
          markInPlaylist();
          if (updateTimer === null)
            updateTimer = setInterval(update, 2000);
          resolve();
        })
        .then(success())
        .catch(msg => error(msg));
    })
    .then(success())
    .catch(msg => error(msg));
};

const markInPlaylist = () => {
  const inPlaylists = api.currentTrackInPlaylists();
  const children = trackingPlaylists.childNodes;
  children.forEach(child => {
    if (child.tagName === "LI")
      child.classList.remove("found");
    const btn = child.firstElementChild;
    btn.className = "add";
    btn.innerText = "Add";
  });
  inPlaylists.forEach(inPl => {
    const pl = trackingPlaylists.querySelector("." + inPl.name.replace(/ /g, "-"));
    pl.classList.add("found");
    const btn = pl.firstElementChild;
    btn.className = "remove";
    btn.innerText = "Remove";
  });
}

const setTrackContext = (currTrack) => {
  const trackEl = document.querySelector("#currentTrack");
  trackEl.classList.remove("hide");
  currentTrackUri = currTrack.uri;
  let trackContext = currTrack.name + " by ";
  currTrack.artists.forEach(artist => {
    trackContext += " " + artist.name + ",";
  });
  trackContext = trackContext.slice(0, trackContext.length - 1)
  trackEl.innerHTML = trackContext;
};
//gets a list of all users playlists and prints them on the DOM
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
          playlistBtnLabel.classList.add(playlist.name.replace(/ /g, "-"));
          const addRmBtn = document.createElement("button");
          playlistsDiv.appendChild(playlistBtnLabel);
        })
      })
      .then(success())
      .catch(msg => error(msg));
  }

  if (playlistsDiv.classList.contains("hide")) {
    let promises = [];
    const trackingPlaylists = document.querySelector("#trackedPlaylists");
    const title = document.createElement("h2");
    while (trackingPlaylists.firstChild) {
      trackingPlaylists.firstChild.remove();
    }

    title.innerText = "Tracking Playlists\n";
    trackingPlaylists.append(title);

    if (playlists.length > 0) {
      getPlaylistsBtn.disabled = true;
      updateBtn.disabled = true;
      playlists.forEach(playlist => {
        promises.push(api.addPlaylistByID(playlist.id, playlist.name));
        let pl = document.createElement("li");
        pl.id = playlist.id;
        pl.classList.add(playlist.name.replace(/ /g, "-"));
        pl.innerText = playlist.name;
        let btn = document.createElement("button")
        btn.classList.add("hide");
        btn.innerText = "Remove";
        pl.append(btn);

        trackingPlaylists.append(pl)
      });

      inPlaylists.innerHTML = "Loading..."
      updatingPlaylists = true;
      Promise.all(promises)
        .then(() => {
          inPlaylists.innerHTML = ""
          getPlaylistsBtn.disabled = false;
          updateBtn.disabled = false;
        })
        .catch(msg => error(msg));
    }
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
    api.removeFromPlaylists(e.target.id);
  }
});

//clears the error msg on success
const success = (() => {
  const errMsg = document.querySelector("#errMsg");
  errMsg.innerText = "";
});

trackedPlaylists.addEventListener('click', e => {
  if (e.target.tagName === "BUTTON") {
    const playlist_id = e.target.parentElement.id;
    let track_uri = currentTrackUri;

    if (e.target.className == "remove") {
      removeTrackFromPlaylist(playlist_id, track_uri);
    } else {
      console.log(e.target);
      addTrackToPlaylist(playlist_id, track_uri);
    }
  }
});


const addTrackToPlaylist = ((playlist_id,track_uri) => {
  api.addTrackToPlaylist(playlist_id,track_uri)
  .then(() => console.log("Successfully added"))
  .catch(err => error(err));
});
const removeTrackFromPlaylist = (id => {
  console.log(id);
});



const showLoginBtn = (() => {
  const loginButton = document.querySelector("#login");
  loginButton.classList.remove("hide");
});

//handles error msgs given from rejected promises
const error = (error => {
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