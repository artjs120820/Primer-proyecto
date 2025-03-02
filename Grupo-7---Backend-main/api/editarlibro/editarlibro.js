const express = require('express');
const db = require('../../db/models/index');

const ruta = express.Router();


ruta.post('/editar', async (req, res) => {
    const {titulo,autor,isbn13,tema,isbn13aux} = req.body;
    try {
        const libro = await db.libro.findOne({ where: { isbn13: isbn13 } });
        if (!libro || isbn13 === isbn13aux) {
            await db.libro.update(
                { titulo: titulo, autor: autor, isbn13: isbn13, tema: tema},
                { where: { isbn13: isbn13aux } }
            );
            res.json({ success: true, message: 'Libro actualizado correctamente' });
        } else {
            res.json({ success: false, message: 'Ya existe un libro con el ISBN13 digitado!!' });
        }
    } catch (error) {
        console.error('Error al actualizar la información del usuario, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


ruta.post('/recoger', async (req, res) => {
    const { id_libro } = req.body;
    try {
        const libro = await db.libro.findOne({ where: { id: id_libro } });
        res.json({ success: true, titulo: libro.titulo, autor: libro.autor, isbn13: libro.isbn13, tema: libro.tema });

    } catch (error) {
        console.error('Error al recibir la información del libro, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


module.exports = ruta;
