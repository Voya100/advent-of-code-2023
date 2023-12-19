// https://adventofcode.com/2023/day/19

import { multiply, numberSum, parseNumbers, toRecord } from './utils';

type Part = Record<string, number>;

type Workflow = {
  id: string;
  rules: Rule[];
};

type Rule =
  | {
      property: string;
      operator: Operator;
      comparisonValue: number;
      output: string;
    }
  | { operator?: undefined; output: string };

type Range = { start: number; end: number };

type Operator = '<' | '>';

enum Status {
  Accepted = 'A',
  Rejected = 'R',
}

export function part1(input: string) {
  const { workflows, parts } = parseInput(input);
  const workflowMap = toRecord(workflows, (workflow) => workflow.id);
  const acceptedParts = parts.filter((part) => processPart(part, workflowMap) === Status.Accepted);
  return numberSum(acceptedParts.flatMap(({ x, m, a, s }) => [x, m, a, s]));
}

export function part2(input: string) {
  const { workflows } = parseInput(input);
  const workflowMap = toRecord(workflows, (workflow) => workflow.id);
  return findRatingCombinations(
    { x: { start: 1, end: 4001 }, m: { start: 1, end: 4001 }, a: { start: 1, end: 4001 }, s: { start: 1, end: 4001 } },
    workflowMap['in'],
    workflowMap
  );
}

function parseInput(input: string) {
  const [workflowsInput, partsInput] = input.split('\n\n');
  return {
    workflows: workflowsInput.split('\n').map(parseWorkflow),
    parts: partsInput.split('\n').map(parsePart),
  };
}

function parseWorkflow(row: string) {
  const [, id, ruleInputs] = row.match(/(\w+)\{(.*)\}/)!;
  return {
    id,
    rules: ruleInputs.split(',').map(parseRule),
  };
}

function parseRule(ruleInput: string): Rule {
  if (!ruleInput.includes(':')) {
    return { output: ruleInput };
  }
  const [, property, operator, comparisonValue, output] = ruleInput.match(/(\w+)([<>])(\d+):(\w+)/)!;
  return {
    property,
    operator: operator as Operator,
    comparisonValue: +comparisonValue,
    output,
  };
}

function parsePart(row: string) {
  const [x, m, a, s] = parseNumbers(row);
  return { x, m, a, s } as Record<string, number>;
}

function processPart(part: Part, workflows: Record<string, Workflow>): Status {
  let workflow = workflows['in'];
  while (true) {
    for (const rule of workflow.rules) {
      const output = resolveOutput(part, rule);
      if (output === Status.Accepted || output === Status.Rejected) {
        return output;
      }
      if (output) {
        workflow = workflows[output];
        break;
      }
    }
  }
}

function resolveOutput(part: Part, rule: Rule) {
  if (!rule.operator) {
    return rule.output;
  }
  const value1 = part[rule.property];
  const value2 = rule.comparisonValue;
  if (rule.operator === '<') {
    return value1 < value2 ? rule.output : null;
  }
  if (rule.operator === '>') {
    return value1 > value2 ? rule.output : null;
  }
  throw new Error('Unknown operator ' + rule.operator);
}

function findRatingCombinations(
  valueRanges: Record<string, Range>,
  workflow: Workflow,
  workflows: Record<string, Workflow>
) {
  let combinations: number = 0;
  // Iterate through rules while keeping track of allowed value ranges. Both branches (if/else) are explored
  // If rule condition continues in another workflow, copy the value range and run algorithm recursively
  // Else branch gets inverse value range compared to if, and continues to next iteration of the for loo
  for (const rule of workflow.rules.slice(0, -1)) {
    if (!rule.operator) {
      // Check for type reasons
      continue;
    }
    // Bracnhes to if and else
    const ifValueRanges: Record<string, Range> = { ...valueRanges };
    const propertyStart = valueRanges[rule.property].start;
    const propertyEnd = valueRanges[rule.property].end;
    if (rule.operator === '>') {
      ifValueRanges[rule.property] = { start: Math.max(propertyStart, rule.comparisonValue + 1), end: propertyEnd };
      valueRanges[rule.property] = { start: propertyStart, end: Math.min(rule.comparisonValue + 1, propertyEnd) }; // Else branch
    } else if (rule.operator === '<') {
      ifValueRanges[rule.property] = { start: propertyStart, end: Math.min(rule.comparisonValue, propertyEnd) };
      valueRanges[rule.property] = { start: Math.max(propertyStart, rule.comparisonValue), end: propertyEnd }; // Else branch
    }
    if (rule.output === Status.Accepted) {
      // If branch resolves immediately
      combinations += getCombinations(ifValueRanges);
    } else if (rule.output !== Status.Rejected) {
      // If branch continues to another workflow
      combinations += findRatingCombinations(ifValueRanges, workflows[rule.output], workflows);
    }
    // Next iteration of the loop continues to the else branch
  }
  const lastRule = workflow.rules[workflow.rules.length - 1];
  if (lastRule.output === Status.Accepted) {
    // Resolves immediately
    combinations += getCombinations(valueRanges);
  } else if (lastRule.output !== Status.Rejected) {
    // Continues to another workflow
    combinations += findRatingCombinations(valueRanges, workflows[lastRule.output], workflows);
  }
  return combinations;
}

function getCombinations(valueRanges: Record<string, Range>) {
  return multiply(Object.values(valueRanges), ({ start, end }) => Math.max(0, end - start));
}
