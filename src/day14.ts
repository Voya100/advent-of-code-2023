// https://adventofcode.com/2023/day/14

import { NumberIterator, findPattern, sum } from './utils';

export function part1(input: string) {
  const rockGrid = parseInput(input);
  tiltNorth(rockGrid);
  return getLoadValue(rockGrid);
}

export function part2(input: string) {
  const rockGrid = parseInput(input);
  let loadValues: number[] = [];
  for (let i = 0; i < 1000000000; i++) {
    runCycle(rockGrid);
    loadValues.push(getLoadValue(rockGrid));
    // Assumption: Eventually cycles will settle and repeat in a pattern
    // Using load values as identifiers for grid states. While different grids could have same value,
    // pattern for load values is enough
    if (i % 1000 === 0) {
      const pattern = findPattern(loadValues, 4, 100, 5);
      if (pattern) {
        // Skip full patterns to the end, and complete remaining cycles normally
        const remainingCycles = 1000000000 - 1 - i;
        const fullPatterns = Math.floor(remainingCycles / pattern.patternLength);
        i += fullPatterns * pattern.patternLength;
      }
      // Clear to reduce memory usage
      loadValues = [];
    }
  }
  return getLoadValue(rockGrid);
}

function parseInput(input: string) {
  return input.split('\n').map((row) => row.split(''));
}

function tiltNorth(rockGrid: string[][]) {
  const verticalIndices = new NumberIterator(0, rockGrid.length);
  const horizontalIndices = new NumberIterator(0, rockGrid[0].length);
  tilt(horizontalIndices, verticalIndices, rockGrid, 0, -1);
}

function runCycle(rockGrid: string[][]) {
  const verticalIndices = new NumberIterator(0, rockGrid.length);
  const horizontalIndices = new NumberIterator(0, rockGrid[0].length);
  tilt(horizontalIndices, verticalIndices, rockGrid, 0, -1);
  tilt(horizontalIndices.copy(), verticalIndices.copy(), rockGrid, -1, 0);
  tilt(horizontalIndices.copy(), verticalIndices.reverse(), rockGrid, 0, 1);
  tilt(horizontalIndices.reverse(), verticalIndices.copy(), rockGrid, 1, 0);
}

function tilt(
  horizontalIndices: Iterable<number>,
  verticalIndices: Iterable<number>,
  rockGrid: string[][],
  xDir: number,
  yDir: number
) {
  for (const j of yDir ? verticalIndices : horizontalIndices) {
    for (const i of yDir ? horizontalIndices : horizontalIndices) {
      const x = yDir ? i : j;
      const y = yDir ? j : i;
      if (rockGrid[y][x] === 'O') {
        moveRock(x, y, xDir, yDir, rockGrid);
      }
    }
  }
}

function moveRock(x: number, y: number, xDir: number, yDir: number, rockGrid: string[][]) {
  while (rockGrid[y + yDir]?.[x + xDir] === '.') {
    rockGrid[y + yDir][x + xDir] = 'O';
    rockGrid[y][x] = '.';
    y += yDir;
    x += xDir;
  }
}

function getLoadValue(rockGrid: string[][]) {
  const rowSize = rockGrid.length;
  const rockValues = rockGrid
    .flatMap((row, j) =>
      row.map((type) => ({
        value: rowSize - j,
        type,
      }))
    )
    .filter(({ type }) => type === 'O');
  return sum(rockValues, (rock) => rock.value);
}
