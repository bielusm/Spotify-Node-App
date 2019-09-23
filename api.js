const request = require('request');
const rp = require('request-promise-native');
const fs = require('fs');

class API {
  constructor(code) {
    this.code = code;
    this.bearerToken = null
    this.currentTrackUri = null;
    this.playLists = [];
  }
  init() {
    this.client = this.readClientInfo();

    const body = `grant_type=authorization_code&code=${this.code}&redirect_uri=http://localhost:8080/manager.html&client_id=${this.client.client_id}&client_secret=${this.client.client_secret}`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const options = {
      headers: headers,
      body: body
    };
    return new Promise((resolve, reject) => {
      rp.post("https://accounts.spotify.com/api/token", options)
        .then(response => {
          let body = JSON.parse(response);
          this.bearerToken = body.access_token;
          resolve("Access token is set");
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  readClientInfo() {
    const clientInfo = fs.readFileSync('client_info.json', 'utf8');
    const client = JSON.parse(clientInfo);
    return client;
  }

  currrentPlayer() {
    return new Promise((resolve, reject) => {
    rp.get("https://api.spotify.com/v1/me/player", {
        auth: {
          'bearer': this.bearerToken
        }
      })
      .then((response) => {
        if(response === "")
          reject("Nothing is playing");
        fs.writeFileSync("./json/currrentPlayer.json", response, ('utf8'));
        const json = JSON.parse(response);
        this.currentTrackUri = json.item.uri;
        resolve("track set");
      })
      .catch((error) => reject(error));
  });
}

  addPlaylistByID(ID) {
    this.playLists.push(ID);
    console.log(this.playLists);
    return new Promise((resolve,reject) => {
    if(fs.existsSync("./json/" + ID + ".json"))
      resolve("Playlist already cached");

    let tracks = [];
    let param = "?fields=next,items(track(name,artists,external_urls,id,uri,album(name)))"
    rp.get(`https://api.spotify.com/v1/playlists/${ID}/tracks${param}`, {
        auth: {
          'bearer': this.bearerToken
        }
      })
      .then((response) => {
        const json = JSON.parse(response);
        tracks.push(json.items);
        const next = json['next'];
        if (next != null)
        {
          this.getNextTracks(ID, next, tracks)
          .then(response=>{
            let buffer = {tracks: tracks}
            fs.writeFileSync("./json/" + ID + ".json", JSON.stringify(buffer), ('utf8'));
            resolve(response);})
          .catch(error=>reject(error));
      }
    else
    {
      resolve("fetch finished");
              fs.writeFileSync("./json/" + ID + ".json", response, ('utf8'));
    }
    })
      .catch((error) => reject(error));
    });
  }

  getNextTracks(ID, next, tracks) {
    return new Promise((resolve,reject) => {
    rp.get(next, {
        auth: {
          'bearer': this.bearerToken
        }
      })
      .then((response) => {
        const json = JSON.parse(response);
        tracks.push(json.items);

        const next = json['next'];
        if (next != null)
          this.getNextTracks(ID, next, tracks)
          .then(response=>resolve(response))
          .catch(error=>reject(error));
        else
          return resolve("fetch finished");
      })
      .catch((error) => reject(error));
    })
  }
  currentTrackInPlaylists(){
    this.playLists.forEach(playlist => {
      if(this.currentTrackInPlaylist(playlist))
        console.log("Track is in playlist " + playlist);
      else
        console.log("Track is not in playlist " + playlist);
    });
  }

  currentTrackInPlaylist(ID){
    let buf = fs.readFileSync(`./json/${ID}.json`,('utf8'));
    const json = JSON.parse(buf);
    let i = 0;
    let equal = false;
    json.tracks.forEach(item =>{
      item.forEach(item =>{
        if(item.track.uri === this.currentTrackUri)
            equal = true;
  //      console.log(typeof item.track.uri);
      });
    });
    return equal;
  }
}

module.exports = API;
