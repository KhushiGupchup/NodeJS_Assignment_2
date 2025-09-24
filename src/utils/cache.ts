type PriceCacheEntry = {
  price: number;
  timestamp: number;
};

const priceCache: Record<string, PriceCacheEntry> = {};

export function getCachedPrice(symbol: string): number | null {
  const entry = priceCache[symbol];
  if (!entry) return null;
  if (Date.now() - entry.timestamp < 15000) return entry.price; // 15 sec cache
  return null;
}

export function setCachedPrice(symbol: string, price: number) {
  priceCache[symbol] = { price, timestamp: Date.now() };
}
