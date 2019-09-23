const request = require('request');
const rp = require('request-promise-native');
const fs = require('fs');

class API {
  constructor(code) {
    this.code = code;
    this.bearerToken = null
    this.currentTrackUri = null;
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
        console.log(this.currentTrackUri);
        resolve("track set");
      })
      .catch((error) => reject(error));
  });
}

  getPlaylistByID(ID) {
    // rp.get("https://api.spotify.com/v1/playlists/4TL6CsXn7AFFrgMWMxq1XL/", {auth: {'bearer': this.bearerToken}})
    // .then((response) => {console.log(response)
    // fs.writeFileSync('writeMe.json',response,('utf8'))})
    // .catch((errorr) => console.log(error));

    return new Promise((resolve,reject) => {
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
  currentTrackInPlaylists(ID){
    let buf = fs.readFileSync(`./json/${ID}.json`,('utf8'));
    const json = JSON.parse(buf);
    console.log(json.tracks[0][0]);
    let i = 0;
    json.tracks.forEach(item =>{
      item.forEach(item =>{
        i++;
      });
    });
    console.log("i: " + i);
  }
}

module.exports = API;
