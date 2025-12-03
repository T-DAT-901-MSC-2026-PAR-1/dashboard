import { OhlcChart } from '../charts/OhlcChart';

interface OHLCViewProps {
  symbol: string;
}

export const OHLCView = ({ symbol }: OHLCViewProps) => {
  return (
    <div className="space-y-6">
      <OhlcChart symbol={symbol} />
    </div>
  );
};
