import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router';


const AgregarNuevo = () => {
    const router = useRouter();
    const [usuario, setUsuario] = useState('');
    const { id_libro } = router.query;
    const [primernombre, setPrimernombre] = useState('');

    const [state, setState] = useState(
        { titulo: '', autor: '', isbn13: '', tema: '', isbn13aux: '' }
    )
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
    useEffect(() => {
        if (id_libro) {
            const recopilarInfoLibro = async () => {
                try {
                    const response = await fetch('/api/editarlibro/recoger', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id_libro }),
                    });

                    const data = await response.json();
                    const { titulo } = data;
                    const { autor } = data;
                    const { isbn13 } = data;
                    const { tema } = data;
                    setState({ titulo: titulo, autor: autor, isbn13: isbn13, tema: tema, isbn13aux: isbn13 });
                } catch (error) {
                    console.error('Error de conexión');
                }
            };
            recopilarInfoLibro();
        }
    }, [id_libro]);
    //------------------------------------------------------------------------------

    const [flag, setFlag] = useState(false);
    const [flag2, setFlag2] = useState(false);
    const handleGuardarClick = async (event) => {
        event.preventDefault();
        await actualizarLibro(state);
    };
    const handleGuardarClick2 = async (event) => {
        event.preventDefault();
        setFlag2(true);
    };
    function noeliminar() {
        setFlag2(false);
    }
    async function eliminar(id_libro) {
        try {
            const response = await fetch('/api/eliminar/libro', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_libro }),
            });
            const data = await response.json();
            if (data.success) {
                setFlag(true);
                const userData = { usuario };
                localStorage.setItem("usuario", JSON.stringify(userData));
                router.push(`/admin/paginaResultadosAdmin`);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error de conexión');
        }
    }
    async function actualizarLibro(nuevosDatos) {
        try {
            const response = await fetch('/api/editarlibro/editar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevosDatos),
            });
            const data = await response.json();
            if (data.success) {
                setFlag(true);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error de conexión');
        }
    }
    //-----------------------------------------------------------------------------------------
    const completo = () => {
        setFlag(true);
        const userData = { usuario };
        localStorage.setItem("usuario", JSON.stringify(userData));
        router.push(`/admin/paginaResultadosAdmin`);
    }
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
                        <img
                            src="/Rectangle 5.png"
                            alt="Imagen del administrador"
                            id="imagenAdmin"
                            style={{
                                maxWidth: '100%', //ancho máximo de la imagen
                                maxHeight: '300px', //altura máxima de la imagen
                            }}
                        />
                    </div>
                    <div className="opciones2">
                        <div className="opciones-superior">
                            <div className='opciones-3'>
                                EDITAR LIBRO
                            </div>
                        </div>
                        <form className="opciones-contenido">
                            <div className="column-2">
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="titulo">TÍTULO</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        value={state.titulo || ''}
                                        onChange={(e) => {
                                            setState({ titulo: e.target.value, autor: state.autor, isbn13: state.isbn13, tema: state.tema, isbn13aux: state.isbn13aux });
                                        }}
                                        required
                                    />
                                </div>
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="autor">Autor, autores</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="autor"
                                        name="autor"
                                        value={state.autor || ''}
                                        onChange={(e) => {
                                            setState({ titulo: state.titulo, autor: e.target.value, isbn13: state.isbn13, tema: state.tema, isbn13aux: state.isbn13aux });

                                        }}
                                        required
                                    />
                                </div>
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="isbn13">ISBN</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="isbn13"
                                        name="isbn13"
                                        value={state.isbn13 || ''}
                                        onChange={(e) => {
                                            setState({ titulo: state.titulo, autor: state.autor, isbn13: e.target.value, tema: state.tema, isbn13aux: state.isbn13aux });

                                        }}
                                        required
                                    />
                                </div>
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="tema">Serie, tipo</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="tema"
                                        name="tema"
                                        value={state.tema || ''}
                                        onChange={(e) => {
                                            setState({ titulo: state.titulo, autor: state.autor, isbn13: state.isbn13, tema: e.target.value, isbn13aux: state.isbn13aux });

                                        }}
                                        required
                                    />
                                </div>
                                <div className="button-container-2" >
                                    <button className="register-button-2" disabled={!(state.titulo && state.autor && state.isbn13 && state.tema)} onClick={handleGuardarClick}>Guardar</button>
                                    <button className="register-button-2" onClick={handleGuardarClick2}>Eliminar libro</button>
                                </div>
                            </div>
                        </form>
                        {flag && (
                            <div className="confirmacion-fondo">
                                <div className="confirmacion">
                                    <h2>Registro completo</h2>
                                    <h3>El recurso ha sido EDITADO con éxito</h3>
                                    <button onClick={completo}>OK</button>
                                </div>
                            </div>

                        )}
                        {flag2 && (
                            <div className="confirmacion-fondo">
                                <div className="confirmacion">
                                    <h2>¿Seguro que deseas eliminar el libro?</h2>
                                    <button onClick={eliminar(id_libro)}>SÍ</button>
                                    <button onClick={noeliminar}>NO</button>
                                </div>
                            </div>

                        )}
                    </div>
                </div>


            </>
        }></Layout>
    )

}
export default AgregarNuevo;