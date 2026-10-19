import { HOUSE, type Repair } from './types';

export const STORAGE_KEY = 'meadow-house-repairs:v1';
const statuses = ['New', 'In Progress', 'Completed'];
const isText = (v: unknown): v is string => typeof v === 'string';
const isDate = (v: unknown): v is string => isText(v) && Number.isFinite(Date.parse(v));

function isRepair(value: unknown): value is Repair {
  if (!value || typeof value !== 'object') return false;
  const j = value as Repair;
  return isText(j.id) && j.house === HOUSE && isDate(j.createdAt)
    && isText(j.description) && isText(j.reporter)
    && ['Normal', 'Urgent'].includes(j.priority) && statuses.includes(j.status)
    && Array.isArray(j.history) && j.history.length > 0
    && j.history.every(e => e && isText(e.id) && isDate(e.at) && statuses.includes(e.status) && isText(e.note));
}

export function loadRepairs(storage: Pick<Storage, 'getItem'>): Repair[] {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed) || !parsed.every(isRepair)) throw new Error('Invalid saved repairs');
  return parsed;
}

export function saveRepairs(storage: Pick<Storage, 'setItem'>, jobs: Repair[]): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}
