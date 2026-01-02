import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Loader2 } from 'lucide-react';
import ProblemCard from './ProblemCard';
import InfoPopover from './InfoPopover';
import type { ProblemRecord } from '../types';
import { getProblemId } from '../utils/problemId';

export type ProblemListHandle = {
  scrollToTop: () => void;
  getScrollOffset: () => number;
};

type SortField = 'title' | 'difficulty';
type SortDirection = 'asc' | 'desc';

type ProblemListProps = {
  problems: ProblemRecord[];
  isLoading: boolean;
  error?: string;
  trackedProblems: Record<string, boolean>;
  onToggleTracked: (problemId: string) => void;
  onScrollOffsetChange?: (offset: number) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField, direction: SortDirection) => void;
};

const ProblemList = forwardRef<ProblemListHandle, ProblemListProps>(
  ({ problems, isLoading, error, trackedProblems, onToggleTracked, onScrollOffsetChange, sortField = 'title', sortDirection = 'asc', onSort }, ref) => {
    const parentRef = useRef<HTMLDivElement>(null);
  const problemIds = useMemo(() => problems.map((problem) => getProblemId(problem)), [problems]);

  const handleSort = (field: SortField) => {
    if (!onSort) return;
    
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const rowVirtualizer = useVirtualizer({
    count: problems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 15,
    getItemKey: (index) => problemIds[index] ?? index,
    measureElement: (element) => element?.getBoundingClientRect().height ?? 50,
  });

    const totalSize = rowVirtualizer.getTotalSize();
    const virtualItems = rowVirtualizer.getVirtualItems();

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        if (parentRef.current) {
          parentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      getScrollOffset: () => parentRef.current?.scrollTop ?? 0,
    }));

    const handleScroll = useCallback(() => {
      if (!parentRef.current) {
        return;
      }
      onScrollOffsetChange?.(parentRef.current.scrollTop);
    }, [onScrollOffsetChange]);

    useEffect(() => {
      if (parentRef.current) {
        parentRef.current.scrollTo({ top: 0 });
      }
      onScrollOffsetChange?.(0);
    }, [problems, onScrollOffsetChange]);

    const emptyState = useMemo(() => {
    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-5 py-3 text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-white/70">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-aurora-soft" /> Fetching problems…
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-5 py-3 text-rose-700 backdrop-blur dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      );
    }

    if (problems.length === 0) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            No problems match your filters yet. Refine your search to explore more questions.
          </div>
        </div>
      );
    }

      return null;
    }, [isLoading, error, problems.length]);

    if (emptyState) {
      return (
        <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/40 shadow-inner shadow-black/20 backdrop-blur">
          {emptyState}
        </div>
      );
    }

    const SortIcon = ({ field }: { field: SortField }) => {
      if (sortField !== field) {
        return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 dark:text-white/30" aria-hidden />;
      }

      return sortDirection === 'asc' ? (
        <ArrowUp className="h-3.5 w-3.5 text-emerald-600 dark:text-aurora-soft" aria-hidden />
      ) : (
        <ArrowDown className="h-3.5 w-3.5 text-emerald-600 dark:text-aurora-soft" aria-hidden />
      );
    };

    return (
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[28px] border border-slate-300 bg-white shadow-inner shadow-slate-300/20 backdrop-blur dark:border-white/10 dark:bg-slate-900/40 dark:shadow-black/20">
        {/* Table Header */}
        <div className="sticky top-0 z-10 border-b border-slate-300 bg-white px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-white/50">
            <div className="w-5 flex-shrink-0"></div>
            <button
              onClick={() => handleSort('title')}
              className="flex min-w-0 flex-1 items-center gap-2 transition hover:text-emerald-600 dark:hover:text-aurora-soft"
            >
              <span>Problem</span>
              <SortIcon field="title" />
            </button>
            <button
              onClick={() => handleSort('difficulty')}
              className="hidden w-24 items-center justify-center gap-1.5 transition hover:text-emerald-600 sm:flex dark:hover:text-aurora-soft"
            >
              <span>Difficulty</span>
              <SortIcon field="difficulty" />
            </button>
            <div className="hidden w-32 justify-center md:flex">
              <span>Company</span>
            </div>
            <div className="hidden flex-1 justify-center lg:flex">
              <span>Topics</span>
            </div>
            <div className="flex w-8 flex-shrink-0 items-center justify-end">
              <InfoPopover
                title="Interactive table"
                description="Sort, scan, and mark off problems directly from the list."
                bullets={[
                  'Click a column header to toggle ascending/descending order',
                  'Use the checkbox to track completion without leaving the page',
                  'Infinite loading keeps performance snappy as you scroll',
                ]}
                side="left"
              />
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={parentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
        >
        <div style={{ height: `${totalSize}px`, position: 'relative', width: '100%' }}>
          {virtualItems.map((virtualRow) => {
            const problem = problems[virtualRow.index];
            if (!problem) {
              return null;
            }

            const problemId = problemIds[virtualRow.index];

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="absolute left-0 right-0 w-full px-2 pb-1.5 will-change-transform"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <ProblemCard
                  problem={problem}
                  problemId={problemId}
                  isTracked={Boolean(trackedProblems[problemId])}
                  onToggleTracking={onToggleTracked}
                />
              </div>
            );
          })}
        </div>
        </div>
      </div>
    );
  }
);

ProblemList.displayName = 'ProblemList';

export default ProblemList;
