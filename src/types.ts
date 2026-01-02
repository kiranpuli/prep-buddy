export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface ProblemRecord {
  company: string;
  timeframe: string;
  title: string;
  difficulty: Difficulty;
  frequency: number;
  acceptanceRate: number;
  link: string;
  topics: string[];
}

export type SortField = 'title' | 'difficulty';
export type SortDirection = 'asc' | 'desc';

export interface ProblemFilters {
  search: string;
  difficulties: Difficulty[];
  topics: string[];
}

export interface ProblemSort {
  field: SortField;
  direction: SortDirection;
}
