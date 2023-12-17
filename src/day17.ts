// https://adventofcode.com/2023/day/17

import { GraphNode } from './algorithms/graph-node';
import { MinHeap } from './data-structures/heap';
import { Coordinate } from './utils';

type Direction = { xDir: number; yDir: number };
const NORTH = { xDir: 0, yDir: -1 };
const SOUTH = { xDir: 0, yDir: 1 };
const EAST = { xDir: 1, yDir: 0 };
const WEST = { xDir: -1, yDir: 0 };

const allDirections = [NORTH, SOUTH, EAST, WEST];

export function part1(input: string) {
  const heatGrid = parseInput(input);
  const start = { x: 0, y: 0 };
  const end = { x: heatGrid[0].length - 1, y: heatGrid.length - 1 };
  return findQuickestPath(heatGrid, start, end, 0, 3);
}

export function part2(input: string) {
  const heatGrid = parseInput(input);
  const start = { x: 0, y: 0 };
  const end = { x: heatGrid[0].length - 1, y: heatGrid.length - 1 };
  return findQuickestPath(heatGrid, start, end, 4, 10);
}

function parseInput(input: string) {
  return input.split('\n').map((row) => row.split('').map((v) => +v));
}

/**
 * Find quickest path by using dijkstra
 * Distinct states are identified by location, direction and how many straight moves there have been in row
 */
function findQuickestPath(
  heatGrid: number[][],
  start: Coordinate,
  goal: Coordinate,
  minStraight: number,
  maxStraight: number
) {
  const pathHeap = new MinHeap<Path>((path) => path.heatLoss);
  const visitedStates = new Set<string>();

  const startPath1 = new Path(start.x, start.y, EAST, 0, 0);
  const startPath2 = new Path(start.x, start.y, SOUTH, 0, 0);
  pathHeap.addItem(startPath1);
  pathHeap.addItem(startPath2);

  while (pathHeap.length) {
    const nextQuickestPath = pathHeap.pop();
    if (visitedStates.has(nextQuickestPath.getId())) {
      continue;
    }
    if (
      nextQuickestPath.x === goal.x &&
      nextQuickestPath.y === goal.y &&
      nextQuickestPath.straightLength >= minStraight
    ) {
      return nextQuickestPath.heatLoss;
    }
    visitedStates.add(nextQuickestPath.getId());
    const adjacentPaths = nextQuickestPath
      .getAdjacentPaths(heatGrid, minStraight, maxStraight)
      .filter((path) => !visitedStates.has(path.getId()));
    pathHeap.addItems(adjacentPaths);
  }
  throw new Error('Path not found');
}

class Path extends GraphNode<Path> {
  constructor(
    public x: number,
    public y: number,
    public direction: Direction,
    public straightLength: number,
    public heatLoss: number,
    previous?: Path
  ) {
    super();
    this.nodeState.previousNode = previous;
  }

  getId(straightLength = this.straightLength) {
    return `${this.x},${this.y}:${this.direction.xDir},${this.direction.yDir}:${straightLength}`;
  }

  getAdjacentPaths(grid: number[][], minStraight: number, maxStaight: number) {
    // Can't go to opposite direction
    let possibleDirections: Direction[] = allDirections.filter(
      (dir) => (!dir.xDir || dir.xDir !== -this.direction.xDir) && (!dir.yDir || dir.yDir !== -this.direction.yDir)
    );
    if (this.straightLength < minStraight) {
      possibleDirections = [this.direction];
    }
    // Can go straight limited number of times
    if (this.straightLength >= maxStaight) {
      possibleDirections = possibleDirections.filter((dir) => dir !== this.direction);
    }
    return possibleDirections
      .map((dir) => [dir, { x: this.x + dir.xDir, y: this.y + dir.yDir }] as const)
      .filter(([, coord]) => grid[coord.y]?.[coord.x])
      .map(([dir, { x, y }]) => {
        const straighLength = dir === this.direction ? this.straightLength + 1 : 1;
        const heatLoss = this.heatLoss + grid[y][x];
        return new Path(x, y, dir, straighLength, heatLoss, this);
      });
  }
}
