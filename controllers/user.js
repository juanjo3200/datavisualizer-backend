'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: "Probando el controlador users"
    });
}

function saveUser(req, res) {

    var user = new User();

    //Retrieve params
    var params = req.body;
    // Set user with params


    if (params.password && params.name && params.email) {
        user.name = params.name;
        user.email = params.email;
        user.role = 'ROLE_USER';
        User.findOne({ email: user.email.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    message: 'Error al guardar el usuario'
                });
            } else {
                if (!issetUser) {
                    //Crypt password
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error al guardar el usuario'
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({
                                        message: 'No se ha registrado el usuario'
                                    });
                                } else {
                                    res.status(200).send({
                                        user: userStored
                                    });
                                }
                            }
                        })
                    });
                } else {
                    res.status(200).send({
                        message: "Ya existe un usuario con ese email"
                    });
                }

            }
        });

    } else {
        res.status(200).send({
            message: "Introduzca los valores correctamente"
        });
    }
}

function login(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password
    if (params.password && params.email) {
        User.findOne({ email: email.toLowerCase() }, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    message: 'Error al comprobar usuario'
                });
            } else {
                if (issetUser) {
                    bcrypt.compare(password, issetUser.password, (err, check) => {
                        if (check) {
                            if (params.gettoken){
                                res.status(200).send({
                                    token : jwt.createToken(issetUser)
                                });
                            }else{
                                res.status(200).send(issetUser);
                            }


                        } else {
                            res.status(404).send({
                                message: "Contraseña incorrecta"
                            });
                        }
                    });

                } else {
                    res.status(404).send({
                        message: 'El usuario no existe'
                    });
                }
            }
        });
    } else {
        res.status(200).send({
            message: "Introduzca correctamente los valores"
        })
    }
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        return res.status(500).send({
            message: 'No tienes permiso para actualizar el usuario'
        });
    }

    User.findByIdAndUpdate(userId, update, {new :true}, (err, userUpdated)=>{
        if(err){
            res.status(500).send({
                message: 'Error al actualizar usuario'
            });
        }else {
            if(!userUpdated){
                res.status(404).send({
                    message: 'No se ha podido actualizar el usuario'
                });
            }else{
                res.status(200).send({user:userUpdated});
            }
        }
    });

}
    


module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser
}