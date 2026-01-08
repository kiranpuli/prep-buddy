import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Gamepad2, Loader2, Rocket, Users, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import CompanySwitcher from '../components/CompanySwitcher';
import DifficultyFilter from '../components/DifficultyFilter';
import TopicSelector from '../components/TopicSelector';
import SearchBar from '../components/SearchBar';
import ProblemList, { ProblemListHandle } from '../components/ProblemList';
import DifficultyDonut from '../components/charts/DifficultyDonut';
import TopicIntensityChart from '../components/charts/TopicIntensityChart';
import InfoPopover from '../components/InfoPopover';
import AdSenseSlot from '../components/AdSenseSlot';
import type { Difficulty, ProblemRecord } from '../types';
import { useProblemStore } from '../store/useProblemStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLeaderboardStore } from '../store/useLeaderboardStore';
import { getProblemId } from '../utils/problemId';

const INITIAL_VISIBLE_LIMIT = 50;
const VISIBLE_INCREMENT = 50;

const difficultyOrder: Record<string, number> = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

const compareProblems = (
  a: ProblemRecord,
  b: ProblemRecord,
  field: 'title' | 'difficulty',
  direction: 'asc' | 'desc'
) => {
  if (field === 'title') {
    const result = a.title.localeCompare(b.title);
    return direction === 'asc' ? result : -result;
  }

  if (field === 'difficulty') {
    const factor = direction === 'asc' ? 1 : -1;
    const difference = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    if (difference !== 0) {
      return difference * factor;
    }
    // fallback to title when difficulty is the same
    return a.title.localeCompare(b.title) * factor;
  }

  return 0;
};

const binaryInsert = <T,>(items: T[], item: T, comparator: (a: T, b: T) => number) => {
  let low = 0;
  let high = items.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (comparator(item, items[mid]) < 0) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
};

const filterAndSortProblems = (
  problems: ProblemRecord[],
  search: string,
  difficulties: Difficulty[],
  topics: string[],
  field: 'title' | 'difficulty',
  direction: 'asc' | 'desc',
  limit: number
) => {
  const normalizedSearch = search.trim().toLowerCase();
  const hasDifficultyFilter = difficulties.length > 0;
  const hasTopicFilter = topics.length > 0;
  const comparator = (left: ProblemRecord, right: ProblemRecord) =>
    compareProblems(left, right, field, direction);

  const limited = Number.isFinite(limit) && limit > 0;
  const results: ProblemRecord[] = [];
  let totalMatches = 0;

  for (const problem of problems) {
    if (hasDifficultyFilter && !difficulties.includes(problem.difficulty)) {
      continue;
    }

    if (hasTopicFilter && !topics.every((topic) => problem.topics.includes(topic))) {
      continue;
    }

    if (normalizedSearch) {
      const haystack = `${problem.title} ${problem.topics.join(' ')}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) {
        continue;
      }
    }

    totalMatches += 1;

    if (!limited) {
      results.push(problem);
      continue;
    }

    if (results.length === 0) {
      results.push(problem);
      continue;
    }

    if (results.length < limit) {
      const insertionIndex = binaryInsert(results, problem, comparator);
      results.splice(insertionIndex, 0, problem);
      continue;
    }

    const worst = results[results.length - 1];
    if (comparator(problem, worst) >= 0) {
      // Candidate does not beat the worst item; skip to avoid churn.
      continue;
    }

    const insertionIndex = binaryInsert(results, problem, comparator);
    if (insertionIndex < limit) {
      results.splice(insertionIndex, 0, problem);
      results.pop();
    }
  }

  if (!limited) {
    results.sort(comparator);
  }

  const hasMore = limited && totalMatches > limit;

  return {
    results,
    totalMatches,
    hasMore,
  };
};

const Dashboard = () => {
  const {
    companies,
    selectedCompany,
    timeframes,
    selectedTimeframe,
    filters,
    sort,
    problems,
    loading,
    error,
    availableTopics,
    trackedProblems,
    setSelectedCompany,
    setSelectedTimeframe,
    setSearch,
    toggleDifficulty,
    setTopics,
    setSort,
    clearFilters,
    toggleProblemTracked,
    clearTrackedProblems,
  } = useProblemStore((state) => ({
    companies: state.companies,
    selectedCompany: state.selectedCompany,
    timeframes: state.timeframes,
    selectedTimeframe: state.selectedTimeframe,
    filters: state.filters,
    sort: state.sort,
    problems: state.problems,
    loading: state.loading,
    error: state.error,
    availableTopics: state.availableTopics,
    trackedProblems: state.trackedProblems,
    setSelectedCompany: state.setSelectedCompany,
    setSelectedTimeframe: state.setSelectedTimeframe,
    setSearch: state.setSearch,
    toggleDifficulty: state.toggleDifficulty,
    setTopics: state.setTopics,
    setSort: state.setSort,
    clearFilters: state.clearFilters,
    toggleProblemTracked: state.toggleProblemTracked,
    clearTrackedProblems: state.clearTrackedProblems,
  }));

  const {
    entries: leaderboardEntries,
    loading: leaderboardLoading,
    error: leaderboardError,
    initialize: initializeLeaderboard,
    dispose: disposeLeaderboard,
  } = useLeaderboardStore((state) => ({
    entries: state.entries,
    loading: state.loading,
    error: state.error,
    initialize: state.initialize,
    dispose: state.dispose,
  }));

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    initializeLeaderboard();
    return () => {
      disposeLeaderboard();
    };
  }, [initializeLeaderboard, disposeLeaderboard]);

  const topLeaderboardEntries = useMemo(() => leaderboardEntries.filter((entry) => entry.trackedCount > 0).slice(0, 8), [leaderboardEntries]);
  const currentUserId = user?.uid ?? null;
  const leaderboardAdSlot = import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR;
  const inlineAdSlot = import.meta.env.VITE_ADSENSE_SLOT_INLINE;

  const problemListRef = useRef<ProblemListHandle>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScrollOffsetChange = useCallback((offset: number) => {
    setShowScrollTop(offset > 80);
  }, []);

  const handleScrollToTop = useCallback(() => {
    problemListRef.current?.scrollToTop();
  }, []);

  const handleSort = useCallback((field: 'title' | 'difficulty', direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  }, [setSort]);

  const deferredProblems = useDeferredValue(problems);
  const deferredFilters = useDeferredValue(filters);
  const deferredSort = useDeferredValue(sort);

  const [visibleLimit, setVisibleLimit] = useState(INITIAL_VISIBLE_LIMIT);

  useEffect(() => {
    setVisibleLimit(INITIAL_VISIBLE_LIMIT);
  }, [
    selectedCompany,
    selectedTimeframe,
    deferredFilters.search,
    deferredFilters.difficulties.join('|'),
    deferredFilters.topics.join('|'),
    deferredSort.field,
    deferredSort.direction,
    deferredProblems.length,
  ]);

  const { results: processedProblems, totalMatches, hasMore } = useMemo(
    () =>
      filterAndSortProblems(
        deferredProblems,
        deferredFilters.search,
        deferredFilters.difficulties,
        deferredFilters.topics,
        deferredSort.field,
        deferredSort.direction,
        visibleLimit
      ),
    [deferredProblems, deferredFilters, deferredSort, visibleLimit]
  );

  const metrics = useMemo(() => {
    const total = processedProblems.length;
    const aggregates = processedProblems.reduce(
      (acc, problem) => {
        acc.frequency += problem.frequency;
        acc.acceptance += problem.acceptanceRate;
        acc.difficulty[problem.difficulty] += 1;
        problem.topics.forEach((topic) => acc.topics.add(topic));
        return acc;
      },
      {
        frequency: 0,
        acceptance: 0,
        difficulty: { EASY: 0, MEDIUM: 0, HARD: 0 } as Record<Difficulty, number>,
        topics: new Set<string>(),
      }
    );

    return {
      total,
      averageFrequency: total ? aggregates.frequency / total : 0,
      averageAcceptance: total ? aggregates.acceptance / total : 0,
      difficultyBreakdown: aggregates.difficulty,
      topicCount: aggregates.topics.size,
    };
  }, [processedProblems]);

  const frequencyBuckets = useMemo(() => {
    const ranges = [
      { label: '0-25', min: 0, max: 25 },
      { label: '25-50', min: 25, max: 50 },
      { label: '50-75', min: 50, max: 75 },
      { label: '75-90', min: 75, max: 90 },
      { label: '90-100', min: 90, max: 101 },
    ];

    const counts = ranges.map((range) => ({ ...range, count: 0 }));

    processedProblems.forEach((problem) => {
      const frequency = problem.frequency;
      const matchingRange = counts.find((range) => frequency >= range.min && frequency < range.max);
      if (matchingRange) {
        matchingRange.count += 1;
      }
    });

    return counts.map(({ label, count }) => ({ label, count }));
  }, [processedProblems]);

  const topTopics = useMemo(() => {
    const topicCounts = new Map<string, number>();

    processedProblems.forEach((problem) => {
      problem.topics.forEach((topic) => {
        topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
      });
    });

    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([topic, count]) => ({ topic, count }));
  }, [processedProblems]);

  const trackingStats = useMemo(() => {
    const total = processedProblems.length;
    const tracked = processedProblems.reduce((count, problem) => {
      const id = getProblemId(problem);
      return trackedProblems[id] ? count + 1 : count;
    }, 0);

    return {
      total,
      tracked,
      percent: total ? (tracked / total) * 100 : 0,
    };
  }, [processedProblems, trackedProblems]);

  const progressStage = useMemo(() => {
    const itemsPerStage = 10;
    const totalTracked = Object.keys(trackedProblems).length;
    const stage = Math.max(1, Math.floor(totalTracked / itemsPerStage) + 1);
    const completedInStage = totalTracked % itemsPerStage;
    const progress = (completedInStage / itemsPerStage) * 100;
    const remainingInStage = itemsPerStage - completedInStage || itemsPerStage;

    return {
      stage,
      progress,
      remainingInStage,
      totalTracked,
    };
  }, [trackedProblems]);

  const handleLoadMore = () => setVisibleLimit((current) => current + VISIBLE_INCREMENT);
  const handleShowAll = () => setVisibleLimit(Number.POSITIVE_INFINITY);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-gradient-to-br dark:from-midnight dark:via-slate-950 dark:to-black dark:text-white">
      <Navbar />
      <div className="pointer-events-none absolute inset-0 opacity-20 dark:opacity-70">
        <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-blue-400/30 blur-[120px] dark:bg-aurora/20" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/20 blur-[160px] dark:bg-aurora-soft/20" />
        <div className="absolute -left-32 bottom-1/3 h-80 w-80 rounded-full bg-emerald-400/20 blur-[140px] dark:bg-emerald-400/10" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 pb-12 pt-6">
        {/* Header - Logo and Description */}
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-glass">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-slate-600 dark:text-white/50">
            <Rocket className="h-4 w-4 text-blue-600 dark:text-aurora-soft" />
            Your FAANG Journey Starts Here
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Crack FAANG interviews with confidence
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-700 dark:text-white/60">
            Master the exact problems asked at Google, Meta, Amazon, Apple & Netflix. Track company-prioritized challenges,
            benchmark against top performers, and land your dream Big Tech offer.
          </p>
        </header>

        {/* Stats - Progress, Leaderboard, Charts, Graphs, Difficulty Mix */}
        <div className="flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-glass">
          {/* Progress and Leaderboard */}
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow dark:border-aurora-soft/30 dark:bg-aurora-soft/10 dark:shadow-glass">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-aurora-soft/80">
                  <Gamepad2 className="h-4 w-4" />
                  FAANG Readiness
                    <InfoPopover
                      title="FAANG Readiness Tracker"
                      description="Track your progress toward interview readiness at top tech companies."
                      bullets={[
                        'Stages unlock as you complete more tracked challenges',
                        'Use Reset Progress if you want to restart from scratch',
                        'Hover each problem row to mark items done from the table',
                      ]}
                    />
                </div>
                <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:border-aurora-soft/40 dark:bg-aurora-soft/10 dark:text-aurora-soft/90">
                  Stage {progressStage.stage}
                </span>
              </div>
              <div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-black/30">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all dark:bg-aurora-soft"
                  style={{ width: `${progressStage.progress}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-white/70">
                <span>
                  {progressStage.totalTracked} problems completed · {progressStage.remainingInStage} until next stage
                </span>
                <button
                  type="button"
                  onClick={clearTrackedProblems}
                  className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-600 transition hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 dark:border-white/10 dark:bg-black/30 dark:text-white/60 dark:hover:border-rose-400/60 dark:hover:bg-rose-500/10 dark:hover:text-rose-100"
                >
                  Reset Progress
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow dark:border-white/10 dark:bg-slate-900/40 dark:text-white/70">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-white/50">
                    <Users className="h-4 w-4 text-blue-600 dark:text-aurora-soft" />
                    <span className="hidden sm:inline">Leaderboard</span>
                    <InfoPopover
                      title="Leaderboard insights"
                      description="See who's crushing their FAANG prep and climbing the ranks."
                      bullets={[
                        'Compete with future FAANG engineers worldwide',
                        'Ranks update live as you complete problems',
                        'Top performers get featured',
                      ]}
                      side="left"
                    />
                  </div>
                  <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-aurora-soft/30 dark:bg-aurora-soft/10 dark:text-aurora-soft/80">
                    Live
                  </span>
                </div>
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-white/70">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-aurora-soft" />
                      Loading…
                    </div>
                  </div>
                ) : leaderboardError ? (
                  <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-100">
                    {leaderboardError}
                  </div>
                ) : topLeaderboardEntries.length === 0 ? (
                  <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60">
                    No entries yet
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                        {topLeaderboardEntries.map((entry, index) => {
                          const rank = index + 1;
                          const isCurrentUser = currentUserId !== null && entry.userId === currentUserId;
                          return (
                            <tr
                              key={entry.userId}
                              className={`transition ${
                                isCurrentUser
                                  ? 'bg-emerald-50 dark:bg-aurora-soft/10'
                                  : 'bg-white hover:bg-slate-50 dark:bg-slate-900/20 dark:hover:bg-slate-900/40'
                              }`}
                            >
                              <td className="w-12 py-2 pl-3 pr-2">
                                <span
                                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                    isCurrentUser
                                      ? 'bg-emerald-200 text-emerald-700 dark:bg-aurora-soft/20 dark:text-aurora-soft'
                                      : 'bg-slate-200 text-slate-600 dark:bg-black/40 dark:text-white/60'
                                  }`}
                                >
                                  {rank}
                                </span>
                              </td>
                              <td className="py-2 pr-2">
                                <p
                                  className={`truncate text-xs font-semibold ${
                                    isCurrentUser ? 'text-emerald-700 dark:text-aurora-soft' : 'text-slate-900 dark:text-white'
                                  }`}
                                  title={entry.displayName}
                                >
                                  {entry.displayName}
                                </p>
                              </td>
                              <td className="py-2 pr-3 text-right">
                                {isCurrentUser ? (
                                  <span className="inline-block rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-aurora-soft/50 dark:bg-aurora-soft/10 dark:text-aurora-soft">
                                    You
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-semibold text-slate-600 dark:text-white/60">
                                    {entry.trackedCount}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <AdSenseSlot
                slotId={leaderboardAdSlot}
                label="Support PrepBuddy"
                compact
                className="hidden border-slate-200/60 bg-white/70 text-slate-500 shadow-none dark:border-white/10 dark:bg-slate-900/40 dark:text-white/40 sm:block"
              />
            </div>
          </div>

          {/* Charts and Graphs */}
          {processedProblems.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-3">
              <DifficultyDonut distribution={metrics.difficultyBreakdown} />
              <TopicIntensityChart topics={topTopics} />
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-white/10 dark:bg-slate-900/60">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 dark:text-white/50">
                  <span>Difficulty Mix</span>
                  <InfoPopover
                    title="Difficulty snapshot"
                    description="Quickly see how balanced your current problem set is across easy, medium, and hard questions."
                    bullets={[
                      'Helps plan study sessions by identifying gaps',
                      'Counts only the problems in your filtered view',
                      'Combine with topics to explore deeper patterns',
                    ]}
                    side="left"
                  />
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-white/70">Easy</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">{metrics.difficultyBreakdown.EASY}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-white/70">Medium</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">{metrics.difficultyBreakdown.MEDIUM}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700 dark:text-white/70">Hard</span>
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">{metrics.difficultyBreakdown.HARD}</span>
                  </div>
                  <div className="mt-2 border-t border-slate-200 pt-3 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-white/50">Total</span>
                      <span className="text-2xl font-semibold text-slate-900 dark:text-white">{metrics.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-white/50">Topics</span>
                    <span className="text-xl font-semibold text-slate-900 dark:text-white">{metrics.topicCount}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar and Main Content */}
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar - Filters only */}
          <aside className="flex max-h-[calc(100vh-180px)] min-h-0 flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-glass lg:sticky lg:top-24">
            {/* Active Filters */}
            {(selectedCompany || filters.difficulties.length > 0 || filters.topics.length > 0) && (
              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/40">
                <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 dark:text-white/50">
                  <span>Active Filters</span>
                  <InfoPopover
                    title="Active filters"
                    description="Glance at every filter influencing the dashboard at the moment."
                    bullets={[
                      'Click any pill or chip to remove it instantly',
                      'Combine multiple filters to mirror target interview loops',
                      'Use Reset Filters below to clear everything at once',
                    ]}
                    side="left"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCompany && (
                    <button
                      type="button"
                      onClick={() => setSelectedCompany(null)}
                      className="group flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-200 dark:border-aurora-soft/40 dark:bg-aurora-soft/10 dark:text-aurora-soft dark:hover:border-aurora-soft/60 dark:hover:bg-aurora-soft/20"
                    >
                      <span>{selectedCompany}</span>
                      <X className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
                    </button>
                  )}
                  {filters.difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      type="button"
                      onClick={() => toggleDifficulty(difficulty)}
                      className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                        difficulty === 'EASY'
                          ? 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-200 dark:border-emerald-400/40 dark:bg-emerald-400/10 dark:text-emerald-300 dark:hover:border-emerald-400/60 dark:hover:bg-emerald-400/20'
                          : difficulty === 'MEDIUM'
                            ? 'border-amber-300 bg-amber-100 text-amber-700 hover:border-amber-400 hover:bg-amber-200 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:border-amber-400/60 dark:hover:bg-amber-400/20'
                            : 'border-rose-300 bg-rose-100 text-rose-700 hover:border-rose-400 hover:bg-rose-200 dark:border-rose-400/40 dark:bg-rose-400/10 dark:text-rose-300 dark:hover:border-rose-400/60 dark:hover:bg-rose-400/20'
                      }`}
                    >
                      <span>{difficulty}</span>
                      <X className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
                    </button>
                  ))}
                  {filters.topics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setTopics(filters.topics.filter((t) => t !== topic))}
                      className="group flex items-center gap-2 rounded-full border border-blue-300 bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:border-blue-400 hover:bg-blue-200 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-300 dark:hover:border-blue-400/60 dark:hover:bg-blue-400/20"
                    >
                      <span>{topic}</span>
                      <X className="h-3.5 w-3.5 opacity-60 transition group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Company Switcher */}
            <CompanySwitcher
              companies={companies}
              selectedCompany={selectedCompany}
              onChange={setSelectedCompany}
            />
            
            {/* Difficulty Filter */}
            <DifficultyFilter selected={filters.difficulties} onToggle={toggleDifficulty} />
            
            {/* Topic Selector */}
            <TopicSelector
              availableTopics={availableTopics}
              selectedTopics={filters.topics}
              onChange={setTopics}
            />
            
            {/* Reset Filters Button */}
            <button
              type="button"
              onClick={clearFilters}
              className="mt-auto rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:border-slate-400 hover:bg-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              Reset Filters
            </button>
          </aside>

          {/* Main Content - Problem List */}
          {/* Main Content - Problem List */}
          <section className="flex min-h-0 flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-glass">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-3">
                <SearchBar value={filters.search} onChange={setSearch} />
                <InfoPopover
                  title="Smart search"
                  description="Filter problems by title, tags, company names, or keywords to locate what you need fast."
                  bullets={[
                    'Search combines with active filters for precise results',
                    'Use shortcuts like array, graph, sliding window, etc.',
                    'Clear the input to restore the full filtered list',
                  ]}
                />
              </div>
              <div className="text-right text-sm text-slate-700 dark:text-white/50">
                Showing
                <span className="ml-1 font-semibold text-slate-900 dark:text-white">{processedProblems.length.toLocaleString()}</span>
                <span className="ml-1 text-slate-700 dark:text-white/50">of</span>
                <span className="ml-1 font-semibold text-slate-900 dark:text-white">{totalMatches.toLocaleString()}</span>
                <span className="ml-1 text-slate-700 dark:text-white/50">problems</span>
              </div>
            </div>
            {hasMore && (
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 dark:border-aurora-soft/30 dark:bg-aurora-soft/10 dark:text-aurora-soft/90">
                Viewing a slice of the full dataset. Load more to continue exploring without overwhelming the browser.
              </div>
            )}
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <ProblemList
                ref={problemListRef}
                problems={processedProblems}
                isLoading={loading}
                error={error}
                trackedProblems={trackedProblems}
                onToggleTracked={toggleProblemTracked}
                onScrollOffsetChange={handleScrollOffsetChange}
                sortField={sort.field}
                sortDirection={sort.direction}
                onSort={handleSort}
              />
            </div>
            <AdSenseSlot
              slotId={inlineAdSlot}
              label="Promoted Prep Resources"
              className="bg-white/80 text-slate-500 shadow-none dark:bg-slate-900/40 dark:text-white/40"
            />
            {hasMore && !loading && (
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 dark:border-white/10 dark:bg-slate-900/50">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="rounded-xl border border-emerald-300 bg-emerald-100 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-200 dark:border-aurora-soft/40 dark:bg-aurora-soft/20 dark:text-aurora-soft/90 dark:hover:border-aurora-soft/60 dark:hover:bg-aurora-soft/30"
                >
                  Load {VISIBLE_INCREMENT.toLocaleString()} More
                </button>
                <button
                  type="button"
                  onClick={handleShowAll}
                  className="rounded-xl border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-300 dark:border-white/20 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/30 dark:hover:bg-white/10"
                >
                  Load Everything
                </button>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-8 dark:border-white/10">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-600 dark:text-white/60 sm:flex-row">
            <p>© 2026 PrepBuddy. Built for the interview prep community.</p>
            <nav className="flex gap-6">
              <Link to="/about" className="transition hover:text-slate-900 dark:hover:text-white">About</Link>
              <Link to="/privacy" className="transition hover:text-slate-900 dark:hover:text-white">Privacy</Link>
              <Link to="/terms" className="transition hover:text-slate-900 dark:hover:text-white">Terms</Link>
              <a href="https://github.com/kiranpuli/prep-buddy" target="_blank" rel="noopener noreferrer" className="transition hover:text-slate-900 dark:hover:text-white">GitHub</a>
            </nav>
          </div>
        </footer>
      </div>

      {/* Scroll to Top Button */}
      <button
        type="button"
        onClick={handleScrollToTop}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-emerald-700 shadow-lg shadow-emerald-500/20 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-200 dark:border-aurora-soft/40 dark:bg-aurora-soft/10 dark:text-aurora-soft dark:focus:ring-aurora-soft/60 dark:hover:bg-aurora-soft dark:hover:text-slate-950 ${showScrollTop ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-4'}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Dashboard;
