export const HOUSE = 'Meadow House' as const;
export type Priority = 'Normal' | 'Urgent';
export type Status = 'New' | 'In Progress' | 'Completed';

export interface HistoryEntry {
  id: string;
  at: string;
  status: Status;
  note: string;
}

export interface Repair {
  id: string;
  house: typeof HOUSE;
  createdAt: string;
  description: string;
  reporter: string;
  priority: Priority;
  status: Status;
  history: HistoryEntry[];
}

export interface ReportInput {
  description: string;
  reporter: string;
  priority: Priority;
}

export type FieldErrors = Partial<Record<'description' | 'reporter' | 'priority' | 'note' | 'general', string>>;
export type Result<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };
