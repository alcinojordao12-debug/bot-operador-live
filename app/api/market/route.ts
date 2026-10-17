import { NextResponse } from 'next/server';
import { CryptoMarketAsset } from '@/lib/types';

// In-memory cache for market rates (15 seconds TTL)
let cachedData: CryptoMarketAsset[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 15000;

// High quality fallback prices if network or rate limit happens
const FALLBACK_ASSETS: CryptoMarketAsset[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    price: 67950.0,
    change24h: 2.45,
    high24h: 68420.0,
    low24h: 66200.0,
    volume24h: 31200000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    price: 2542.8,
    change24h: 1.15,
    high24h: 2590.0,
    low24h: 2495.0,
    volume24h: 14800000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    price: 158.8,
    change24h: 4.82,
    high24h: 161.4,
    low24h: 150.2,
    volume24h: 4600000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'LINK/USDT',
    name: 'Chainlink',
    price: 11.45,
    change24h: -0.65,
    high24h: 11.90,
    low24h: 11.10,
    volume24h: 320000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'PEPE/USDT',
    name: 'Pepe',
    price: 0.00001042,
    change24h: 6.85,
    high24h: 0.00001095,
    low24h: 0.00000965,
    volume24h: 1150000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'DOGE/USDT',
    name: 'Dogecoin',
    price: 0.128,
    change24h: 3.12,
    high24h: 0.134,
    low24h: 0.122,
    volume24h: 980000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'SUI/USDT',
    name: 'Sui',
    price: 2.14,
    change24h: 5.40,
    high24h: 2.22,
    low24h: 1.98,
    volume24h: 670000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
  {
    symbol: 'NEAR/USDT',
    name: 'NEAR Protocol',
    price: 4.88,
    change24h: 1.80,
    high24h: 5.05,
    low24h: 4.70,
    volume24h: 410000000,
    lastUpdated: new Date().toISOString(),
    source: 'SIMULATION_FALLBACK',
    dataQuality: 'DADOS DE SIMULAÇÃO',
  },
];

export async function GET() {
  const now = Date.now();

  // Return cached data if still fresh
  if (cachedData && now - lastCacheTime < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      assets: cachedData.map(a => ({ ...a, dataQuality: 'DADOS EM CACHE' as const })),
      cachedAt: new Date(lastCacheTime).toISOString(),
    });
  }

  try {
    // Attempt to fetch from Binance public 24hr ticker API (reliable, fast, no API key required)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'LINKUSDT', 'PEPEUSDT', 'DOGEUSDT', 'SUIUSDT', 'NEARUSDT'];
    const query = JSON.stringify(symbols);

    const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(query)}`, {
      signal: controller.signal,
      next: { revalidate: 15 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const symbolMap: Record<string, { symbol: string; name: string }> = {
          BTCUSDT: { symbol: 'BTC/USDT', name: 'Bitcoin' },
          ETHUSDT: { symbol: 'ETH/USDT', name: 'Ethereum' },
          SOLUSDT: { symbol: 'SOL/USDT', name: 'Solana' },
          LINKUSDT: { symbol: 'LINK/USDT', name: 'Chainlink' },
          PEPEUSDT: { symbol: 'PEPE/USDT', name: 'Pepe' },
          DOGEUSDT: { symbol: 'DOGE/USDT', name: 'Dogecoin' },
          SUIUSDT: { symbol: 'SUI/USDT', name: 'Sui' },
          NEARUSDT: { symbol: 'NEAR/USDT', name: 'NEAR Protocol' },
        };

        const liveAssets: CryptoMarketAsset[] = data.map((item: {
          symbol: string;
          lastPrice: string;
          priceChangePercent: string;
          highPrice: string;
          lowPrice: string;
          quoteVolume: string;
        }) => {
          const meta = symbolMap[item.symbol] || { symbol: item.symbol, name: item.symbol };
          return {
            symbol: meta.symbol,
            name: meta.name,
            price: parseFloat(item.lastPrice),
            change24h: parseFloat(item.priceChangePercent),
            high24h: parseFloat(item.highPrice),
            low24h: parseFloat(item.lowPrice),
            volume24h: parseFloat(item.quoteVolume),
            lastUpdated: new Date().toISOString(),
            source: 'BINANCE_API',
            dataQuality: 'DADOS AO VIVO',
          };
        });

        cachedData = liveAssets;
        lastCacheTime = now;

        return NextResponse.json({
          success: true,
          assets: liveAssets,
          cachedAt: new Date(lastCacheTime).toISOString(),
        });
      }
    }
  } catch {
    // If network error, use cached or fallback
  }

  // Fallback to verified simulation state with clear metadata
  const fallbackWithTimestamp = FALLBACK_ASSETS.map(a => ({
    ...a,
    lastUpdated: new Date().toISOString(),
  }));

  cachedData = fallbackWithTimestamp;
  lastCacheTime = now;

  return NextResponse.json({
    success: true,
    assets: fallbackWithTimestamp,
    cachedAt: new Date().toISOString(),
  });
}
