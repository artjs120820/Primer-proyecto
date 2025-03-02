const express = require('express');
const db = require('../../db/models/index');

const ruta = express.Router();

ruta.post('/admin1', async (req, res) => {
    const { nombre, tipoDOC, apellidos, nroDocumento, correoaux,direccion_imagen_url } = req.body;
    try {
        await db.usuario.update(
            { nombre: nombre, tipo_documento: tipoDOC, apellido: apellidos, nro_documento: nroDocumento, direccion_imagen_url:direccion_imagen_url },
            { where: { correo: correoaux } }
        );
        res.json({ success: true, message: 'Información actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la información del usuario, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

ruta.post('/admin2', async (req, res) => {
    const { correo, password, correoaux, direccion_imagen_url } = req.body;
    try {
        const user = await db.usuario.findOne({ where: { correo: correo } });
        if (!user || correo === correoaux) {
            await db.usuario.update(
                { correo: correo, password: password ,direccion_imagen_url:direccion_imagen_url},
                { where: { correo: correoaux } }
            );
            res.json({ success: true, message: 'Información actualizada correctamente' });
        } else {
            res.json({ success: false, message: 'Ya existe un usuario con el correo digitado!!' });
        }
    } catch (error) {
        console.error('Error al actualizar la información del usuario, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

ruta.post('/admin3', async (req, res) => {
    const { idioma, prefijo, color , correoaux ,direccion_imagen_url} = req.body;
    try {
        await db.usuario.update(
            { idioma: idioma, prefijo: prefijo, color: color ,direccion_imagen_url:direccion_imagen_url},
            { where: { correo: correoaux } }
        );
        res.json({ success: true, message: 'Información actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la información del usuario, posible problemas de conexión!', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

ruta.post('/reserva', async (req, res) => {
    const reservasPendientes = await db.reserva.findAll();
    const reservasFiltradas = reservasPendientes.filter(reserva => new Date(reserva.fechaentrega) < new Date());
    for (const reserva of reservasFiltradas) {
        await db.reserva.update({ disponibilidad: 0 }, { where: { id: reserva.id } });
        await db.libro.update({ disponibilidad: 1 }, { where: { id: reserva.id_libro } });
    }
    res.json({ success: true, message: 'Reservas actualizadas correctamente' });
});

module.exports = ruta;
