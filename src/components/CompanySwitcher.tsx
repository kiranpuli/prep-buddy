import { Building2, Search } from 'lucide-react';
import clsx from 'clsx';
import { useMemo, useState, type ChangeEvent } from 'react';
import InfoPopover from './InfoPopover';

type CompanySwitcherProps = {
  companies: string[];
  selectedCompany: string | null;
  onChange: (company: string | null) => void;
};

const CompanySwitcher = ({ companies, selectedCompany, onChange }: CompanySwitcherProps) => {
  const [search, setSearch] = useState('');

  const filteredCompanies = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return companies;
    }

    return companies.filter((company) => company.toLowerCase().includes(term));
  }, [companies, search]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-700 dark:text-white/60">
        <Building2 size={16} className="text-slate-700 dark:text-white/60" />
        <span>Company</span>
        <InfoPopover
          title="Company focus"
          description="Filter the entire dashboard to problems frequently asked by the companies you care about."
          bullets={[
            'Selecting a company updates charts, stats, and the table instantly',
            'Click an active company to clear it and explore others',
            'Use search to locate global or niche firms quickly',
          ]}
        />
      </div>
      <div className="mt-3 rounded-2xl border border-slate-300 bg-white p-3 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-glass">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/40" />
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search companies"
            className="w-full rounded-xl border border-slate-300 bg-slate-100 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 dark:border-white/10 dark:bg-black/30 dark:text-white/80 dark:placeholder:text-white/40 dark:focus:border-aurora-soft/70 dark:focus:ring-aurora-soft/40"
          />
        </label>
        <div className="mt-3 overflow-x-auto">
          {filteredCompanies.length === 0 ? (
            <div className="min-w-full rounded-2xl border border-slate-300 bg-slate-100 px-3 py-4 text-center text-xs text-slate-600 dark:border-white/10 dark:bg-black/20 dark:text-white/50">
              No companies match “{search.trim()}”.
            </div>
          ) : (
            <div className="flex w-max items-center gap-2 pb-2">
              {filteredCompanies.map((company) => {
                const isSelected = company === selectedCompany;
                return (
                  <button
                    key={company}
                    type="button"
                    onClick={() => onChange(isSelected ? null : company)}
                    className={clsx(
                      'whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition focus:outline-none focus-visible:ring-2',
                      isSelected
                        ? 'border-emerald-400 bg-emerald-500 text-white shadow-[0_0_0_2px_rgba(16,185,129,0.35)] focus-visible:ring-emerald-400/70 dark:border-aurora-soft/80 dark:bg-aurora-soft dark:text-slate-950 dark:focus-visible:ring-aurora-soft/70'
                        : 'border-slate-300 bg-slate-100 text-slate-700 hover:border-emerald-400 hover:text-slate-900 focus-visible:ring-emerald-400/70 dark:border-white/10 dark:bg-black/20 dark:text-white/70 dark:hover:border-aurora-soft/40 dark:hover:text-white dark:focus-visible:ring-aurora-soft/70'
                    )}
                    aria-pressed={isSelected}
                  >
                    {company}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanySwitcher;
