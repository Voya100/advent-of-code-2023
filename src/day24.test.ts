import { part1, part2 } from './day24';

const input = `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`;

describe('day 24, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input, 7, 27)).toBe(2);
  });
});

describe('day 24, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(null);
  });
});
