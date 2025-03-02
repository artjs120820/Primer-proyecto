import Link from 'next/link'
import { useState } from "react"
import { useRouter } from 'next/router';

const Logear = () => {
  const [state, setState] = useState(
    { usuario: "", contrasena: "" }
  )
  const router = useRouter();

  //CONSULTA API PARA VALIDAR SI ES USUARIO O ADMINISTRADOR (CASO CONTRARIO, EL ERROR SE EVIDENCIA EN EL MENSAJE)
  function mngmtChange(e) {
    console.log(e.target.name, e.target.value)
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const validarLogeo = async (e) => {
    e.preventDefault();
    const { usuario, contrasena } = state;

    try {
      const response = await fetch('/api/login/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify(state),
      });

      const data = await response.json();
      const { success } = data
      if (success) {
        const { tipo_usuario } = data;
        if (tipo_usuario === "administrador") {
          const userData = { usuario }; // Objeto que contiene el nombre de usuario
          localStorage.setItem("usuario", JSON.stringify(userData));
          router.push(`/admin/paginaPrincipalAdmin`);
          //router.push(`/blog/admin/${usuario}/paginaPrincipalAdmin`);
        } else {
          const userData = { usuario }; // Objeto que contiene el nombre de usuario
          localStorage.setItem("usuario", JSON.stringify(userData));
          router.push(`/alumno/paginaPrincipalAlumno`);
          //router.push(`/blog/alumno/${usuario}/paginaPrincipalAlumno`);
        }
      } else {
        alert(data.message || 'Error al autenticar');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      alert('Error al realizar la solicitud');
    }
  };

  return (
    <>
      <div className="title">Sistema de reserva de libros</div>
      <div className="container">
        <div className="form-container">
          <form onSubmit={validarLogeo}> {/* Agregamos onSubmit para manejar el envío del formulario */}
            <div className="input-container">
              <label className="form-label" htmlFor="usuario">Usuario o correo:</label>
              <input className="form-input" type="text" id="usuario" name="usuario" onChange={mngmtChange} value={state.usuario} required autoComplete="current-password" />
            </div>
            <div className="input-container">
              <label className="form-label" htmlFor="contrasena">Contraseña:</label>
              <input className="form-input" type="password" id="contrasena" name="contrasena" onChange={mngmtChange} value={state.contrasena} required autoComplete="current-password" />
            </div>
            <div className="forgot-password-container">
              <Link href="/recover-password">Olvidé mi contraseña</Link>
            </div>

            <div className="button-container">
              <button className="register-button" type="submit">Ingresar</button> {/* Cambiamos el botón a type="submit" para que active onSubmit */}
              <Link href="/register"><button className="login-button">Registrar usuario</button></Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Logear;