'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var auth = require('../middlewares/authenticate');
var checkAdmin = require('../middlewares/isAdmin');

api.get('/checkemail/:email', UserController.checkEmail);
api.post('/register', UserController.saveUser);
api.post('/login',UserController.login);
api.put('/update-user/:email', auth.ensureAuth, UserController.updateUser);

module.exports = api;