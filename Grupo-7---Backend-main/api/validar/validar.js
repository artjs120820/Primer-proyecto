const express = require('express')
//importa base de datos
const db = require('../../db/models/index')

const ruta = express.Router()

ruta.post('/users', async (req, res) => {
    const { usuario } = req.body;
    console.log(req.body);
    try {
      const user = await db.usuario.findOne({ where: { correo: usuario } });
      if (user) {
        res.status(201).json({ success: true,
            id_usuario: user.id, 
            nombreDelAlumno: user.nombre, 
            tipo_documento: user.tipo_documento,
            apellido: user.apellido,
            nro_documento: user.nro_documento,
            correo: user.correo,
            password: user.password,
            idioma: user.idioma,
            prefijo: user.prefijo,
            color: user.color,
            tipo_usuario : user.tipo_usuario,
            direccion_imagen_url: user.direccion_imagen_url
        });
      } else {
        res.status(401).json({ success: false});
      }
    } catch (error) {
      console.error('Error al autenticar al usuario!!!!!!', error);
      res.status(500).json({ success: false, message: 'Error del server!' });
    }
  });

module.exports = ruta;
