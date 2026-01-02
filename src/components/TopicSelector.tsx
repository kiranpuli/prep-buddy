import { useMemo, useState } from 'react';
import { ChevronDown, Search, Tags, X } from 'lucide-react';
import InfoPopover from './InfoPopover';

type TopicSelectorProps = {
  availableTopics: string[];
  selectedTopics: string[];
  onChange: (topics: string[]) => void;
};

const TopicSelector = ({ availableTopics, selectedTopics, onChange }: TopicSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredTopics = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) {
      return availableTopics;
    }
    return availableTopics.filter((topic) => topic.toLowerCase().includes(lowerQuery));
  }, [availableTopics, query]);

  const handleToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      onChange(selectedTopics.filter((value) => value !== topic));
    } else {
      onChange([...selectedTopics, topic]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between text-sm font-medium uppercase tracking-[0.2em] text-slate-700 dark:text-white/60">
        <div className="flex items-center gap-2">
          <Tags size={16} className="text-slate-700 dark:text-white/60" />
          <span>Topics</span>
          <InfoPopover
            title="Topic explorer"
            description="Zero in on the algorithmic areas you want to revisit without losing sight of company relevance."
            bullets={[
              'Select multiple topics to create a focused practice set',
              'Use search to quickly jump to graph, DP, or system favourites',
              'Clear resets the list so you can pivot to a new skill group',
            ]}
          />
        </div>
        {selectedTopics.length > 0 && (
          <button
            type="button"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-700 hover:text-slate-900 dark:text-white/60 dark:hover:text-white"
            onClick={handleClearAll}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="mt-3 flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-left text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
      >
        <span className="truncate">
          {selectedTopics.length === 0 ? 'All topics' : `${selectedTopics.length} selected`}
        </span>
        <ChevronDown
          size={16}
          className={`transition ${isOpen ? 'rotate-180 text-emerald-600 dark:text-aurora-soft' : 'text-slate-700 dark:text-white/60'}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-72 overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/95">
          <div className="flex items-center gap-2 border-b border-slate-300 px-4 py-3 dark:border-white/5">
            <Search size={14} className="text-slate-400 dark:text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topics"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-white/30"
            />
          </div>
          <div className="max-h-56 overflow-y-auto px-1 py-2">
            {filteredTopics.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-600 dark:text-white/40">No topics match your search.</p>
            )}
            {filteredTopics.map((topic) => {
              const isActive = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleToggle(topic)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2 text-sm transition ${
                    isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-aurora/10 dark:text-aurora-soft' : 'text-slate-700 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{topic}</span>
                  {isActive && <span className="text-xs font-semibold uppercase text-emerald-700 dark:text-aurora-soft">Active</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicSelector;
