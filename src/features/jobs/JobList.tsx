import type { Repair } from '../../domain/types';
import { StatusBadge } from './StatusBadge';
import './jobs.css';

interface Props { jobs: Repair[]; selectedId: string | null; onSelect: (id: string) => void; }

function RepairRows({ jobs, selectedId, onSelect }: Props) {
  return <ul className="job-list">{jobs.map(job => <li key={job.id}>
    <button className={`job-choice ${selectedId === job.id ? 'selected' : ''}`}
      aria-pressed={selectedId === job.id} onClick={() => onSelect(job.id)}>
      <span className="job-row-title"><span className="job-title plain-text">{job.description}</span><span aria-hidden="true" className="job-arrow">↗</span></span>
      <span className="job-meta">{job.reporter} · {new Date(job.createdAt).toLocaleDateString('en-GB')}</span>
      <span className="badges"><StatusBadge status={job.status} />
        <span className={job.priority === 'Urgent' ? 'badge urgent' : 'badge'}>{job.priority}</span></span>
      <span className="open-job">Open repair →</span>
    </button>
  </li>)}</ul>;
}

export function JobList({ jobs, ...props }: Props) {
  const active = jobs.filter(job => job.status !== 'Completed');
  return <section id="repair-jobs" tabIndex={-1} className="panel jobs-panel" aria-labelledby="jobs-heading">
    <div className="panel-top"><span className="section-number">02</span><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M8 2v4M16 2v4M8 10h8M8 14h8M8 18h5" /></svg></div>
    <div className="section-title"><h2 id="jobs-heading">Repair jobs</h2><span className="count">{active.length}</span></div>
    {!active.length ? <div className="jobs-empty"><span className="empty-mark" aria-hidden="true">✓</span>
      <h3>{jobs.length ? 'All repairs up to date.' : 'No open repairs.'}</h3>
      <p>{jobs.length ? 'Completed repairs are in the repair record below.' : 'New repairs will appear here, ready to review and update.'}</p></div>
      : <RepairRows jobs={active} {...props} />}
  </section>;
}

export function CompletedRepairs({ jobs, ...props }: Props) {
  const completed = jobs.filter(job => job.status === 'Completed');
  return <details id="repair-record" className="records-panel">
    <summary><span className="record-title">Repair record</span><span className="record-summary"><span>{completed.length} completed</span><span className="record-chevron" aria-hidden="true">⌄</span></span></summary>
    <div className="record-content">{completed.length ? <RepairRows jobs={completed} {...props} />
      : <p className="empty">No completed repairs yet.</p>}</div>
  </details>;
}
