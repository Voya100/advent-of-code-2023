// https://adventofcode.com/2023/day/1

import { sum } from './utils';

const numberMap: Record<string, number> = {
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

const firstDigitRegex = new RegExp(Object.keys(numberMap).join('|'));
const lastDigitRegex = new RegExp(reverseString(Object.keys(numberMap).join('|')));

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

/**
 * Find first and last digit in string, concatenate them and return as number
 */
function findNumber(row: string) {
  const digitMatches = [...row.matchAll(/\d/g)];
  const numberString = digitMatches[0][0] + digitMatches[digitMatches.length - 1][0];
  return +numberString;
}

/**
 * Find first and last representations of digit in string ("1", "one", "2", ...), concatenate them and return as number
 */
function findNumber2(row: string) {
  const reversedRow = reverseString(row);
  const firstDigitKey = row.match(firstDigitRegex)![0];
  const lastDigitKey = reverseString(reversedRow.match(lastDigitRegex)![0]);
  const numberString = `${numberMap[firstDigitKey]}${numberMap[lastDigitKey]}`;
  return +numberString;
}

function reverseString(str: string) {
  return str.split('').reverse().join('');
}
