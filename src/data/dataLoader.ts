import Papa from 'papaparse';
import type { Difficulty, ProblemRecord } from '../types';
import { buildProblemId } from '../utils/problemId';

type RawProblemRow = {
  Difficulty?: string;
  Title?: string;
  Frequency?: string | number;
  'Acceptance Rate'?: string | number;
  Link?: string;
  Topics?: string;
};

type DatasetEntry = {
  key: string;
  company: string;
  bucket: string;
  order: number;
  load: () => Promise<string>;
};

const problemFiles = import.meta.glob('/data/**/*.csv', { as: 'raw' });

const datasetEntries: DatasetEntry[] = Object.entries(problemFiles)
  .map(([path, loader]) => {
    const segments = path.split('/').filter(Boolean);
    // Expected shape: ['data', 'Company', '5. Range.csv']
    const company = segments.length > 1 ? segments[1] : undefined;
    const fileName = segments.length > 0 ? segments[segments.length - 1] : '';
    const normalizedFileName = fileName.trim();
    const match = normalizedFileName.match(/^(\d+)\.\s*(.+?)\.csv$/i);
    const bucket = match?.[2]?.trim() ?? normalizedFileName.replace(/\.csv$/i, '').trim();
    const order = match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;

    if (!company || !bucket) {
      return null;
    }

    return {
      key: path,
      company,
      bucket,
      order,
      load: loader as () => Promise<string>,
    } satisfies DatasetEntry;
  })
  .filter((entry): entry is DatasetEntry => Boolean(entry));

const entryKey = (company: string, bucket: string) => `${company.toLowerCase()}__${bucket.toLowerCase()}`;

const datasetEntryMap = new Map<string, DatasetEntry>();
const groupedByCompany = new Map<string, DatasetEntry[]>();
const bucketEntries = new Map<string, DatasetEntry[]>();
const bucketOrder = new Map<string, number>();

for (const entry of datasetEntries) {
  datasetEntryMap.set(entryKey(entry.company, entry.bucket), entry);

  const companyGroup = groupedByCompany.get(entry.company);
  if (companyGroup) {
    companyGroup.push(entry);
  } else {
    groupedByCompany.set(entry.company, [entry]);
  }

  const bucketGroup = bucketEntries.get(entry.bucket);
  if (bucketGroup) {
    bucketGroup.push(entry);
  } else {
    bucketEntries.set(entry.bucket, [entry]);
  }

  const existingOrder = bucketOrder.get(entry.bucket);
  if (existingOrder === undefined || entry.order < existingOrder) {
    bucketOrder.set(entry.bucket, entry.order);
  }
}

const companyBuckets = new Map<string, string[]>();

groupedByCompany.forEach((entries, company) => {
  companyBuckets.set(
    company,
    entries
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((entry) => entry.bucket)
  );
});

const companies = Array.from(new Set(datasetEntries.map((entry) => entry.company))).sort((a, b) =>
  a.localeCompare(b)
);

const allBuckets = Array.from(bucketEntries.keys()).sort((a, b) => {
  const orderA = bucketOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
  const orderB = bucketOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
  if (orderA !== orderB) {
    return orderA - orderB;
  }
  return a.localeCompare(b);
});

const normalizeDifficulty = (value?: string): Difficulty => {
  const normalized = value?.trim().toUpperCase();
  if (normalized === 'EASY' || normalized === 'MEDIUM' || normalized === 'HARD') {
    return normalized;
  }
  return 'MEDIUM';
};

const parseFloatSafe = (value?: string | number) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace(/,/g, ''));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const parseTopics = (value?: string) =>
  value
    ?.split(',')
    .map((topic) => topic.trim())
    .filter(Boolean) ?? [];

const transformRows = (rows: RawProblemRow[], company: string, bucket: string): ProblemRecord[] =>
  rows
    .map((row) => {
      const title = row.Title?.trim();
      if (!title) {
        return null;
      }

      return {
        company,
        timeframe: bucket,
        title,
        difficulty: normalizeDifficulty(row.Difficulty),
        frequency: parseFloatSafe(row.Frequency),
        acceptanceRate: parseFloatSafe(row['Acceptance Rate']),
        link: row.Link?.trim() ?? '',
        topics: parseTopics(row.Topics),
      } satisfies ProblemRecord;
    })
    .filter((problem): problem is ProblemRecord => Boolean(problem));

const dedupeProblems = (problems: ProblemRecord[]) => {
  const seen = new Set<string>();
  const unique: ProblemRecord[] = [];

  for (const problem of problems) {
    const id = buildProblemId(problem.company, problem.timeframe, problem.title, problem.link);
    if (seen.has(id)) {
      continue;
    }
    seen.add(id);
    unique.push(problem);
  }

  return unique;
};

export const getCompanies = () => companies;

export const getBucketsForCompany = (company: string) => companyBuckets.get(company) ?? [];

export const loadProblemBucket = async (company: string, bucket: string) => {
  const entry = datasetEntryMap.get(entryKey(company, bucket));
  if (!entry) {
    throw new Error(`Unable to locate dataset for ${company} (${bucket})`);
  }

  return parseDatasetEntry(entry);
};

const datasetCache = new Map<string, ProblemRecord[]>();
const datasetPromiseCache = new Map<string, Promise<ProblemRecord[]>>();

const parseDatasetEntry = async (entry: DatasetEntry) => {
  const cacheKey = entry.key;
  const cached = datasetCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const pending = datasetPromiseCache.get(cacheKey);
  if (pending) {
    return pending;
  }

  const loadPromise = (async () => {
    const csv = await entry.load();
    const parsed = Papa.parse<RawProblemRow>(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      transformHeader: (header) => header.trim(),
    });

  const rows = transformRows(parsed.data, entry.company, entry.bucket);
  const uniqueRows = dedupeProblems(rows);
  datasetCache.set(cacheKey, uniqueRows);
  return uniqueRows;
  })()
    .catch((error) => {
      datasetPromiseCache.delete(cacheKey);
      throw error;
    })
    .then((rows) => {
      datasetPromiseCache.delete(cacheKey);
      return rows;
    });

  datasetPromiseCache.set(cacheKey, loadPromise);
  return loadPromise;
};

export const getAllBuckets = () => allBuckets;

export const loadAllProblems = async (bucket?: string | null) => {
  const targetEntries = bucket ? bucketEntries.get(bucket) ?? [] : datasetEntries;
  if (targetEntries.length === 0) {
    return [];
  }

  const results = await Promise.all(targetEntries.map((entry) => parseDatasetEntry(entry)));
  return dedupeProblems(results.flat());
};
