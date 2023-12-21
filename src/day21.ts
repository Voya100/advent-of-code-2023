// https://adventofcode.com/2023/day/21

import { ExtendedSet } from './data-structures/set';
import { getAdjacentNonDiagonalCoordinates, isNotNullish } from './utils';

type NodeOptions = {
  grid: (TileNode | null)[][];
};

export function part1(input: string, stepCount = 64) {
  const nodeMap = parseInput(input);
  const nodes = nodeMap.flatMap((row) => row);
  const startNode = nodes.find((node) => node?.isStart)!;
  let currentNodes = new ExtendedSet([startNode]);
  let nextNodes: ExtendedSet<TileNode> = new ExtendedSet();
  for (let i = 0; i < stepCount; i++) {
    for (const node of currentNodes) {
      nextNodes.addAll(node.getAdjacentNodes({ grid: nodeMap }));
    }
    currentNodes = nextNodes;
    nextNodes = new ExtendedSet();
  }
  return currentNodes.size;
}

export function part2(input: string) {
  const v = parseInput(input);
  return '';
}

function parseInput(input: string) {
  return input
    .split('\n')
    .map((row, j) => row.split('').map((v, i) => (v === '.' || v === 'S' ? new TileNode(i, j, v === 'S') : null)));
}

class TileNode {
  constructor(
    public x: number,
    public y: number,
    public isStart: boolean
  ) {}

  getAdjacentNodes(options: NodeOptions): TileNode[] {
    return getAdjacentNonDiagonalCoordinates({ x: this.x, y: this.y })
      .map(({ x, y }) => options.grid[y]?.[x])
      .filter(isNotNullish);
  }
}
