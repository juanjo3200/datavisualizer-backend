var express = require('express');
var bodyParser = require('body-parser');
var dbconfig = require('./config/db.config');
var app = express();
var portused= 3000;
var port = process.env.PORT|| portused;
//Conectar a la db
dbconfig.connectdb();

//Cargar rutas
var user_routes = require('./routes/user');

//middlewares

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Configurar cabeceras y cors

app.use((req,res, next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas 

app.use('/api', user_routes);


//inicio app
app.listen(port, () => {
    console.log("Servidor funcionando en ", portused);
});

module.exports = app;
