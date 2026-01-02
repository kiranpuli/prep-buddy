import { ExternalLink, Check } from 'lucide-react';
import clsx from 'clsx';
import { memo, type ChangeEvent } from 'react';
import type { ProblemRecord } from '../types';

const difficultyClassnames: Record<ProblemRecord['difficulty'], string> = {
  EASY: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-400/20 dark:text-emerald-300 dark:border-emerald-400/40',
  MEDIUM: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-400/20 dark:text-amber-300 dark:border-amber-400/40',
  HARD: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-400/20 dark:text-rose-300 dark:border-rose-400/40',
};

type ProblemCardProps = {
  problem: ProblemRecord;
  problemId: string;
  isTracked: boolean;
  onToggleTracking: (problemId: string) => void;
};

const ProblemCardComponent = ({ problem, problemId, isTracked, onToggleTracking }: ProblemCardProps) => {
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onToggleTracking(problemId);
  };

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 transition duration-150 hover:border-emerald-400 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-aurora-soft/40 dark:hover:bg-white/10">
      {/* Checkbox */}
      <label className="flex-shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={isTracked}
          onChange={handleCheckboxChange}
          className="peer sr-only"
          aria-label={isTracked ? 'Unmark problem as completed' : 'Mark problem as completed'}
        />
        <div
          className={clsx(
            'flex h-5 w-5 items-center justify-center rounded border-2 transition',
            isTracked
              ? 'border-emerald-500 bg-emerald-500 dark:border-aurora-soft dark:bg-aurora-soft'
              : 'border-slate-300 bg-transparent hover:border-emerald-500 dark:border-white/30 dark:hover:border-aurora-soft/60'
          )}
        >
          {isTracked && <Check className="h-3.5 w-3.5 text-white dark:text-slate-950" strokeWidth={3} />}
        </div>
      </label>

      {/* Problem Title */}
      <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-aurora-soft">
        {problem.title}
      </h3>

      {/* Difficulty Pill */}
      <div className="hidden w-24 justify-center sm:flex">
        <span
          className={clsx(
            'rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase',
            difficultyClassnames[problem.difficulty]
          )}
        >
          {problem.difficulty}
        </span>
      </div>

      {/* Company */}
      <div className="hidden w-32 justify-center truncate text-xs text-slate-600 md:flex dark:text-white/60">
        {problem.company}
      </div>

      {/* Topics */}
      <div className="hidden flex-1 gap-1.5 overflow-hidden lg:flex">
        {problem.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="truncate rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
          >
            {topic}
          </span>
        ))}
        {problem.topics.length > 3 && (
          <span className="text-xs text-slate-500 dark:text-white/40">+{problem.topics.length - 3}</span>
        )}
      </div>

      {/* Link */}
      <a
        href={problem.link || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 rounded-lg border border-slate-300 bg-slate-100 p-1.5 text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-100 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-aurora-soft/40 dark:hover:bg-aurora-soft/10 dark:hover:text-aurora-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};

const ProblemCard = memo(
  ProblemCardComponent,
  (previous, next) =>
    previous.problem === next.problem &&
    previous.problemId === next.problemId &&
    previous.isTracked === next.isTracked
);

export default ProblemCard;
