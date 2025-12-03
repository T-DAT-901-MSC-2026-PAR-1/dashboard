import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const MOCK_DATA = [
  { id: 1, symbol: 'BTC', name: 'Bitcoin', price: 64230.50, change24h: 2.4, marketCap: '1.2T' },
  { id: 2, symbol: 'ETH', name: 'Ethereum', price: 3450.12, change24h: -1.2, marketCap: '400B' },
  { id: 3, symbol: 'USDT', name: 'Tether', price: 1.00, change24h: 0.01, marketCap: '103B' },
  { id: 4, symbol: 'BNB', name: 'BNB', price: 590.45, change24h: 1.5, marketCap: '87B' },
  { id: 5, symbol: 'SOL', name: 'Solana', price: 145.20, change24h: 5.6, marketCap: '65B' },
  { id: 6, symbol: 'USDC', name: 'USDC', price: 1.00, change24h: 0.00, marketCap: '32B' },
  { id: 7, symbol: 'XRP', name: 'XRP', price: 0.62, change24h: -0.5, marketCap: '34B' },
  { id: 8, symbol: 'DOGE', name: 'Dogecoin', price: 0.16, change24h: 8.2, marketCap: '23B' },
  { id: 9, symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -2.1, marketCap: '16B' },
  { id: 10, symbol: 'AVAX', name: 'Avalanche', price: 35.60, change24h: 4.3, marketCap: '13B' },
];

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            CryptoViz Market
          </h1>
          <p className="text-gray-400 mt-2">Top 10 Cryptocurrencies by Market Cap</p>
        </header>

        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-800/50 text-gray-400 text-sm uppercase tracking-wider border-b border-gray-700">
                  <th className="p-4 font-medium">#</th>
                  <th className="p-4 font-medium">Coin</th>
                  <th className="p-4 font-medium text-right">Price</th>
                  <th className="p-4 font-medium text-right">24h Change</th>
                  <th className="p-4 font-medium text-right">Market Cap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {MOCK_DATA.map((coin) => (
                  <tr 
                    key={coin.symbol} 
                    className="hover:bg-gray-750 transition-colors cursor-pointer group hover:bg-gray-700/50"
                  >
                    <td className="p-4 text-gray-500 font-mono">{coin.id}</td>
                    <td className="p-4">
                      <Link to={`/asset/${coin.symbol}`} className="flex items-center gap-3 group-hover:text-blue-400 transition-colors">
                         {/* Placeholder icon */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold">
                          {coin.symbol[0]}
                        </div>
                        <div>
                          <div className="font-bold">{coin.name}</div>
                          <div className="text-xs text-gray-500">{coin.symbol}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="p-4 text-right font-mono font-medium">
                      ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right">
                      <div className={clsx(
                        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
                        coin.change24h >= 0 ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
                      )}>
                        {coin.change24h >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(coin.change24h)}%
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-400 font-mono">
                      ${coin.marketCap}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
