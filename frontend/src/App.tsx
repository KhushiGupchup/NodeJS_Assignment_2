import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AlertForm from './components/AlertForm';
import AlertList from './components/AlertList';

const socket = io('http://localhost:5000'); // backend URL

interface AlertData {
  userEmail: string;
  cryptoSymbol: string;
  condition: string;
  targetPrice: number;
  currentPrice: number;
}

function App() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    socket.on('priceAlert', (data: AlertData) => {
      setAlerts((prev) => [data, ...prev]);
    });

    return () => {
      socket.off('priceAlert');
    };
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Crypto Price Alert System</h1>
      <AlertForm />
      <hr />
      <h2>Real-time Alerts</h2>
      <AlertList alerts={alerts} />
    </div>
  );
}

export default App;
