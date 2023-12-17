import { part1, part2 } from './day17';

const input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

const input2 = `111111111111
999999999991
999999999991
999999999991
999999999991`;

describe('day 17, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(102);
  });
});

describe('day 17, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(94);
    expect(part2(input2)).toBe(71);
  });
});
