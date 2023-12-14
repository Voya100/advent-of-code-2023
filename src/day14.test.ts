import { part1, part2 } from './day14';

const input = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`;

describe('day 14, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(136);
  });
});

describe('day 14, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(64);
  });
});
