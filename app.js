let API = require('./api');

const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/manager.html', function(req,res){
  API.init(req, res);
});


const port = 8080;
app.listen(port, function(req,res){
  console.log('I am listening on port: ' + port);
});
