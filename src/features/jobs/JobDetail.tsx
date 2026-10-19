import { useRef, useState, type FormEvent, type Ref } from 'react';
import type { FieldErrors, Repair, Result, Status } from '../../domain/types';
import { JobHistory } from './JobHistory';
import { StatusBadge } from './StatusBadge';

interface Props {
  job: Repair;
  panelRef: Ref<HTMLElement>;
  onUpdate: (id: string, status: Status, note: string) => Result<Repair>;
  onSaved: (message: string) => void;
  onClose: () => void;
}

export function JobDetail({ job, panelRef, onUpdate, onSaved, onClose }: Props) {
  const [note, setNote] = useState('');
  const [nextStatus, setNextStatus] = useState<Status>(job.status === 'New' ? 'In Progress' : job.status);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savedMessage, setSavedMessage] = useState('');
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const latest = job.history.at(-1)!;

  function submit(event: FormEvent) {
    event.preventDefault();
    setSavedMessage('');
    const result = onUpdate(job.id, nextStatus, note);
    if (!result.ok) {
      setErrors(result.errors);
      if (result.errors.note) noteRef.current?.focus();
      return;
    }
    setErrors({}); setNote('');
    setSavedMessage(`Saved as ${nextStatus}. Your note is shown in the repair history.`);
    onSaved(nextStatus === 'Completed'
      ? 'Repair marked Completed. Completion note saved.'
      : `Update saved. Status: ${nextStatus}.`);
  }

  return <section id="repair-details" ref={panelRef} tabIndex={-1} className="panel detail-panel" aria-labelledby="detail-heading">
    <p className="eyebrow">03 / UPDATE</p>
    <div className="section-title"><h2 id="detail-heading">Repair details</h2><StatusBadge status={job.status} /></div>
    <h3 className="repair-description plain-text">{job.description}</h3>
    <div className={`latest-update ${job.status === 'Completed' ? 'completion' : ''}`}>
      <strong>{job.status === 'Completed' ? 'Completed — completion note' : 'Latest saved note'}</strong>
      <p className="plain-text">{latest.note}</p>
      <time dateTime={latest.at}>{new Date(latest.at).toLocaleString('en-GB')}</time>
    </div>
    <dl className="details">
      <div><dt>House</dt><dd>{job.house}</dd></div>
      <div><dt>Reporter</dt><dd>{job.reporter}</dd></div>
      <div><dt>Priority</dt><dd><span className={job.priority === 'Urgent' ? 'badge urgent' : 'badge'}>{job.priority}</span></dd></div>
      <div><dt>Reported</dt><dd><time dateTime={job.createdAt}>{new Date(job.createdAt).toLocaleString('en-GB')}</time></dd></div>
      <div className="full-width"><dt>Job ID</dt><dd className="job-id">{job.id}</dd></div>
    </dl>
    <form className="update-area" onSubmit={submit} noValidate>
      <h3>Update this repair</h3>
      <label htmlFor="repair-status">Status</label>
      <select id="repair-status" value={nextStatus} onChange={e => {
        setNextStatus(e.target.value as Status); setErrors({}); setSavedMessage('');
      }} aria-invalid={!!errors.status} aria-describedby={errors.status ? 'status-error' : undefined}>
        <option>New</option><option>In Progress</option><option>Completed</option>
      </select>
      {errors.status && <p className="error" id="status-error">{errors.status}</p>}
      <label htmlFor="repair-note">{nextStatus === 'Completed' ? 'Completion note' : 'Progress note'} <span className="required">(required)</span></label>
      <p className="hint" id="note-hint">{nextStatus === 'Completed'
        ? 'Explain what was repaired and checked. Earlier notes will stay in the history.'
        : 'Explain what has happened. The status and note will be saved together.'}</p>
      <textarea id="repair-note" ref={noteRef} rows={3} value={note} onChange={e => { setNote(e.target.value); setSavedMessage(''); }}
        aria-required="true" aria-invalid={!!errors.note} aria-describedby={`note-hint${errors.note ? ' note-error' : ''}`} />
      {errors.note && <p className="error" id="note-error">{errors.note}</p>}
      {errors.general && <p className="error" role="alert">{errors.general}</p>}
      <button type="submit" className="primary save-update">{nextStatus === 'Completed' ? 'Complete repair' : 'Save update'}</button>
      {savedMessage && <p className="inline-confirmation">{savedMessage}</p>}
    </form>
    <JobHistory entries={job.history} />
    <button className="close-repair" type="button" onClick={onClose}>Close repair ↑</button>
  </section>;
}
