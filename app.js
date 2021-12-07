// Requires
var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE, OPTIONS');
  next();
});


// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.bodyParser());

// Importar Rutas
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//Conexion BBDD
mongoose.connection.openUri('mongodb://localhost:27017/react', ( err, res ) => {
  if (err) throw err;
  console.log('BBDD: \x1b[32m%s\x1b[0m', 'online')
});

// Rutas
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);

// Escuchar peticiones
app.listen(3000, ()=>{
  console.log('Express ejecutadose, port 3000: \x1b[32m%s\x1b[0m', 'online')
})
