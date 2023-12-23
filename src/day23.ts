import { DfsNode, findLongestPathLengthWithDfs } from './algorithms/dfs';
import { getAdjacentNonDiagonalCoordinates, isNotNullish, sum } from './utils';
// https://adventofcode.com/2023/day/23

type NodeOptions = {
  grid: (PathNode | null)[][];
  slippery: boolean;
};

export function part1(input: string) {
  return findLongestPath(input, true);
}

// Not fully optimised, but is fast enough (~40 s for full input)
export function part2(input: string) {
  return findLongestPath(input, false);
}

function findLongestPath(input: string, slippery: boolean) {
  const nodeGrid = parseInput(input);
  const nodes = nodeGrid.flatMap((row) => row).filter(isNotNullish);
  nodes.forEach((node) => node.init({ grid: nodeGrid, slippery }));
  nodes.forEach((node) => node.simplify());
  const start = nodeGrid[0][1]!;
  const end = nodeGrid[nodeGrid.length - 1][nodeGrid[0].length - 2];
  return findLongestPathLengthWithDfs(
    start,
    (node) => node === end,
    (node) => node.weight,
    undefined
  );
}

function parseInput(input: string) {
  return input.split('\n').map((row, j) => row.split('').map((v, i) => (v === '#' ? null : new PathNode(i, j, v))));
}

class PathNode extends DfsNode<PathNode, NodeOptions> {
  weight = 1;
  adjacentNodes: PathNode[] = [];

  constructor(
    public x: number,
    public y: number,
    public symbol: string
  ) {
    super();
  }

  init({ grid, slippery }: NodeOptions) {
    if (slippery) {
      if (this.symbol === '>') {
        this.adjacentNodes = [grid[this.y][this.x + 1]!];
        return;
      }
      if (this.symbol === '<') {
        this.adjacentNodes = [grid[this.y][this.x - 1]!];
        return;
      }
      if (this.symbol === 'v') {
        this.adjacentNodes = [grid[this.y + 1][this.x]!];
        return;
      }
      if (this.symbol === '^') {
        this.adjacentNodes = [grid[this.y - 1][this.x]!];
        return;
      }
    }
    this.adjacentNodes = getAdjacentNonDiagonalCoordinates({ x: this.x, y: this.y })
      .map(({ x, y }) => grid[y]?.[x])
      .filter(isNotNullish);
  }

  getAdjacentNodes(): PathNode[] {
    return this.adjacentNodes;
  }

  /**
   * Simplify graph by combining adjacent corridors into single node
   */
  simplify() {
    if (this.adjacentNodes.length !== 2) {
      return;
    }
    let previousNode: PathNode = this as PathNode;
    const [first, second] = this.adjacentNodes;
    const nodesBetween: PathNode[] = [];

    let connectedNode = second;
    if (connectedNode.adjacentNodes.length !== 2 || !connectedNode.adjacentNodes.includes(this)) {
      return;
    }

    while (true) {
      const nextConnectedNode = connectedNode.adjacentNodes.find((node) => node !== previousNode);
      if (
        nextConnectedNode &&
        nextConnectedNode.adjacentNodes.length === 2 &&
        nextConnectedNode.adjacentNodes.includes(connectedNode)
      ) {
        nodesBetween.push(connectedNode);
        previousNode = connectedNode;
        connectedNode = nextConnectedNode;
      } else {
        break;
      }
    }
    // Connect nodes and clear old nodes between them
    if (nodesBetween.length) {
      connectedNode.adjacentNodes = connectedNode.adjacentNodes.map((node) => (node === previousNode ? this : node));
      for (const node of nodesBetween) {
        node.adjacentNodes = [];
      }
      this.adjacentNodes = this.adjacentNodes.map((node) => (node === first ? first : connectedNode));
      this.weight += sum(nodesBetween, (node) => node.weight);
      return true;
    }
    return false;
  }
}
