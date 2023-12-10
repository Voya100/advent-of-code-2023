import { part1, part2 } from './day10';

const input1 = `.....
.S-7.
.|.|.
.L-J.
.....`;

const input2 = `7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ`;

const input3 = `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`;
const input4 = `..........
.S------7.
.|F----7|.
.||....||.
.||....||.
.|L-7F-J|.
.|..||..|.
.L--JL--J.
..........`;
const input5 = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;
const input6 = `FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`;

describe('day 10, part 1', () => {
  it('should work with test input', () => {
    expect(part1(input1)).toBe(4);
    expect(part1(input2)).toBe(8);
  });
});

describe('day 10, part 2', () => {
  it('should work with test input', () => {
    expect(part2(input3)).toBe(4);
    expect(part2(input4)).toBe(4);
    expect(part2(input5)).toBe(8);
    expect(part2(input6)).toBe(10);
  });
});
