import { part1, part2 } from './day20';

const input1 = `broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`;

const input2 = `broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`;

describe('day 20, part 1', () => {
  it('should work with test input 1', () => {
    expect(part1(input1)).toBe(32000000);
  });
  it('should work with test input 2', () => {
    expect(part1(input2)).toBe(11687500);
  });
});

describe('day 20, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input1)).toBe(null);
  });
});
