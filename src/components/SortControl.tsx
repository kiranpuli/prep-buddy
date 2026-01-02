import { ChangeEvent } from 'react';
import { ArrowDownAZ, ArrowDownWideNarrow } from 'lucide-react';
import type { ProblemSort } from '../types';

type SortControlProps = {
  sort: ProblemSort;
  onChange: (sort: ProblemSort) => void;
};

const SortControl = ({ sort, onChange }: SortControlProps) => {
  const handleFieldChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...sort, field: event.target.value as ProblemSort['field'] });
  };

  const toggleDirection = () => {
    onChange({ ...sort, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <ArrowDownAZ className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <select
          className="appearance-none rounded-2xl border border-white/10 bg-white/5 py-2 pl-9 pr-9 text-sm text-white shadow-inner outline-none transition focus:border-aurora focus:ring-2 focus:ring-aurora/30"
          value={sort.field}
          onChange={handleFieldChange}
        >
          <option value="frequency">Frequency</option>
          <option value="acceptanceRate">Acceptance Rate</option>
          <option value="title">Title</option>
        </select>
      </div>
      <button
        type="button"
        onClick={toggleDirection}
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
        aria-label="Toggle sort direction"
      >
        <ArrowDownWideNarrow
          className={`h-5 w-5 transition ${sort.direction === 'asc' ? 'rotate-180 text-aurora-soft' : 'text-white/70'}`}
        />
      </button>
    </div>
  );
};

export default SortControl;
