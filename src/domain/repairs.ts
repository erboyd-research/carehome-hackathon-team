import { HOUSE, type Repair, type ReportInput, type Result, type Status } from './types';

export function createRepair(input: ReportInput): Result<Repair> {
  const errors: Record<string, string> = {};
  if (!input.description.trim()) errors.description = 'Describe the repair needed.';
  if (!input.reporter.trim()) errors.reporter = 'Enter the reporter’s name.';
  if (!['Normal', 'Urgent'].includes(input.priority)) errors.priority = 'Choose Normal or Urgent.';
  if (Object.keys(errors).length) return { ok: false, errors };
  const at = new Date().toISOString();
  return { ok: true, value: {
    id: crypto.randomUUID(), house: HOUSE, createdAt: at,
    description: input.description.trim(), reporter: input.reporter.trim(),
    priority: input.priority, status: 'New',
    history: [{ id: crypto.randomUUID(), at, status: 'New', note: 'Repair reported.' }],
  } };
}

// All validation happens before producing a new job. Existing records are never mutated.
function append(repair: Repair, status: Status, note: string): Repair {
  return { ...repair, status, history: [...repair.history, {
    id: crypto.randomUUID(), at: new Date().toISOString(), status, note,
  }] };
}

export function startRepair(repair: Repair): Result<Repair> {
  if (repair.status !== 'New') return { ok: false, errors: { general: 'Only a New repair can be started.' } };
  return { ok: true, value: append(repair, 'In Progress', 'Work started.') };
}

export function addProgressNote(repair: Repair, note: string): Result<Repair> {
  if (repair.status !== 'In Progress') return { ok: false, errors: { general: 'Start this repair before adding a progress note.' } };
  if (!note.trim()) return { ok: false, errors: { note: 'Enter a progress note before saving.' } };
  return { ok: true, value: append(repair, 'In Progress', note.trim()) };
}

export function completeRepair(repair: Repair, note: string): Result<Repair> {
  if (repair.status === 'Completed') return { ok: false, errors: { general: 'This repair is already completed.' } };
  if (!note.trim()) return { ok: false, errors: { note: 'Explain what was repaired before completing the job.' } };
  return { ok: true, value: append(repair, 'Completed', note.trim()) };
}
