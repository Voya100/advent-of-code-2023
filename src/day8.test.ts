import { part1, part2 } from './day8';

const input1 = `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`;

const input2 = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`;

const input3 = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`;

describe('day 8, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input1)).toBe(2);
    expect(part1(input2)).toBe(6);
  });
});

describe('day 8, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input3)).toBe(6);
  });
});
