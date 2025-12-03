import { useState, useEffect, useRef } from 'react';
import { Exchange, VwapData, ExchangeConfig } from '../types';

const EXCHANGES: ExchangeConfig[] = [
  { name: 'Binance', color: '#F0B90B', baseVolume: 125 },
  { name: 'Coinbase', color: '#0052FF', baseVolume: 90 },
  { name: 'Kraken', color: '#5741D9', baseVolume: 75 },
  { name: 'xtpub', color: '#FF6B35', baseVolume: 5 },
  { name: 'CoinEx', color: '#00C087', baseVolume: 2 },
  { name: 'Bitfinex', color: '#52626F', baseVolume: 40 },
];

const BASE_PRICE = 90000;
const MAX_HISTORY = 60;
const UPDATE_INTERVAL = 10000;
const TREND_CHANGE_INTERVAL = 3;

const random = (min: number, max: number) => Math.random() * (max - min) + min;

const roundToNearest10Seconds = (date: Date): Date => {
  const ms = date.getTime();
  const rounded = Math.floor(ms / 10000) * 10000;
  return new Date(rounded);
};

const generateInitialPrices = (basePrice: number): Map<Exchange, number> => {
  const prices = new Map<Exchange, number>();
  EXCHANGES.forEach((exchange) => {
    prices.set(exchange.name, basePrice + random(-200, 200));
  });
  return prices;
};

const generateVwapForExchange = (
  config: ExchangeConfig,
  lastPrice: number,
  trendDirection: number,
  symbol: string,
  basePrice: number
): { vwapData: VwapData; newPrice: number } => {
  const trendMovement = trendDirection * random(50, 200);
  const noise = random(-100, 100);
  let newPrice = lastPrice + trendMovement + noise;

  const minPrice = basePrice * 0.95;
  const maxPrice = basePrice * 1.05;
  newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

  let volume = config.baseVolume * random(0.5, 1.5);
  if (Math.random() < 0.1) {
    volume *= random(2, 5);
  }

  const now = new Date();
  const roundedTime = roundToNearest10Seconds(now);
  const windowStart = new Date(roundedTime.getTime() - 60000);
  const windowEnd = roundedTime;

  const vwapData: VwapData = {
    window_start: windowStart.toISOString(),
    window_end: windowEnd.toISOString(),
    market: config.name,
    from_symbol: symbol,
    to_symbol: 'USDT',
    vwap: newPrice,
    volume: parseFloat(volume.toFixed(8)),
  };

  return { vwapData, newPrice };
};

const getBasePriceForSymbol = (symbol: string): number => {
  const prices: Record<string, number> = {
    BTC: 90000,
    ETH: 3400,
    BNB: 590,
    SOL: 145,
    XRP: 0.62,
    ADA: 0.45,
    DOGE: 0.16,
    AVAX: 35,
    DOT: 7.5,
    MATIC: 0.95,
    LINK: 15,
    UNI: 8.5,
    LTC: 95,
  };
  return prices[symbol] || 1000;
};

export const useVwapGenerator = (symbol: string): {
  vwapHistory: Map<Exchange, VwapData[]>;
  exchangeConfigs: ExchangeConfig[];
} => {
  const [vwapHistory, setVwapHistory] = useState<Map<Exchange, VwapData[]>>(
    new Map()
  );
  const basePrice = getBasePriceForSymbol(symbol);
  const lastPrices = useRef<Map<Exchange, number>>(generateInitialPrices(basePrice));
  const trendDirection = useRef<number>(0);
  const intervalCount = useRef<number>(0);
  const currentSymbol = useRef<string>(symbol);

  useEffect(() => {
    if (currentSymbol.current !== symbol) {
      const newBasePrice = getBasePriceForSymbol(symbol);
      lastPrices.current = generateInitialPrices(newBasePrice);
      setVwapHistory(new Map());
      currentSymbol.current = symbol;
      intervalCount.current = 0;
    }

    const generateData = () => {
      intervalCount.current += 1;

      if (intervalCount.current % TREND_CHANGE_INTERVAL === 0) {
        trendDirection.current = Math.floor(random(-1, 2));
      }

      const newHistory = new Map(vwapHistory);
      const currentBasePrice = getBasePriceForSymbol(symbol);

      EXCHANGES.forEach((config) => {
        const lastPrice = lastPrices.current.get(config.name) || currentBasePrice;
        const { vwapData, newPrice } = generateVwapForExchange(
          config,
          lastPrice,
          trendDirection.current,
          symbol,
          currentBasePrice
        );

        lastPrices.current.set(config.name, newPrice);

        const history = newHistory.get(config.name) || [];
        const updatedHistory = [...history, vwapData].slice(-MAX_HISTORY);
        newHistory.set(config.name, updatedHistory);
      });

      setVwapHistory(newHistory);
    };

    generateData();

    const interval = setInterval(generateData, UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, [symbol]);

  return { vwapHistory, exchangeConfigs: EXCHANGES };
};
