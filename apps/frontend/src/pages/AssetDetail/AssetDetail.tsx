import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Activity, BarChart2, TrendingUp, Layers, Maximize2 } from 'lucide-react';
import clsx from 'clsx';
import { 
  OHLCView, 
  VWAPView, 
  PriceVariationView, 
  VolatilityView, 
  IntradayRangeView 
} from '../../components/AssetTabs';

type TabType = 'ohlc' | 'vwap' | 'variation' | 'volatility' | 'range';

export function AssetDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('ohlc');

  const tabs = [
    { id: 'ohlc', label: 'OHLC', icon: BarChart2 },
    { id: 'vwap', label: 'VWAP', icon: Layers },
    { id: 'variation', label: 'Price Variation', icon: TrendingUp },
    { id: 'volatility', label: 'Volatility', icon: Activity },
    { id: 'range', label: 'Intraday Range', icon: Maximize2 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm">
                  {symbol?.[0]}
                </span>
                {symbol} <span className="text-gray-500 text-lg font-normal">/ USD</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 overflow-x-auto p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                    isActive 
                      ? 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/50' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'ohlc' && <OHLCView />}
        {activeTab === 'vwap' && <VWAPView symbol={symbol || 'BTC'} />}
        {activeTab === 'variation' && <PriceVariationView />}
        {activeTab === 'volatility' && <VolatilityView />}
        {activeTab === 'range' && <IntradayRangeView />}
      </div>
    </div>
  );
}

export default AssetDetailPage;
