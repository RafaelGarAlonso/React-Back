/*=============================================>>>>>
= IMPORTACIONES =
===============================================>>>>>*/
//Importa funcionalidad EXpress
var express = require('express');
//BCRYPT para hashear passwords
const bcrypt = require('bcrypt');
//Implementación TOKENS
const jwt = require('jsonwebtoken');
//SEED Parametrizado como constante
var SEED = require('../config/config').SEED;

//EJECUCION
var app = express();

//Modelo del esquema del usuario
var Usuario = require('../models/usuario');

app.post('/', ( req, res ) =>{

  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioBBDD) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuarios',
        errors: err
      });
    }
    if(!usuarioBBDD){
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - email',
        errors: err
      });
    }
    if(!bcrypt.compareSync( body.password, usuarioBBDD.password)){
      return res.status(400).json({
        ok: false,
        mensaje: 'Credenciales incorrectas - password',
        errors: err
      });
    }

    //Generar TOKEN
    usuarioBBDD.password = ':)';
    var token = jwt.sign({ usuario:usuarioBBDD}, SEED, { expiresIn:14400 }) // expiracion en 4 horas

    res.status(200).json({
      ok: true,
      usuario: usuarioBBDD,
      token:token,
      id:usuarioBBDD._id
    })
  });

});

module.exports = app;
