import { part1, part2 } from './day16';

const input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

describe('day 16, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(46);
  });
});

describe('day 16, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(51);
  });
});
