import { memo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type FrequencyDistributionChartProps = {
  buckets: Array<{
    label: string;
    count: number;
  }>;
};

const FrequencyDistributionChart = ({ buckets }: FrequencyDistributionChartProps) => (
  <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-glass backdrop-blur">
    <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
      <span>Frequency Spread</span>
      <span className="text-white/70">Problem count</span>
    </div>
    <div className="mt-4 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} barCategoryGap="20%">
          <defs>
            <linearGradient id="frequencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.85} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
          <XAxis dataKey="label" stroke="rgba(148, 163, 184, 0.6)" tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148, 163, 184, 0.4)" tickLine={false} axisLine={false} allowDecimals={false} />
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
                <div className="rounded-2xl border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-white/80 shadow-lg backdrop-blur">
                  <div className="font-semibold">{item.payload.label}</div>
                  <div>{item.payload.count.toLocaleString()} problems</div>
                </div>
              );
            }}
          />
          <Bar dataKey="count" fill="url(#frequencyGradient)" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default memo(FrequencyDistributionChart);
