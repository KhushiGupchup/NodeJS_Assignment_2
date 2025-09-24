import React from 'react';

interface AlertData {
  userEmail: string;
  cryptoSymbol: string;
  condition: string;
  targetPrice: number;
  currentPrice: number;
}

function AlertList({ alerts }: { alerts: AlertData[] }) {
  return (
    <ul>
      {alerts.map((alert, idx) => (
        <li key={idx}>
          🔔 {alert.cryptoSymbol.toUpperCase()} is now ${alert.currentPrice} ({alert.condition} ${alert.targetPrice}) → Notified {alert.userEmail}
        </li>
      ))}
    </ul>
  );
}

export default AlertList;
