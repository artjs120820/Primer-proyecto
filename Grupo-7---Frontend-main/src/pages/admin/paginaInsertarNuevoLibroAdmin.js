import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router';


const AgregarNuevo = () => {
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

    //------------------------ GUARDADO DE LIBRO --------------------------
    const [libroNuevo, setLibroNuevo] = useState(
        { titulo: '', autor: '', isbn13: '', tema: '' }
    )


    function mngmtChange(e) {
        console.log(e.target.name, e.target.value)
        setLibroNuevo({ ...libroNuevo, [e.target.name]: e.target.value })
    }

    async function mngmtSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        for (let [key, value] of Object.entries(libroNuevo)) {
            formData.append(key, value)
        }
        //Una vez que se ha cargado el formData, se envia el formulario normalmente usando fetch (backend)...
        console.log(formData)
        try {
            await escribir();
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            alert("El correo electronico ya existe. Por favor, inténte con otro.");
        }
    }

    const [flag, setFlag] = useState(false)

    async function escribir() {
        console.log(isbn13);
        const response = await fetch('/api/register/registrarLibro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(libroNuevo),
        });
        const data2 = await response.json();
        console.log(data2.success);
        if (data2.success) {
            setFlag(true);
        } else {
            alert("Ya existe un libro con el mismo ISBN. Por favor, inténte con otro.");
        }
    }

    const completo = () => {
        setFlag(false);
        setLibroNuevo({
            titulo: "",
            autor: "",
            isbn13: "",
            tema: "",
        });
        const userData = { usuario };
        localStorage.setItem("usuario", JSON.stringify(userData));
        router.push(`/admin/paginaResultadosAdmin`);
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
                                INSERTAR NUEVO LIBRO
                            </div>
                        </div>
                        <form className="opciones-contenido" onSubmit={mngmtSubmit}>
                            <div className="column-2">
                                <div className="input-container-2">
                                    <label className="form-label-2" htmlFor="titulo">TÍTULO</label>
                                    <input
                                        className="form-input-2"
                                        type="text"
                                        id="titulo"
                                        name="titulo"
                                        onChange={mngmtChange}
                                        value={libroNuevo.titulo}
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
                                        onChange={mngmtChange}
                                        value={libroNuevo.autor}
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
                                        onChange={mngmtChange}
                                        value={libroNuevo.isbn13}
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
                                        onChange={mngmtChange}
                                        value={libroNuevo.tema}
                                        required
                                    />
                                </div>
                                <div className="button-container-2" >
                                    <button className="register-button-2" disabled={!(libroNuevo.titulo && libroNuevo.autor && libroNuevo.isbn13 && libroNuevo.tema)} >Guardar</button>
                                </div>
                            </div>
                        </form>
                        {flag && (
                            <div className="confirmacion-fondo">
                                <div className="confirmacion">
                                    <h2>Registro completo</h2>
                                    <h3>El recurso ha sido grabado con éxito</h3>
                                    <button onClick={completo}>OK</button>
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