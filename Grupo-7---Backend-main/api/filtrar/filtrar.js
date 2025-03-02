const express = require('express')
//importa base de datos
const db = require('../../db/models/index')

const ruta = express.Router()

ruta.post('/filtrarLibros', async (req, res) => {
  const { inputText } = req.body;
  console.log(req.body);
  try {
    // 'Op.like': buscar coincidencias parciales en el título
    const libros = await db.libro.findAll({ where: { titulo: { [db.Sequelize.Op.like]: `%${inputText}%` } } });
    if (libros.length > 0) {
      res.json({ success: true, libros: libros });
    } else {
      res.status(401).json({ success: false, libros: [] });
    }
  } catch (error) {
    console.error('Error al buscar las coincidencias de los libros!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del servidor!' });
  }
});

ruta.post('/LibrosTop', async (req, res) => {
  try {
    const topLibros = await db.reserva.findAll({
      attributes: ['id_libro', [db.sequelize.fn('COUNT', 'id_libro'), 'count']],
      group: ['id_libro'],
      order: [[db.sequelize.literal('count'), 'DESC']]
    });
    let idsLibros = topLibros.map(reserva => reserva.id_libro).slice(0,2);//21 - 26
    //topLibros.forEach(reserva => {console.log(`Libro ID: ${reserva.id_libro}, Cuenta: ${reserva.get('count')}`);});
    //console.log("ids_libros where: ", idsLibros);
    const libros = await db.libro.findAll({
      where: {
        id: idsLibros
      }
    })
    libros.sort((a, b) => {
      return idsLibros.indexOf(a.id) - idsLibros.indexOf(b.id);
    });
    //libros.forEach(reserva => {console.log(`Libro ID: ${reserva.id}, Titulo: ${reserva.titulo}`);});
    //console.log("enviando libros: ",libros)
    if (libros) {
      res.json({ success: true, libros: libros});
    } else {
      res.status(401).json({ success: false, libros: [] });
    }
  } catch (error) {
    console.error('Error al buscar top libros', error);
    res.status(500).json({ success: false, message: 'Error del servidor!' });
  }
});

ruta.post('/filtrarReservas', async (req, res) => {
  try {
    const reservas = await db.reserva.findAll();
    if (reservas.length > 0) {
      res.json({ success: true, reservas: reservas });
    } else {
      res.status(401).json({ success: false});
    }
  } catch (error) {
    console.error('Error al buscar todas las reservas!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

ruta.post('/reservas_libros_usuario', async (req, res) => {
  try {
    const reservas = await db.reserva.findAll({
      //where:{'disponibilidad': 1},
      include: ['reservalibro', 'usuariolibro'],
      order: [['fecha','DESC']]
    });
    if (reservas.length > 0) {
      res.status(201).json({ success: true, reservas: reservas });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error('Error al buscar todas las reservas!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error de reservas_libros_usuario!' });
  }
});



ruta.post('/reservasXid', async (req, res) => {
  const {id_usuario} = req.body;
  console.log("(API) Id_usuario recibido: ", id_usuario);
  try {
    const reservas = await db.reserva.findAll({
      where: { 'id_usuario' : id_usuario, 'disponibilidad': 1}
      ,include: ['reservalibro']
      ,order: [['fecha','DESC']]
    }
    );
    console.log("(API) reservas de la busqueda: ", reservas);
    res.json({ success: true, reservas: reservas});
  } catch (error) {
    console.error('Error al buscar todas las reservas!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

ruta.post('/eliminarReserva', async (req, res) => {
  const { libro } = req.body;
  console.log(req.body);
  try {
    await db.reserva.update(
      { disponibilidad: 1 },
      { where: { id_libro: libro.id } }
    );
    await db.libro.update(
      { disponibilidad_libro: 1 },
      { where: { id: libro.id } }
    );
  } catch (error) {
    console.error('Error al buscar las coincidencias de los libros!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});


ruta.post('/idusuario', async (req, res) => {
  const { usuario } = req.body;
  console.log(req.body);
  try {
    const user = await db.usuario.findOne({ where: { correo: usuario } });
    if (user) {
      res.json({ success: true, id_usuario: user.id });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error('Error al autenticar al usuario!!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

ruta.post('/librosCita', async (req, res) => {
  const { id_libro } = req.body;
  console.log(req.body);
  try {
    const libro = await db.libro.findOne({ where: { id: id_libro } });
    if (libro) {
      res.json({ success: true, titulo: libro.titulo, imagen_portada_url: libro.imagen_portada_url, url_compra: libro.url_compra, editorial: libro.editorial });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (error) {
    console.error('Error al buscar libro!!!!!', error);
    res.status(500).json({ success: false, message: 'Error del server!' });
  }
});

module.exports = ruta;
