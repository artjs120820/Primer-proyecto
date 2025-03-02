import '../styles/estilos1.css'
import '../styles/estilos2.css'
import '../styles/estilos3.css'
import '../styles/estilos4.css'
import '../styles/estilos5.css'
import '../styles/estilos6.css'
import '../styles/cards.css'
import '../styles/estilos7.css'

import { AppProps } from 'next/app'
import { DemoProvider } from './context/demo'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useState } from 'react';

export default function MyApp({ Component, pageProps }) {
  const [fechainicial, setFechainicial] = useState(new Date());
  /*
  useEffect(() => {
    const recopilarIdUsuario = async () => {
      try {
        await fetch('/api/actualizarAdmin/reserva', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fechainicial }),
        });
      } catch (error) {
        console.error('Error de conexión');
      }
    };
    recopilarIdUsuario();
  });
  */
  return (
    <DemoProvider>
      <Component {...pageProps} />
    </DemoProvider>
  );
}