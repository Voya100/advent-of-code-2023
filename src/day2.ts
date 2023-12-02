import { sum } from './utils';
// https://adventofcode.com/2023/day/2

type Game = {
  id: number;
  maxColors: Record<string, number>;
};

export function part1(input: string) {
  const games = parseInput(input);
  const availableCubes = {
    red: 12,
    green: 13,
    blue: 14,
  };
  const possibleGames = games.filter((game) => isGamePossible(game, availableCubes));
  return sum(possibleGames, (game) => game.id);
}

export function part2(input: string) {
  const games = parseInput(input);
  return sum(games, getCubePower);
}

function parseInput(input: string) {
  return input.split('\n').map(parseGame);
}

// Parses input of type "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
function parseGame(row: string): Game {
  const [game, cubeInput] = row.split(': ');
  const id = +game.split(' ')[1];
  const cubeSets = cubeInput.split('; ').map(parseSet);
  const maxColors: Record<string, number> = {};
  for (const [color, value] of cubeSets.flatMap((set) => Object.entries(set))) {
    if (!maxColors[color] || maxColors[color] < value) {
      maxColors[color] = value;
    }
  }
  return { id, maxColors };
}

// Parses input of type "1 red, 2 green, 6 blue" into color -> value map
function parseSet(set: string): Record<string, number> {
  const valueColorPairs: [string, number][] = set
    .split(', ')
    .map((valueColor) => valueColor.split(' '))
    .map(([number, color]) => [color, +number]);
  return Object.fromEntries(valueColorPairs);
}

function isGamePossible(game: Game, cubes: Record<string, number>) {
  return Object.entries(cubes).every(([color, value]) => game.maxColors[color] && game.maxColors[color] <= value);
}

function getCubePower(game: Game) {
  return (game.maxColors.red ?? 0) * (game.maxColors.green ?? 0) * (game.maxColors.blue ?? 0);
}
