import type { ProblemRecord } from '../types';

const sanitize = (value: string) => value.trim().toLowerCase();

export const getProblemId = (problem: ProblemRecord) => {
  if (problem.link) {
    return sanitize(problem.link);
  }

  const composite = `${problem.company}::${problem.timeframe}::${problem.title}`;
  return sanitize(composite);
};

export const buildProblemId = (company: string, timeframe: string, title: string, link?: string) => {
  if (link) {
    return sanitize(link);
  }

  const composite = `${company}::${timeframe}::${title}`;
  return sanitize(composite);
};
