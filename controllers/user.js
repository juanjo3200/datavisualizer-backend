'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

var jwt = require('../services/jwt');


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
                                    userStored = deletePrivateInfo(userStored);
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
                                issetUser= deletePrivateInfo(issetUser);
                                res.status(200).send({
                                    user: issetUser
                                });
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
    var userMail = req.params.email;
    var update = req.body; 
   if(userMail != req.user.email){
        return res.status(500).send({
            message: 'No tienes permiso para actualizar el usuario'
        });
    }
    User.findOneAndUpdate({ email: userMail.toLowerCase() }, update, {new :true}, (err, userUpdated)=>{
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
                if(update.password){
                    bcrypt.hash(update.password, null, null, (err, hash) => {
                        userUpdated.password = hash;
                        User.findByIdAndUpdate(userUpdated._id, userUpdated, { new: true }, (err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    message: 'Error al actualizar el usuario'
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({
                                        message: 'No se ha actualizado el usuario'
                                    });
                                } else {
                                    res.status(200).send({
                                        token: jwt.createToken(userStored)
                                    });
                                    }
                            }
                        })
                    });
                }else{
                        res.status(200).send({ token: jwt.createToken(userUpdated) });
                    }
                }
            }
        });
}



function checkEmail(req, res) {
    var userMail = req.params.email;
    User.findOne({ email : userMail.toLowerCase() }, (err, existMail) => {
        if (err) {
            res.status(404).send({
                message: 'Error al obtener email'
            })

        } else {
            if(existMail){
                res.status(200).send({
                    message: existMail.email
                })
            }else{
                res.status(404).send({
                    message: "No existe el email"
                });
            }


        }
    });
}

function deletePrivateInfo(user){
    user.password = undefined;
    user._id = undefined;
    return user;
}

module.exports = {
    saveUser,
    login,
    updateUser,
    checkEmail
}