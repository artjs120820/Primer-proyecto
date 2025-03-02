import Link from 'next/link'
import Head from 'next/head'
import Layout from '@/components/Layout'
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

const Principal = () => {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');


  const [primernombre, setPrimernombre] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoDOC, setTipoDOC] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nroDocumento, setNroDocumento] = useState('');
  const [correo, setCorreo] = useState('');
  const [correoaux, setCorreoaux] = useState('');
  const [password, setPassword] = useState('');
  const [idioma, setIdioma] = useState('');
  const [prefijo, setPrefijo] = useState('');
  const [color, setColor] = useState('');
  const [direccion_imagen_url, setImagenURL] = useState('');

  useEffect(() => {
    const recopilarRouterValue = () => {
      const usuarioLocalStorage = localStorage.getItem("usuario");
      const { usuario } = usuarioLocalStorage ? JSON.parse(usuarioLocalStorage) : { usuario: "" };
      setUsuario(usuario);
    };
    recopilarRouterValue();
  }, [])

  useEffect(() => {
    if (usuario !== '') {
      const recopilarNombreUsuario = async () => {
        try {
          const response = await fetch('/api/validar/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario }),
          });
          const data = await response.json();
          const { nombreDelAlumno } = data;
          const { tipo_documento } = data;
          const { apellido } = data;
          const { nro_documento } = data;
          const { correo } = data;
          const { password } = data;
          const { idioma } = data;
          const { prefijo } = data;
          const { color } = data;
          const { direccion_imagen_url } = data;
          setNombre(nombreDelAlumno);
          setTipoDOC(tipo_documento);
          setApellidos(apellido);
          setNroDocumento(nro_documento);
          setCorreo(correo);
          setCorreoaux(correo);
          setState1({ ...state1, correoaux: correoaux });
          setPassword(password);
          setIdioma(idioma);
          setPrefijo(prefijo);
          setColor(color);
          setImagenURL(direccion_imagen_url);
          const nombreAlumnoArray = (nombreDelAlumno).split(' ');
          setPrimernombre(nombreAlumnoArray[0]);
        } catch (error) {
          console.error('Error de conexión');
        }
      };
      recopilarNombreUsuario();
    }
  }, [usuario]);

  //--------------------------------------------------------------------------------------------------------------------------------------------
  //LOGICA PARA CARGAR IMAGEN

  const handleImagenChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImagenURL(e.target.result);
        setState1({ nombre: nombre, apellidos: apellidos, tipoDOC: tipoDOC, nroDocumento: nroDocumento, correoaux: correoaux, direccion_imagen_url: e.target.result });
        setState2({ correo: correo, password: password, correoaux: correoaux, direccion_imagen_url: e.target.result });
        setState3({ idioma: idioma, prefijo: prefijo, color: color, correoaux: correoaux, direccion_imagen_url: e.target.result });
      };

      reader.readAsDataURL(file);
    }
  };

  //-----------------------DATOS PERSONALES---------------------------------------
  const [state1, setState1] = useState(
    { nombre: '', tipoDOC: '', apellidos: '', nroDocumento: '', correoaux: '', direccion_imagen_url: '' }
  )
  const handleGuardarClick2 = () => {
    actualizarJSONcasoDATOSPERSONALES(state1);
  };
  async function actualizarJSONcasoDATOSPERSONALES(nuevosDatos) {
    console.log(nuevosDatos.direccion_imagen_url);
    try {
      const response = await fetch('/api/actualizarAdmin/admin1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevosDatos),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error de conexión');
    }
  }
  //-----------------------CUENTA---------------------------------------
  const [state2, setState2] = useState(
    { correo: '', password: '', correoaux: '', direccion_imagen_url: '' }
  )
  async function handleGuardarClick() {
    await actualizarJSONcasoCUENTA(state2);
  };
  async function actualizarJSONcasoCUENTA(nuevosDatos) {
    try {
      const response = await fetch('/api/actualizarAdmin/admin2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevosDatos),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error de conexión');
    }
  }
  //-----------------------PREFERENCIAS---------------------------------------
  const [state3, setState3] = useState(
    { idioma: '', prefijo: '', color: '', correoaux: '', direccion_imagen_url: '' }
  )
  const handleGuardarClick3 = () => {
    actualizarJSONcasoPREFERENCIAS(state3);
  };
  async function actualizarJSONcasoPREFERENCIAS(nuevosDatos) {
    try {
      const response = await fetch('/api/actualizarAdmin/admin3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevosDatos),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error de conexión');
    }
  }
  //------------------------------------------------------------------------------------------------------------
  //logica para cambiar de opcion
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('datosPersonales');
  const handleOpcionClick = (opcion) => {
    setOpcionSeleccionada(opcion);
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
            <h2>Hola, {primernombre}!</h2>
          </div>
          <div className="linea"></div>
          <div className="seccion-perfil">
            <div className="imagen-admin">
              {direccion_imagen_url && (
                <><img
                  src={direccion_imagen_url}
                  alt="Imagen del alumno"
                  id="imagenAdmin"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                  }} /><h1></h1><input
                    type="file"
                    id="cargarImagen"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImagenChange}
                  /><label htmlFor="cargarImagen">Cargar imagen</label></>
              )}
              {!direccion_imagen_url && (
                <>
                  <input
                    type="file"
                    id="cargarImagen"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImagenChange}
                  />
                  <label htmlFor="cargarImagen">Cargar imagen</label>
                </>
              )}
            </div>
            <div className="opciones2">
              {/* Parte superior de las opciones */}
              <div className="opciones-superior">
                <button
                  className={`opcion${opcionSeleccionada === 'datosPersonales' ? ' opcion-activa' : ''}`}
                  onClick={() => handleOpcionClick('datosPersonales')}
                >
                  DATOS PERSONALES
                </button>
                <button
                  className={`opcion${opcionSeleccionada === 'cuenta' ? ' opcion-activa' : ''}`}
                  onClick={() => handleOpcionClick('cuenta')}
                >
                  CUENTA
                </button>
                <button
                  className={`opcion${opcionSeleccionada === 'preferencia' ? ' opcion-activa' : ''}`}
                  onClick={() => handleOpcionClick('preferencia')}
                >
                  PREFERENCIA
                </button>
              </div>
              {/* Contenido de las opciones */}
              <div className="opciones-contenido">
                {opcionSeleccionada === 'datosPersonales' && (
                  <div className="column-2">
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="nombre">Nombres:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={nombre}
                        onChange={(e) => {
                          setState1({ nombre: e.target.value, apellidos: apellidos, tipoDOC: tipoDOC, nroDocumento: nroDocumento, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setNombre(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="tipoDOC">Tipo de Documento:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="tipoDOC"
                        name="tipoDOC"
                        required
                        value={tipoDOC}
                        onChange={(e) => {
                          setState1({ nombre: nombre, apellidos: apellidos, tipoDOC: e.target.value, nroDocumento: nroDocumento, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setTipoDOC(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="apellidos">Apellidos:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        required
                        value={apellidos}
                        onChange={(e) => {
                          setState1({ nombre: nombre, apellidos: e.target.value, tipoDOC: tipoDOC, nroDocumento: nroDocumento, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setApellidos(e.target.value);
                        }}
                      />
                    </div>
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="nroDocumento">Nro. de Documento:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="nroDocumento"
                        name="nroDocumento"
                        required
                        value={nroDocumento}
                        onChange={(e) => {
                          setNroDocumento(e.target.value);
                          setState1({ nombre: nombre, apellidos: apellidos, tipoDOC: tipoDOC, nroDocumento: e.target.value, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                        }}
                      />
                    </div>
                    <div className="button-container-2" >
                      <button className="register-button-2" onClick={handleGuardarClick2}>Guardar</button>
                    </div>
                  </div>
                )}
                {opcionSeleccionada === 'cuenta' && (
                  <div className="column-2">
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="correo">Correo:</label>
                      <input
                        className="form-input-2"
                        type="email"
                        id="correo"
                        name="correo"
                        required
                        value={correo}
                        onChange={(e) => {
                          setState2({ correo: e.target.value, password: password, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setCorreo(e.target.value)
                        }}
                      />
                    </div>
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="password">Contraseña:</label>
                      <input
                        className="form-input-2"
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => {
                          setState2({ correo: correo, password: e.target.value, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setPassword(e.target.value)
                        }}
                      />
                    </div>
                    <div className="button-container-2" >
                      <button className="register-button-2" onClick={handleGuardarClick}>Guardar</button>
                    </div>
                  </div>
                )}
                {opcionSeleccionada === 'preferencia' && (
                  <div className="column-2">
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="idioma">Idioma:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="idioma"
                        name="idioma"
                        required
                        value={idioma}
                        onChange={(e) => {
                          setState3({ idioma: e.target.value, prefijo: prefijo, color: color, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setIdioma(e.target.value)
                        }}
                      />
                    </div>
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="prefijo">Prefijo:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="prefijo"
                        name="prefijo"
                        required
                        value={prefijo}
                        onChange={(e) => {
                          setState3({ idioma: idioma, prefijo: e.target.value, color: color, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setPrefijo(e.target.value)
                        }}
                      />
                    </div>
                    <div className="input-container-2" >
                      <label className="form-label-2" htmlFor="color">Color:</label>
                      <input
                        className="form-input-2"
                        type="text"
                        id="color"
                        name="color"
                        required
                        value={color}
                        onChange={(e) => {
                          setState3({ idioma: idioma, prefijo: prefijo, color: e.target.value, correoaux: correoaux, direccion_imagen_url: direccion_imagen_url });
                          setColor(e.target.value)
                        }}
                      />
                    </div>
                    <div className="button-container-2" >
                      <button className="register-button-2" onClick={handleGuardarClick3}>Guardar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      } />
    </>
  )
}

export default Principal;
