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
= Obtener todos los usuarios =
===============================================>>>>>*/
app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Usuario.find({}, 'nombre email img role google')
  .skip(desde)
  .limit(5)
    .exec(
      (err, usuarios) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            mensaje: 'Error get Usuarios',
            errors: err
          });
        }

        Usuario.countDocuments({}, (err, conteo)=>{
          res.status(200).json({
            ok: true,
            usuarios: usuarios,
            total:conteo
          })
        })

      })
});

/*=============================================>>>>>
= Actualizar Usuario =
===============================================>>>>>*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err,usuario) => {
    if(err){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar usuario',
          errors: err
        });
      }
      if(!usuario){
        return res.status(400).json({
          ok: false,
          mensaje: 'El usuario con id ' + id + " no existe",
          errors: { message: 'No existe un usuario con ese ID'}
        });
      }
      //Existe usuario con ID
      usuario.nombre = body.nombre;
      usuario.email = body.email;
      usuario.role = body.role;

      //Actualizar Usuario con nuevos datos
      usuario.save( (err,usuarioGuardado ) =>{
        if(err){
          return res.status(400).json({
            ok: false,
            mensaje: 'Error al actualizar usuario',
            errors: err
          });
        }
        usuarioGuardado.password = ':)';
        res.status(200).json({
          ok: true,
          usuario: usuarioGuardado
        })
      });
  })
})

/*=============================================>>>>>
= Crear un usuario =
===============================================>>>>>*/
app.post('/' ,(req,res) =>{
  var body = req.body;

  var usuario = new Usuario({
    nombre:body.nombre,
    email:body.email,
    password: bcrypt.hashSync(body.password,10),
    img:body.img,
    role:body.role
  });

  usuario.save( (err, usuarioGuardado) =>{
    if(err){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado,
      usuariotoken:req.usuario
    })
  });

})

/*=============================================>>>>>
= Borrar un usuario por ID =
===============================================>>>>>*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado ) => {
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }
    if(!usuarioBorrado){
      return res.status(400).json({
        ok: false,
        mensaje: 'No existe un usuario con ese ID',
        errors: err
      });
    }
    //Borra el usuario
    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    })
  })
});

module.exports = app;
