// https://adventofcode.com/2023/day/6

import { multiply, parseNumbers } from './utils';

type Race = {
  time: number;
  distance: number;
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
  return times.map((time, i) => ({ time, distance: distances[i] }));
}

function getWaysToBeat(race: Race) {
  const { min, max } = getMinAndMax(race);
  return max - min + 1;
}

// While unoptimised, still runs within 200 ms for given input
function getMinAndMax(race: Race) {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < race.time; i++) {
    const distaneTravelled = (race.time - i) * i;
    if (distaneTravelled > race.distance) {
      if (min === Infinity) {
        min = i;
      }
      max = i;
    }
  }
  return { min, max };
}
