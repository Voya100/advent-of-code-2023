// https://adventofcode.com/2023/day/24

import { Coordinate, getAllPairs, parseNumbers } from './utils';

type Hailstone = Coordinate & {
  xVelocity: number;
  yVelocity: number;
  zVelocity: number;
};

export function part1(input: string, testAreaStart = 200000000000000, testAreaEnd = 400000000000000) {
  const hailstones = parseInput(input);
  const hailstonePairs = getAllPairs(hailstones);
  return hailstonePairs.map(([stone1, stone2]) => collides(stone1, stone2, testAreaStart, testAreaEnd)).filter((v) => v)
    .length;
}

export function part2(input: string) {
  const v = parseInput(input);
  return '';
}

function parseInput(input: string) {
  return input.split('\n').map(parseHailstone);
}

function parseHailstone(row: string) {
  const [x, y, z, xVelocity, yVelocity, zVelocity] = parseNumbers(row);
  return {
    x,
    y,
    z,
    xVelocity,
    yVelocity,
    zVelocity,
  };
}

function collides(hailstone1: Hailstone, hailstone2: Hailstone, testAreaStart: number, testAreaEnd: number) {
  const collidesTime2 =
    (hailstone1.y - hailstone2.y + ((hailstone2.x - hailstone1.x) / hailstone1.xVelocity) * hailstone1.yVelocity) /
    (hailstone2.yVelocity - (hailstone1.yVelocity * hailstone2.xVelocity) / hailstone1.xVelocity);

  if (collidesTime2 === Infinity || collidesTime2 === -Infinity) {
    return false;
  }

  const x2 = hailstone2.x + hailstone2.xVelocity * collidesTime2;
  const y2 = hailstone2.y + hailstone2.yVelocity * collidesTime2;

  if (x2 < testAreaStart || testAreaEnd < x2 || y2 < testAreaStart || testAreaEnd < y2) {
    return false;
  }

  const collidesTime1 = (x2 - hailstone1.x) / hailstone1.xVelocity;

  return collidesTime1 > 0 && collidesTime2 > 0;
}
