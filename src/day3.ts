import { numberSum, sum } from './utils';
// https://adventofcode.com/2023/day/3

type SchmaticNumber = {
  value: number;
  // Coordinate of number's first digit
  x: number;
  y: number;
};

export function part1(input: string) {
  const numbers = parseSchematic(parseInput(input));
  return sum(numbers, (num) => num.value);
}

export function part2(input: string) {
  const rows = parseInput(input);
  const numbers = parseSchematic(rows);
  const gearRatios = findGearRatios(rows, numbers);
  return numberSum(gearRatios);
}

function parseInput(input: string) {
  return input.split('\n');
}

function parseSchematic(rows: string[]) {
  const numbers: SchmaticNumber[] = [];
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    let numberString = '';
    let nextToSymbol = false;
    for (let i = 0; i < row.length; i++) {
      const possibleDigit = Number.parseInt(row[i]);
      if (!isNaN(possibleDigit)) {
        numberString += possibleDigit;
        if (isNextToSymbol(rows, i, j)) {
          nextToSymbol = true;
        }
      } else {
        if (nextToSymbol) {
          numbers.push({ value: +numberString, x: i - numberString.length, y: j });
        }
        numberString = '';
        nextToSymbol = false;
      }
    }
    if (nextToSymbol) {
      numbers.push({ value: +numberString, x: row.length - numberString.length - 1, y: j });
    }
  }
  return numbers;
}

function isNextToSymbol(rows: string[], x: number, y: number) {
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      if (rows[y + j] && isSymbol(rows[y + j][x + i])) {
        return true;
      }
    }
  }
  return false;
}

function isSymbol(char: string) {
  if (!char) {
    return false;
  }
  return char !== '.' && isNaN(Number.parseInt(char));
}

function findGearRatios(rows: string[], numbers: SchmaticNumber[]) {
  const gearRatios: number[] = [];
  for (let j = 0; j < rows.length; j++) {
    const row = rows[j];
    for (let i = 0; i < row.length; i++) {
      if (row[i] !== '*') {
        continue;
      }
      const adjacentNumbers = getAdjacentNumbers(numbers, i, j);
      if (adjacentNumbers.length === 2) {
        gearRatios.push(adjacentNumbers[0].value * adjacentNumbers[1].value);
      }
    }
  }
  return gearRatios;
}

function getAdjacentNumbers(numbers: SchmaticNumber[], x: number, y: number) {
  // Note: Not very optimised, since this must iterate all numbers
  // The amount of numbers is small, so is not an issue here
  return numbers.filter(
    (number) =>
      number.x - 1 <= x && x <= number.x + number.value.toString().length && number.y - 1 <= y && y <= number.y + 1
  );
}
