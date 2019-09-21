let client_id = null;
let client_secret = null;

const request = require('request');
const fs = require('fs');

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/manager.html', function(req,res){
  let clientInfo = null;
//  let fd = fs.openSync('client_info.json')
  clientInfo = fs.readFileSync('client_info.json','utf8');
  client = JSON.parse(clientInfo);

   client_id = client.client_id;
   client_secret = client.client_secret;
  const body = `grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://localhost:8080/manager.html&client_id=${client_id}&client_secret=${client_secret}`;
  console.log(body);
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};

  const options = {headers: headers, body: body}

  request.post("https://accounts.spotify.com/api/token", options ,function(error, response){
  let body = JSON.parse(response.body);
  console.log(body);
    const bearerToken = body.access_token;
    request.get("https://api.spotify.com/v1/me/player", {auth:{'bearer': bearerToken}} ,function(error, response){
      console.log(error);
      console.log(response.statusCode);
      //console.log(response);
      console.log(response.body);

    });
  });
  res.render('manager.ejs');

});


const port = 8080;
app.listen(port, function(req,res){
  console.log('I am listening on port: ' + port);
});
