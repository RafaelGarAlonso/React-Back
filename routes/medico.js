var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Medico = require('../models/medico');

/*=============================================>>>>>
= Obtener todos los Medicos =
===============================================>>>>>*/
app.get('/', (req, res, next) =>{

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({}, 'nombre img')
  .skip(desde)
  .limit(5)
  .populate('usuario','nombre email')
  .populate('hospital')
  .exec(
    (err, medicos) => {
      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error GET Medicos',
          errors: err
        })
      }
      Medico.countDocuments({}, (err, conteo)=>{
        res.status(200).json({
          ok: true,
          medicos: medicos,
          total:conteo
        })
      })
    }
  )
});

/*=============================================>>>>>
= Obtener Medico =
===============================================>>>>>*/

app.get('/:id',(req,res) => {
  var id = req.params.id;

  Medico.findById(id)
    .populate('usuario','nombre email img')
    .populate('hospital')
    .exec( (err,medico) => {
      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al buscar medico',
          errors: err
        })
      }
      if(!medico){
        return res.status(400).json({
          ok: false,
          mensaje: 'El medico con id ' + id + " no existe",
          errors: { message: 'No existe un medico con ese ID'}
        });
      }
      res.status(200).json({
        ok: true,
        medico:medico
      });
    })
})

/*=============================================>>>>>
= Actualizar Medico =
===============================================>>>>>*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) =>{
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) =>{
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar Medico',
        errors: err
      })
    }
    if(!medico){
      return res.status(400).json({
        ok: false,
        mensaje: 'El medico con id ' + id + " no existe",
        errors: { message: 'No existe un medico con ese ID'}
      });
    }
    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save( (err, medicoGuardado) =>{
      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al actualizar Medico',
          errors: err
        })
      }
      res.status(200).json({
        ok: true,
        medico: medicoGuardado
      })
    });
  })
})

/*=============================================>>>>>
= Crear Medico =
===============================================>>>>>*/
app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  })

  medico.save( (err, medicoGuardado) =>{
    if(err){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear Medico',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado
    })
  });

})

/*=============================================>>>>>
= Borrar Medico =
===============================================>>>>>*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) =>{
    if(err){
      res.status(500).json({
        ok:false,
        mensaje:'Error al borrar Medico',
        errors:err
      })
    }
    if(!medicoBorrado){
      return res.status(400).json({
        ok:false,
        mensaje:'No existe el medico con esa ID',
        errors: {message: 'No existe el medico con esa ID'}
      })
    }
    res.status(200).json({
      ok:true,
      medico:medicoBorrado
    })
  })

})


module.exports = app;
