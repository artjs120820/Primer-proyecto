import LayoutR from '@/components/LayoutReservas'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Principal = () => {

    const router = useRouter();
    const [usuario, setUsuario] = useState('');
    const [reservas, setReservas] = useState([]);
    const { query } = router;
    const [tipousuario, setTipousuario] = useState('');
    const [id_usuario, setId_usuario] = useState(0);

    useEffect(() => {
        const recopilarRouterValue = () => {
            const usuarioLocalStorage = localStorage.getItem("usuario");
            const { usuario } = usuarioLocalStorage ? JSON.parse(usuarioLocalStorage) : { usuario: "" };
            setUsuario(usuario);
        };
        recopilarRouterValue();
    }, [])
    async function obtenerId() {
        try {
            const response = await fetch('/api/validar/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario }),
            });
            const data = await response.json();
            const { id_usuario } = data;
            const { tipo_usuario } = data;
            setTipousuario(tipo_usuario);
            console.log("Data", data);
            setId_usuario(id_usuario);
            console.log("id_usuario", id_usuario);
        } catch (error) {
            console.error('Error de conexión');
        }
    };

    //------- ULTIMOS RESERVADOS --------------------
    async function obtenerReservas() {
        try {
            const response = await fetch('/api/filtrar/reservas_libros_usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            if (response.ok) {
                const { reservas } = data;
                setReservas(reservas);
                console.log("Reservas general: ", reservas);
            } else {
                alert(data.message || 'Error al encontrar reservas');
            }
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            alert('Error al realizar la solicitud');
        }
    };

    function crearCarta(index, reserva) {
        const cartasFila = (
            <>
                <div className={reserva.disponibilidad == 1 ? ("carta") : ("carta_off")} key={index}>
                    <div className="contenido">
                        <div className='Titulo_card'>
                            <h2>{reserva.reservalibro.titulo}</h2></div>
                        <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
                    </div>
                    <div className="imagen">
                        <img src={reserva.reservalibro.imagen_portada_url} alt="portada" className="icono_default" />
                    </div>
                </div>
            </>
        );
        return (cartasFila);
    }

    function crearCartaUSER(index, reserva) {
        return (
            <>
                <div className={reserva.disponibilidad == 1 ? ("carta") : ("carta_off")} key={index}>
                    <div className="contenido">
                        <div className='Titulo_card'>
                            <h2 >{reserva.reservalibro.titulo}</h2>
                        </div>
                        <p className='Fecha_card'>{new Date(reserva.fecha).toLocaleDateString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })} <span className="User_Card">User: {reserva.usuariolibro.correo.split("@")[0]}</span></p>
                    </div>
                    <div className="imagen">
                        <img src={reserva.reservalibro.imagen_portada_url} alt="portada" className="icono_default" />
                    </div>
                </div>
            </>
        )
    }

    function mostrarLibros(reservas) {
        const resultado = [];

        for (let i = 0; i < reservas.length; i += 2) {
            const cartasFila = (
                <div className='cartas_fila' key={i}>
                    {crearCarta(i, reservas[i])}
                    {i + 1 < reservas.length && (
                        crearCarta(i + 1, reservas[i + 1])
                    )}
                </div>
            );
            resultado.push(cartasFila);
        }

        return resultado;
    }
    function mostrarLibrosADMIN(reservas) {
        const resultado = [];

        for (let i = 0; i < reservas.length; i += 2) {
            const cartasFila = (
                <div className='cartas_fila' key={i}>
                    {crearCartaUSER(i, reservas[i])}
                    {i + 1 < reservas.length && (
                        crearCartaUSER(i + 1, reservas[i + 1])
                    )}
                </div>
            );
            resultado.push(cartasFila);
        }

        return resultado;
    }


    useEffect(() => {
        if (!id_usuario) {
            obtenerId();
            obtenerReservas();
        }
    }, [id_usuario, reservas]);

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
            <LayoutR content={
                <>
                    <div className="contenidoizquierda">
                        <div className="opciones">
                            <ul>
                                {tipousuario === "usuario" && (
                                    <>
                                        <li><button onClick={() => redirigirConUsuario(`/alumno/paginaPrincipalAlumno`)}>Inicio</button></li>
                                        <li><button onClick={() => redirigirConUsuario(`/alumno/paginaPerfilAlumno`)}>Perfil</button></li>
                                        <li><button onClick={() => redirigirConUsuario(`/alumno/paginaResultadosAlumno`)}>Bibliotecas</button></li>
                                        <li><button onClick={ValidacionDeSalida}>Salir</button></li>
                                    </>
                                )}
                                {tipousuario === "administrador" && (
                                    <>
                                        <li><button onClick={() => redirigirConUsuario(`/admin/paginaPrincipalAdmin`)}>Inicio</button></li>
                                        <li><button onClick={() => redirigirConUsuario(`/admin/paginaPerfilAdmin`)}>Perfil</button></li>
                                        <li><button onClick={() => redirigirConUsuario(`/admin/paginaResultadosAdmin`)}>Bibliotecas</button></li>
                                        <li><button onClick={ValidacionDeSalida}>Salir</button></li>
                                    </>
                                )}
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
                        <h2>Utimas reservas</h2>
                    </div>
                    <div className="linea2"></div>
                    <div className="ultimas_reservas_pag_block">
                        {tipousuario === "administrador" ? (
                            mostrarLibrosADMIN(reservas, 2)
                        ) : mostrarLibros(reservas.filter((reserva) => reserva.id_usuario == id_usuario), 2)}
                    </div>
                </>
            } />
        </>
    )
}

export default Principal;
//