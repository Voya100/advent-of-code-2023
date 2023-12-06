// https://adventofcode.com/2023/day/6

import { multiply, parseNumbers } from './utils';

type Race = {
  time: number;
  distanceRecord: number;
};

export function part1(input: string) {
  const races = parseInput(input);
  return multiply(races, getWaysToBeat);
}

export function part2(input: string) {
  const fixedInput = input.replaceAll(' ', '');
  const race = parseInput(fixedInput)[0];
  return getWaysToBeat(race);
}

function parseInput(input: string): Race[] {
  const [timeInput, distanceInput] = input.split('\n');
  const times = parseNumbers(timeInput);
  const distances = parseNumbers(distanceInput);
  return times.map((time, i) => ({ time, distanceRecord: distances[i] }));
}

function getWaysToBeat(race: Race) {
  const { min, max } = getMinAndMaxButtonDuration(race);
  return max - min + 1;
}

/**
 * Finds minimum and maximum duration to press the button by solving the quadratic equation
 * v*t1 > d // v = speed = time to press the button, d = minDistance, t1 = time remaining after button press
 * => v*(t-v) > d // t = total time
 * => -v**2 + v*t - d > 0 // Solve the quadratic equation
 */
function getMinAndMaxButtonDuration(race: Race) {
  let min = (race.time - Math.sqrt(race.time ** 2 - 4 * race.distanceRecord)) / 2;
  let max = (race.time + Math.sqrt(race.time ** 2 - 4 * race.distanceRecord)) / 2;
  // Must be better than record, so increment/decrement if exact match
  if (min === Math.ceil(min)) {
    min++;
  }
  if (max === Math.floor(max)) {
    max--;
  }
  // Only complete milliseconds
  return { min: Math.ceil(min), max: Math.floor(max) };
}
