/*=============================================>>>>>
= IMPORTACIONES =
===============================================>>>>>*/
//Importa funcionalidad EXpress
var express = require('express');

//BCRYPT para hashear passwords
const bcrypt = require('bcrypt');

//Implementación TOKENS
const jwt = require('jsonwebtoken');

//Autenticacion Middleware
var mdAutenticacion = require('../middlewares/autenticacion');

//Ejecución de Express
var app = express();

//Modelo del esquema del usuario
var Usuario = require('../models/usuario');

/*=============================================>>>>>
= Crear un usuario =
===============================================>>>>>*/
app.post('/' ,(req, res) =>{
  var body = req.body;
  console.log('body', body);
  // var usuario = new Usuario({
  //   email:body.email,
  //   password: bcrypt.hashSync(body.password, 10)
  // });

  // usuario.save( (err, usuarioGuardado) =>{
  //   if(err){
  //     return res.status(400).json({
  //       ok: false,
  //       mensaje: 'Error al crear usuario',
  //       errors: err
  //     });
  //   }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken: req.usuario
    })
  // });

});

module.exports = app;
