import { part1, part2 } from './day11';

const input = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`;

describe('day 11, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(374);
  });
});

describe('day 11, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input, 10)).toBe(1030);
    expect(part2(input, 100)).toBe(8410);
  });
});
