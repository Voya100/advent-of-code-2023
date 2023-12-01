// https://adventofcode.com/2023/day/1

import { sum } from './utils';

const numberMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

export function part1(input: string) {
  const values = parseInput(input);
  return sum(values, (v) => v);
}

export function part2(input: string) {
  const values = parseInput2(input);
  return sum(values, (v) => v);
}

function parseInput(input: string) {
  return input.split('\n').map(findNumber);
}

function parseInput2(input: string) {
  return input.split('\n').map(findNumber2);
}

function findNumber(row: string) {
  const digitMatches = [...row.matchAll(/\d/g)];
  const numberString =
    digitMatches[0][0] + digitMatches[digitMatches.length - 1][0];
  return +numberString;
}

function findNumber2(row: string) {
  let firstIndex = row.length;
  let firstValue = 0;
  let lastIndex = -1;
  let lastValue = 0;
  for (const [key, value] of Object.entries(numberMap)) {
    const firstIndexOfKey = row.indexOf(key);
    const lastIndexOfKey = row.lastIndexOf(key);
    if (firstIndexOfKey !== -1 && firstIndexOfKey < firstIndex) {
      firstIndex = firstIndexOfKey;
      firstValue = value;
    }
    if (lastIndexOfKey !== -1 && lastIndexOfKey > lastIndex) {
      lastIndex = lastIndexOfKey;
      lastValue = value;
    }
  }
  const numberString = firstValue + '' + lastValue;
  return +numberString;
}
