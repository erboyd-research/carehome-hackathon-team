import { describe, expect, it } from 'vitest';
import { addProgressNote, completeRepair, createRepair, startRepair, saveRepairUpdate } from './repairs';
import { loadRepairs, saveRepairs } from './storage';
import type { Repair, Result } from './types';

function unwrap(result: Result<Repair>): Repair {
  if (!result.ok) throw new Error(JSON.stringify(result.errors));
  return result.value;
}
const report = (description = 'Garden fence damaged', priority: 'Normal' | 'Urgent' = 'Urgent') =>
  unwrap(createRepair({ description, reporter: 'Alex Morgan', priority }));

describe('published functional rules', () => {
  it('1: creates a New repair with its automatic identity and fields', () => {
    const job = report();
    expect(job).toMatchObject({ house: 'Meadow House', status: 'New', description: 'Garden fence damaged', reporter: 'Alex Morgan', priority: 'Urgent' });
    expect(job.id.length).toBeGreaterThan(0);
    expect(Number.isFinite(Date.parse(job.createdAt))).toBe(true);
  });
  it('2: rejects empty and whitespace descriptions', () => {
    for (const description of ['', '   ']) {
      const result = createRepair({ description, reporter: 'Alex Morgan', priority: 'Normal' });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.description).toBeTruthy();
    }
  });
  it('3: rejects empty and whitespace reporter names', () => {
    for (const reporter of ['', '   ']) {
      const result = createRepair({ description: 'Fence', reporter, priority: 'Normal' });
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.reporter).toBeTruthy();
    }
  });
  it('4: retains both priorities', () => {
    expect(report('Fence', 'Normal').priority).toBe('Normal');
    expect(report('Light', 'Urgent').priority).toBe('Urgent');
  });
  it('5: changes one repair without changing the other', () => {
    const fence = report(); const light = report('Kitchen light');
    const before = JSON.stringify(light);
    const updated = unwrap(startRepair(fence));
    expect(updated.status).toBe('In Progress');
    expect(fence.status).toBe('New');
    expect(fence.id).not.toBe(light.id);
    expect(JSON.stringify(light)).toBe(before);
  });
  it('6: retains earlier entries and adds dated progress', () => {
    const created = report();
    const progressing = unwrap(startRepair(created));
    const updated = unwrap(addProgressNote(progressing, 'Temporary barrier fitted'));
    expect(updated.status).toBe('In Progress');
    expect(updated.history.at(-1)?.note).toBe('Temporary barrier fitted');
    expect(updated.history.slice(0, progressing.history.length)).toEqual(progressing.history);
    expect(updated.history.every(e => Number.isFinite(Date.parse(e.at)))).toBe(true);
  });
  it('7: rejected completion preserves all earlier state', () => {
    const job = unwrap(addProgressNote(unwrap(startRepair(report())), 'Temporary barrier fitted'));
    const before = JSON.stringify(job);
    for (const blank of ['', '   ']) {
      const result = completeRepair(job, blank);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.note).toBeTruthy();
      expect(JSON.stringify(job)).toBe(before);
    }
  });
  it('8: completion keeps New and In Progress history', () => {
    const job = unwrap(completeRepair(unwrap(startRepair(report())), 'Fence repaired and checked'));
    expect(job.status).toBe('Completed');
    expect(job.history.map(e => e.status)).toEqual(['New', 'In Progress', 'Completed']);
    expect(job.history.at(-1)?.note).toBe('Fence repaired and checked');
  });
  it('9: serializes two independent records including complete history', () => {
    const jobs = [unwrap(completeRepair(unwrap(startRepair(report())), 'Fence repaired and checked')), report('Kitchen light', 'Normal')];
    const data = new Map<string, string>();
    const storage = { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
    saveRepairs(storage, jobs);
    expect(loadRepairs(storage)).toEqual(jobs);
  });
  it('10: preserves literal markup characters in the data', () => {
    const literal = '<b>check gate</b>';
    const job = unwrap(addProgressNote(unwrap(startRepair(report(literal))), literal));
    expect(job.description).toBe(literal);
    expect(job.history.at(-1)?.note).toBe(literal);
    // Browser rendering is checked separately in docs/judging-checklist.md.
  });
  it('does not silently replace malformed saved data', () => {
    expect(() => loadRepairs({ getItem: () => '{broken' })).toThrow();
    expect(() => loadRepairs({ getItem: () => '[{}]' })).toThrow();
  });
  it('saves a selected status and note together in one entry', () => {
    const original = report();
    const updated = unwrap(saveRepairUpdate(original, 'In Progress', 'Temporary barrier fitted'));
    expect(updated.history).toHaveLength(2);
    expect(updated.status).toBe('In Progress');
    expect(updated.history.at(-1)).toMatchObject({ status: 'In Progress', note: 'Temporary barrier fitted' });
    expect(original.status).toBe('New');
    expect(original.history).toHaveLength(1);
  });
  it('does not apply a draft status with a rejected note', () => {
    const original = unwrap(saveRepairUpdate(report(), 'In Progress', 'Temporary barrier fitted'));
    const before = structuredClone(original);
    for (const note of ['', '   ']) {
      expect(saveRepairUpdate(original, 'Completed', note).ok).toBe(false);
      expect(original).toEqual(before);
    }
    const completed = unwrap(saveRepairUpdate(original, 'Completed', 'Fence repaired and checked'));
    expect(completed.history.map(e => e.status)).toEqual(['New', 'In Progress', 'Completed']);
  });
});
