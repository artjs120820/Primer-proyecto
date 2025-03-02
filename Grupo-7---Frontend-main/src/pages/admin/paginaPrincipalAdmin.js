import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const Principal = () => {
  const router = useRouter();
  const [primernombre, setPrimernombre] = useState('');
  const [usuario, setUsuario] = useState('');
  const [stats, setStats] = useState([]);
  useEffect(() => {
    const recopilarNombreUsuario = async () => {
      try {
        const usuarioLocalStorage = localStorage.getItem("usuario");
        const { usuario } = usuarioLocalStorage ? JSON.parse(usuarioLocalStorage) : { usuario: "" };
        setUsuario(usuario);
        const response = await fetch('/api/validar/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usuario }),
        });
        const data = await response.json();
        const { nombreDelAlumno } = data;
        if (nombreDelAlumno) {
          const nombreAlumnoArray = nombreDelAlumno.split(' ');
          setPrimernombre(nombreAlumnoArray[0]);
        }
      } catch (error) {
        console.error('Error de conexión');
      }
    };

    recopilarNombreUsuario();
  }, []);

  //------- ULTIMOS RESERVADOS --------------------
  const [reservas, setReservas] = useState([]);
  async function obtenerReservas() {
    try {
      const response = await fetch('/api/filtrar/reservas_libros_usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify()
      });

      const data = await response.json();
      if (response.ok) {
        const { reservas } = data;
        setReservas(reservas.filter((reserva) => reserva.disponibilidad == 1));
      } else {
        setReservas([]);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert('Error al realizar la solicitud');
    }

  };
  //LIBROS TOP
  async function obtenerStats() {
    try {
      const response = await fetch('/api/filtrar/LibrosTop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      const { libros } = data;
      setStats(libros);
      console.log("DataStats", data);
    } catch (error) {
      console.error('Error de conexión');
    }
  };

  useEffect(() => {
    obtenerReservas();
    obtenerStats();
  }, []);

  useEffect(() => {
    console.log("Reservas: ", reservas);
  }, [reservas])


  //LOGICA PARA IR AL INICIO
  const [MostrarValidacion, setMostrarValidacion] = useState(false);
  function ValidacionDeSalida() {
    setMostrarValidacion(true);
  }
  function confirmacionSalida() {
    router.push("/login");
  }
  function nosalir() {
    setMostrarValidacion(false);
  }

  //LOGICA RUTAS
  const redirigirConUsuario = (ruta) => {
    const userData = { usuario };
    localStorage.setItem("usuario", JSON.stringify(userData));
    router.push(ruta);
  };
  return (
    <>
      <Layout content={
        <>
          <div className="contenidoizquierda">
            <div className="opciones">
              <ul>
                <li><button onClick={() => redirigirConUsuario(`/admin/paginaPrincipalAdmin`)}>Inicio</button></li>
                <li><button onClick={() => redirigirConUsuario(`/admin/paginaPerfilAdmin`)}>Perfil</button></li>
                <li><button onClick={() => redirigirConUsuario(`/admin/paginaResultadosAdmin`)}>Bibliotecas</button></li>
                <li><button onClick={ValidacionDeSalida}>Salir</button></li>
                {MostrarValidacion && (
                  <>
                    <div className="confirmacion-fondo">
                      <div className="seccion-confirmacion-2">
                        <h1>¿Seguro que quiere salir?</h1>
                        <button className="buttonfecha" onClick={confirmacionSalida}>SÍ</button>
                        <button className="buttonfecha" onClick={nosalir}>NO</button>
                      </div>
                    </div>
                  </>
                )}
              </ul>
            </div>
            <p className="version">Biblio v1.0.1-Alpha</p>
          </div>
          <div className="seccion-titulo">
            <h2>Bienvenido, {primernombre}!</h2>
          </div>
          <div className="linea"></div>
          <div className="seccion-igual-1">
            <div className="titulo_seccion">Últimas reservas</div>
            <div className="cartas_fila">
              {reservas.slice(0, 2).map((reserva, index) => ( //RESERVAS TEST
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{reserva.reservalibro.titulo}</h2></div>
                    <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}<span className="User_Card"> User: {reserva.usuariolibro.correo.split("@")[0]}</span></p>
                  </div>
                  <div className="imagen">
                    <img src={reserva.reservalibro.imagen_portada_url} loading="lazzy" alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
            <button className="ver_todo" onClick={() => redirigirConUsuario(`/paginaUltimasReservas`)}>Ver todo</button>
          </div>

          <div className="seccion-igual-2">
            <div className="titulo_seccion">Los más pedidos</div>
            <div className="cartas_fila">
              {stats.map((libro, index) => (
                <div className="carta" key={index}>
                  <div className="contenido">
                    <div className='Titulo_card'>
                      <h2>{libro.titulo}</h2>
                    </div>
                    <p className='Fecha_card'>{libro.autor}</p>
                  </div>
                  <div className="imagen">
                    <img src={libro.imagen_portada_url} alt="/media.png" className="icono_default" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      } />
    </>
  )
}

export default Principal;
