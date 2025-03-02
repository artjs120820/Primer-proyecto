const express = require('express');
const db = require('../../db/models/index');

const ruta = express.Router();


ruta.delete('/libro', async (req, res) => {
    const {id_libro} = req.body;
    try {
        await db.reserva.destroy({ where: { id_libro: id_libro } });
        await db.libro.destroy({ where: { id: id_libro } });
        res.json({success: true});
    } catch (error) {
        console.error('Error al actualizar la información del usuario, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


ruta.post('/reserva', async (req, res) => {
    const {id_libro} = req.body;
    console.log(id_libro);
    try {
        await db.reserva.update({ disponibilidad: 0 }, { where: { id_libro: id_libro, disponibilidad: 1} });
        await db.libro.update({ disponibilidad_libro: 1 }, { where: { id: id_libro } });
        res.json({success: true});
    } catch (error) {
        console.error('Error al actualizar la información del usuario, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


module.exports = ruta;
