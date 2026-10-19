import type { Status } from '../../domain/types';
export function StatusBadge({ status }: { status: Status }) {
  return <span className={`badge status-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>;
}
