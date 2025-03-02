const express = require('express');
const bodyParser = require("body-parser")
const path = require('path');

//Registar las APIS
const login = require('./api/login/login')
const register = require('./api/register/register')
const recovered = require('./api/recovered/recovered')
const validar = require('./api/validar/validar')
const actualizarAdmin = require('./api/actualizarAdmin/actualizarAdmin')
const filtrar = require('./api/filtrar/filtrar')
const editarlibro = require('./api/editarlibro/editarlibro')
const eliminar = require('./api/eliminar/eliminar')

const app = express()
app.use(express.json({ limit: '100mb' }));
const port = 3080

app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.json());


//
app.use('/api/login' , login);
app.use('/api/register' , register);
app.use('/api/recovered' , recovered);
app.use('/api/validar' , validar);
app.use('/api/actualizarAdmin' , actualizarAdmin);
app.use('/api/filtrar' , filtrar);
app.use('/api/editarlibro' , editarlibro);
app.use('/api/eliminar' , eliminar);



//
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.listen(port, () => {
    console.log(`Server escuchando en el port::${port}`);
});

