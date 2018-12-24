const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/*=============================================>>>>>
= Verificacion TOKEN =
===============================================>>>>>*/

exports.verificaToken = function(req, res, next){

  var token = req.query.token;

  jwt.verify(token, SEED, (err, decoded) =>{
    if(err){
      return res.status(401).json({
        ok: false,
        mensaje: 'Token incorrecto',
        errors: err
      });
    }
    req.usuario = decoded.usuario;
    next();
  });

}

/*=============================================>>>>>
= Verificacion ADMIN =
===============================================>>>>>*/

exports.verificaADMIN_ROLE = function(req, res, next){

  var usuario = req.usuario;

  if(usuario.role === 'ADMIN_ROLE'){
    next();
    return;
  }else{
    return res.status(401).json({
      ok: false,
      mensaje: 'Token incorrecto - no es administrador',
      errors: {message: 'No es administrador, no puede hacer eso'}
    });
  }

}

/*=============================================>>>>>
= Verificacion ADMIN o mismo usuario =
===============================================>>>>>*/

exports.verificaAdminUsuario = function(req, res, next){

  var usuario = req.usuario;
  var id = req.params.id;

  if(usuario.role === 'ADMIN_ROLE' || usuario._id == id){
    next();
    return;
  }else{
    return res.status(401).json({
      ok: false,
      mensaje: 'Token incorrecto - no es administrador ni es el mismo usuario',
      errors: {message: 'No es administrador, no puede hacer eso'}
    });
  }

}
