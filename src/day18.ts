// https://adventofcode.com/2023/day/18

import { getRange } from './utils';

type PlanItem = {
  direction: string;
  distance: number;
  edge: string;
};

type GridValue = {
  edge: boolean;
  trench: boolean;
};

export function part1(input: string) {
  const plans = parseInput(input);
  const grid = dig(plans);
  fillGrid(grid);
  return grid.flatMap((row) => row).filter((v) => v.edge || v.trench).length;
}

export function part2(input: string) {
  const v = parseInput(input);
  return '';
}

function parseInput(input: string) {
  return input.split('\n').map(parsePlanItem);
}

function parsePlanItem(row: string) {
  const [direction, distance, edge] = row.replaceAll(/[()]/g, '').split(' ');
  return {
    direction,
    distance: +distance,
    edge,
  };
}

function dig(plans: PlanItem[]) {
  const width = getMinMaxIndices(plans, 'R', 'L');
  const height = getMinMaxIndices(plans, 'D', 'U');
  const grid: GridValue[][] = getRange(0, Math.abs(height.minIndex) + height.maxIndex + 1).map(() =>
    getRange(0, Math.abs(width.minIndex) + width.maxIndex + 1).map(() => ({ edge: false, trench: false }))
  );
  let x = -width.minIndex;
  let y = -height.minIndex;
  for (const plan of plans) {
    const { xDir, yDir } = getDirection(plan.direction);
    for (let i = 0; i < plan.distance; i++) {
      x += xDir;
      y += yDir;
      grid[y][x] = { edge: true, trench: false };
    }
  }
  return grid;
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

function fillGrid(grid: GridValue[][]) {
  for (let j = 0; j < grid.length; j++) {
    let insideTrench = false;
    let sectionsInTrench = [];
    for (let i = 0; i < grid[0].length; i++) {
      const edge = grid[j][i].edge;

      if (!edge && insideTrench) {
        sectionsInTrench.push(grid[j][i]);
      }

      if (isVerticalWall(grid, i, j) || isDownCorner(grid, i, j)) {
        insideTrench = !insideTrench;
        if (!insideTrench) {
          for (const section of sectionsInTrench) {
            section.trench = true;
            sectionsInTrench = [];
          }
        }
      }
    }
  }
}

function isVerticalWall(grid: GridValue[][], x: number, y: number) {
  return grid[y][x].edge && grid[y + 1]?.[x].edge && grid[y - 1]?.[x].edge;
}

function isDownCorner(grid: GridValue[][], x: number, y: number) {
  return grid[y][x].edge && grid[y + 1]?.[x].edge && (grid[y][x + 1]?.edge || grid[y][x - 1]?.edge);
}
