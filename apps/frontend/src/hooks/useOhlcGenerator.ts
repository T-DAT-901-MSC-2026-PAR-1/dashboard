import { useState, useEffect, useRef } from 'react';
import { OHLCEvent } from '../types';

const CANDLE_INTERVAL = 10000; // 10 seconds per candle
const MAX_CANDLES = 100;

const random = (min: number, max: number) => Math.random() * (max - min) + min;

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

const generateOHLCCandle = (
  symbol: string,
  lastClose: number,
  startTime: number,
  basePrice: number
): OHLCEvent => {
  // Generate open based on last close with small gap
  const gapPercent = random(-0.002, 0.002); // -0.2% to +0.2% gap
  const open = lastClose * (1 + gapPercent);

  // Generate price movement during candle
  const volatility = basePrice * 0.003; // 0.3% volatility
  const trend = random(-volatility, volatility);

  // Generate high and low
  const priceRange = Math.abs(trend) + volatility * random(0.5, 1.5);
  const high = open + Math.abs(priceRange * random(0.3, 1));
  const low = open - Math.abs(priceRange * random(0.3, 1));

  // Generate close
  const close = open + trend;

  // Ensure OHLC relationships are valid
  const validHigh = Math.max(high, open, close);
  const validLow = Math.min(low, open, close);

  // Keep prices within reasonable bounds (±5% of base price)
  const minPrice = basePrice * 0.95;
  const maxPrice = basePrice * 1.05;
  const clampedClose = Math.max(minPrice, Math.min(maxPrice, close));
  const clampedOpen = Math.max(minPrice, Math.min(maxPrice, open));
  const clampedHigh = Math.max(minPrice, Math.min(maxPrice, validHigh));
  const clampedLow = Math.max(minPrice, Math.min(maxPrice, validLow));

  // Generate volume (random with occasional spikes)
  let volume = random(50, 200);
  if (Math.random() < 0.15) {
    volume *= random(2, 5); // Volume spikes
  }

  return {
    base: symbol,
    start_ts: startTime,
    end_ts: startTime + CANDLE_INTERVAL,
    open: clampedOpen,
    high: clampedHigh,
    low: clampedLow,
    close: clampedClose,
    volume: parseFloat(volume.toFixed(8)),
  };
};

export const useOhlcGenerator = (symbol: string): {
  ohlcData: OHLCEvent[];
} => {
  const [ohlcData, setOhlcData] = useState<OHLCEvent[]>([]);
  const basePrice = getBasePriceForSymbol(symbol);
  const lastClose = useRef<number>(basePrice);
  const currentSymbol = useRef<string>(symbol);
  const startTimeRef = useRef<number>(Date.now() - MAX_CANDLES * CANDLE_INTERVAL);
  const isInitialized = useRef<boolean>(false);

  useEffect(() => {
    // Generate initial historical data on first mount or when symbol changes
    if (!isInitialized.current || currentSymbol.current !== symbol) {
      const newBasePrice = getBasePriceForSymbol(symbol);
      lastClose.current = newBasePrice;
      currentSymbol.current = symbol;
      startTimeRef.current = Date.now() - MAX_CANDLES * CANDLE_INTERVAL;

      // Generate initial historical data
      const historicalCandles: OHLCEvent[] = [];
      for (let i = 0; i < MAX_CANDLES; i++) {
        const candleStartTime = startTimeRef.current + i * CANDLE_INTERVAL;
        const candle = generateOHLCCandle(
          symbol,
          lastClose.current,
          candleStartTime,
          newBasePrice
        );
        lastClose.current = candle.close;
        historicalCandles.push(candle);
      }
      setOhlcData(historicalCandles);
      startTimeRef.current = Date.now();
      isInitialized.current = true;
    }

    const generateNewCandle = () => {
      const currentBasePrice = getBasePriceForSymbol(symbol);
      const candleStartTime = startTimeRef.current;

      const newCandle = generateOHLCCandle(
        symbol,
        lastClose.current,
        candleStartTime,
        currentBasePrice
      );

      lastClose.current = newCandle.close;
      startTimeRef.current += CANDLE_INTERVAL;

      setOhlcData((prevData) => {
        const updatedData = [...prevData, newCandle].slice(-MAX_CANDLES);
        return updatedData;
      });
    };

    // Generate new candle every interval
    const interval = setInterval(generateNewCandle, CANDLE_INTERVAL);

    return () => clearInterval(interval);
  }, [symbol]);

  return { ohlcData };
};
