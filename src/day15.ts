// https://adventofcode.com/2023/day/15

import { getRange, numberSum, sum } from './utils';

type Step = {
  label: string;
  labelHash: number;
  operation: '-' | '=';
  focalLength: number;
};

export function part1(input: string) {
  const hashes = input.split(',').map(getHash);
  return numberSum(hashes);
}

export function part2(input: string) {
  const steps = parseSteps(input);
  const boxes = runSteps(steps);
  return sum(boxes, (box, i) => getFocusingPowerForBox(box, i));
}

function parseSteps(input: string) {
  return input.split(',').map(parseStep);
}

function runSteps(steps: Step[]) {
  const boxes: Step[][] = getRange(0, 256).map(() => []);
  for (const step of steps) {
    const box = boxes[step.labelHash];
    if (!box) {
      console.warn(box, step);
    }
    if (step.operation === '-') {
      boxes[step.labelHash] = box.filter((lens) => lens.label !== step.label);
    }
    if (step.operation === '=') {
      if (box.some((lens) => lens.label === step.label)) {
        boxes[step.labelHash] = box.map((lens) => (lens.label === step.label ? step : lens));
      } else {
        box.push(step);
      }
    }
  }
  return boxes;
}

function getFocusingPowerForBox(box: Step[], boxNumber: number) {
  let focusingPower = 0;
  for (let i = 0; i < box.length; i++) {
    focusingPower += (boxNumber + 1) * (i + 1) * box[i].focalLength;
  }
  return focusingPower;
}

function parseStep(text: string): Step {
  const operation = text.includes('-') ? '-' : '=';
  const [label, focalLength] = text.split(/[-=]/);
  return {
    label,
    labelHash: getHash(label),
    operation,
    focalLength: +focalLength,
  };
}

function getHash(text: string) {
  let value = 0;
  for (let i = 0; i < text.length; i++) {
    value += text.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  return value;
}
