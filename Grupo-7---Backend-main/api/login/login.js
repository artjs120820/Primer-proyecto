const express = require('express')
//importa base de datos
const db = require('../../db/models/index')

const ruta = express.Router()

ruta.post('/login', async (req, res) => {
    const { usuario, contrasena } = req.body;
    console.log(req.body);
    try {
      const user = await db.usuario.findOne({ where: { correo: usuario } });
  
      if (user && user.password === contrasena) {
        res.json({ success: true, tipo_usuario: user.tipo_usuario });
      } else {
        res.json({ success: false, message: 'No coincide la contraseña o usuario' });
      }
    } catch (error) {
      console.error('Error al autenticar al usuario!!!!!!', error);
      res.status(500).json({ success: false, message: 'Error del server!' });
    }
  });

module.exports = ruta;