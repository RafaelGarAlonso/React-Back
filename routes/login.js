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
= Autenticacion mediante Google =
===============================================>>>>>*/

app.get('/renuevatoken', mdAutenticacion.verificaToken ,(req,res) => {
  var token = jwt.sign({ usuario:req.usuario}, SEED, { expiresIn:14400 })
  res.status(200).json({
    ok:true,
    token:token
  });
});

/*=============================================>>>>>
= Autenticacion mediante Google =
===============================================>>>>>*/
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    nombre:payload.name,
    email:payload.email,
    img:payload.picture,
    google:true
  }
}

app.post('/google', async(req,res) =>{
  var token = req.body.token;

  var googleUser = await verify(token)
    .catch(e => {
      return res.status(403).json({
        ok:false,
        mensaje: 'Token no valido'
      });
    });

  Usuario.findOne( { email:googleUser.email }, (err, usuarioBBDD) =>{
    if(err){
      return res.status(500).json({
        ok:false,
        mensaje: 'Error al buscar usuario',
        errors:err
      });
    }
    if(usuarioBBDD){
      if(usuarioBBDD.google === false){
        return res.status(400).json({
          ok:false,
          mensaje: 'Debe de utilizar su autenticacion por defecto'
        });
      }else{
        var token = jwt.sign({ usuario:usuarioBBDD}, SEED, { expiresIn:14400 })

        res.status(200).json({
          ok: true,
          usuario: usuarioBBDD,
          token:token,
          id:usuarioBBDD._id,
          menu:obtenerMenu(usuarioBBDD.role)
        })
      }
    }else{
      //El usuario no existe, hay que crearlo
      var usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';

      usuario.save( (err, usuarioBBDD ) =>{
        var token = jwt.sign({ usuario:usuarioBBDD}, SEED, { expiresIn:14400 })

        res.status(200).json({
          ok: true,
          usuario: usuarioBBDD,
          token:token,
          id:usuarioBBDD._id,
          menu:obtenerMenu(usuarioBBDD.role)
        })
      })
    }
  });
})

/*=============================================>>>>>
= Autenticacion normal =
===============================================>>>>>*/

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
    var token = jwt.sign({ usuario:usuarioBBDD}, SEED, { expiresIn:14400 })

    res.status(200).json({
      ok: true,
      usuario: usuarioBBDD,
      token:token,
      id:usuarioBBDD._id,
      menu:obtenerMenu(usuarioBBDD.role)
    })
  });

});

function obtenerMenu(ROLE){
  menu = [
    {
      titulo: 'Principal',
      icono:'mdi mdi-gauge',
      submenu: [
        { titulo: 'Dashboard', url:'/dashboard' },
        { titulo: 'ProgressBar', url:'/progress' },
        { titulo: 'Gráficas', url:'/graficas1' },
        { titulo: 'Promesas', url:'/promesas' },
        { titulo: 'Rxjs', url:'/rxjs' }
      ]
    },
    {
      titulo:'Mantenimientos',
      icono:'mdi mdi-gauge',
      submenu: [
        {titulo: 'Hospitales', url:'/hospitales'},
        {titulo: 'Médicos', url:'/medicos'}
      ]
    }
  ];
  if(ROLE === 'ADMIN_ROLE'){
    menu[1].submenu.unshift({titulo: 'Usuarios', url:'/usuarios'})
  }
  return menu;
}

module.exports = app;
