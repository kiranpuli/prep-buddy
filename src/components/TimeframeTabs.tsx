import { Clock } from 'lucide-react';
import { useMemo } from 'react';

type TimeframeTabsProps = {
  timeframes: string[];
  selectedTimeframe: string | null;
  onSelect: (timeframe: string) => void;
};

const TimeframeTabs = ({ timeframes, selectedTimeframe, onSelect }: TimeframeTabsProps) => {
  const normalizedSelected = useMemo(() => selectedTimeframe?.toLowerCase() ?? '', [selectedTimeframe]);

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-white/60">
        <Clock size={16} className="text-white/60" />
        <span>Timeframe</span>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {timeframes.map((timeframe) => {
          const isActive = timeframe.toLowerCase() === normalizedSelected;
          return (
            <button
              key={timeframe}
              type="button"
              onClick={() => onSelect(timeframe)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-aurora text-slate-900 shadow-lg shadow-aurora/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {timeframe}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeframeTabs;
