import { findLeastCommonMultiple, findPattern } from './utils';
// https://adventofcode.com/2023/day/8

type Instruction = {
  left: string;
  right: string;
};

enum Direction {
  Left = 'L',
  Right = 'R',
}

export function part1(input: string) {
  const { instructions, nodeMap } = parseInput(input);
  return countStepsToZZZ(instructions, nodeMap);
}

export function part2(input: string) {
  const { instructions, nodeMap } = parseInput(input);
  return countStepsToZ(instructions, nodeMap);
}

function parseInput(input: string) {
  const [instructions, nodeInput] = input.split('\n\n');
  return {
    instructions,
    nodeMap: Object.fromEntries(nodeInput.split('\n').map(parseNode)),
  };
}

function parseNode(row: string): [string, Instruction] {
  const [from, left, right] = [...row.matchAll(/[A-Z\d]+/g)].map((v) => v[0]);
  return [from, { left, right }];
}

function countStepsToZZZ(instructions: string, nodeMap: Record<string, Instruction>) {
  let count = 0;
  let nodeKey = 'AAA';
  while (true) {
    if (nodeKey === 'ZZZ') {
      return count;
    }
    const node = nodeMap[nodeKey];
    const direction = instructions[count % instructions.length] as Direction;
    nodeKey = direction === Direction.Left ? node.left : node.right;
    count++;
  }
}

function countStepsToZ(instructions: string, nodeMap: Record<string, Instruction>) {
  const nodeKeys = Object.keys(nodeMap).filter((key) => key.endsWith('A'));
  // Iterate all routes by enough rounds to have enough material for pattern finder
  // Note: In this case pattern is simple, since "Z" node occurs only once. Using the more generic algorithm regardless
  // Would be more performant to simply find positions of 2 "Z" nodes
  const allNodeSteps = nodeKeys.map((nodeKey) => getSteps(nodeKey, instructions, nodeMap));
  // Pattern will repeat eventually. Find lengths of the patterns
  const patterns = allNodeSteps.map((nodeSteps) => findPattern(nodeSteps, 2, 50000, 5)!);
  if (patterns.some((p) => !p)) {
    throw new Error('Pattern not found');
  }
  // In this case the first value of the pattern seems to be the desired node
  // The patterns align at least common multiple
  return findLeastCommonMultiple(patterns.map((p) => p.patternLength));
}

function getSteps(
  startNodeKey: string,
  instructions: string,
  nodeMap: Record<string, Instruction>,
  stepCount = 500000
) {
  let nodeKey = startNodeKey;
  const steps: string[] = [];
  for (let i = 0; i < stepCount; i++) {
    const node = nodeMap[nodeKey];
    const direction = instructions[i % instructions.length] as Direction;
    nodeKey = direction === Direction.Left ? node.left : node.right;
    steps.push(nodeKey);
  }
  return steps;
}
