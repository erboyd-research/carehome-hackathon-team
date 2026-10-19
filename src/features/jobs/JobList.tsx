import type { Repair } from '../../domain/types';
import { StatusBadge } from './StatusBadge';
import './jobs.css';

interface Props { jobs: Repair[]; selectedId: string | null; onSelect: (id: string) => void; }

export function JobList({ jobs, selectedId, onSelect }: Props) {
  return <section className="panel" aria-labelledby="jobs-heading">
    <p className="eyebrow">02 / TRACK</p>
    <div className="section-title"><h2 id="jobs-heading">Repair jobs</h2><span className="count">{jobs.length}</span></div>
    {!jobs.length ? <p className="empty">No repairs yet. Report your first repair using the form.</p>
      : <ul className="job-list">{jobs.map(job => <li key={job.id}>
        <button className={`job-choice ${selectedId === job.id ? 'selected' : ''}`}
          aria-pressed={selectedId === job.id} onClick={() => onSelect(job.id)}>
          <span className="job-title plain-text">{job.description}</span>
          <span className="job-meta">{job.reporter} · {new Date(job.createdAt).toLocaleDateString('en-GB')}</span>
          <span className="badges"><StatusBadge status={job.status} />
            <span className={job.priority === 'Urgent' ? 'badge urgent' : 'badge'}>{job.priority}</span></span>
        </button>
      </li>)}</ul>}
  </section>;
}
