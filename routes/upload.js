var express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');

const app = express();

app.use(fileUpload());

var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// Rutas
app.put('/:tipo/:id', ( req, res, next ) => {

  var tipo = req.params.tipo;
  var id = req.params.id;

  // Tipos de colecciones ( Usuarios, Medicos u Hospitales)
  var tiposValidos = ['hospitales','medicos','usuarios'];

  if(tiposValidos.indexOf(tipo) < 0 ){
    return res.status(400).json({
      ok: false,
      mensaje: 'Tipo de coleccion no valida',
      errors: {message: 'Tipo de coleccion no valida'}
    });
  }

  if(!req.files){
    return res.status(400).json({
      ok: false,
      mensaje: 'No selecciono nada',
      errors: {message: 'Debe de seleccionar una imagen'}
    });
  }

  // Obtener nombre del archivo
  var archivo = req.files.imagen;
  var nombreCortado = archivo.name.split('.');
  var extensionArchivo = nombreCortado[nombreCortado.length -1]

  // Solo estas extensiones se aceptan
  var extensionesValidas = ['png','jpg','gif','jpeg'];

  if( extensionesValidas.indexOf(extensionArchivo) < 0 ){
    return res.status(400).json({
      ok: false,
      mensaje: 'Extension no valida',
      errors: {message: 'Las extensiones válidas son: '+ extensionesValidas.join(', ') }
    });
  }

  // Nombre archivo personalizado (ID Usuario-Numero Random-Extension archivo)
  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  // Mover archivo del tempooral a un path
  var path = `./uploads/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err =>{
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al mover el archivo',
        errors: err
      });
    }

    subirPorTipo( tipo, id, nombreArchivo, res );

  })

});

function subirPorTipo( tipo, id, nombreArchivo, res ){

  if(tipo === 'usuarios'){
    Usuario.findById( id, (err, usuario) =>{
      if(!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Este usuario no existe',
          errors:{message:'Este usuario no existe'}

        });
      }
      //Si existe alguna imagen ya en la carpeta, la borra antes de subir la nueva imagen
      var pathViejo = './uploads/usuarios/' + usuario.img;
      if( fs.existsSync(pathViejo) ){
        fs.unlinkSync(pathViejo, (err)=>{
          if(err){
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al eliminar el archivo',
              errors:{message:'Error al eliminar el archivo',err}
            });
          }
        });
      }
      usuario.img = nombreArchivo;
      usuario.save( (err,usuarioActualizado) =>{
        usuarioActualizado.password =':)';
        if(err){
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la imagen',
            errors:{message:'Error al actualizar la imagen',err}
          });
        }else{
          return res.status(200).json({
            ok:true,
            mensaje:'Imagen de usuario actualizada',
            usuario:usuarioActualizado
          });
        }
      })
    });
  }

  if(tipo === 'medicos'){
    Medico.findById( id, (err, medico) =>{
      if(!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Este medico no existe',
          errors:{message:'Este medico no existe'}
        });
      }
      //Si existe alguna imagen ya en la carpeta, la borra antes de subir la nueva imagen
      var pathViejo = './uploads/medicos/' + medico.img;
      if( fs.existsSync(pathViejo) ){
        fs.unlinkSync(pathViejo, (err)=>{
          if(err){
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al eliminar el archivo',
              errors:{message:'Error al eliminar el archivo',err}
            });
          }
        });
      }
      medico.img = nombreArchivo;
      medico.save( (err,medicoActualizado) =>{
        if(err){
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la imagen',
            errors:{message:'Error al actualizar la imagen',err}
          });
        }else{
          return res.status(200).json({
            ok:true,
            mensaje:'Imagen de medico actualizada',
            usuario:medicoActualizado
          });
        }
      })
    });
  }

  if(tipo === 'hospitales'){
    Hospital.findById( id, (err, hospital) =>{
      if(!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Este hospital no existe',
          errors:{message:'Este hospital no existe'}
        });
      }
      //Si existe alguna imagen ya en la carpeta, la borra antes de subir la nueva imagen
      var pathViejo = './uploads/hospitales/' + hospital.img;
      if( fs.existsSync(pathViejo) ){
        fs.unlinkSync(pathViejo, (err)=>{
          if(err){
            return res.status(500).json({
              ok: false,
              mensaje: 'Error al eliminar el archivo',
              errors:{message:'Error al eliminar el archivo',err}
            });
          }
        });
      }
      hospital.img = nombreArchivo;
      hospital.save( (err,hospitalActualizado) =>{
        if(err){
          return res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar la imagen',
            errors:{message:'Error al actualizar la imagen',err}
          });
        }else{
          return res.status(200).json({
            ok:true,
            mensaje:'Imagen de medico actualizada',
            usuario:hospitalActualizado
          });
        }
      })
    });
  }

}

module.exports = app;
