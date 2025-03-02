const express = require('express')
//importa base de datos
const db = require('../../db/models/index')

const ruta = express.Router()

ruta.post('/recovered', async (req, res) => {
    const { correo } = req.body;
    console.log(req.body);
    try {
      const user = await db.usuario.findOne({ where: { correo: correo } });
      if (user) {
        res.json({ success: true, password: user.password, tipo_usuario: user.tipo_usuario });
      } else {
        res.status(401).json({ success: false});
      }
    } catch (error) {
      console.error('Error al encontrar al usuario', error);
      res.status(500).json({ success: false, message: 'Error del server!' });
    }
  });

module.exports = ruta;