import React, {useEffect, useRef, useState} from 'react';
import {CandlestickData, CandlestickSeries, createChart, IChartApi, ISeriesApi} from 'lightweight-charts';
import {useOhlcGenerator} from '../../hooks/useOhlcGenerator';

interface OhlcChartProps {
  symbol: string;
}

export const OhlcChart: React.FC<OhlcChartProps> = ({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { ohlcData } = useOhlcGenerator(symbol);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1e1e1e' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderColor: '#2a2a2a',
      },
      rightPriceScale: {
        borderColor: '#2a2a2a',
      },
    });

    chartRef.current = chart;

    seriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current || ohlcData.length === 0) return;

    const chartData: CandlestickData[] = ohlcData.map((candle) => ({
      time: Math.floor(candle.start_ts / 1000) as any,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    seriesRef.current.setData(chartData);
    setLastUpdate(new Date());
  }, [ohlcData]);

  const getLatestCandle = () => {
    if (ohlcData.length === 0) return null;
    return ohlcData[ohlcData.length - 1];
  };

  const calculateStats = () => {
    if (ohlcData.length < 2) {
      return {
        change: 0,
        changePercent: 0,
        high24h: 0,
        low24h: 0,
        volume24h: 0,
      };
    }

    const latest = ohlcData[ohlcData.length - 1];
    const firstCandle = ohlcData[0];

    const change = latest.close - firstCandle.open;
    const changePercent = ((change / firstCandle.open) * 100).toFixed(2);

    // Calculate 24h stats from all available candles
    const high24h = Math.max(...ohlcData.map((c) => c.high));
    const low24h = Math.min(...ohlcData.map((c) => c.low));
    const volume24h = ohlcData.reduce((sum, c) => sum + c.volume, 0);

    return {
      change,
      changePercent,
      high24h,
      low24h,
      volume24h,
    };
  };

  const latestCandle = getLatestCandle();
  const stats = calculateStats();
  const isPositive = stats.change >= 0;

  const formatTime = (date: Date): string => {
    return date.toISOString().substring(11, 19) + ' UTC';
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) return price.toFixed(2);
    if (price >= 1) return price.toFixed(4);
    return price.toFixed(6);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h2 className="text-2xl font-bold text-white">
              OHLC - {symbol}/USDT
            </h2>
            <p className="text-gray-400 text-sm">
              Open-High-Low-Close candlestick chart
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Last update</p>
            <p className="text-sm text-gray-300 font-mono">
              {formatTime(lastUpdate)}
            </p>
          </div>
        </div>
      </div>

      {latestCandle && (
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400 text-xs block">Current Price</span>
            <span className="text-white text-lg font-mono font-bold">
              ${formatPrice(latestCandle.close)}
            </span>
          </div>

          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400 text-xs block">Change</span>
            <span
              className={`text-lg font-mono font-bold ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {formatPrice(stats.change)} ({stats.changePercent}%)
            </span>
          </div>

          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400 text-xs block">Open</span>
            <span className="text-white text-sm font-mono">
              ${formatPrice(latestCandle.open)}
            </span>
          </div>

          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400 text-xs block">High</span>
            <span className="text-green-400 text-sm font-mono">
              ${formatPrice(latestCandle.high)}
            </span>
          </div>

          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400 text-xs block">Low</span>
            <span className="text-red-400 text-sm font-mono">
              ${formatPrice(latestCandle.low)}
            </span>
          </div>

          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-gray-400 text-xs block">Volume</span>
            <span className="text-white text-sm font-mono">
              {latestCandle.volume.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="mb-4 flex gap-3 text-sm">
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">24h High: </span>
          <span className="text-green-400 font-mono">
            ${formatPrice(stats.high24h)}
          </span>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">24h Low: </span>
          <span className="text-red-400 font-mono">
            ${formatPrice(stats.low24h)}
          </span>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-lg">
          <span className="text-gray-400">24h Volume: </span>
          <span className="text-white font-mono">
            {stats.volume24h.toFixed(2)}
          </span>
        </div>
      </div>

      <div ref={chartContainerRef} className="mt-4" />
    </div>
  );
};
