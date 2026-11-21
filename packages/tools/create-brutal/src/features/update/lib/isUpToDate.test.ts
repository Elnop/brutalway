import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isUpToDate } from '#src/features/update/lib/isUpToDate.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

const STATE: BrutalwayState = {
  schemaVersion: 1,
  createBrutal: '1.0.0',
  stack: 'fastify',
  projectName: 'app',
  options: { swagger: true, database: 'postgres' },
};

describe('isUpToDate', () => {
  it('is true for the same version, stack and options, in any order', () => {
    assert.equal(
      isUpToDate(STATE, { ...STATE, options: { database: 'postgres', swagger: true } }, false),
      true,
    );
  });

  it('is false for another version, another option, or a project being attached', () => {
    assert.equal(isUpToDate(STATE, { ...STATE, createBrutal: '1.1.0' }, false), false);
    assert.equal(
      isUpToDate(STATE, { ...STATE, options: { ...STATE.options, swagger: false } }, false),
      false,
    );
    assert.equal(isUpToDate(STATE, STATE, true), false);
  });
});
