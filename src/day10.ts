// https://adventofcode.com/2023/day/10

import { DfsNode, findCycleLength, findLastNodeInCycle, findTargetsWithDfs } from './algorithms/dfs';
import { getAdjacentNonDiagonalCoordinates, isNotNullish } from './utils';

export function part1(input: string) {
  const map = parseInput(input, false);
  const pipes = getPipes(map);
  const startPipe = pipes.find((pipe) => pipe.value === 'S')!;
  return findCycleLength(startPipe, undefined) / 2;
}

export function part2(input: string) {
  const map = parseInput(input, true);
  const pipes = getPipes(map);
  const startPipe = pipes.find((pipe) => pipe.value === 'S')!;
  const cyclePipes = findLastNodeInCycle(startPipe, undefined).getPath() as Pipe[];
  const tiles = getTiles(map, cyclePipes); // Does not include cycle pipes
  const maxX = map[0].length - 1;
  const maxY = map.length - 1;
  let nodesInsideLoopCount = 0;
  let uncheckedNode = tiles.find((node) => !node.nodeState.checked);
  // Find all separate "areas" within the map, and figure whether they are outside the loop or inside
  // They are outside if they can reach edge of the map, since map size has been increased to allow movement between pipess
  while (uncheckedNode) {
    const reachableNodes = findTargetsWithDfs(uncheckedNode, () => true, undefined);
    const reachesEdge = [...reachableNodes].some(({ x, y }) => x === 0 || y === 0 || x === maxX || y === maxY);
    if (!reachesEdge) {
      // Since we added extra nodes, include only original nodes in count
      nodesInsideLoopCount += [...reachableNodes].filter(
        (node) => node.value !== '#' && node.x % 3 === 1 && node.y % 3 === 1
      ).length;
    }
    uncheckedNode = tiles.find((node) => !node.nodeState.checked);
  }
  return nodesInsideLoopCount;
}

function parseInput(input: string, addGaps: boolean) {
  let map = input.split('\n').map((row) => row.split(''));
  if (addGaps) {
    map = addPipeGaps(map);
  }
  return map;
}

function getPipes(rows: string[][]) {
  const pipesMap = rows.map((row, j) =>
    row.map((symbol, i) => (symbol === '.' || symbol === '#' ? null : new Pipe(symbol, i, j)))
  );
  const pipes = pipesMap.flatMap((row) => row).filter(isNotNullish);
  pipes.forEach((pipe) => pipe.populateNeighbors(pipesMap));
  pipes.forEach((pipe) => pipe.removeIncompatibleNeighbors());
  return pipes;
}

/**
 * Returns nodes for all tiles and populates their connections.
 * Tiles which are part of the pipe or which are manually added empty tiles ('#') are filtered out in output.
 */
function getTiles(rows: string[][], cyclePipes: Pipe[]) {
  const nodesMap = rows.map((row, j) => row.map((symbol, i) => new Tile(symbol, i, j)));
  const nodes = nodesMap.flatMap((row) => row).filter(isNotNullish);
  nodes.forEach((node) => node.populateNeighbors(nodesMap));
  const pipeCoordinates = new Set(cyclePipes.map((pipe) => `${pipe.x},${pipe.y}`));
  nodes.forEach((node) => node.removeNeighbors(pipeCoordinates));
  return nodes.filter((node) => node.value !== '#' && !pipeCoordinates.has(node.coordinateString));
}

/**
 * Pipe node. Connects only to other pipes based on pipe's direction.
 */
class Pipe extends DfsNode<string, undefined> {
  neighbors: Pipe[] = [];

  constructor(
    symbol: string,
    public x: number,
    public y: number
  ) {
    super();
    this.value = symbol;
  }

  override getAdjacentNodes(): Pipe[] {
    return this.neighbors;
  }

  populateNeighbors(pipes: (Pipe | null)[][]) {
    const possibleNeighbors: (Pipe | null | undefined)[] = [];
    switch (this.value) {
      case '|':
        possibleNeighbors.push(pipes[this.y - 1]?.[this.x]);
        possibleNeighbors.push(pipes[this.y + 1]?.[this.x]);
        break;
      case '-':
        possibleNeighbors.push(pipes[this.y]?.[this.x - 1]);
        possibleNeighbors.push(pipes[this.y]?.[this.x + 1]);
        break;
      case 'L':
        possibleNeighbors.push(pipes[this.y - 1]?.[this.x]);
        possibleNeighbors.push(pipes[this.y]?.[this.x + 1]);
        break;
      case 'J':
        possibleNeighbors.push(pipes[this.y - 1]?.[this.x]);
        possibleNeighbors.push(pipes[this.y]?.[this.x - 1]);
        break;
      case '7':
        possibleNeighbors.push(pipes[this.y + 1]?.[this.x]);
        possibleNeighbors.push(pipes[this.y]?.[this.x - 1]);
        break;
      case 'F':
        possibleNeighbors.push(pipes[this.y + 1]?.[this.x]);
        possibleNeighbors.push(pipes[this.y]?.[this.x + 1]);
        break;
      case 'S':
        possibleNeighbors.push(
          ...getAdjacentNonDiagonalCoordinates({ x: this.x, y: this.y }).map(({ x, y }) => pipes[y]?.[x])
        );
        break;
      default:
        throw new Error('Invalid symbol: ' + this.value);
    }
    this.neighbors = possibleNeighbors.filter(isNotNullish);
  }

  // Should be called after populateNeighbors has been called for all nodes
  // Ensures both pipes can access each other
  removeIncompatibleNeighbors() {
    this.neighbors = this.neighbors.filter((neighbor) => neighbor.neighbors.includes(this));
  }

  toString() {
    return `${this.value}, x: ${this.x}, y: ${this.y}. Previous: ${this.previousNode?.value}`;
  }
}

/**
 * Tile node, which can be any tile in the map (including pipe).
 * Allows movement to all non-diagonal directions, even if is a pipe
 */
class Tile extends DfsNode<string, undefined> {
  neighbors: Tile[] = [];

  coordinateString: string;

  constructor(
    symbol: string,
    public x: number,
    public y: number
  ) {
    super();
    this.value = symbol;
    this.coordinateString = `${x},${y}`;
  }

  override getAdjacentNodes(): Tile[] {
    return this.neighbors;
  }

  populateNeighbors(nodes: (Tile | null)[][]) {
    const possibleNeighbors: (Tile | null | undefined)[] = getAdjacentNonDiagonalCoordinates({
      x: this.x,
      y: this.y,
    }).map(({ x, y }) => nodes[y]?.[x]);
    this.neighbors = possibleNeighbors.filter(isNotNullish);
  }

  removeNeighbors(coordinateStrings: Set<string>) {
    this.neighbors = this.neighbors.filter((neighbor) => !coordinateStrings.has(neighbor.coordinateString));
  }

  matchesPipe(pipe: Pipe) {
    return this.x === pipe.x && this.y === pipe.y;
  }

  toString() {
    return `${this.value}, x: ${this.x}, y: ${this.y}. Previous: ${this.previousNode?.value}`;
  }
}

/**
 * Increases map size by 3x3 so that gaps between pipes have their own nodes.
 */
function addPipeGaps(map: string[][]) {
  const extendedMap: string[][] = [];
  for (let j = 0; j < map.length; j++) {
    const originalRow = map[j];
    const extendedRowValues: string[][] = [];
    for (let i = 0; i < originalRow.length; i++) {
      const value = originalRow[i];
      extendedRowValues.push(getExtendedPipeValue(value, i, j, map));
    }
    const rowsToAdd: string[][] = [[], [], []];
    for (let i = 0; i < 3; i++) {
      for (const value of extendedRowValues) {
        rowsToAdd[i].push(...value[i].split(''));
      }
    }
    extendedMap.push(...rowsToAdd);
  }
  return extendedMap;
}

function getExtendedPipeValue(value: string, x: number, y: number, map: string[][]): string[] {
  // Uses '#' as manually added empty node to more easily seprate them when debugging
  switch (value) {
    case '|':
      return ['#|#', '#|#', '#|#'];
    case '-':
      return ['###', '---', '###'];
    case 'L':
      return ['#|#', '#L-', '###'];
    case 'J':
      return ['#|#', '-J#', '###'];
    case '7':
      return ['###', '-7#', '#|#'];
    case 'F':
      return ['###', '#F-', '#|#'];
    case '.':
      return ['###', '#.#', '###'];
    case 'S': {
      const upValue = map[y - 1]?.[x];
      const downValue = map[y + 1]?.[x];
      const rightValue = map[y]?.[x + 1];
      const leftValue = map[y]?.[x - 1];
      const upOpen = ['|', '7', 'F'].includes(upValue);
      const downOpen = ['|', 'L', 'J'].includes(downValue);
      const leftOpen = ['-', 'L', 'F'].includes(leftValue);
      const rightOpen = ['-', '7', 'J'].includes(rightValue);
      let startPipe = '';
      if (upOpen && downOpen) {
        startPipe = '|';
      }
      if (leftOpen && rightOpen) {
        startPipe = '-';
      }
      if (upOpen && rightOpen) {
        startPipe = 'L';
      }
      if (upOpen && leftOpen) {
        startPipe = 'J';
      }
      if (downOpen && leftOpen) {
        startPipe = '7';
      }
      if (downOpen && rightOpen) {
        startPipe = 'F';
      }
      if (!startPipe) {
        // Will assume start pipe is always reachable from 2 directions
        throw new Error('Start pipe type not found');
      }
      return getExtendedPipeValue(startPipe, x, y, map).join('\n').replace(startPipe, 'S').split('\n');
    }
  }
  throw new Error('Invalid pipe type:' + value);
}
