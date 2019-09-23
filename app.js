let API = require('./api');

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/manager.html', function(req,res){
  const everything = "78capR2HryfdSE2JallXDb";
  const rap = "4TL6CsXn7AFFrgMWMxq1XL";
  api = new API(req.query.code);
  api.init()
  .then(()=> api.addPlaylistByID(everything))
  .then(()=> api.addPlaylistByID(rap))
  .then(() => api.currrentPlayer())
  .then(() => console.log(api.currentTrackInPlaylists()))
  .catch(error=>console.log(error));
  res.render('manager.ejs');
});


const port = 8080;
app.listen(port, function(req,res){
  console.log('I am listening on port: ' + port);
});
