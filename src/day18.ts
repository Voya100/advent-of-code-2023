// https://adventofcode.com/2023/day/18

import { Coordinate, sum } from './utils';

type PlanItem = {
  direction: string;
  distance: number;
};

type Hole = {
  start: Coordinate;
  end: Coordinate;
};

export function part1(input: string) {
  const plans = parseInput(input, false);
  const holes = getHoles(plans);
  return countHoleSize(holes);
}

export function part2(input: string) {
  const plans = parseInput(input, true);
  const holes = getHoles(plans);
  return countHoleSize(holes);
}

function parseInput(input: string, useHex: boolean) {
  return input.split('\n').map((i) => parsePlanItem(i, useHex));
}

function parsePlanItem(row: string, useHex: boolean) {
  const [direction, distance, hex] = row.replaceAll(/[()#]/g, '').split(' ');
  if (useHex) {
    const hexDistance = Number.parseInt(hex.slice(0, 5), 16);
    const directions = 'RDLU';
    return {
      distance: hexDistance,
      direction: directions[+hex[5]],
    };
  }
  return {
    direction,
    distance: +distance,
  };
}

function getHoles(plans: PlanItem[]) {
  // Change coordinates to start from 0
  const width = getMinMaxIndices(plans, 'R', 'L');
  const height = getMinMaxIndices(plans, 'D', 'U');
  const holes: Hole[] = [];
  // Give correct offset, since 0,0 isn't necessarly the starting point
  let x = -width.minIndex;
  let y = -height.minIndex;
  for (const plan of plans) {
    const { xDir, yDir } = getDirection(plan.direction);
    const start = { x, y };
    x += xDir * plan.distance;
    y += yDir * plan.distance;
    const end = {
      x,
      y,
    };
    if (start.x < end.x || start.y < end.y) {
      holes.push({ start, end });
    } else {
      holes.push({ start: end, end: start });
    }
  }
  return holes;
}

function getMinMaxIndices(plans: PlanItem[], increaseDirection: string, decreaseDirection: string) {
  let minIndex = Infinity;
  let maxIndex = 0;
  let length = 0;
  for (const plan of plans) {
    if (plan.direction === increaseDirection) {
      length += plan.distance;
      maxIndex = Math.max(maxIndex, length);
    } else if (plan.direction === decreaseDirection) {
      length -= plan.distance;
      minIndex = Math.min(length, minIndex);
    }
  }
  return { minIndex, maxIndex };
}

function getDirection(direction: string) {
  switch (direction) {
    case 'L': {
      return { xDir: -1, yDir: 0 };
    }
    case 'R': {
      return { xDir: 1, yDir: 0 };
    }
    case 'D': {
      return { xDir: 0, yDir: 1 };
    }
    case 'U': {
      return { xDir: 0, yDir: -1 };
    }
  }
  throw new Error(`Invalid direction: ${direction}`);
}

function countHoleSize(holes: Hole[]) {
  const maxY = Math.max(...holes.flatMap((hole) => [hole.start.y, hole.end.y]));
  const maxX = Math.max(...holes.flatMap((hole) => [hole.start.x, hole.end.x]));
  // Get all corner positions and indices next to them, since values between corners behave differently
  const distinctY = [
    ...new Set(
      holes
        .flatMap((hole) => [
          hole.start.y - 1,
          hole.start.y,
          hole.start.y + 1,
          hole.end.y - 1,
          hole.end.y,
          hole.end.y + 1,
        ])
        .filter((y) => y >= 0 && y <= maxY)
    ),
  ];
  distinctY.sort((a, b) => a - b);
  distinctY.push(maxY + 1);

  const distinctX = [
    ...new Set(
      holes
        .flatMap((hole) => [
          hole.start.x - 1,
          hole.start.x,
          hole.start.x + 1,
          hole.end.x - 1,
          hole.end.x,
          hole.end.x + 1,
        ])
        .filter((x) => x >= 0 && x <= maxX)
    ),
  ];
  distinctX.sort((a, b) => a - b);
  distinctX.push(maxX + 1);
  let holeSize = 0;
  // Go through all x/y combinations
  for (let j = 0; j < distinctY.length - 1; j++) {
    const startY = distinctY[j];
    const endY = distinctY[j + 1];
    const height = endY - startY;
    let insideTrench = false;
    let trenchSize = 0;
    for (let i = 0; i < distinctX.length - 1; i++) {
      const startX = distinctX[i];
      const endX = distinctX[i + 1];
      const width = endX - startX;
      const start = { x: startX, y: startY };
      const end = { x: endX, y: endY };
      if (!isWall(holes, start.x, start.y) && insideTrench) {
        trenchSize += height * width;
      }
      if (isVerticalWall(holes, start, end) || isTopCorner(holes, start, end)) {
        insideTrench = !insideTrench;
        if (!insideTrench) {
          holeSize += trenchSize;
          trenchSize = 0;
        }
      }
    }
  }
  const wallSizes = sum(holes, (hole) => hole.end.x - hole.start.x + (hole.end.y - hole.start.y));
  return holeSize + wallSizes;
}

function isWall(holes: Hole[], x: number, y: number) {
  return holes.some((hole) => hole.start.x <= x && x <= hole.end.x && hole.start.y <= y && y <= hole.end.y);
}

/**
 * Wall above and below
 */
function isVerticalWall(holes: Hole[], start: Coordinate, end: Coordinate) {
  return isWall(holes, start.x, start.y) && isWall(holes, start.x, start.y - 1) && isWall(holes, start.x, end.y);
}

/**
 * Wall below and either left or right side
 */
function isTopCorner(holes: Hole[], start: Coordinate, end: Coordinate) {
  return (
    isWall(holes, start.x, start.y) &&
    isWall(holes, start.x, end.y) &&
    (isWall(holes, start.x + 1, start.y) || isWall(holes, start.x - 1, start.y))
  );
}
