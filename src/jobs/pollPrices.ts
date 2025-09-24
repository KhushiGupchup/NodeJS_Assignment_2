import axios from 'axios';
import Alert from '../models/Alert';
import { Server as SocketIOServer } from 'socket.io';
import { getCachedPrice, setCachedPrice } from '../utils/cache';

const symbols = ['bitcoin', 'ethereum'];

async function fetchPrices(): Promise<Record<string, number> | null> {
  const cachedPrices: Record<string, number> = {};
  let hasAllCached = true;

  for (const symbol of symbols) {
    const cached = getCachedPrice(symbol);
    if (cached === null) {
      hasAllCached = false;
      break;
    }
    cachedPrices[symbol] = cached;
  }

  if (hasAllCached) return cachedPrices;

  try {
    const ids = symbols.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const response = await axios.get(url);

    const data = response.data;
    const prices: Record<string, number> = {};

    for (const symbol of symbols) {
      const price = data[symbol]?.usd;
      if (typeof price === 'number') {
        setCachedPrice(symbol, price);
        prices[symbol] = price;
      } else {
        console.warn(`No price for ${symbol} in response`);
      }
    }

    return prices;
  } catch (err) {
    console.error('Failed to fetch prices from CoinGecko:', err);
    return null;
  }
}

export function startPricePolling(io: SocketIOServer) {
  setInterval(async () => {
    const prices = await fetchPrices();
    if (!prices) return;

    for (const symbol of symbols) {
      const price = prices[symbol];
      const alerts = await Alert.find({ cryptoSymbol: symbol, notified: false });

      for (const alert of alerts) {
        if (
          (alert.condition === '>' && price > alert.targetPrice) ||
          (alert.condition === '<' && price < alert.targetPrice)
        ) {
          alert.notified = true;
          await alert.save();

          io.emit('priceAlert', {
            userEmail: alert.userEmail,
            cryptoSymbol: symbol,
            currentPrice: price,
            targetPrice: alert.targetPrice,
            condition: alert.condition,
          });

          console.log(`Alert sent: ${alert.userEmail} - ${symbol} price ${price} ${alert.condition} ${alert.targetPrice}`);
        }
      }
    }
  }, 15000);
}
