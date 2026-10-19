import { useRef, useState } from 'react';
import type { FieldErrors, Repair, Result } from '../../domain/types';
import { JobHistory } from './JobHistory';
import { StatusBadge } from './StatusBadge';

interface Props {
  job: Repair;
  onStart: (id: string) => Result<Repair>;
  onProgress: (id: string, note: string) => Result<Repair>;
  onComplete: (id: string, note: string) => Result<Repair>;
  onSaved: (message: string) => void;
}

export function JobDetail({ job, onStart, onProgress, onComplete, onSaved }: Props) {
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const noteRef = useRef<HTMLTextAreaElement>(null);

  function handle(result: Result<Repair>, message: string) {
    if (!result.ok) {
      setErrors(result.errors);
      if (result.errors.note) noteRef.current?.focus();
      return;
    }
    setErrors({}); setNote(''); onSaved(message);
  }

  return <section className="panel detail-panel" aria-labelledby="detail-heading">
    <p className="eyebrow">03 / UPDATE</p>
    <div className="section-title"><h2 id="detail-heading">Repair details</h2><StatusBadge status={job.status} /></div>
    <h3 className="repair-description plain-text">{job.description}</h3>
    <dl className="details">
      <div><dt>House</dt><dd>{job.house}</dd></div>
      <div><dt>Reporter</dt><dd>{job.reporter}</dd></div>
      <div><dt>Priority</dt><dd>{job.priority}</dd></div>
      <div><dt>Reported</dt><dd><time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleString('en-GB')}</time></dd></div>
      <div className="full-width"><dt>Job ID</dt><dd className="job-id">{job.id}</dd></div>
    </dl>
    {job.status === 'New' && <button className="primary" onClick={() => handle(onStart(job.id), 'Repair moved to In Progress and saved.')}>Start repair</button>}
    {job.status !== 'Completed' && <div className="update-area">
      <label htmlFor="repair-note">Progress or completion note</label>
      <p className="hint" id="note-hint">Explain your update. A completion note is required to mark this repair completed.</p>
      <textarea id="repair-note" ref={noteRef} rows={3} value={note} onChange={e => setNote(e.target.value)}
        aria-invalid={!!errors.note} aria-describedby={`note-hint${errors.note ? ' note-error' : ''}`} />
      {errors.note && <p className="error" id="note-error">{errors.note}</p>}
      <div className="actions">
        {job.status === 'In Progress' && <button onClick={() => handle(onProgress(job.id, note), 'Progress note saved.')}>Save progress note</button>}
        <button className="primary" onClick={() => handle(onComplete(job.id, note), 'Repair marked Completed. Completion note saved.')}>Complete repair</button>
      </div>
    </div>}
    {errors.general && <p className="error" role="alert">{errors.general}</p>}
    {job.status === 'Completed' && <div className="completion"><strong>Completed</strong><p className="plain-text">{job.history.at(-1)?.note}</p></div>}
    <JobHistory entries={job.history} />
  </section>;
}
