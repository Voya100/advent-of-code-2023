// https://adventofcode.com/2023/day/5

import { toRecord } from './utils';

type SourceMap = {
  sourceCategory: string;
  destinationCategory: string;
  ranges: {
    destinationRangeStart: number;
    destinationRangeEnd: number;
    sourceRangeStart: number;
    sourceRangeEnd: number;
  }[];
};

export function part1(input: string) {
  const { seeds, maps } = parseInput(input);
  const mapsBySource = toRecord(maps, (map) => map.sourceCategory);
  const locations = seeds.map((seed) => findLocation(seed, 'seed', mapsBySource));
  return Math.min(...locations);
}

// Brute force solution. Takes ~21 minutes to run
export function part2(input: string) {
  const { seeds, maps } = parseInput(input);
  const mapsBySource = toRecord(maps, (map) => map.sourceCategory);
  let minLoc = Infinity;
  for (let i = 0; i < seeds.length - 1; i += 2) {
    for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
      const location = findLocation(j, 'seed', mapsBySource);
      if (location < minLoc) {
        minLoc = location;
      }
    }
  }
  return minLoc;
}

function parseInput(input: string) {
  const [seedInput, ...mapInput] = input.split('\n\n');
  const seeds = seedInput
    .split(': ')[1]
    .split(' ')
    .map((v) => +v);
  const maps = mapInput.map(parseMap);
  return { seeds, maps };
}

function parseMap(mapInput: string): SourceMap {
  const rows = mapInput.split('\n');
  // Format "seed-to-soil map:"
  const [sourceCategory, destinationCategory] = rows[0].split(' ')[0].split('-to-');
  const ranges = rows.slice(1).map(parseRange);
  return { sourceCategory, destinationCategory, ranges };
}

function parseRange(row: string) {
  const [destinationRangeStart, sourceRangeStart, rangeLength] = row.split(' ').map((v) => +v);
  return {
    destinationRangeStart,
    destinationRangeEnd: destinationRangeStart + rangeLength,
    sourceRangeStart,
    sourceRangeEnd: sourceRangeStart + rangeLength,
  };
}

function findLocation(id: number, source: string, mapsBySource: Record<string, SourceMap>) {
  if (source === 'location') {
    return id;
  }
  const map = mapsBySource[source];
  for (const range of map.ranges) {
    if (range.sourceRangeStart <= id && id < range.sourceRangeEnd) {
      const diff = id - range.sourceRangeStart;
      return findLocation(range.destinationRangeStart + diff, map.destinationCategory, mapsBySource);
    }
  }
  return findLocation(id, map.destinationCategory, mapsBySource);
}
