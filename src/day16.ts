// https://adventofcode.com/2023/day/16

import { Coordinate } from './utils';

type Direction = {
  xDir: number;
  yDir: number;
};

export function part1(input: string) {
  const layout = parseInput(input);
  const visited = new Set<string>();
  moveBeam(layout, { x: 0, y: 0 }, { xDir: 1, yDir: 0 }, visited);
  const uniqueCoordinates = new Set([...visited].map((s) => s.split(':')[0]));
  return uniqueCoordinates.size;
}

export function part2(input: string) {
  const layout = parseInput(input);
  let bestResult = 0;
  for (let j = 0; j < layout.length; j++) {
    for (const i of [0, layout[0].length - 1]) {
      const visited = new Set<string>();
      moveBeam(layout, { x: i, y: j }, { xDir: i === 0 ? 1 : -1, yDir: 0 }, visited);
      const uniqueCoordinates = new Set([...visited].map((s) => s.split(':')[0]));
      bestResult = Math.max(bestResult, uniqueCoordinates.size);
    }
  }
  for (const j of [0, layout.length - 1]) {
    for (let i = 0; i < layout[0].length; i++) {
      const visited = new Set<string>();
      moveBeam(layout, { x: i, y: j }, { xDir: 0, yDir: j === 0 ? 1 : -1 }, visited);
      const uniqueCoordinates = new Set([...visited].map((s) => s.split(':')[0]));
      bestResult = Math.max(bestResult, uniqueCoordinates.size);
    }
  }
  return bestResult;
}

function parseInput(input: string) {
  return input.split('\n');
}

function moveBeam(layout: string[], location: Coordinate, direction: Direction, visited: Set<string>) {
  const symbol = layout[location.y]?.[location.x];
  const stateKey = getStateKey(location, direction);
  if (!symbol || visited.has(stateKey)) {
    return;
  }
  visited.add(stateKey);
  if (symbol === '.' || (symbol === '-' && direction.xDir) || (symbol === '|' && direction.yDir)) {
    moveBeam(layout, { x: location.x + direction.xDir, y: location.y + direction.yDir }, direction, visited);
    return;
  }
  if (symbol === '/') {
    const xDir = -direction.yDir;
    const yDir = -direction.xDir;
    moveBeam(layout, { x: location.x + xDir, y: location.y + yDir }, { xDir, yDir }, visited);
    return;
  }
  if (symbol === '\\') {
    const xDir = direction.yDir;
    const yDir = direction.xDir;
    moveBeam(layout, { x: location.x + xDir, y: location.y + yDir }, { xDir, yDir }, visited);
    return;
  }
  if (symbol === '|') {
    moveBeam(layout, { x: location.x, y: location.y + 1 }, { xDir: 0, yDir: 1 }, visited);
    moveBeam(layout, { x: location.x, y: location.y - 1 }, { xDir: 0, yDir: -1 }, visited);
    return;
  }
  if (symbol === '-') {
    moveBeam(layout, { x: location.x + 1, y: location.y }, { xDir: 1, yDir: 0 }, visited);
    moveBeam(layout, { x: location.x - 1, y: location.y }, { xDir: -1, yDir: 0 }, visited);
    return;
  }
}

function getStateKey(coordinate: Coordinate, direction: Direction) {
  return `${coordinate.x},${coordinate.y}:${direction.xDir},${direction.yDir}`;
}
