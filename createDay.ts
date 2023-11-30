#!/usr/bin/env -S node -r "ts-node/register"

import { promises as fs } from 'fs';
import { exit } from 'process';

async function main() {
  if (process.argv.length <= 2) {
    console.log(
      'Usage: ./createDay.ts [dayNumber, 1-25]\nExample: ./createDay.ts 1'
    );
    return;
  }

  const day = Number.parseInt(process.argv[2]);

  if (isNaN(day)) {
    console.error(`Invalid day: ${process.argv[2]}`);
    return;
  }

  if (day < 1 || day > 25) {
    console.error('Day must be between 1-25.');
    return;
  }

  await Promise.all([
    writeFile('src/templates/day_ts.template', `src/day${day}.ts`, day),
    writeFile('src/templates/day_test.template', `src/day${day}.test.ts`, day),
    await fs.writeFile(`inputs/day${day}.txt`, ''),
  ]);
}

async function writeFile(
  templatePath: string,
  outputPath: string,
  day: number
) {
  if (await fileExists(outputPath)) {
    console.error(`File ${day} already exists`);
    exit();
  }

  const template = await fs.readFile(templatePath, 'utf8');
  await fs.writeFile(
    outputPath,
    template.replaceAll('__DAY__', day.toString())
  );
}

async function fileExists(path: string) {
  return fs
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

main();
