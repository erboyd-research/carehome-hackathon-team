import { useRef, useState, type FormEvent } from 'react';
import type { FieldErrors, Priority, Repair, ReportInput, Result } from '../../domain/types';
import './reporting.css';

interface Props {
  onCreate: (input: ReportInput) => Result<Repair>;
  onSaved: (job: Repair) => void;
}

// Join the ids of the hint and (when present) the error so both are read with the control.
function describedBy(...ids: Array<string | false | undefined>) {
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
}

export function RepairForm({ onCreate, onSaved }: Props) {
  const [description, setDescription] = useState('');
  const [reporter, setReporter] = useState('');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [errors, setErrors] = useState<FieldErrors>({});
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const reporterRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);

  // Editing a field clears only that field's message; everything the person typed is kept.
  function clearError(...keys: Array<keyof FieldErrors>) {
    setErrors(previous => {
      if (!keys.some(key => previous[key])) return previous;
      const next = { ...previous };
      for (const key of keys) delete next[key];
      return next;
    });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = onCreate({ description, reporter, priority });
    if (!result.ok) {
      // Inputs are deliberately left untouched so valid values survive a failed attempt.
      setErrors(result.errors);
      if (result.errors.description) descriptionRef.current?.focus();
      else if (result.errors.reporter) reporterRef.current?.focus();
      else if (result.errors.priority) priorityRef.current?.focus();
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
        onChange={e => { setDescription(e.target.value); clearError('description', 'general'); }}
        aria-required="true" aria-invalid={!!errors.description}
        aria-describedby={describedBy('description-hint', errors.description && 'description-error')} />
      <p className="hint field-hint" id="description-hint">Say what is wrong and where, for example “Garden fence damaged”.</p>
      {errors.description && <p className="error field-error" id="description-error">
        <span className="error-prefix">Error:</span> {errors.description}</p>}

      <label htmlFor="reporter">Reporter name <span className="required">(required)</span></label>
      <input id="reporter" ref={reporterRef} value={reporter}
        onChange={e => { setReporter(e.target.value); clearError('reporter', 'general'); }}
        autoComplete="name" aria-required="true" aria-invalid={!!errors.reporter}
        aria-describedby={describedBy('reporter-hint', errors.reporter && 'reporter-error')} />
      <p className="hint field-hint" id="reporter-hint">Use a fictional name for this demo.</p>
      {errors.reporter && <p className="error field-error" id="reporter-error">
        <span className="error-prefix">Error:</span> {errors.reporter}</p>}

      <label htmlFor="priority">Priority</label>
      <select id="priority" ref={priorityRef} value={priority}
        onChange={e => { setPriority(e.target.value as Priority); clearError('priority', 'general'); }}
        aria-invalid={!!errors.priority}
        aria-describedby={describedBy('priority-hint', errors.priority && 'priority-error')}>
        <option>Normal</option><option>Urgent</option>
      </select>
      <p className="hint field-hint" id="priority-hint">Urgent repairs are labelled “Urgent” in the repair list and details.</p>
      {errors.priority && <p className="error field-error" id="priority-error">
        <span className="error-prefix">Error:</span> {errors.priority}</p>}

      {errors.general && <p className="error field-error" role="alert">
        <span className="error-prefix">Error:</span> {errors.general}</p>}
      <button type="submit" className="primary">Report repair</button>
    </form>
  </section>;
}
