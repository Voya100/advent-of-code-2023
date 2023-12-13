import { part1, part2 } from './day13';

const input = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`;

describe('day 13, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(405);
  });
});

describe('day 13, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(400);
  });
});
