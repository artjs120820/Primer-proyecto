import Link from 'next/link'
import Head from 'next/head'

export default props => (
  <>
    <div className="header">
      <div className="left">
        <img src="/menu_24px.png" alt="Imagen Izquierda" />
      </div>
      <div className="center">
        <h1>Administracion de bibliotecas</h1>
      </div>
      <div className="right">
        <img src="/account_circle_filled_24px.png" alt="Imagen Derecha" />
      </div>
    </div>
    <div className="content-wrapper">
      <main className="main-content">
        {props.content}
      </main>
    </div>
  </>
);
