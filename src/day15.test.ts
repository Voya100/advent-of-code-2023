import { part1, part2 } from './day15';

const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

describe('day 15, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input)).toBe(1320);
  });
});

describe('day 15, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input)).toBe(145);
  });
});
