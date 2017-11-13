var express = require('express');
var bodyParser = require('body-parser');
var dbconfig = require('./config/db.config');
var app = express();
var port = process.env.PORT|| 4200;
//Conectar a la db
dbconfig.connectdb();

//Cargar rutas
var user_routes = require('./routes/user');

//middlewares

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Configurar cabeceras y cors

//rutas 

app.use('/api', user_routes);


//inicio app
app.listen(port, () => {
    console.log("Servidor funcionando en 4200");
});

module.exports = app;
