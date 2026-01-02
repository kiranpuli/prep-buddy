import { create } from 'zustand';
import {
  getAllBuckets,
  getBucketsForCompany,
  getCompanies,
  loadAllProblems,
  loadProblemBucket,
} from '../data/dataLoader';
import type { Difficulty, ProblemFilters, ProblemRecord, ProblemSort } from '../types';

export type TrackingMap = Record<string, boolean>;

type PersistTrackedFn = (tracked: TrackingMap) => Promise<void> | void;

type ProblemState = {
  companies: string[];
  selectedCompany: string | null;
  timeframes: string[];
  selectedTimeframe: string | null;
  filters: ProblemFilters;
  sort: ProblemSort;
  availableTopics: string[];
  problems: ProblemRecord[];
  loading: boolean;
  error?: string;
  isInitialized: boolean;
  activeDatasetKey: string | null;
  trackedProblems: TrackingMap;
  trackingPersistence: 'local' | 'remote';
  persistTracked: PersistTrackedFn;
  datasetCache: Record<string, { problems: ProblemRecord[]; topics: string[] }>;
  initialize: () => void;
  loadProblems: (company: string, timeframe: string) => Promise<void>;
  setSelectedCompany: (company: string | null) => void;
  setSelectedTimeframe: (timeframe: string) => void;
  setSearch: (value: string) => void;
  toggleDifficulty: (difficulty: Difficulty) => void;
  setTopics: (topics: string[]) => void;
  setSort: (sort: ProblemSort) => void;
  clearFilters: () => void;
  toggleProblemTracked: (problemId: string) => void;
  setProblemTracked: (problemId: string, tracked: boolean) => void;
  clearTrackedProblems: () => void;
  setTrackingPersistence: (mode: 'local' | 'remote', persistFn: PersistTrackedFn) => void;
  replaceTrackedProblems: (tracked: TrackingMap, persist?: boolean) => void;
};

const ALL_TIMEFRAMES = 'All Timeframes';
const TRACKING_STORAGE_KEY = 'leetcode-viewer::tracked-problems';

const baseCompanies = getCompanies();
const companies = baseCompanies;
const defaultCompany = baseCompanies.includes('Google') ? 'Google' : (baseCompanies.length > 0 ? baseCompanies[0] : null);
const defaultTimeframes = defaultCompany ? getBucketsForCompany(defaultCompany) : [];
const defaultTimeframe = defaultTimeframes.length > 0 ? defaultTimeframes[0] : null;

const createDatasetKey = (company: string, timeframe: string) => `${company.toLowerCase()}::${timeframe.toLowerCase()}`;

export const loadTrackedFromStorage = (): TrackingMap => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(TRACKING_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') {
      const entries = Object.entries(parsed as Record<string, boolean>).filter(([, value]) => value);
      return Object.fromEntries(entries);
    }
  } catch {
    // ignore corrupted storage, fall back to empty map
  }

  return {};
};

export const persistTrackedToStorage: PersistTrackedFn = (tracked) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(tracked));
  } catch {
    // ignore write failures (private mode, quota, etc.)
  }
};

export const useProblemStore = create<ProblemState>((set, get) => ({
  companies,
  selectedCompany: defaultCompany,
  timeframes: defaultTimeframes,
  selectedTimeframe: defaultTimeframe,
  filters: {
    search: '',
    difficulties: [],
    topics: [],
  },
  sort: {
    field: 'title',
    direction: 'asc',
  },
  availableTopics: [],
  problems: [],
  loading: false,
  error: undefined,
  isInitialized: false,
  activeDatasetKey: null,
  trackedProblems: loadTrackedFromStorage(),
  trackingPersistence: 'local',
  persistTracked: persistTrackedToStorage,
  datasetCache: {},
  setTrackingPersistence: (mode, persistFn) => {
    set({ trackingPersistence: mode, persistTracked: persistFn });
  },
  replaceTrackedProblems: (tracked, shouldPersist = false) => {
    if (shouldPersist) {
      const persist = get().persistTracked;
      void Promise.resolve(persist(tracked));
    }
    set({ trackedProblems: tracked });
  },
  initialize: () => {
    if (get().isInitialized) {
      return;
    }

    set({ isInitialized: true });
    const { selectedCompany, selectedTimeframe } = get();

    if (selectedCompany && selectedTimeframe) {
      void get().loadProblems(selectedCompany, selectedTimeframe);
    }
  },
  loadProblems: async (company, timeframe) => {
    const datasetKey = createDatasetKey(company, timeframe);
    const cached = get().datasetCache[datasetKey];
    if (cached) {
      set((state) => {
        const filteredTopics = state.filters.topics.filter((topic) => cached.topics.includes(topic));
        return {
          problems: cached.problems,
          availableTopics: cached.topics,
          filters: {
            ...state.filters,
            topics: filteredTopics,
          },
          loading: false,
          error: undefined,
          activeDatasetKey: datasetKey,
        };
      });
      return;
    }

    set({ loading: true, error: undefined, activeDatasetKey: datasetKey });

    try {
      const data = await loadProblemBucket(company, timeframe);
      const topics = Array.from(new Set(data.flatMap((problem) => problem.topics))).sort((a, b) =>
        a.localeCompare(b)
      );

      set((state) => {
        if (state.activeDatasetKey !== datasetKey) {
          return {};
        }

        const filteredTopics = state.filters.topics.filter((topic) => topics.includes(topic));

        return {
          problems: data,
          availableTopics: topics,
          filters: {
            ...state.filters,
            topics: filteredTopics,
          },
          loading: false,
          error: undefined,
          datasetCache: {
            ...state.datasetCache,
            [datasetKey]: {
              problems: data,
              topics,
            },
          },
        };
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load problem set';
      set((state) => {
        if (state.activeDatasetKey !== datasetKey) {
          return {};
        }
        return {
          loading: false,
          problems: [],
          availableTopics: [],
          error: message,
        };
      });
    }
  },
  setSelectedCompany: (company) => {
    if (!company) {
      const datasetKey = '__all__::all';
      const cached = get().datasetCache[datasetKey];

      if (cached) {
        set((state) => {
          const filteredTopics = state.filters.topics.filter((topic) => cached.topics.includes(topic));
          return {
            selectedCompany: null,
            timeframes: [],
            selectedTimeframe: null,
            problems: cached.problems,
            availableTopics: cached.topics,
            filters: {
              ...state.filters,
              topics: filteredTopics,
            },
            loading: false,
            error: undefined,
            activeDatasetKey: datasetKey,
          };
        });
        return;
      }

      set((state) => ({
        selectedCompany: null,
        timeframes: [],
        selectedTimeframe: null,
        loading: true,
        error: undefined,
        activeDatasetKey: datasetKey,
        filters: {
          ...state.filters,
          topics: [],
        },
      }));

      void (async () => {
        try {
          const data = await loadAllProblems();
          const topics = Array.from(new Set(data.flatMap((problem) => problem.topics))).sort((a, b) =>
            a.localeCompare(b)
          );

          set((state) => {
            if (state.activeDatasetKey !== datasetKey) {
              return {};
            }
            return {
              problems: data,
              availableTopics: topics,
              filters: {
                ...state.filters,
                topics: [],
              },
              loading: false,
              error: undefined,
              datasetCache: {
                ...state.datasetCache,
                [datasetKey]: {
                  problems: data,
                  topics,
                },
              },
            };
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unable to load problems';
          set((state) => {
            if (state.activeDatasetKey !== datasetKey) {
              return {};
            }
            return {
              loading: false,
              error: message,
              problems: [],
              availableTopics: [],
            };
          });
        }
      })();
      return;
    }

    const timeframes = getBucketsForCompany(company);
    const nextTimeframe = timeframes.length > 0 ? timeframes[0] : null;

    set((state) => ({
      selectedCompany: company,
      timeframes,
      selectedTimeframe: nextTimeframe,
      filters: {
        ...state.filters,
        topics: [],
      },
    }));

    if (nextTimeframe) {
      void get().loadProblems(company, nextTimeframe);
    } else {
      set({ problems: [], availableTopics: [] });
    }
  },
  setSelectedTimeframe: (timeframe) => {
    const { selectedCompany } = get();
    if (!selectedCompany) {
      return;
    }

    set({ selectedTimeframe: timeframe });
    void get().loadProblems(selectedCompany, timeframe);
  },
  setSearch: (value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        search: value,
      },
    }));
  },
  toggleDifficulty: (difficulty) => {
    set((state) => {
      const exists = state.filters.difficulties.includes(difficulty);
      const difficulties = exists
        ? state.filters.difficulties.filter((d) => d !== difficulty)
        : [...state.filters.difficulties, difficulty];

      return {
        filters: {
          ...state.filters,
          difficulties,
        },
      };
    });
  },
  setTopics: (topics) => {
    set((state) => ({
      filters: {
        ...state.filters,
        topics,
      },
    }));
  },
  setSort: (sort) => {
    set({ sort });
  },
  clearFilters: () => {
    set((state) => ({
      filters: {
        ...state.filters,
        search: '',
        difficulties: [],
        topics: [],
      },
    }));
  },
  toggleProblemTracked: (problemId) => {
    set((state) => {
      const next = { ...state.trackedProblems };
      if (next[problemId]) {
        delete next[problemId];
      } else {
        next[problemId] = true;
      }
      void Promise.resolve(get().persistTracked(next));
      return { trackedProblems: next };
    });
  },
  setProblemTracked: (problemId, tracked) => {
    set((state) => {
      const next = { ...state.trackedProblems };
      if (tracked) {
        next[problemId] = true;
      } else {
        delete next[problemId];
      }
      void Promise.resolve(get().persistTracked(next));
      return { trackedProblems: next };
    });
  },
  clearTrackedProblems: () => {
    void Promise.resolve(get().persistTracked({}));
    set({ trackedProblems: {} });
  },
}));
