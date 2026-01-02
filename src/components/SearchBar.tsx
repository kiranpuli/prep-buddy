import { Search } from 'lucide-react';
import { useTransition } from 'react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, placeholder = 'Search problems' }: SearchBarProps) => {
  const [, startTransition] = useTransition();

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/40" />
      <input
        type="search"
        value={value}
        onChange={(event) => {
          const nextValue = event.target.value;
          startTransition(() => onChange(nextValue));
        }}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-slate-100 py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 dark:focus:border-aurora dark:focus:ring-aurora/30"
      />
    </div>
  );
};

export default SearchBar;
