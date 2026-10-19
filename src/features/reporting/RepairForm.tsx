import { useRef, useState, type FormEvent } from 'react';
import type { FieldErrors, Priority, Repair, ReportInput, Result } from '../../domain/types';
import './reporting.css';

interface Props {
  onCreate: (input: ReportInput) => Result<Repair>;
  onSaved: (job: Repair) => void;
}

export function RepairForm({ onCreate, onSaved }: Props) {
  const [description, setDescription] = useState('');
  const [reporter, setReporter] = useState('');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [errors, setErrors] = useState<FieldErrors>({});
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const reporterRef = useRef<HTMLInputElement>(null);

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = onCreate({ description, reporter, priority });
    if (!result.ok) {
      setErrors(result.errors);
      if (result.errors.description) descriptionRef.current?.focus();
      else if (result.errors.reporter) reporterRef.current?.focus();
      return;
    }
    setDescription(''); setReporter(''); setPriority('Normal'); setErrors({});
    onSaved(result.value);
  }

  return <section className="panel report-panel" aria-labelledby="report-heading">
    <p className="eyebrow">01 / REPORT</p>
    <h2 id="report-heading">Report a repair</h2>
    <p className="muted">Tell us what needs attention at Meadow House.</p>
    <form onSubmit={submit} noValidate>
      <label htmlFor="description">What needs repairing? <span className="required">(required)</span></label>
      <textarea id="description" ref={descriptionRef} rows={4} value={description}
        onChange={e => setDescription(e.target.value)} aria-required="true"
        aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined} />
      {errors.description && <p className="error" id="description-error">{errors.description}</p>}
      <label htmlFor="reporter">Reporter name <span className="required">(required)</span></label>
      <input id="reporter" ref={reporterRef} value={reporter} onChange={e => setReporter(e.target.value)}
        autoComplete="name" aria-required="true" aria-invalid={!!errors.reporter}
        aria-describedby={errors.reporter ? 'reporter-error' : undefined} />
      {errors.reporter && <p className="error" id="reporter-error">{errors.reporter}</p>}
      <label htmlFor="priority">Priority</label>
      <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
        <option>Normal</option><option>Urgent</option>
      </select>
      {errors.general && <p className="error" role="alert">{errors.general}</p>}
      <button type="submit" className="primary">Report repair</button>
    </form>
  </section>;
}
