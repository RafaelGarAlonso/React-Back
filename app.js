// Requires
var express = require('express');

// Inicializar variables
var app = express();

// Escuchar peticiones
app.listen(3000, ()=>{
  console.log('Express ejecutadose, port 3000: \x1b[32m%s\x1b[0m', 'online')
})
