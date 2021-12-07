var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
  email: { type: String, unique:true, required: [true, 'El email es necesario'] },
  password: { type: String, required: [true, 'El password es necesario'] }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' } );

module.exports = mongoose.model('Usuario', usuarioSchema);
