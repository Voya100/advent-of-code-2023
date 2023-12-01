import { part1, part2 } from './day1';

const input = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const input2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

describe('day 1, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(142);
  });
});

describe('day 1, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input2)).toBe(281);
  });
});
