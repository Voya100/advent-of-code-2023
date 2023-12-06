import { part1, part2 } from './day6';

const input = `Time:      7  15   30
Distance:  9  40  200`;

describe('day 6, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(288);
  });
});

describe('day 6, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(71503);
  });
});
