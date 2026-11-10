import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { planStatusSync } from './planStatusSync.ts';
import type { IssueStatusState } from './IssueStatusTypes.ts';

function state(fields: Partial<IssueStatusState>): IssueStatusState {
  return { labels: [], labelChangedAt: undefined, boardStatus: undefined, boardChangedAt: undefined, external: false, ...fields };
}

const EARLY = '2026-11-10T10:00:00Z';
const LATE = '2026-11-10T11:00:00Z';

describe('planStatusSync', () => {
  it('gives a new issue todo when a collaborator opened it and triage otherwise, on the labels and on the board', () => {
    assert.deepEqual(planStatusSync(state({}), { kind: 'opened' }), { addLabel: 'todo', removeLabels: [], boardStatus: 'Todo', close: false });
    assert.deepEqual(planStatusSync(state({ external: true, labels: ['bug'], boardStatus: 'Todo' }), { kind: 'opened' }), {
      addLabel: 'triage',
      removeLabels: [],
      boardStatus: 'Triage',
      close: false,
    });
  });

  it('moves the board to the status label just added and drops the previous label', () => {
    assert.deepEqual(planStatusSync(state({ labels: ['triage', 'todo'], boardStatus: 'Triage' }), { kind: 'labeled', label: 'todo' }), {
      addLabel: undefined,
      removeLabels: ['triage'],
      boardStatus: 'Todo',
      close: false,
    });
  });

  it('ignores a label that is not a status, and a status label removed since', () => {
    assert.equal(planStatusSync(state({ labels: ['bug'] }), { kind: 'labeled', label: 'bug' }), undefined);
    assert.equal(planStatusSync(state({ labels: ['in progress'] }), { kind: 'labeled', label: 'todo' }), undefined);
  });

  it('follows the board when its status changed after the label', () => {
    assert.deepEqual(planStatusSync(state({ labels: ['todo'], labelChangedAt: EARLY, boardStatus: 'Triage', boardChangedAt: LATE }), { kind: 'sweep' }), {
      addLabel: 'triage',
      removeLabels: ['todo'],
      boardStatus: undefined,
      close: false,
    });
  });

  it('follows the label when it changed after the board', () => {
    assert.deepEqual(planStatusSync(state({ labels: ['todo'], labelChangedAt: LATE, boardStatus: 'Triage', boardChangedAt: EARLY }), { kind: 'sweep' }), {
      addLabel: undefined,
      removeLabels: [],
      boardStatus: 'Todo',
      close: false,
    });
  });

  it('closes an open issue moved to Done on the board', () => {
    assert.deepEqual(planStatusSync(state({ labels: ['in progress'], labelChangedAt: EARLY, boardStatus: 'Done', boardChangedAt: LATE }), { kind: 'sweep' }), {
      addLabel: undefined,
      removeLabels: [],
      boardStatus: undefined,
      close: true,
    });
  });

  it('fills whichever side is missing, and leaves an issue already in sync alone', () => {
    assert.deepEqual(planStatusSync(state({ boardStatus: 'In progress', boardChangedAt: EARLY }), { kind: 'sweep' }), {
      addLabel: 'in progress',
      removeLabels: [],
      boardStatus: undefined,
      close: false,
    });
    assert.deepEqual(planStatusSync(state({ labels: ['todo'] }), { kind: 'sweep' }), { addLabel: undefined, removeLabels: [], boardStatus: 'Todo', close: false });
    assert.deepEqual(planStatusSync(state({ external: true }), { kind: 'sweep' }), { addLabel: 'triage', removeLabels: [], boardStatus: 'Triage', close: false });
    assert.equal(planStatusSync(state({ labels: ['todo'], labelChangedAt: EARLY, boardStatus: 'Todo', boardChangedAt: LATE }), { kind: 'sweep' }), undefined);
  });

  it('puts back the status of the label on a reopened issue the board still shows as done', () => {
    assert.deepEqual(planStatusSync(state({ labels: ['todo'], boardStatus: 'Done', boardChangedAt: LATE }), { kind: 'opened' }), {
      addLabel: undefined,
      removeLabels: [],
      boardStatus: 'Todo',
      close: false,
    });
  });
});
