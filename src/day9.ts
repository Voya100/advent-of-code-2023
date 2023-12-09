// https://adventofcode.com/2023/day/9

import { parseNumbers, sum } from './utils';

export function part1(input: string) {
  const patterns = parseInput(input);
  return sum(patterns, (p) => getNextValue(p));
}

export function part2(input: string) {
  const patterns = parseInput(input);
  patterns.forEach((pattern) => pattern.reverse());
  return sum(patterns, (p) => getNextValue(p));
}

function parseInput(input: string) {
  return input.split('\n').map(parseNumbers);
}

function getNextValue(pattern: number[]): number {
  const differences = pattern.slice(0, -1).map((p, i) => pattern[i + 1] - p);
  if (differences.every((d) => d === 0)) {
    return pattern[0];
  }
  const nextInDifferencePattern = getNextValue(differences);
  return pattern[pattern.length - 1] + nextInDifferencePattern;
}
