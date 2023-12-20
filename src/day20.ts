// https://adventofcode.com/2023/day/20

import { ExtendedSet } from './data-structures/set';
import { toRecord } from './utils';

enum Pulse {
  Low = 1,
  High = 2,
}

export function part1(input: string) {
  const modules = parseInput(input);
  const modulesById = toRecord(modules, (module) => module.id);
  initModules(modulesById);
  let lowPulses = 0;
  let highPulses = 0;
  for (let i = 0; i < 1000; i++) {
    const result = pressButton(modulesById);
    lowPulses += result.lowPulses;
    highPulses += result.highPulses;
  }
  console.log({ lowPulses, highPulses });
  return lowPulses * highPulses;
}

export function part2(input: string) {
  const modules = parseInput(input);
  return '';
}

function parseInput(input: string) {
  const modules = input.split('\n').map(parseModule);
  const missingIds = new ExtendedSet(modules.flatMap((m) => m.outputIds)).difference(modules.map((m) => m.id));
  for (const id of missingIds) {
    modules.push(new UntypedModule(id, []));
  }
  return modules;
}

function parseModule(row: string) {
  const [identifier, outputInput] = row.split(' -> ');
  const outputIds = outputInput.split(', ');
  if (identifier.startsWith('%')) {
    return new FlipFlopModule(identifier.slice(1), outputIds);
  }
  if (identifier.startsWith('&')) {
    return new ConjuctionModule(identifier.slice(1), outputIds);
  }
  return new BroadcasterModule(identifier, outputIds);
}

function initModules(modulesById: Record<string, PulseModule>) {
  for (const module of Object.values(modulesById)) {
    module.outputModules = module.outputIds.map((id) => modulesById[id]);
    for (const outputModule of module.outputModules) {
      outputModule.inputModules.push(module);
    }
  }
  for (const module of Object.values(modulesById)) {
    module.init();
  }
}

function pressButton(modulesById: Record<string, PulseModule>, lowMatchId?: string) {
  const pulses: [PulseModule, sourceId: string, Pulse][] = [[modulesById['broadcaster'], 'button', Pulse.Low]];
  let lowPulses = 0; // From broadcaster
  let highPulses = 0;
  let lowMatch = false;

  while (pulses.length) {
    const [pulsingModule, sourceId, pulse] = pulses.shift()!;
    pulsingModule.reveivePulse(sourceId, pulse);
    if (pulse === Pulse.High) {
      highPulses++;
    } else {
      lowPulses++;
    }
    if (lowMatchId === pulsingModule.id && pulse === Pulse.Low) {
      lowMatch = true;
    }
    if (!pulsingModule.output) {
      continue;
    }
    for (const outputModule of pulsingModule.outputModules) {
      pulses.push([outputModule, pulsingModule.id, pulsingModule.output]);
    }
  }
  return { lowPulses, highPulses, lowMatch };
}

abstract class PulseModule {
  output: Pulse | null = null;

  inputModules: PulseModule[] = [];
  outputModules: PulseModule[] = [];

  constructor(
    public id: string,
    public outputIds: string[]
  ) {}

  abstract reveivePulse(sourceId: string, pulse: Pulse): void;

  init() {}
}

class FlipFlopModule extends PulseModule {
  active = false;
  constructor(id: string, outputIds: string[]) {
    super(id, outputIds);
    this.output = null;
  }

  reveivePulse(sourceId: string, pulse: Pulse) {
    if (pulse === Pulse.High) {
      this.output = null;
      return;
    }
    this.active = !this.active;
    this.output = this.active ? Pulse.High : Pulse.Low;
  }
}

class ConjuctionModule extends PulseModule {
  rememberedInputs = new Map<string, Pulse>();
  constructor(id: string, outputIds: string[]) {
    super(id, outputIds);
    this.output = null;
  }

  reveivePulse(sourceId: string, pulse: Pulse) {
    this.rememberedInputs.set(sourceId, pulse);
    const allHigh = [...this.rememberedInputs.values()].every((pulse) => pulse === Pulse.High);
    this.output = allHigh ? Pulse.Low : Pulse.High;
  }

  init() {
    for (const module of this.inputModules) {
      this.rememberedInputs.set(module.id, Pulse.Low);
    }
  }
}

class BroadcasterModule extends PulseModule {
  constructor(id: string, outputIds: string[]) {
    super(id, outputIds);
    this.output = Pulse.Low;
  }
  reveivePulse() {}
}

class UntypedModule extends PulseModule {
  constructor(id: string, outputIds: string[]) {
    super(id, outputIds);
    this.output = null;
  }
  reveivePulse() {}
}
