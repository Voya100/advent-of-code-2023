// https://adventofcode.com/2023/day/11

import { Coordinate, getAllPairs, getRange, isNotNullish, numberSum } from './utils';

export function part1(input: string) {
  const coordinates = parseInput(input);
  const distances = calculateDistances(coordinates, 2);
  return numberSum(distances);
}

export function part2(input: string, expansionSize = 1000000) {
  const coordinates = parseInput(input);
  const distances = calculateDistances(coordinates, expansionSize);
  return numberSum(distances);
}

function parseInput(input: string): Coordinate[] {
  return input
    .split('\n')
    .flatMap((row, j) => row.split('').map((value, i) => (value === '.' ? null : { x: i, y: j })))
    .filter(isNotNullish);
}

function calculateDistances(coordinates: Coordinate[], expansionSize: number) {
  const { emptyColumns, emptyRows } = getEmptyColumnsAndRows(coordinates);
  const coordinatePairs = getAllPairs(coordinates);
  const distances = coordinatePairs.map(([coord1, coord2]) =>
    calculateDistance(coord1, coord2, emptyColumns, emptyRows, expansionSize)
  );
  return distances;
}

function getEmptyColumnsAndRows(coordinates: Coordinate[]) {
  const allColumns = getRange(0, Math.max(...coordinates.map(({ x }) => x)) + 1);
  const allRows = getRange(0, Math.max(...coordinates.map(({ y }) => y)) + 1);

  const nonEmptyColumns = new Set(coordinates.map(({ x }) => x));
  const nonEmptyRows = new Set(coordinates.map(({ y }) => y));

  const emptyColumns = new Set(allColumns.filter((column) => !nonEmptyColumns.has(column)));
  const emptyRows = new Set(allRows.filter((row) => !nonEmptyRows.has(row)));
  return { emptyColumns, emptyRows };
}

function calculateDistance(
  coord1: Coordinate,
  coord2: Coordinate,
  emptyColumns: Set<number>,
  emptyRows: Set<number>,
  expansionSize: number
) {
  const startX = Math.min(coord1.x, coord2.x);
  const endX = Math.max(coord1.x, coord2.x);
  const startY = Math.min(coord1.y, coord2.y);
  const endY = Math.max(coord1.y, coord2.y);
  const manhattanDistance = endX - startX + (endY - startY);
  let emptyColumnsCount = 0;
  let emptyRowsCount = 0;
  for (let i = startX + 1; i < endX; i++) {
    if (emptyColumns.has(i)) {
      emptyColumnsCount++;
    }
  }
  for (let j = startY + 1; j < endY; j++) {
    if (emptyRows.has(j)) {
      emptyRowsCount++;
    }
  }
  return manhattanDistance + (emptyColumnsCount + emptyRowsCount) * (expansionSize - 1);
}
