import { useState } from 'react';
import * as actions from '../domain/repairs';
import { loadRepairs, saveRepairs } from '../domain/storage';
import type { Repair, ReportInput, Result } from '../domain/types';

export function useRepairs() {
  const [initial] = useState(() => {
    try { return { jobs: loadRepairs(window.localStorage), error: '' }; }
    catch { return { jobs: [] as Repair[], error: 'Saved repairs could not be loaded. Existing saved data has been left untouched. Restore browser storage or use a fresh browser profile.' }; }
  });
  const [jobs, setJobs] = useState(initial.jobs);
  const [storageError, setStorageError] = useState(initial.error);

  function commit(next: Repair[], saved: Repair): Result<Repair> {
    if (initial.error) return { ok: false, errors: { general: initial.error } };
    try {
      // Only show success after persistence succeeds.
      saveRepairs(window.localStorage, next);
      setJobs(next);
      setStorageError('');
      return { ok: true, value: saved };
    } catch {
      const message = 'This change could not be saved. Check available browser storage and try again.';
      setStorageError(message);
      return { ok: false, errors: { general: message } };
    }
  }

  function createRepair(input: ReportInput): Result<Repair> {
    const result = actions.createRepair(input);
    return result.ok ? commit([result.value, ...jobs], result.value) : result;
  }

  function update(id: string, change: (job: Repair) => Result<Repair>): Result<Repair> {
    const current = jobs.find(job => job.id === id);
    if (!current) return { ok: false, errors: { general: 'Repair not found.' } };
    const result = change(current);
    return result.ok ? commit(jobs.map(job => job.id === id ? result.value : job), result.value) : result;
  }

  return { jobs, storageError, createRepair,
    startRepair: (id: string) => update(id, actions.startRepair),
    addProgressNote: (id: string, note: string) => update(id, job => actions.addProgressNote(job, note)),
    completeRepair: (id: string, note: string) => update(id, job => actions.completeRepair(job, note)),
  };
}
