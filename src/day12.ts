import { getRange, parseNumbers, sum } from './utils';
// https://adventofcode.com/2023/day/12

type LengthInfo = {
  length: number;
  minStartIndex: number;
  maxStartIndex: number;
};

// Non-inclusive range
type Range = { start: number; end: number };

export function part1(input: string) {
  const conditionRecords = parseInput(input, 1);
  return sum(conditionRecords, ({ springs, lengths }) => countPossibleRecords(springs, lengths));
}

export function part2(input: string) {
  const conditionRecords = parseInput(input, 5);
  return sum(conditionRecords, ({ springs, lengths }) => countPossibleRecords(springs, lengths));
}

function parseInput(input: string, multiplyFactor: number) {
  return input.split('\n').map((row) => parseConditionRecord(row, multiplyFactor));
}

function parseConditionRecord(row: string, multiplyFactor: number) {
  // Combine '...' -> '.' to simplify value, since adjacent operational springs don't affect results
  const [springs, numbersString] = row.replaceAll(/\.+/g, '.').split(' ');
  const numbers = parseNumbers(numbersString);
  return {
    springs: getRange(0, multiplyFactor)
      .map(() => springs)
      .join('?'),
    lengths: getRange(0, multiplyFactor).flatMap(() => numbers),
  };
}

function countPossibleRecords(springs: string, lengths: number[]) {
  const possibleMatchesByLength = Object.fromEntries(
    [...new Set(lengths)].map((length) => [length, getPossibleMatches(springs, length)])
  );
  const lengthInfos = getLengthInfos(springs, lengths);
  return countMatchesWithoutOverlap(springs, lengthInfos, possibleMatchesByLength);
}

/**
 * Returns all possible locations for damaged sections of given length,
 * considering that 2 damaged sections can't be right next to each other
 * @param springs
 * @param length
 * @returns
 */
function getPossibleMatches(springs: string, length: number): Range[] {
  const matchingRanges: Range[] = [];
  for (let i = 0; i <= springs.length - length; i++) {
    const leftPossiblyOperational = i === 0 || springs[i - 1] !== '#';
    const rightPossiblyOperational = i + length > springs.length || springs[i + length] !== '#';
    if (!leftPossiblyOperational || !rightPossiblyOperational) {
      // Both sides must have potential to be operational or empty => skip
      continue;
    }
    let springBetweenPossiblyDamaged = true;
    for (let j = i; j < i + length; j++) {
      if (springs[j] === '.') {
        springBetweenPossiblyDamaged = false;
        break;
      }
    }
    if (springBetweenPossiblyDamaged) {
      matchingRanges.push({ start: i, end: i + length });
    }
  }
  return matchingRanges;
}

function countMatchesWithoutOverlap(
  springs: string,
  lengths: LengthInfo[],
  possibleMatchesByLength: Record<number, Range[]>,
  cache: Record<string, number | undefined> = {},
  previousMatch?: Range
) {
  const cacheKey = getCacheKey(lengths, previousMatch);
  const cacheValue = cache[cacheKey];
  if (cacheValue !== undefined) {
    return cacheValue;
  }
  if (lengths.length === 0) {
    const lastDamagedIndex = springs.lastIndexOf('#');
    if (previousMatch && lastDamagedIndex !== -1 && lastDamagedIndex > previousMatch.end) {
      return 0;
    }
    return 1;
  }
  let count = 0;
  const nextLengthInfo = lengths[0];
  const possibleMatches = possibleMatchesByLength[nextLengthInfo.length].filter(
    (possibleMatch) =>
      nextLengthInfo.minStartIndex <= possibleMatch.start && possibleMatch.start <= nextLengthInfo.maxStartIndex
  );
  const firstDamagedIndex = springs.indexOf('#');
  for (const possibleMatch of possibleMatches) {
    if (!previousMatch && firstDamagedIndex !== -1 && firstDamagedIndex < possibleMatch.start) {
      continue;
    }
    if (
      !previousMatch ||
      (possibleMatch.start > previousMatch.end &&
        !hasDestroyedSpringInRange(springs, { start: previousMatch.end, end: possibleMatch.start }))
    ) {
      count += countMatchesWithoutOverlap(springs, lengths.slice(1), possibleMatchesByLength, cache, possibleMatch);
    }
  }
  cache[cacheKey] = count;
  return count;
}

function hasDestroyedSpringInRange(str: string, { start, end }: Range) {
  for (let i = start; i < end; i++) {
    if (str[i] === '#') {
      return true;
    }
  }
  return false;
}

/**
 * Find first and last possible start position for each length when considering that all other lengths must also fit
 */
function getLengthInfos(springs: string, lengths: number[]) {
  const lengthInfos: LengthInfo[] = [];

  // Populate min values
  let lengthSum = 0;
  for (const length of lengths) {
    lengthInfos.push({
      length,
      minStartIndex: lengthSum,
      maxStartIndex: -Infinity,
    });
    lengthSum += length + 1;
  }

  // Populate max values
  lengthSum = 0;
  for (const lengthInfo of [...lengthInfos].reverse()) {
    const operationalSpringsBetween = springs
      .slice(-lengthSum - lengthInfo.length, -lengthSum)
      .split('')
      .filter((s) => s === '.').length;
    lengthSum += operationalSpringsBetween;
    lengthInfo.maxStartIndex = springs.length - lengthInfo.length - lengthSum;
    lengthSum += lengthInfo.length + 1;
  }
  return lengthInfos;
}

function getCacheKey(lengths: LengthInfo[], previousMatch: Range | undefined) {
  return (previousMatch ? previousMatch.end : 0) + ':' + lengths.join(',');
}
