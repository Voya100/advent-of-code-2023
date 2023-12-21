import { part1, part2 } from './day21';

const input = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`;

describe('day 21, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input, 6)).toBe(16);
  });
});

describe('day 21, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(null);
  });
});
