import { SlidersHorizontal } from 'lucide-react';
import type { Difficulty } from '../types';
import InfoPopover from './InfoPopover';

type DifficultyFilterProps = {
  selected: Difficulty[];
  onToggle: (difficulty: Difficulty) => void;
};

const difficultyStyles: Record<Difficulty, string> = {
  EASY: 'border border-emerald-400 bg-emerald-400/90 text-slate-900 hover:bg-emerald-300 dark:border-emerald-400/70 dark:bg-emerald-400/25 dark:text-emerald-200 dark:hover:bg-emerald-400/35',
  MEDIUM: 'border border-amber-400 bg-amber-400/90 text-slate-900 hover:bg-amber-300 dark:border-amber-400/70 dark:bg-amber-400/25 dark:text-amber-200 dark:hover:bg-amber-400/35',
  HARD: 'border border-rose-400 bg-rose-400/90 text-slate-900 hover:bg-rose-300 dark:border-rose-400/70 dark:bg-rose-400/25 dark:text-rose-200 dark:hover:bg-rose-400/35',
};

const DifficultyFilter = ({ selected, onToggle }: DifficultyFilterProps) => (
  <div>
    <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-700 dark:text-white/60">
      <SlidersHorizontal size={16} className="text-slate-700 dark:text-white/60" />
      <span>Difficulty</span>
      <InfoPopover
        title="Difficulty filter"
        description="Fine tune the challenge level so you can focus on the skills that matter most right now."
        bullets={[
          'Select multiple difficulties to blend easy warm-ups with harder drills',
          'The charts and stats respond instantly to your selection',
          'Use this together with topics to craft interview-like sets',
        ]}
      />
    </div>
    <div className="mt-3 flex flex-wrap gap-2">
      {(['EASY', 'MEDIUM', 'HARD'] satisfies Difficulty[]).map((difficulty) => {
        const isActive = selected.includes(difficulty);
        return (
          <button
            key={difficulty}
            type="button"
            onClick={() => onToggle(difficulty)}
            className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              isActive
                ? difficultyStyles[difficulty]
                : 'border border-slate-300 bg-slate-100 text-slate-700 hover:border-emerald-400 hover:bg-slate-200 dark:border-white/20 dark:bg-white/5 dark:text-white/70 dark:hover:border-aurora-soft/40 dark:hover:bg-white/10'
            }`}
          >
            {difficulty}
          </button>
        );
      })}
    </div>
  </div>
);

export default DifficultyFilter;
