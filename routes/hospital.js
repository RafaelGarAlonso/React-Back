var express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();

var Hospital = require('../models/hospital');

/*=============================================>>>>>
= Obtener todos los hospitales =
===============================================>>>>>*/
app.get('/', (req, res, next) =>{

  var pagDesde = req.query.pagDesde || 0;
  pagDesde = Number(pagDesde);

  Hospital.find({})
  .skip(pagDesde)
  .limit(5)
  .populate('usuario', 'nombre email')
  .exec(
    (err, hospitales) => {
      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error GET Hospitales',
          errors: err
        })
      }
      Hospital.countDocuments ({}, (err, conteo)=>{
        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          total:conteo
        })
      })
    }
  )
});

/*=============================================>>>>>
= Actualizar Hospital por ID=
===============================================>>>>>*/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) =>{
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) =>{
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar Hospital',
        errors: err
      })
    }
    if(!hospital){
      return res.status(400).json({
        ok: false,
        mensaje: 'El hospital con id ' + id + " no existe",
        errors: { message: 'No existe un hospital con ese ID'}
      });
    }
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save( (err, hospitalGuardado) =>{
      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: 'Error al actualizar Hospital',
          errors: err
        })
      }
      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      })
    });
  })
})

/*=============================================>>>>>
= Crear Hospital =
===============================================>>>>>*/
app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  })

  hospital.save( (err, hospitalGuardado) =>{
    if(err){
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear Hospital',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    })
  });

})

/*=============================================>>>>>
= Borrar Hospital por ID=
===============================================>>>>>*/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) =>{
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) =>{
    if(err){
      res.status(500).json({
        ok:false,
        mensaje:'Error al borrar Hospital',
        errors:err
      })
    }
    if(!hospitalBorrado){
      return res.status(400).json({
        ok:false,
        mensaje:'No existe el hospital con esa ID',
        errors: {message: 'No existe un hospital con ese ID'}
      })
    }
    res.status(200).json({
      ok:true,
      hospital:hospitalBorrado
    })
  })

})


module.exports = app;
