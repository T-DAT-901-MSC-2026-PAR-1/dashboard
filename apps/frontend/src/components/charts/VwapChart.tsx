import React, {useEffect, useRef, useState} from 'react';
import {createChart, IChartApi, ISeriesApi, LineData, LineSeries} from 'lightweight-charts';
import {useVwapGenerator} from '../../hooks/useVwapGenerator';
import {Exchange} from '../../types';

interface VwapChartProps {
    symbol: string;
}

export const VwapChart: React.FC<VwapChartProps> = ({symbol}) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRefs = useRef<Map<Exchange, ISeriesApi<'Line'>>>(new Map());
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const {vwapHistory, exchangeConfigs} = useVwapGenerator(symbol);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: {color: '#1e1e1e'},
                textColor: '#d1d4dc',
            },
            grid: {
                vertLines: {color: '#2a2a2a'},
                horzLines: {color: '#2a2a2a'},
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

        exchangeConfigs.forEach((config) => {
            const series = chart.addSeries(LineSeries, {
                color: config.color,
                lineWidth: 2,
                title: config.name,
            });
            seriesRefs.current.set(config.name, series);
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
    }, [exchangeConfigs]);

    useEffect(() => {
        if (vwapHistory.size === 0) return;

        vwapHistory.forEach((dataArray, exchange) => {
            const series = seriesRefs.current.get(exchange);
            if (!series || dataArray.length === 0) return;

            const chartData: LineData[] = dataArray.map((d) => ({
                time: Math.floor(new Date(d.window_end).getTime() / 1000) as any,
                value: d.vwap,
            }));

            series.setData(chartData);
        });

        setLastUpdate(new Date());
    }, [vwapHistory]);

    const getCurrentVwaps = (): Map<Exchange, number> => {
        const vwaps = new Map<Exchange, number>();
        vwapHistory.forEach((dataArray, exchange) => {
            if (dataArray.length > 0) {
                vwaps.set(exchange, dataArray[dataArray.length - 1].vwap);
            }
        });
        return vwaps;
    };

    const calculateStats = () => {
        const vwaps = Array.from(getCurrentVwaps().values());
        if (vwaps.length === 0) return {spread: 0, spreadPct: 0, average: 0};

        const min = Math.min(...vwaps);
        const max = Math.max(...vwaps);
        const spread = max - min;
        const average = vwaps.reduce((sum, v) => sum + v, 0) / vwaps.length;
        const spreadPct = ((spread / average) * 100).toFixed(3);

        return {spread, spreadPct, average};
    };

    const stats = calculateStats();
    const currentVwaps = getCurrentVwaps();

    const formatTime = (date: Date): string => {
        return date.toISOString().substring(11, 19) + ' UTC';
    };

    return (
        <div className="bg-gray-900 rounded-xl p-6">
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-white">VWAP - {symbol}/USDT</h2>
                        <p className="text-gray-400 text-sm">Compare across exchanges</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Last update</p>
                        <p className="text-sm text-gray-300 font-mono">
                            {formatTime(lastUpdate)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-3 items-center">
                {exchangeConfigs.map((config) => {
                    const vwap = currentVwaps.get(config.name);
                    return (
                        <div
                            key={config.name}
                            className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-lg"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{backgroundColor: config.color}}
                            />
                            <span className="text-gray-300 text-sm font-medium">
                {config.name}
              </span>
                            <span className="text-white text-sm font-mono">
                ${vwap ? vwap.toFixed(2) : '-'}
              </span>
                        </div>
                    );
                })}
            </div>

            <div className="mb-4 flex gap-6 text-sm">
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-400">Spread: </span>
                    <span className="text-white font-mono">
            ${stats.spread.toFixed(2)} ({stats.spreadPct}%)
          </span>
                </div>
                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-400">Average: </span>
                    <span className="text-white font-mono">${stats.average.toFixed(2)}</span>
                </div>
            </div>

            <div ref={chartContainerRef} className="mt-4"/>
        </div>
    );
};
