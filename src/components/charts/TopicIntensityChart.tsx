import { memo } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import InfoPopover from '../InfoPopover';

type TopicIntensityChartProps = {
  topics: Array<{
    topic: string;
    count: number;
  }>;
};

const TopicIntensityChart = ({ topics }: TopicIntensityChartProps) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/50 dark:shadow-glass">
    <div className="flex items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-white/50">
      <span>Top Topics</span>
      <div className="flex items-center gap-2 text-xs font-medium normal-case tracking-[0.1em] text-slate-500 dark:text-white/60">
        <InfoPopover
          title="Topic intensity"
          description="Identify which topics dominate the current problem set so you can tailor your next practice session."
          bullets={["Built from the filtered problem list", 'Focus on the longest bars to match interviewer expectations', 'Adjust topic filters to explore different areas']}
          side="left"
        />
        <span className="text-slate-900 dark:text-white/70">By problem count</span>
      </div>
    </div>
    <div className="mt-4 h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={topics} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="topicGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#5b8def" stopOpacity={0.9} />
            </linearGradient>
          </defs>
          <XAxis type="number" stroke="rgba(51, 65, 85, 0.6)" className="dark:stroke-slate-400" tickLine={false} axisLine={false} allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="topic"
            stroke="rgba(51, 65, 85, 0.8)"
            className="dark:stroke-slate-300"
            tickLine={false}
            axisLine={false}
            width={140}
            tick={{ fontSize: 12 }}
          />
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
                  <div className="font-semibold">{item.payload.topic}</div>
                  <div>{item.payload.count.toLocaleString()} problems</div>
                </div>
              );
            }}
          />
          <Bar dataKey="count" fill="url(#topicGradient)" radius={[0, 12, 12, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default memo(TopicIntensityChart);
