var express = require('express');

var DEFAULT_PORT = 8000;

var app = express();

app.use(express.static(__dirname + '/../..'));
app.listen(DEFAULT_PORT);