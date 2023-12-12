import { part1, part2 } from './day12';

const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

describe('day 12, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(21);
  });

  it('should work with more inputs', () => {
    expect(part1('?..#..### 1,3')).toBe(1);
    expect(part1('...?????.?? 1,2,1')).toBe(6);
  });
});

describe('day 12, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(525152);
  });
});
