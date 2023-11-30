#!/usr/bin/env -S node -r "ts-node/register"

import { promises as fs } from 'fs';

const PERFORMANCE_CHECK_ITERATIONS = 100;

interface DayScriptModule {
  part1(input: string): string | number;
  part2(input: string): string | number;
}

async function main() {
  if (process.argv.length <= 2) {
    console.log(
      `Usage: ./main.ts [dayNumber, 1-25 or 'all'] [optionalArguments]

Example 1: ./main.ts 1 --performance
Example 2: ./main.ts 6 --version v2 --performance
Example 3: ./main.ts all --performance

Optional arguments:
--performance:         Calls script multiple times and shows average duration
--version [versionId]: Uses provided script version instead of default. 
                       Script name must be in format day[dayNumber]-[versionId].ts
                       versionId is always in format v[number].
                       If versionId is 'all', all versions are processed (default)`
    );
    return;
  }
  const dayInput = process.argv[2];
  const day = Number.parseInt(dayInput);

  if (dayInput !== 'all' && isNaN(day)) {
    console.error(`Invalid day: ${dayInput}`);
    return;
  }

  if (dayInput !== 'all' && (day < 1 || day > 25)) {
    console.error('Day must be between 1-25.');
    return;
  }

  const testPerformance = process.argv.includes('--performance');
  const versionIndex = process.argv.indexOf('--version');
  const version = versionIndex === -1 ? 'all' : process.argv[versionIndex + 1];

  let dayVersions: [number, string | undefined][] = [];
  if (dayInput === 'all' || version === 'all') {
    dayVersions = await getAllDayVersionPairs();
    if (version !== 'all') {
      dayVersions = dayVersions.filter(
        ([, dayVersion]) => dayVersion === version
      );
    }
    if (dayInput !== 'all') {
      dayVersions = dayVersions.filter(([dayNumber]) => dayNumber === day);
    }
  } else {
    dayVersions = [[day, version]];
  }

  for (const [day, versionId] of dayVersions) {
    console.log('');
    await processDay(day, versionId, testPerformance);
  }
}

async function getAllDayVersionPairs() {
  const allFiles = await fs.readdir('src');
  return allFiles
    .map((file) => file.match(/day(\d{1,2})(-)?(v\d*)?\.ts$/)!)
    .filter((match) => match)
    .map(
      ([, day, , version]) => [+day, version] as [number, string | undefined]
    )
    .sort(([day1, version1], [day2, version2]) => {
      if (day1 !== day2) {
        return day1 - day2;
      }
      return (version1 || '') < (version2 || '') ? -1 : 1;
    });
}

async function processDay(
  day: number,
  version: string | null | undefined,
  testPerformance: boolean
) {
  let input: string;

  try {
    input = await fs.readFile(`inputs/day${day}.txt`, 'utf8');
  } catch (error) {
    console.warn("Day's input file is missing");
    return;
  }

  // Not most ideal from type security standpoint, but good enough for this use case
  const module: DayScriptModule = await import(
    `./src/day${day}${version ? '-' + version : ''}`
  );
  const versionString = version ? ` (${version})` : '';
  console.log(`Day ${day}${versionString}`);
  processDayPart(1, module.part1, input, testPerformance);
  processDayPart(2, module.part2, input, testPerformance);
}

async function processDayPart(
  part: 1 | 2,
  partFunction: (input: string) => string | number,
  input: string,
  testPerformance: boolean
) {
  const time = performance.now();

  const result = partFunction(input);
  if (testPerformance) {
    for (let i = 0; i < PERFORMANCE_CHECK_ITERATIONS - 1; i++) {
      // Assumes same result always for same input, so not verifying results
      partFunction(input);
    }
  }
  const duration1 = getDuration(
    time,
    testPerformance ? PERFORMANCE_CHECK_ITERATIONS : 1
  );
  const durationString = `${testPerformance ? 'average ' : ''}${duration1} ms`;
  console.log(`Part ${part}: ${result} (${durationString})`);
}

function getDuration(startTime: number, rounds = 1) {
  return Math.round(((performance.now() - startTime) / rounds) * 100) / 100;
}

main();
