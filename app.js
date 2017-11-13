var express = require('express');
var bodyParser = require('body-parser');
var dbconfig = require('./config/db.config');

var app = express();

dbconfig.connectdb();

module.exports = app;
