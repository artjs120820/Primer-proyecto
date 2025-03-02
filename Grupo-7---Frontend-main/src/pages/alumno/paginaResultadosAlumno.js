import Link from 'next/link';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import LayoutCasoBusquedaAlumno from '@/components/LayoutCasoBusquedaAlumno';
import { useRouter } from 'next/router';


const Principal = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  useEffect(() => {
    const recopilarRouterValue = () => {
      const usuarioLocalStorage = localStorage.getItem("usuario");
      const { usuario } = usuarioLocalStorage ? JSON.parse(usuarioLocalStorage) : { usuario: "" };
      setUsuario(usuario);
    };
    recopilarRouterValue();
  }, [])


  const [busqueda, setBusqueda] = useState('');
  const [checkboxes, setCheckboxes] = useState({
    titulo: false,
    autor: false,
    serie: false,
    isbn: false,
  });

  const limpiarBusqueda = () => {
    setBusqueda('');
    setCheckboxes({
      titulo: false,
      autor: false,
      serie: false,
      isbn: false,
    });
  };

  const buscar = () => {
    const queryParams = {
      busqueda,
      checkboxes: JSON.stringify(checkboxes),
    };
    const userData = { usuario };
    localStorage.setItem("usuario", JSON.stringify(userData));
    router.push({
      pathname: `/alumno/paginaBusquedaLibroAlumno`,
      query: queryParams,
    });
  };

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
      <LayoutCasoBusquedaAlumno content={
        <>
          <div className="contenidoizquierda">
            <div className="opciones">
              <ul>
                <li><button onClick={() => redirigirConUsuario(`/alumno/paginaPrincipalAlumno`)}>Inicio</button></li>
                <li><button onClick={() => redirigirConUsuario(`/alumno/paginaPerfilAlumno`)}>Perfil</button></li>
                <li><button onClick={() => redirigirConUsuario(`/alumno/paginaResultadosAlumno`)}>Bibliotecas</button></li>
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
          <div className="seccion-titulo-resultados">
            <div className="titulo">
              <h2>Búsqueda</h2>
            </div>
          </div>
          <div className="linea2"></div>
          <div className='seccion-resultados-alum'>
            <div className='casilla-para-escribir'>
              <label className='form-label-3' htmlFor='contrasena'>
                Ingresa la palabra clave
                <div className='icono'>
                  <img src='/Icon.png' alt='Icono' />
                </div>
              </label>
              <input
                className='form-input-4'
                type='text'
                id='recurso'
                name='recurso'
                placeholder='Buscar por título'
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className='checkbox-boton'>
              <div className='checkbox-titulo'>
                <b>Incluir búsqueda en:</b>
                <div className='chexboxx'>
                  <input
                    type='checkbox'
                    name='titulo'
                    checked={checkboxes.titulo}
                    onChange={() =>
                      setCheckboxes({ ...checkboxes, titulo: !checkboxes.titulo })
                    }
                  />
                  Título
                </div>
                <div className='chexboxx'>
                  <input
                    type="checkbox"
                    name="autor"
                    checked={checkboxes.autor}
                    onChange={() => setCheckboxes({ ...checkboxes, autor: !checkboxes.autor })}
                  />
                  Autor, Autores
                </div>
                <div className='chexboxx'>
                  <input
                    type="checkbox"
                    name="serie"
                    checked={checkboxes.serie}
                    onChange={() => setCheckboxes({ ...checkboxes, serie: !checkboxes.serie })}
                  />
                  Serie
                </div>
                <div className='chexboxx'>
                  <input
                    type="checkbox"
                    name="isbn"
                    checked={checkboxes.isbn}
                    onChange={() => setCheckboxes({ ...checkboxes, isbn: !checkboxes.isbn })}
                  />
                  ISBN
                </div>
              </div>
              <div className='botones'>
                <button className='boton-limpiar' onClick={limpiarBusqueda}>
                  Limpiar
                </button>
                <button className='boton-buscar' onClick={buscar}>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </>
      } />
    </>
  )
}

export default Principal;
