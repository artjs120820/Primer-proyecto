import React, { useState } from 'react';

const RecoverPassword = () => {
  const [state, setState] = useState({ correo: "" });

  function mngmtChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  async function mngmtSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('/api/recovered/recovered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(state),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        const { password, tipo_usuario } = data;
        if (tipo_usuario === "administrador") {
          alert("No se puede proporcionar datos de un administrador!");
        } else {
          alert("La contraseña del usuario es: " + password);
          window.location.href = "/login";
        }
      }
    } catch (error) {
      alert('Error al realizar la solicitud');
    }
  }

  return (
    <div className="container-oc">
      <div className="form-container-oc">
        <div className="title-oc">Recuperación de Contraseña (SOLO USUARIOS)</div>
        <form onSubmit={mngmtSubmit}>
          <div>
            <label className="form-label-oc" htmlFor="correo">Correo electrónico:</label>
            <input
              className="form-input-oc"
              type="email"
              id="correo"
              name="correo"
              value={state.correo}
              onChange={mngmtChange}
              required
            />
          </div>
          <button className="button-oc" type="submit" onSubmit={mngmtSubmit}>Recuperar contraseña</button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;