'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var auth = require('../middlewares/authenticate');

api.get('/pruebauser', auth.ensureAuth ,UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login',UserController.login);
api.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);

module.exports = api;