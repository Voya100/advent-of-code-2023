// https://adventofcode.com/2023/day/5

import { toRecord } from './utils';

type Range = {
  start: number;
  end: number;
};

type SourceMap = {
  sourceCategory: string;
  destinationCategory: string;
  ranges: {
    sourceRange: Range;
    destinationRange: Range;
  }[];
};

export function part1(input: string) {
  const { seeds, maps } = parseInput(input);
  const mapsBySource = toRecord(maps, (map) => map.sourceCategory);
  const locations = seeds.map((seed) => findLocation(seed, 'seed', mapsBySource));
  return Math.min(...locations);
}

export function part2(input: string) {
  const { seeds, maps } = parseInput(input);
  const mapsBySource = toRecord(maps, (map) => map.sourceCategory);
  let minLoc = Infinity;
  for (let i = 0; i < seeds.length - 1; i += 2) {
    const location = findLowestLocationForRange(
      { start: seeds[i], end: seeds[i] + seeds[i + 1] - 1 },
      'seed',
      mapsBySource
    );
    if (location < minLoc) {
      minLoc = location;
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
  // Sort by ascending start order so that gaps between ranges can be found more easily
  ranges.sort((r1, r2) => r1.sourceRange.start - r2.sourceRange.start);
  return { sourceCategory, destinationCategory, ranges };
}

function parseRange(row: string) {
  const [destinationRangeStart, sourceRangeStart, rangeLength] = row.split(' ').map((v) => +v);
  return {
    destinationRange: {
      start: destinationRangeStart,
      end: destinationRangeStart + rangeLength,
    },
    sourceRange: {
      start: sourceRangeStart,
      end: sourceRangeStart + rangeLength,
    },
  };
}

function findLocation(id: number, source: string, mapsBySource: Record<string, SourceMap>) {
  if (source === 'location') {
    return id;
  }
  const map = mapsBySource[source];
  for (const range of map.ranges) {
    if (range.sourceRange.start <= id && id < range.sourceRange.end) {
      const diff = id - range.sourceRange.start;
      return findLocation(range.destinationRange.start + diff, map.destinationCategory, mapsBySource);
    }
  }
  return findLocation(id, map.destinationCategory, mapsBySource);
}

/**
 * Finds smallest location value for given idRange of given source type.
 */
function findLowestLocationForRange(idRange: Range, source: string, mapsBySource: Record<string, SourceMap>) {
  const map = mapsBySource[source];
  if (source === 'location') {
    return idRange.start;
  }
  // Note: These are ordered in ascending order
  const sourceRanges: Range[] = map.ranges.map((r) => r.sourceRange);
  const lastSourceRange = sourceRanges[sourceRanges.length - 1];
  // Ranges within idRange not contained within sourceRanges
  const outsideRanges: Range[] = [];
  const lowestLocations: number[] = [];

  // idRange section on left side of first sourceRange, if exists
  const firstOutsideRange = getOverlap(idRange, { start: 0, end: sourceRanges[0].start });
  // idRange section on right side of last sourceRange, if exists
  const lastOutsideRange = getOverlap(idRange, { start: lastSourceRange.end, end: Infinity });
  if (firstOutsideRange) {
    outsideRanges.push(firstOutsideRange);
  }
  if (lastOutsideRange) {
    outsideRanges.push(lastOutsideRange);
  }

  let previousRange: Range | null = null;
  for (const range of map.ranges) {
    const { sourceRange, destinationRange } = range;
    if (previousRange !== null && previousRange.end !== sourceRange.start) {
      // There is empty space between sourceRanges. Check if idRange overlaps with this section
      const overLap = getOverlap(idRange, { start: previousRange.end, end: sourceRange.start });
      if (overLap) {
        outsideRanges.push(overLap);
      }
    }
    const overlapWithSourceRange = getOverlap(idRange, sourceRange);
    if (overlapWithSourceRange) {
      const overlapLength = overlapWithSourceRange.end - overlapWithSourceRange.start;
      const diff = overlapWithSourceRange.start - sourceRange.start;
      const mappedOverlap = {
        start: destinationRange.start + diff,
        end: destinationRange.start + diff + overlapLength + 1,
      };
      lowestLocations.push(findLowestLocationForRange(mappedOverlap, map.destinationCategory, mapsBySource));
    }
    previousRange = sourceRange;
  }

  for (const range of outsideRanges) {
    // Ids outside outside of source ranges don¨t need any mapping
    lowestLocations.push(findLowestLocationForRange(range, map.destinationCategory, mapsBySource));
  }

  return Math.min(...lowestLocations);
}

/**
 * Finds overlap between 2 ranges. Retuns null if no overlap found
 */
function getOverlap(range1: Range, range2: Range): Range | null {
  const possibleOverlap = {
    start: Math.max(range1.start, range2.start),
    end: Math.min(range1.end, range2.end),
  };
  if (possibleOverlap.start < possibleOverlap.end) {
    return possibleOverlap;
  }
  return null;
}
