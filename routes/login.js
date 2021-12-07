/*=============================================>>>>>
= IMPORTACIONES =
===============================================>>>>>*/
var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var app = express();

var SEED = require('../config/config').SEED;

//Google
var CLIENT_ID = require('../config/config').CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var Usuario = require('../models/usuario');

var mdAutenticacion = require('../middlewares/autenticacion');

/*=============================================>>>>>
= Autenticacion =
===============================================>>>>>*/

app.post('/', ( req, res ) =>{
  var body = req.body;
  res.status(200).json({
    usuario: 'MANOLO',
    token:'1234',
    id: '_1234'
  })
  // Usuario.findOne({ email: body.email }, (err, usuarioBBDD) => {
    // if (err) {
    //   return res.status(500).json({
    //     ok: false,
    //     mensaje: 'Error al buscar usuarios',
    //     errors: err
    //   });
    // }
    // if(!usuarioBBDD){
    //   return res.status(400).json({
    //     ok: false,
    //     mensaje: 'Credenciales incorrectas - email',
    //     errors: err
    //   });
    // }
    // if(!bcrypt.compareSync( body.password, usuarioBBDD.password)){
    //   return res.status(400).json({
    //     ok: false,
    //     mensaje: 'Credenciales incorrectas - password',
    //     errors: err
    //   });
    // }

    //Generar TOKEN
    // usuarioBBDD.password = ':)';
    // var token = jwt.sign({ usuario:usuarioBBDD}, SEED, { expiresIn:14400 })

    // res.status(200).json({
    //   ok: true,
    //   usuario: usuarioBBDD,
    //   token:token,
    //   id:usuarioBBDD._id,
    //   menu:obtenerMenu(usuarioBBDD.role)
    // })
  // });

});

module.exports = app;
