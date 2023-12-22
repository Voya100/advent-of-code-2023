// https://adventofcode.com/2023/day/22

import { numberSum, parseNumbers } from './utils';

type Coordinate = {
  x: number;
  y: number;
  z: number;
};

// Inclusive range
type Brick = {
  start: Coordinate;
  end: Coordinate;
  supportingBricks: Brick[];
  supportedBricks: Brick[];
};

export function part1(input: string) {
  const bricks = parseInput(input);
  for (const brick of bricks) {
    dropBrick(brick, bricks);
  }
  return bricks.filter(canBeDisintegrated).length;
}

export function part2(input: string) {
  const bricks = parseInput(input);
  for (const brick of bricks) {
    dropBrick(brick, bricks);
  }
  const counts = bricks.map((b) => countFallingBricksIfDisintegrated(b));
  return numberSum(counts);
}

function parseInput(input: string) {
  const bricks = input.split('\n').map(parseRow);
  // Sort in falling order
  bricks.sort((a, b) => a.start.z - b.start.z);
  return bricks;
}

function parseRow(row: string): Brick {
  const [start, end] = row
    .split('~')
    .map(parseNumbers)
    .map(([x, y, z]) => ({ x, y, z }));
  return { start, end, supportingBricks: [], supportedBricks: [] };
}

function dropBrick(brick: Brick, allBricks: Brick[]) {
  while (brick.start.z > 1 && brick.supportingBricks.length === 0) {
    for (const possibleSupport of allBricks) {
      if (isBrickUnder(brick, possibleSupport)) {
        brick.supportingBricks.push(possibleSupport);
        possibleSupport.supportedBricks.push(brick);
      }
    }
    if (!brick.supportingBricks.length) {
      brick.start.z--;
      brick.end.z--;
    }
  }
}

function isBrickUnder(aboveBrick: Brick, underBrick: Brick) {
  if (aboveBrick.start.z - 1 !== underBrick.end.z) {
    return false;
  }
  for (const coord of getCoordinatesBelow(aboveBrick)) {
    if (isCoordinateInsideBrick(coord, underBrick)) {
      return true;
    }
  }
  return false;
}

function isCoordinateInsideBrick(coordinate: Coordinate, brick: Brick) {
  return (
    brick.start.x <= coordinate.x &&
    coordinate.x <= brick.end.x &&
    brick.start.y <= coordinate.y &&
    coordinate.y <= brick.end.y &&
    brick.start.z <= coordinate.z &&
    coordinate.z <= brick.end.z
  );
}

function* getCoordinatesBelow(brick: Brick) {
  if (brick.start.z !== brick.end.z) {
    // Vertical, only 1 coordinate below
    yield { x: brick.start.x, y: brick.start.y, z: brick.start.z - 1 };
    return;
  }
  const direction: 'x' | 'y' = brick.start.x === brick.end.x ? 'y' : 'x';
  for (let i = brick.start[direction]; i <= brick.end[direction]; i++) {
    yield {
      ...brick.start,
      z: brick.start.z - 1,
      [direction]: i,
    };
  }
}

function canBeDisintegrated(brick: Brick) {
  return brick.supportedBricks.every((supportedBrick) => supportedBrick.supportingBricks.length > 1);
}

function countFallingBricksIfDisintegrated(brick: Brick) {
  let count = 0;
  const nextBricks = [brick];
  const disintegratedBricks = new Set<Brick>();
  while (nextBricks.length) {
    const supportingBrick = nextBricks.pop()!;
    disintegratedBricks.add(supportingBrick);
    count++;
    for (const supportedBrick of supportingBrick.supportedBricks) {
      if (!supportedBrick.supportingBricks.some((b) => !disintegratedBricks.has(b))) {
        nextBricks.push(supportedBrick);
      }
    }
  }
  // Not including brick itself
  return count - 1;
}
