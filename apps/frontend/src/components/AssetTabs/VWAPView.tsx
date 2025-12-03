import { VwapChart } from '../charts/VwapChart';

interface VWAPViewProps {
  symbol: string;
}

export const VWAPView = ({ symbol }: VWAPViewProps) => {
  return (
    <div className="space-y-6">
      <VwapChart symbol={symbol} />
    </div>
  );
};
