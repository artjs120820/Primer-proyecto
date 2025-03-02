import Link from 'next/link'
import Head from 'next/head'

import { useState } from "react"
import { useRouter } from 'next/router';


const Formulario = () => {
  const router = useRouter();
  const [isValid, setIsValid] = useState(true)

  const [state, setState] = useState(
    { nombre: "", apellido: "", tipo_documento: "", nro_documento: "", correo: "", password: "", repetir_password: "" }
  )

  function mngmtChange(e) {
    console.log(e.target.name, e.target.value)
    setState({ ...state, [e.target.name]: e.target.value })
  }

  async function mngmtSubmit(e) {
    e.preventDefault();

    if (state.password !== state.repetir_password) {
      setIsValid(false)
      alert('No coincide la contraseña');
      return;
    }
    setIsValid(true)
    let formData = new FormData();
    for (let [key, value] of Object.entries(state)) {
      formData.append(key, value)
    }
    //Una vez que se ha cargado el formData, se envia el formulario normalmente usando fetch (backend)...
    console.log(formData)

    if (e.nativeEvent.submitter.classList.contains('register-button')) {
      try {
        await doEscribir();
      } catch (error) {
        console.error("Error al registrar el usuario:", error);
        alert("El correo electronico ya existe. Por favor, inténte con otro.");
      }
    }
  }

  async function doEscribir() {
    try {
      const response = await fetch('/api/register/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify(state),
      });
      const data2 = await response.json();
      const { success } = data2;
      if (success) {
        alert(data2.message || 'Registrado correctamente!');
        router.push("/login");
      } else {
        alert(data2.message || 'Error al registrar!');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert('Error al realizar la solicitud');
    }
  };

  return (
    <>
      <div className="title">Sistema de Reserva de Libros</div>
      <div className="subtitle">Registro de Usuario</div>
      <div className="container">
        <form onSubmit={mngmtSubmit}>
          <div className="center-container">
            <div className="column">
              <div className="columna-subtitulo" >Datos personales</div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="nombre">Nombres:</label>
                <input className="form-input" type="text" id="nombre" name="nombre" onChange={mngmtChange} value={state.nombre} required autoComplete="current-password" />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="apellido">Apellidos:</label>
                <input className="form-input" type="text" id="apellido" name="apellido" onChange={mngmtChange} value={state.apellido} required autoComplete="current-password" />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="tipo_documento">Tipo de Documento:</label>
                <input className="form-input" type="text" id="tipo_documento" name="tipo_documento" onChange={mngmtChange} value={state.tipo_documento} required autoComplete="current-password" />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="nro_documento">Nro de Documento:</label>
                <input className="form-input" type="text" id="nro_documento" name="nro_documento" onChange={mngmtChange} value={state.nro_documento} required autoComplete="current-password" />
              </div>
            </div>
            <div className="column">
              <div className='columna-subtitulo' >Datos de la cuenta</div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="correo">Correo Electrónico:</label>
                <input className="form-input" type="email" id="correo" name="correo" onChange={mngmtChange} value={state.correo} required autoComplete="current-password" />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="password">Password:</label>
                <input className="form-input" type="password" id="password" name="password" onChange={mngmtChange} value={state.password} required autoComplete="current-password" />
              </div>
              <div className="input-container" onSubmit={mngmtSubmit}>
                <label className="form-label" htmlFor="repetir_password">Repetir Password:</label>
                <input className="form-input" type="password" id="repetir_password" name="repetir_password" onChange={mngmtChange} value={state.repetir_password} required autoComplete="current-password" />
              </div>
              <div className="button-container" onSubmit={mngmtSubmit}>
                <button className="register-button" >Registrar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
export default Formulario