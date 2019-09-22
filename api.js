const request = require('request');
const rp = require('request-promise-native');
const fs = require('fs');

class API {
  constructor(code) {
    this.code = code;
    this.bearerToken = null
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
          console.log(response);
          let body = JSON.parse(response);
          console.log(body.access_token);
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
    console.log("after waiting");
    rp.get("https://api.spotify.com/v1/me/player", {
        auth: {
          'bearer': this.bearerToken
        }
      })
      .then((response) => console.log(response))
      .catch((errorr) => console.log(error));
  }

  getPlaylistByID(ID) {
    // rp.get("https://api.spotify.com/v1/playlists/4TL6CsXn7AFFrgMWMxq1XL/", {auth: {'bearer': this.bearerToken}})
    // .then((response) => {console.log(response)
    // fs.writeFileSync('writeMe.json',response,('utf8'))})
    // .catch((errorr) => console.log(error));

    let param = "?fields=next,items(track(name,artists,external_urls,id,uri,album(name)))"
    rp.get("https://api.spotify.com/v1/playlists/4TL6CsXn7AFFrgMWMxq1XL/tracks" + param, {
        auth: {
          'bearer': this.bearerToken
        }
      })
      .then((response) => {
        fs.writeFileSync('writeMe.json', response, ('utf8'));
        const json = JSON.parse(response);
        const next = json['next'];
        if (next != null)
          this.getNextTracks(next);
      })
      .catch((error) => console.log(error));
  }

  getNextTracks(next) {
    console.log(next, "next");
    rp.get(next, {
        auth: {
          'bearer': this.bearerToken
        }
      })
      .then((response) => {
        fs.appendFileSync('writeMe.json', response, ('utf8'));
        const json = JSON.parse(response);
        const next = json['next'];
        if (next != null)
          this.getNextTracks(next);
      })
      .catch((error) => console.log(error));
  }
}

module.exports = API;
