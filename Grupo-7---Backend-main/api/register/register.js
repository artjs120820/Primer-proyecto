const express = require('express')
//importa base de datos
const db = require('../../db/models/index')

const ruta = express.Router()

ruta.post('/register', async (req, res) => {
  const {
    nombre,
    apellido,
    tipo_documento,
    nro_documento,
    correo,
    password,
    repetir_password
  } = req.body;
  console.log(req.body);
  try {
    const user = await db.usuario.findOne({ where: { correo: correo } });
    if (user) {
      res.json({ success: false, message: 'Ya existe un usuario con ese correo' });
    } else {
      let tipo_usuario = "usuario"
      const nuevoUsuario = await db.usuario.create({
        nombre: nombre,
        apellido: apellido,
        tipo_documento: tipo_documento,
        nro_documento: nro_documento,
        correo: correo,
        password: password,
        tipo_usuario: tipo_usuario
      });
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

ruta.post('/registrarLibro', async (req, res) => {
  const {
    titulo,
    autor,
    isbn13,
    tema
  } = req.body;
  try {
    const libro = await db.libro.findOne({ where: { isbn13: isbn13 } });
    if (libro) {
      res.status(401).json({ success: false });
    } else {
      const nuevoLibro = await db.libro.create({
        titulo,
        autor,
        isbn: isbn13,
        isbn13: isbn13,
        tema
      });
      res.json({ success: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

ruta.post('/reservas', async (req, res) => {
  const {
    fecha,
    fechaentrega,
    disponibilidad,
    id_libro,
    usuario
  } = req.body;
  try {
    const user = await db.usuario.findOne({ where: { correo: usuario } });
    const nuevoReserva = await db.reserva.create({
      fecha,
      fechaentrega,
      disponibilidad,
      id_libro,
      id_usuario: user.id
    });
    const nuevoReserva2 = await db.libro.update(
      { disponibilidad_libro: 0 },
      { where: { id: id_libro } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error al buscar las coincidencias de los libros!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

module.exports = ruta;