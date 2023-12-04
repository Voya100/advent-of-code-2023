import { part1, part2 } from './day3';

const input = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

describe('day 3, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(4361);
  });
});

describe('day 3, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(467835);
  });
});
