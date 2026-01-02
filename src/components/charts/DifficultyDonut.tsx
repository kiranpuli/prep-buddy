import { memo, useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { Difficulty } from '../../types';
import InfoPopover from '../InfoPopover';

type DifficultyDonutProps = {
  distribution: Record<Difficulty, number>;
};

const difficultyPalette: Record<Difficulty, string> = {
  EASY: '#34d399',
  MEDIUM: '#fbbf24',
  HARD: '#f87171',
};

const DifficultyDonut = ({ distribution }: DifficultyDonutProps) => {
  const data = useMemo(
    () =>
      (Object.keys(distribution) as Difficulty[])
        .map((difficulty) => ({
          name: difficulty,
          value: distribution[difficulty],
          fill: difficultyPalette[difficulty],
        }))
        .filter((entry) => entry.value > 0),
    [distribution]
  );

  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:shadow-glass">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-white/50">
        <span>Difficulty Mix</span>
        <div className="flex items-center gap-2 text-xs font-medium normal-case tracking-[0.1em] text-slate-500 dark:text-white/60">
          <InfoPopover
            title="Stacked difficulty"
            description="Visualize how many problems fall into each difficulty for the current filters."
            bullets={['Hover slices to see exact counts', 'Use filters to recompute the chart instantly', 'A balanced mix keeps interview prep realistic']}
            side="left"
          />
          <span className="text-slate-900 dark:text-white/70">{total.toLocaleString()} problems</span>
        </div>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {data.map((entry) => (
                <radialGradient id={`difficulty-${entry.name}`} key={entry.name} cx="50%" cy="50%" r="65%">
                  <stop offset="0%" stopColor={entry.fill} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={entry.fill} stopOpacity={0.45} />
                </radialGradient>
              ))}
            </defs>
            <Pie
              data={data}
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={6}
              dataKey="value"
              cornerRadius={12}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={`url(#difficulty-${entry.name})`} stroke="rgba(15,23,42,0.35)" />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
              content={({ payload }) => {
                if (!payload || payload.length === 0) {
                  return null;
                }
                const item = payload[0];
                if (!item?.payload) {
                  return null;
                }
                return (
                  <div className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/90 dark:text-white/80">
                    <div className="font-semibold">{item.name}</div>
                    <div>{item.value.toLocaleString()} problems</div>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-white/60">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full"
              style={{ background: `linear-gradient(135deg, ${entry.fill}, rgba(255,255,255,0.35))` }}
            />
            <span>
              {entry.name}
              <span className="ml-1 font-semibold text-slate-900 dark:text-white/80">{((entry.value / (total || 1)) * 100).toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(DifficultyDonut);
