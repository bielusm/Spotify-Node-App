let client_id = null;
let client_secret = null;

const request = require('request');
const fs = require('fs');

let API = {
  client_id: null,
  client_secret: null,
  init(req, res) {
    const clientInfo = fs.readFileSync('client_info.json', 'utf8');
    const client = JSON.parse(clientInfo);
    client_id = client.client_id;
    client_secret = client.client_secret;

    const body = `grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://localhost:8080/manager.html&client_id=${client_id}&client_secret=${client_secret}`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const options = {
      headers: headers,
      body: body
    }

    request.post("https://accounts.spotify.com/api/token", options, function(error, response) {
      let body = JSON.parse(response.body);
      console.log(body);
      const bearerToken = body.access_token;
      request.get("https://api.spotify.com/v1/me/player", {
        auth: {
          'bearer': bearerToken
        }
      }, function(error, response) {
        console.log(error);
        console.log(response.statusCode);
        console.log(response.body);

      });
    });
    res.render('manager.ejs');

  },

  reqCurrentTrack(){
    
  }
};

module.exports = API;
