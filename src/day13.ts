// https://adventofcode.com/2023/day/13

import { numberSum, sum } from './utils';

export function part1(input: string) {
  const patterns = parseInput(input);
  const horizontalMirrors = patterns.map((pattern) => findHorizontalMirror(pattern, false));
  const verticalMirrors = patterns.map((pattern) => findVerticallMirror(pattern, false));
  return sum(verticalMirrors, (v) => v * 100) + numberSum(horizontalMirrors);
}

export function part2(input: string) {
  const patterns = parseInput(input);
  const horizontalMirrors = patterns.map((pattern) => findHorizontalMirror(pattern, true));
  const verticalMirrors = patterns.map((pattern) => findVerticallMirror(pattern, true));
  return sum(verticalMirrors, (v) => v * 100) + numberSum(horizontalMirrors);
}

function parseInput(input: string) {
  return input.split('\n\n').map((pattern) => pattern.split('\n'));
}

function findHorizontalMirror(pattern: string[], hasSmudge: boolean) {
  // Mirror is after index of i
  for (let i = 0; i < pattern[0].length - 1; i++) {
    const topMirroredResult = isMirrored(pattern[0], i, !hasSmudge);
    if (!topMirroredResult.mirrored) {
      continue;
    }
    let allMirrored = true;
    let smudgeUsed = topMirroredResult.smudgeUsed;
    for (let j = 1; j < pattern.length; j++) {
      const rowMirrorResult = isMirrored(pattern[j], i, smudgeUsed);
      if (!rowMirrorResult.mirrored) {
        allMirrored = false;
        break;
      }
      smudgeUsed = rowMirrorResult.smudgeUsed;
    }
    // If has smudge, it must have been used
    if (allMirrored && (!hasSmudge || smudgeUsed)) {
      return i + 1;
    }
  }
  return 0;
}

function findVerticallMirror(pattern: string[], hasSmudge: boolean) {
  return findHorizontalMirror(transpose(pattern), hasSmudge);
}

function isMirrored(row: string, mirrorAfterIndex: number, smudgeAlreadyUsed: boolean) {
  const maxLength = Math.min(mirrorAfterIndex + 1, row.length - mirrorAfterIndex - 1);
  let smudgeUsed = smudgeAlreadyUsed;
  for (let i = 0; i < maxLength; i++) {
    if (row[mirrorAfterIndex - i] !== row[mirrorAfterIndex + i + 1]) {
      if (!smudgeUsed) {
        smudgeUsed = true;
      } else {
        return { mirrored: false, smudgeUsed };
      }
    }
  }
  return { mirrored: true, smudgeUsed };
}

function transpose(pattern: string[]) {
  const transposedPattern: string[] = pattern[0].split('').map(() => '');
  for (let i = 0; i < pattern[0].length; i++) {
    for (let j = 0; j < pattern.length; j++) {
      transposedPattern[i] += pattern[j][i];
    }
  }
  return transposedPattern;
}
