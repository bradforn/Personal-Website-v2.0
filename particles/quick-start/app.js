var express = require('express');
var exphbs  = require('express-handlebars');

var path = require('path');
var http = require('http');
var fs = require('fs');


var app = express();

var port = 1081;

var staticDir = path.join(__dirname, 'public');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

console.log("The Server is now running on port" + port );
app.listen(1081);
