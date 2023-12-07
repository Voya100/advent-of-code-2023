import { part1, part2 } from './day7';

const input = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`;

describe('day 7, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(6440);
  });
});

describe('day 7, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(5905);
  });
});
